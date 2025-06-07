import pdfplumber
import re
import pickle
import os
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.linear_model import LogisticRegression



# Load pre-trained models
with open("models/vectorizer.pkl", "rb") as f:
    vectorizer = pickle.load(f)

with open("models/logistic_model.pkl", "rb") as f:
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

def has_linkedin(text):
    # Regex to find LinkedIn profile links
    pattern = r"(https?://)?(www\.)?linkedin\.com/in/[a-zA-Z0-9-_%]+"
    return bool(re.search(pattern, text.lower()))

def extract_text_from_pdf(pdf_path):
    try:
        with pdfplumber.open(pdf_path) as pdf:
            return '\n'.join(page.extract_text() or '' for page in pdf.pages)
    except Exception as e:
        print(f"Error extracting text: {e}")
        return ""


def extract_skills(text):
    words = re.findall(r'\b\w[\w+]*\b', text.lower())
    return list({word for word in words if word in skill_to_role_mapping})


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
    suggestions = []
    if 'sql' not in skills:
        suggestions.append("Consider learning SQL—it’s widely required.")
    if 'aws' not in skills:
        suggestions.append("Familiarity with AWS is a great boost for cloud-related roles.")
    if 'machine learning' not in skills:
        suggestions.append("Machine Learning knowledge can open doors in AI roles.")
    if 'docker' not in skills:
        suggestions.append("Docker helps with containerization—valuable for deployment.")
    if 'react' not in skills and 'angular' not in skills:
        suggestions.append("Frontend frameworks like React or Angular improve frontend profiles.")
    return suggestions


def get_missing_skills_by_role(predicted_role, existing_skills):
    reverse_map = {}
    for skill, roles in skill_to_role_mapping.items():
        for role in roles:
            reverse_map.setdefault(role, []).append(skill)
    expected_skills = reverse_map.get(predicted_role, [])
    return list(set(s for s in expected_skills if s not in existing_skills))


def format_score_breakdown(skills):
    critical = ['python', 'sql', 'machine learning', 'aws', 'docker']
    critical_count = sum(1 for s in skills if s in critical)
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
    if not has_linkedin(resume_text):
        formatting_suggestions.append("Consider adding your LinkedIn profile.")
    if 'summary' not in resume_text.lower():
        formatting_suggestions.append("Add a professional summary at the top of your resume.")
    if resume_text.count('\n') < 15:
        formatting_suggestions.append("Your resume seems short. Consider elaborating on your experiences.")

    return {
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


if __name__ == "__main__":
    pdf_path = "sample_resume.pdf"  # replace with your actual file path
    result = analyze_resume(pdf_path)

    import json
    print(json.dumps(result, indent=4))




# import pdfplumber
# import re
# import pickle
# import os
# from sklearn.feature_extraction.text import CountVectorizer
# from sklearn.linear_model import LogisticRegression

# # Load pre-trained models
# with open("models/vectorizer.pkl", "rb") as f:
#     vectorizer = pickle.load(f)

# with open("models/logistic_model.pkl", "rb") as f:
#     model = pickle.load(f)

# # Skill-to-role mapping and precomputed data structures
# skill_to_role_mapping = {
#     'python': ['Data Scientist', 'Software Engineer'],
#     'java': ['Backend Developer', 'Software Engineer'],
#     'c++': ['Embedded Systems Engineer', 'Game Developer'],
#     'sql': ['Data Analyst', 'Database Administrator'],
#     'javascript': ['Frontend Developer', 'Full Stack Developer'],
#     'html': ['Frontend Developer'],
#     'css': ['Frontend Developer'],
#     'react': ['Frontend Developer'],
#     'node': ['Backend Developer'],
#     'aws': ['DevOps Engineer', 'Cloud Engineer'],
#     'azure': ['Cloud Engineer'],
#     'gcp': ['Cloud Engineer'],
#     'docker': ['DevOps Engineer'],
#     'kubernetes': ['DevOps Engineer'],
#     'machine learning': ['Data Scientist', 'ML Engineer'],
#     'deep learning': ['AI Engineer'],
#     'tensorflow': ['AI Engineer'],
#     'pytorch': ['AI Engineer'],
#     'nlp': ['NLP Engineer'],
#     'computer vision': ['CV Engineer'],
#     'mongodb': ['Full Stack Developer'],
#     'hadoop': ['Data Engineer'],
#     'typescript': ['Frontend Developer'],
#     'express': ['Backend Developer'],
#     'figma': ['UI/UX Designer'],
#     'scrum': ['Product Manager'],
#     'agile': ['Product Manager'],
#     'product management': ['Product Manager'],
#     'penetration testing': ['Cybersecurity Analyst'],
#     'network security': ['Cybersecurity Analyst'],
#     'ethical hacking': ['Cybersecurity Analyst'],
#     'encryption': ['Cybersecurity Analyst'],
#     'solidity': ['Blockchain Developer'],
#     'web3': ['Blockchain Developer'],
#     'ethereum': ['Blockchain Developer'],
# }



# # Precompute reverse role mapping and skill categories
# reverse_role_map = {}
# skill_category_map = {}
# for skill, roles in skill_to_role_mapping.items():
#     for role in roles:
#         reverse_role_map.setdefault(role, set()).add(skill)
#     # Map skill to category
#     if skill in ['python', 'java', 'c++', 'typescript', 'javascript']:
#         skill_category_map[skill] = "Programming Languages"
#     elif skill in ['react', 'angular', 'vue', 'node', 'express', 'html', 'css']:
#         skill_category_map[skill] = "Web Development"
#     elif skill in ['machine learning', 'deep learning', 'tensorflow', 'pytorch', 'nlp', 'computer vision']:
#         skill_category_map[skill] = "Data Science / ML"
#     elif skill in ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'ci/cd', 'terraform']:
#         skill_category_map[skill] = "DevOps / Cloud"
#     elif skill in ['sql', 'mongodb', 'hadoop']:
#         skill_category_map[skill] = "Database"
#     elif skill in ['figma', 'ui', 'ux', 'user research', 'product management', 'agile', 'scrum']:
#         skill_category_map[skill] = "Product / UI-UX"
#     elif skill in ['penetration testing', 'network security', 'ethical hacking', 'encryption']:
#         skill_category_map[skill] = "Cybersecurity"
#     elif skill in ['solidity', 'web3', 'ethereum']:
#         skill_category_map[skill] = "Blockchain / Web3"

# # Predefined list of skills for quick lookup
# all_skills = set(skill_to_role_mapping.keys())

# def has_linkedin(text):
#     """Improved LinkedIn URL detection with better regex coverage"""
#     pattern = r"(https?://)?(www\.)?linkedin\.com/(in|pub|profile)/[a-zA-Z0-9-]+(/[a-zA-Z0-9-]+)*/?(\?[\w=&-]+)?"
#     return bool(re.search(pattern, text, re.IGNORECASE))

# def extract_text_from_pdf(pdf_path):
#     """Extract text from PDF with error handling"""
#     try:
#         with pdfplumber.open(pdf_path) as pdf:
#             return '\n'.join(page.extract_text() or '' for page in pdf.pages)
#     except Exception as e:
#         print(f"Error extracting text: {e}")
#         return ""

# def extract_skills(text):
#     """Improved skill extraction using n-grams and preprocessing"""
#     text_lower = text.lower()
#     # Preprocess text to handle special characters and case variations
#     clean_text = re.sub(r'[^\w\s+]', ' ', text_lower)
#     words = re.findall(r'\b\w+(?:[\+\./-]\w+)*\b', clean_text)
    
#     # Generate 1-gram and 2-gram combinations
#     ngrams = set()
#     max_ngram_size = 2
#     for i in range(len(words)):
#         for j in range(1, max_ngram_size + 1):
#             if i + j <= len(words):
#                 ngram = ' '.join(words[i:i+j])
#                 ngrams.add(ngram)
    
#     # Match with known skills
#     return [skill for skill in all_skills if skill in ngrams]

# def categorize_skills(skills):
#     """Efficient categorization using precomputed mapping"""
#     categories = {k: [] for k in set(skill_category_map.values())}
#     for skill in skills:
#         if skill in skill_category_map:
#             categories[skill_category_map[skill]].append(skill)
#     return {k: v for k, v in categories.items() if v}

# def predict_roles(skills):
#     """Role prediction using set operations"""
#     roles = set()
#     for skill in skills:
#         roles.update(skill_to_role_mapping.get(skill, []))
#     return list(roles)

# def get_improvement_suggestions(skills):
#     """More relevant suggestions based on role-agnostic best practices"""
#     suggestions = []
#     common_requirements = {
#         'sql': "SQL is fundamental for data roles",
#         'python': "Python remains crucial for automation and data tasks",
#         'aws': "Cloud skills are increasingly important",
#         'docker': "Containerization is key for modern deployment",
#         'communication': "Soft skills are often overlooked but critical"
#     }
#     for skill, msg in common_requirements.items():
#         if skill not in skills and skill != 'communication':
#             suggestions.append(msg)
#     if len(suggestions) < 3:
#         suggestions.append(common_requirements['communication'])
#     return suggestions[:3]

# def get_missing_skills_by_role(target_role, existing_skills):
#     """Efficient missing skills calculation using precomputed reverse map"""
#     required_skills = reverse_role_map.get(target_role, set())
#     return list(required_skills - set(existing_skills))

# def format_score_breakdown(skills):
#     """Improved scoring algorithm with normalized weights"""
#     critical_skills = {'python', 'sql', 'aws', 'docker', 'javascript'}
#     base_score = min(len(skills) * 8, 60)
#     bonus = sum(10 for s in skills if s in critical_skills)
#     return {
#         "totalScore": min(base_score + bonus, 100),
#         "baseScore": base_score,
#         "bonusSkills": bonus,
#         "criticalSkills": [s for s in skills if s in critical_skills]
#     }

# def analyze_resume(pdf_path):
#     """Optimized main analysis function"""
#     resume_text = extract_text_from_pdf(pdf_path)
#     if not resume_text:
#         return {"error": "Empty resume text extracted"}

#     skills = extract_skills(resume_text)
#     skill_categories = categorize_skills(skills)
#     suggested_roles = predict_roles(skills)

#     # Prepare features for model prediction
#     features = ' '.join(skills) if skills else resume_text
#     resume_vector = vectorizer.transform([features])
#     predicted_role = model.predict(resume_vector)[0]

#     # Generate insights
#     resume_score = format_score_breakdown(skills)
#     improvements = get_improvement_suggestions(skills)
#     missing_skills = get_missing_skills_by_role(predicted_role, skills)

#     # Formatting suggestions
#     formatting_suggestions = []
#     if not has_linkedin(resume_text):
#         formatting_suggestions.append("Add a LinkedIn profile link (found in 85% of top resumes)")
#     if len(resume_text.split()) < 400:
#         formatting_suggestions.append("Consider adding more details to reach 400-600 words (typical for ATS systems)")

#     return {
#         "skillsExtracted": skills,
#         "categorizedSkills": skill_categories,
#         "suggestedRoles": sorted(list(set(suggested_roles + [predicted_role]))),
#         "predictedPrimaryRole": predicted_role,
#         "resumeScore": resume_score["totalScore"],
#         "scoreBreakdown": resume_score,
#         "improvementSuggestions": improvements,
#         "missingSkillsForTargetRole": missing_skills,
#         "formattingTips": formatting_suggestions
#     }

# if __name__ == "__main__":
#     pdf_path = "sample_resume.pdf"
#     result = analyze_resume(pdf_path)
#     print(json.dumps(result, indent=2))