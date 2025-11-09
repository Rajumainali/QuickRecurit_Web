from sentence_transformers import SentenceTransformer, util

# Load base model (no fine-tuning)
model = SentenceTransformer("fine-tuned")

job_description = """
Requirements:
- Knowledge of software testing concepts such as test cases, bug reporting, and SDLC.
- Understanding of web and mobile testing.
- Interest in automation tools like Selenium and Postman.
"""

resume_text = """
I am a student of Information Technology. I have basic knowledge of HTML, CSS, and Python.
I have not worked  but I am eager to learn developing tools in the future.
"""

# Encode
embeddings = model.encode([job_description, resume_text], convert_to_tensor=True)
similarity = util.cos_sim(embeddings[0], embeddings[1])
print(f"Similarity Score: {similarity.item():.4f}")
