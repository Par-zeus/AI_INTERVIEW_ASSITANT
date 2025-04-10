import sys
import json
import pdfplumber
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import pandas as pd

# Skill-to-Role Mapping
skill_to_role_mapping = {
    # Software Engineering
    'python': ['Software Engineer', 'Backend Developer', 'Data Scientist', 'ML Engineer'],
    'java': ['Software Engineer', 'Backend Developer'],
    'c++': ['Software Engineer', 'Game Developer'],
    'javascript': ['Software Engineer', 'Frontend Developer', 'Full Stack Developer'],
    'typescript': ['Frontend Developer', 'Full Stack Developer'],
    'react': ['Frontend Developer', 'Full Stack Developer'],
    'angular': ['Frontend Developer'],
    'vue': ['Frontend Developer'],
    'node': ['Backend Developer', 'Full Stack Developer'],
    'express': ['Backend Developer'],
    'django': ['Backend Developer', 'Full Stack Developer'],
    'flask': ['Backend Developer'],
    'spring': ['Backend Developer'],

    # Data Science & AI
    'machine learning': ['Data Scientist', 'ML Engineer'],
    'deep learning': ['ML Engineer', 'AI Researcher'],
    'tensorflow': ['ML Engineer', 'AI Researcher'],
    'pytorch': ['ML Engineer', 'AI Researcher'],
    'nlp': ['ML Engineer', 'AI Researcher'],
    'computer vision': ['ML Engineer', 'AI Researcher'],
    'data analysis': ['Data Analyst', 'Data Scientist'],
    'big data': ['Data Engineer', 'Data Scientist'],
    'sql': ['Data Analyst', 'Data Engineer', 'Database Administrator'],
    'mongodb': ['Database Administrator', 'Backend Developer'],
    'hadoop': ['Data Engineer'],

    # DevOps & Cloud
    'aws': ['Cloud Engineer', 'DevOps Engineer'],
    'azure': ['Cloud Engineer', 'DevOps Engineer'],
    'gcp': ['Cloud Engineer'],
    'docker': ['DevOps Engineer'],
    'kubernetes': ['DevOps Engineer'],
    'ci/cd': ['DevOps Engineer'],
    'terraform': ['DevOps Engineer'],

    # Product & Design
    'product management': ['Product Manager'],
    'agile': ['Product Manager', 'Scrum Master'],
    'scrum': ['Scrum Master'],
    'figma': ['UX Designer'],
    'ui': ['UX Designer'],
    'ux': ['UX Designer'],
    'user research': ['UX Designer', 'Product Manager'],

    # Cybersecurity
    'penetration testing': ['Cybersecurity Engineer'],
    'network security': ['Cybersecurity Engineer'],
    'ethical hacking': ['Cybersecurity Engineer'],
    'encryption': ['Cybersecurity Engineer'],

    # Blockchain & Web3
    'solidity': ['Blockchain Developer'],
    'web3': ['Blockchain Developer'],
    'ethereum': ['Blockchain Developer'],

    # # Soft Skills
    # 'leadership': ['Manager', 'Team Lead'],
    # 'communication': ['Manager', 'Team Lead', 'Product Manager'],
    # 'teamwork': ['Any Role']
}

def extract_text_from_pdf(pdf_path):
    """Extract text content from PDF file."""
    try:
        with pdfplumber.open(pdf_path) as pdf:
            text = "\n".join([page.extract_text() or "" for page in pdf.pages])
        return text.strip()
    except Exception as e:
        print(json.dumps({"error": f"Error reading PDF: {str(e)}"}))
        sys.exit(1)

def extract_skills(resume_text):
    """Extract skills from resume text based on skill mapping."""
    resume_text_lower = resume_text.lower()
    found_skills = [skill for skill in skill_to_role_mapping if skill in resume_text_lower]
    return found_skills

def predict_roles(skills):
    """Predict suitable roles based on extracted skills."""
    matched_roles = set()
    for skill in skills:
        matched_roles.update(skill_to_role_mapping.get(skill, []))
    return list(matched_roles) if matched_roles else ["General Software Engineer"]

# Training data for ML model
data = {
    "resume": [
        "Python, Machine Learning, TensorFlow",
        "SQL, Data Analysis, Big Data",
        "Project Management, Agile, Scrum",
        "React, JavaScript, HTML, CSS",
        "Python, OOP, Data Structures and Algorithms, Git, SQL",
        "Javascript, React, Node.js, MongoDB, REST API",
        "Node.js, Express.js, SQL, Microservices, Docker",
        "Python, Machine Learning, SQL, TensorFlow, Data Visualization"
    ],
    "role": [
        "ML Engineer",
        "Data Analyst",
        "Product Manager",
        "Frontend Developer",
        "Software Engineer",
        "Full Stack Developer",
        "Backend Developer",
        "Data Scientist"
    ]
}

# Initialize and train the ML model
df = pd.DataFrame(data)
vectorizer = TfidfVectorizer()
X_vectors = vectorizer.fit_transform(df["resume"])
model = LogisticRegression()
model.fit(X_vectors, df["role"])

def calculate_resume_score(skills):
    """Calculate a score for the resume based on skills."""
    base_score = 0
    skill_boost = len(skills) * 5  # Each skill adds 5 points
    # Critical skills give extra weight
    role_weight = sum(10 for skill in skills if skill in ["python", "sql", "machine learning", "aws", "docker"])
    score = min(base_score + skill_boost + role_weight, 100)  # Cap at 100
    return score

def get_improvement_suggestions(skills):
    """Generate improvement suggestions based on missing skills."""
    improvements = []
    
    # Programming Languages
    if "python" not in skills and "java" not in skills:
        improvements.append("Consider adding Python or Java programming skills.")
    
    # Database
    if "sql" not in skills and "mongodb" not in skills:
        improvements.append("Consider improving database knowledge (SQL, NoSQL).")
    
    # Cloud
    if not any(cloud in skills for cloud in ["aws", "azure", "gcp"]):
        improvements.append("Cloud expertise (AWS, Azure, GCP) is highly valued in modern tech.")
    
    # Core CS
    if "data structures" not in skills and "algorithms" not in skills:
        improvements.append("Strengthen knowledge of Data Structures and Algorithms for better problem-solving.")
    
    # Version Control
    if "git" not in skills:
        improvements.append("Include Git and version control experience to improve collaboration.")
    
    # Frontend
    if "javascript" in skills and "typescript" not in skills:
        improvements.append("Consider learning TypeScript for better scalability in frontend and backend development.")
    if "react" in skills and "redux" not in skills:
        improvements.append("Learn Redux for better state management in React applications.")
    
    # Backend
    if "node" in skills and "express" not in skills:
        improvements.append("Gain experience with Express.js for better backend development in Node.js.")
    if "microservices" not in skills:
        improvements.append("Gain knowledge of Microservices architecture for scalable backend systems.")
    
    # Data Science
    if "python" in skills and "pandas" not in skills:
        improvements.append("Learn Pandas for efficient data manipulation in Python.")
    if "machine learning" in skills and "statistics" not in skills:
        improvements.append("Enhance understanding of Statistics for better ML model performance.")
    if "deep learning" in skills and "nlp" not in skills and "computer vision" not in skills:
        improvements.append("Consider specializing in NLP or Computer Vision for advanced AI applications.")
    
    return improvements

def analyze_resume(pdf_path):
    """Main function to analyze resume and generate recommendations."""
    # Extract text from PDF
    resume_text = extract_text_from_pdf(pdf_path)
    if not resume_text:
        return {"error": "Empty resume text extracted"}

    # Extract skills and predict roles
    skills = extract_skills(resume_text)
    suggested_roles = predict_roles(skills)

    # ML Model Prediction
    resume_vector = vectorizer.transform([" ".join(skills)]) if skills else vectorizer.transform([resume_text])
    predicted_role = model.predict(resume_vector)[0]

    # Calculate score and get improvement suggestions
    resume_score = calculate_resume_score(skills)
    improvements = get_improvement_suggestions(skills)

    # Prepare result
    result = {
        "skills": skills,
        "suggestedRoles": list(set(suggested_roles + [predicted_role])),
        "resumeScore": resume_score,
        "improvements": improvements
    }
    
    return result

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Missing PDF file path"}))
        sys.exit(1)

    pdf_path = sys.argv[1]
    result = analyze_resume(pdf_path)
    print(json.dumps(result, indent=2))