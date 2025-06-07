import pdfplumber
import re
import pickle
import os
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.linear_model import LogisticRegression

# Load pre-trained models
with open("vectorizer.pkl", "rb") as f:
    vectorizer = pickle.load(f)

with open("logistic_model.pkl", "rb") as f:
    model = pickle.load(f)

# Skill-to-role mapping
skill_to_role_mapping = {
    'python': ['Data Scientist', 'Software Engineer'],
    'java': ['Backend Developer', 'Software Engineer'],
    'c++': ['Embedded Systems Engineer', 'Game Developer'],
    'sql': ['Data Analyst', 'Database Administrator'],
    'javascript': ['Frontend Developer', 'Full Stack Developer'],
    'html': ['Frontend Developer'],
    'css': ['Frontend Developer'],
    'react': ['Frontend Developer'],
    'node': ['Backend Developer'],
    'aws': ['DevOps Engineer', 'Cloud Engineer'],
    'azure': ['Cloud Engineer'],
    'gcp': ['Cloud Engineer'],
    'docker': ['DevOps Engineer'],
    'kubernetes': ['DevOps Engineer'],
    'machine learning': ['Data Scientist', 'ML Engineer'],
    'deep learning': ['AI Engineer'],
    'tensorflow': ['AI Engineer'],
    'pytorch': ['AI Engineer'],
    'nlp': ['NLP Engineer'],
    'computer vision': ['CV Engineer'],
    'mongodb': ['Full Stack Developer'],
    'hadoop': ['Data Engineer'],
    'typescript': ['Frontend Developer'],
    'express': ['Backend Developer'],
    'figma': ['UI/UX Designer'],
    'scrum': ['Product Manager'],
    'agile': ['Product Manager'],
    'product management': ['Product Manager'],
    'penetration testing': ['Cybersecurity Analyst'],
    'network security': ['Cybersecurity Analyst'],
    'ethical hacking': ['Cybersecurity Analyst'],
    'encryption': ['Cybersecurity Analyst'],
    'solidity': ['Blockchain Developer'],
    'web3': ['Blockchain Developer'],
    'ethereum': ['Blockchain Developer'],
}


def extract_text_from_pdf(pdf_path):
    try:
        with pdfplumber.open(pdf_path) as pdf:
            text = ''
            for page in pdf.pages:
                text += page.extract_text() + '\n'
        return text
    except Exception as e:
        print(f"Error extracting text: {e}")
        return ""


def extract_skills(text):
    words = re.findall(r'\b\w[\w+]*\b', text.lower())
    skills_found = set()
    for word in words:
        if word in skill_to_role_mapping:
            skills_found.add(word)
    return list(skills_found)


def predict_roles(skills):
    roles = set()
    for skill in skills:
        roles.update(skill_to_role_mapping.get(skill, []))
    return list(roles)


def categorize_skills(skills):
    categories = {
        "Programming Languages": [],
        "Web Development": [],
        "Data Science / ML": [],
        "DevOps / Cloud": [],
        "Database": [],
        "Product / UI-UX": [],
        "Cybersecurity": [],
        "Blockchain / Web3": []
    }

    for skill in skills:
        if skill in ['python', 'java', 'c++', 'typescript', 'javascript']:
            categories["Programming Languages"].append(skill)
        elif skill in ['react', 'angular', 'vue', 'node', 'express', 'html', 'css']:
            categories["Web Development"].append(skill)
        elif skill in ['machine learning', 'deep learning', 'tensorflow', 'pytorch', 'nlp', 'computer vision']:
            categories["Data Science / ML"].append(skill)
        elif skill in ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'ci/cd', 'terraform']:
            categories["DevOps / Cloud"].append(skill)
        elif skill in ['sql', 'mongodb', 'hadoop']:
            categories["Database"].append(skill)
        elif skill in ['figma', 'ui', 'ux', 'user research', 'product management', 'agile', 'scrum']:
            categories["Product / UI-UX"].append(skill)
        elif skill in ['penetration testing', 'network security', 'ethical hacking', 'encryption']:
            categories["Cybersecurity"].append(skill)
        elif skill in ['solidity', 'web3', 'ethereum']:
            categories["Blockchain / Web3"].append(skill)

    return {k: v for k, v in categories.items() if v}


def get_improvement_suggestions(skills):
    improvement_suggestions = []
    if 'sql' not in skills:
        improvement_suggestions.append("Consider learning SQL—it’s widely required.")
    if 'aws' not in skills:
        improvement_suggestions.append("Familiarity with AWS is a great boost for cloud-related roles.")
    if 'machine learning' not in skills:
        improvement_suggestions.append("Machine Learning knowledge can open doors in AI roles.")
    if 'docker' not in skills:
        improvement_suggestions.append("Docker helps with containerization—valuable for deployment.")
    if 'react' not in skills and 'angular' not in skills:
        improvement_suggestions.append("Frontend frameworks like React or Angular improve frontend profiles.")
    return improvement_suggestions


def get_missing_skills_by_role(predicted_role, existing_skills):
    reverse_map = {}
    for skill, roles in skill_to_role_mapping.items():
        for role in roles:
            reverse_map.setdefault(role, []).append(skill)
    
    expected_skills = reverse_map.get(predicted_role, [])
    missing = [s for s in expected_skills if s not in existing_skills]
    return list(set(missing))


def format_score_breakdown(skills):
    critical = ['python', 'sql', 'machine learning', 'aws', 'docker']
    critical_count = len([s for s in skills if s in critical])
    score = min(len(skills) * 5 + critical_count * 10, 100)
    return {
        "totalScore": score,
        "skillsMatched": len(skills),
        "criticalSkillsBoost": critical_count * 10,
        "capAt": 100
    }


def analyze_resume(pdf_path):
    resume_text = extract_text_from_pdf(pdf_path)
    if not resume_text:
        return {"error": "Empty resume text extracted"}

    skills = extract_skills(resume_text)
    skill_categories = categorize_skills(skills)
    suggested_roles = predict_roles(skills)

    resume_vector = vectorizer.transform([" ".join(skills)]) if skills else vectorizer.transform([resume_text])
    predicted_role = model.predict(resume_vector)[0]

    resume_score_breakdown = format_score_breakdown(skills)
    improvements = get_improvement_suggestions(skills)
    missing_skills = get_missing_skills_by_role(predicted_role, skills)

    formatting_suggestions = []
    if 'linkedin' not in resume_text.lower():
        formatting_suggestions.append("Consider adding your LinkedIn profile.")
    if 'summary' not in resume_text.lower():
        formatting_suggestions.append("Add a professional summary at the top of your resume.")
    if resume_text.count('\n') < 15:
        formatting_suggestions.append("Your resume seems short. Consider elaborating on your experiences.")

    result = {
        "skillsExtracted": skills,
        "categorizedSkills": skill_categories,
        "suggestedRoles": list(set(suggested_roles + [predicted_role])),
        "predictedPrimaryRole": predicted_role,
        "resumeScore": resume_score_breakdown["totalScore"],
        "scoreBreakdown": resume_score_breakdown,
        "improvements": improvements,
        "missingSkillsForRole": missing_skills,
        "formattingSuggestions": formatting_suggestions
    }

    return result


if __name__ == "__main__":
    pdf_path = "sample_resume.pdf"  # replace this with your actual path
    result = analyze_resume(pdf_path)
    
    import json
    print(json.dumps(result, indent=4))
