import sys
import pickle
import re
import docx
import PyPDF2
import os

svc_model = pickle.load(open('clf.pkl', 'rb'))
tfidf = pickle.load(open('tfidf.pkl', 'rb'))
le = pickle.load(open('encoder.pkl', 'rb'))

def cleanResume(txt):
    cleanText = re.sub('http\S+\s', ' ', txt)
    cleanText = re.sub('RT|cc', ' ', cleanText)
    cleanText = re.sub('#\S+\s', ' ', cleanText)
    cleanText = re.sub('@\S+', '  ', cleanText)
    cleanText = re.sub('[%s]' % re.escape(r"""!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~"""), ' ', cleanText)
    cleanText = re.sub(r'[^\x00-\x7f]', ' ', cleanText)
    cleanText = re.sub('\s+', ' ', cleanText)
    return cleanText

def extract_text(file_path):
    ext = os.path.splitext(file_path)[-1].lower()
    text = ''
    if ext == '.pdf':
        reader = PyPDF2.PdfReader(open(file_path, 'rb'))
        for page in reader.pages:
            text += page.extract_text()
    elif ext == '.docx':
        doc = docx.Document(file_path)
        for p in doc.paragraphs:
            text += p.text + '\n'
    elif ext == '.txt':
        with open(file_path, 'r', encoding='utf-8') as f:
            text = f.read()
    return text

def predict_category(resume_path):
    text = extract_text(resume_path)
    cleaned_text = cleanResume(text)
    vector = tfidf.transform([cleaned_text]).toarray()
    pred = svc_model.predict(vector)
    label = le.inverse_transform(pred)
    print(label[0])  # Output to stdout

if __name__ == "__main__":
    resume_path = sys.argv[1]
    predict_category(resume_path)