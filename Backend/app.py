import os
import json
import re
import time
import hashlib
import fitz  # PyMuPDF
import docx  # python-docx
from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer, util
import google.generativeai as genai
from typing import Dict, Any

# --- Configuration ---
UPLOAD_DIR = os.path.join(os.getcwd(), "upload", "resume")
CACHE_DIR = os.path.join(os.getcwd(), "cache")
CACHE_TTL_SECONDS = 3600  # 1 hour

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(CACHE_DIR, exist_ok=True)

# --- Configure Gemini ---
genai.configure(api_key="AIzaSyCsxEPyxSXHsrwi7FjpxUd13SREqmoBu6E")

# --- Load models ---
# MODEL = SentenceTransformer("fine_tuned_resume_fit_model")
MODEL = SentenceTransformer("all-miniLM-L6-V2")
GEMINI_MODEL = genai.GenerativeModel(
    "gemini-2.0-flash",
    generation_config={"temperature": 0}  # deterministic responses
)

# --- Flask App ---
app = Flask(__name__)

# =========================
# File Readers
# =========================
def extract_text_from_pdf(path: str) -> str:
    try:
        with fitz.open(path) as doc:
            return "\n".join(page.get_text() for page in doc)
    except Exception as e:
        print(f"[Error] PDF read failed ({path}): {e}")
        return ""

def extract_text_from_docx(path: str) -> str:
    try:
        document = docx.Document(path)
        return "\n".join(p.text for p in document.paragraphs)
    except Exception as e:
        print(f"[Error] DOCX read failed ({path}): {e}")
        return ""

def extract_text_from_txt(path: str) -> str:
    try:
        with open(path, "r", encoding="utf-8") as f:
            return f.read()
    except Exception as e:
        print(f"[Error] TXT read failed ({path}): {e}")
        return ""

READERS = {
    ".pdf": extract_text_from_pdf,
    ".docx": extract_text_from_docx,
    ".txt": extract_text_from_txt,
}

def process_file(file_path: str) -> str:
    if not file_path or not os.path.exists(file_path):
        return ""
    ext = os.path.splitext(file_path)[1].lower()
    reader = READERS.get(ext)
    return reader(file_path) if reader else ""

# =========================
# Text Cleaning & Helpers
# =========================
def clean_text(text: str) -> str:
    if not text:
        return ""
    text = text.replace("“", '"').replace("”", '"').replace("’", "'").replace("–", "-")
    text = re.sub(r"[^a-zA-Z0-9\s\.,;:()\-\+/']", " ", text)
    return re.sub(r"\s+", " ", text).strip()

def default_summary(reason="Not Found") -> Dict[str, str]:
    return {
        "Professional Summary": reason,
        "Skills": reason,
        "Experience": reason,
        "Education": reason,
    }

# =========================
# Gemini Helpers
# =========================
def get_clean_summary_with_gemini(resume_text: str) -> Dict[str, Any]:
    prompt = f"""
You are a resume parser. Extract the following sections from the given resume text:

- Professional Summary (2–4 sentences)
- Skills (comma-separated list)
- Experience (bullet points or concise sentences)
- Education (include degree, institution, and year if available)

Return strictly as JSON with keys: "Professional Summary", "Skills", "Experience", "Education".
Resume Text:
\"\"\"{resume_text}\"\"\""""
    try:
        response = GEMINI_MODEL.generate_content(prompt)
        raw = response.text.strip()
        match = re.search(r"\{[\s\S]*\}", raw)
        if not match:
            return default_summary("Gemini did not return JSON")
        cleaned = match.group(0).replace("“", '"').replace("”", '"').replace("'", '"')
        parsed = json.loads(cleaned)
        for key in ["Professional Summary", "Skills", "Experience", "Education"]:
            parsed.setdefault(key, "Not Found")
        return parsed
    except Exception as e:
        print(f"[Error] Gemini summary failed: {e}")
        return default_summary(f"Gemini API Error: {e}")

def get_job_skills_from_gemini(job_text: str) -> str:
    prompt = f"""
You are a job requirement parser. Extract only the skills required for this job.
Return them as a comma-separated list (no extra text).

Job Description:
\"\"\"{job_text}\"\"\""""
    try:
        response = GEMINI_MODEL.generate_content(prompt)
        skills_text = response.text.strip()
        skills_text = re.sub(r"[\n;]+", ",", skills_text)
        skills_text = re.sub(r"\s*,\s*", ",", skills_text).strip(", ")
        return skills_text.lower()
    except Exception as e:
        print(f"[Warning] Gemini job-skill extraction failed: {e}")
        tokens = re.split(r"[,.\n]", job_text)
        candidates = [re.sub(r"[^A-Za-z0-9 +#\-.]", "", t.strip()) for t in tokens if 0 < len(t.split()) <= 4]
        return ",".join(x.lower() for x in candidates if x)

# =========================
# Cache with TTL
# =========================
def _cache_file_path(key: str) -> str:
    return os.path.join(CACHE_DIR, f"{key}.json")

def cleanup_cache():
    now = time.time()
    for fname in os.listdir(CACHE_DIR):
        if not fname.endswith(".json"):
            continue
        fpath = os.path.join(CACHE_DIR, fname)
        try:
            if now - os.path.getmtime(fpath) > CACHE_TTL_SECONDS:
                os.remove(fpath)
        except Exception as e:
            print(f"[Warning] cleanup_cache failed for {fpath}: {e}")

def cache_summary(resume_text: str) -> Dict[str, Any]:
    cleanup_cache()
    key = hashlib.md5(resume_text.encode("utf-8")).hexdigest()
    cache_file = _cache_file_path(key)
    if os.path.exists(cache_file):
        try:
            with open(cache_file, "r", encoding="utf-8") as f:
                data = json.load(f)
                if isinstance(data, dict):
                    return data
        except Exception as e:
            print(f"[Warning] reading cache failed ({cache_file}): {e}")
    summary = get_clean_summary_with_gemini(resume_text)
    try:
        with open(cache_file, "w", encoding="utf-8") as f:
            json.dump(summary, f, ensure_ascii=False, indent=2)
    except Exception as e:
        print(f"[Warning] writing cache failed ({cache_file}): {e}")
    return summary

# =========================
# Semantic Skill Matching
# =========================
def compare_skills_semantic(job_skills_text: str, resume_skills_text: str, threshold: float = 0.7):
    """
    Compare job and resume skills semantically using embeddings.
    A match is considered if cosine similarity >= threshold.
    """
    job_skills = [s.strip().lower() for s in (job_skills_text or "").split(",") if s.strip()]
    resume_skills = [s.strip().lower() for s in (resume_skills_text or "").split(",") if s.strip()]

    if not job_skills or not resume_skills:
        return [], job_skills  # no matches, all missing

    matched = []
    missing = []

    # Precompute resume skill embeddings for efficiency
    resume_embeddings = MODEL.encode(resume_skills, convert_to_tensor=True)
    
    for job_skill in job_skills:
        job_emb = MODEL.encode(job_skill, convert_to_tensor=True)
        sims = util.cos_sim(job_emb, resume_embeddings)[0].tolist()
        max_sim = max(sims)
        if max_sim >= threshold:
            matched.append(job_skill)
        else:
            missing.append(job_skill)

    return sorted(list(set(matched))), sorted(list(set(missing)))

# =========================
# Resume Semantic Normalization
# =========================
def normalize_summary(summary: Dict[str, Any]) -> str:
    skills = summary.get("Skills", "")
    if isinstance(skills, str):
        skills_list = sorted(set(s.strip().lower() for s in skills.split(",") if s.strip()))
        skills_norm = ",".join(skills_list)
    else:
        skills_norm = ""

    def ensure_str(x):
        if isinstance(x, list):
            return " ".join(str(i) for i in x)
        return str(x) if x else ""

    pieces = [
        ensure_str(summary.get("Professional Summary")),
        skills_norm,
        ensure_str(summary.get("Experience")),
        ensure_str(summary.get("Education")),
    ]

    combined = " ".join(pieces).strip()
    return clean_text(combined).lower()

# =========================
# Resume Semantic Matching
# =========================
def semantic_match(job_desc: str, resumes: list):
    if not resumes:
        return []
    job_embedding = MODEL.encode(job_desc, convert_to_tensor=True)
    resume_embeddings = MODEL.encode(resumes, convert_to_tensor=True)
    sims = util.cos_sim(job_embedding, resume_embeddings)[0]
    return [float(x.item()) for x in sims]

def classify_strength(score: float) -> str:
    return (
        "Excellent Match" if score >= 0.90 else
        "Good Match" if score >= 0.75 else
        "Fair Match" if score >= 0.50 else
        "Poor Match"
    )

# =========================
# API Endpoint
# =========================
@app.route("/match", methods=["POST"])
def match_resumes():
    try:
        data = request.get_json(force=True)
    except Exception:
        return jsonify({"error": "Invalid JSON"}), 400

    job_desc_text = data.get("requirement")
    resumes_list = data.get("resumes")

    if not job_desc_text or not resumes_list:
        return jsonify({"error": "Missing requirement or resumes"}), 400

    job_desc_clean = clean_text(job_desc_text).lower()
    job_skills_text = get_job_skills_from_gemini(job_desc_text)

    resumes_for_model = []
    full_outputs = []

    for resume in resumes_list:
        try:
            if isinstance(resume, str):
                resume_filename = resume
                resume_path = os.path.join(UPLOAD_DIR, resume_filename)
                display_name = resume_filename
            elif isinstance(resume, dict):
                resume_filename = resume.get("name") or resume.get("filename") or "unknown"
                display_name = resume_filename
                resume_path = resume.get("path") or os.path.join(UPLOAD_DIR, resume_filename)
            else:
                continue

            text = resume.get("text") if isinstance(resume, dict) and resume.get("text") else process_file(resume_path)
            if not text:
                print(f"[Warning] empty text for resume: {display_name}")
                continue

            summary = cache_summary(text)
            essential_text = normalize_summary(summary)

            # Semantic skill matching
            matched, missing = compare_skills_semantic(job_skills_text, summary.get("Skills", ""))

            resumes_for_model.append(essential_text)
            full_outputs.append({
                "filename": display_name,
                "raw_summary": summary,
                "matched_skills": matched,
                "missing_skills": missing
            })

        except Exception as e:
            print(f"[Warning] Resume processing failed: {e}")
            continue

    if not resumes_for_model:
        return jsonify({"error": "No valid resumes found"}), 400

    try:
        similarities = semantic_match(job_desc_clean, resumes_for_model)
    except Exception as e:
        print(f"[Error] semantic matching failed: {e}")
        return jsonify({"error": "Embedding / semantic match failed"}), 500

    combined = []
    for info, score in zip(full_outputs, similarities):
        combined.append({
            "Resume Name": info["filename"],
            "Matching Score": round(score * 100, 2),
            "Strength": classify_strength(score),
            "Matched Skills": info["matched_skills"],
            "Missing Skills": info["missing_skills"],
            "Summary": info["raw_summary"],
        })

    combined_sorted = sorted(combined, key=lambda x: x["Matching Score"], reverse=True)
    return jsonify(combined_sorted), 200

# --- Run Flask ---
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
