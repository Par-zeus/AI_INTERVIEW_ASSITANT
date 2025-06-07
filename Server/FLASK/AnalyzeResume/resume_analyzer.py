import pdfplumber
import re
import io
import json
import numpy as np
from collections import Counter
import spacy
from dateutil.parser import parse
import logging
import os
from datetime import datetime
from collections import defaultdict

# Common English stopwords for filtering noise from skill extraction
common_words = {
    'the', 'and', 'a', 'an', 'in', 'on', 'for', 'with', 'to', 'from', 'of', 'at', 'by',
    'is', 'are', 'was', 'were', 'be', 'being', 'been', 'this', 'that', 'these', 'those',
    'it', 'its', 'as', 'but', 'if', 'or', 'because', 'while', 'so', 'such', 'just', 'into',
    'than', 'then', 'out', 'about', 'over', 'under', 'again', 'further', 'off', 'up', 'down',
    'only', 'own', 'same', 'very', 'can', 'will', 'should', 'could', 'would', 'might', 'must'
}


# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('resume_analyzer')

# Load NLP model for better text processing
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    logger.warning("Spacy model not found. Using simple tokenization.")
    nlp = None

# Comprehensive skill-role mapping with weights
SKILL_TO_ROLE = {
    # Programming Languages
    "python": {"roles": ["Data Scientist", "Software Engineer", "ML Engineer", "Backend Developer"], "weight": 0.9},
    "java": {"roles": ["Backend Developer", "Software Engineer", "Android Developer"], "weight": 0.8},
    "javascript": {"roles": ["Frontend Developer", "Full Stack Developer", "Web Developer"], "weight": 0.85},
    "typescript": {"roles": ["Frontend Developer", "Full Stack Developer"], "weight": 0.8},
    "c++": {"roles": ["Software Engineer", "Game Developer", "Embedded Systems Engineer"], "weight": 0.75},
    "c#": {"roles": ["Software Engineer", ".NET Developer", "Game Developer"], "weight": 0.7},
    "go": {"roles": ["Backend Developer", "DevOps Engineer"], "weight": 0.75},
    "rust": {"roles": ["Systems Engineer", "Backend Developer"], "weight": 0.7},
    "php": {"roles": ["Backend Developer", "Web Developer"], "weight": 0.6},
    "ruby": {"roles": ["Backend Developer", "Full Stack Developer"], "weight": 0.65},
    "swift": {"roles": ["iOS Developer", "Mobile Developer"], "weight": 0.8},
    "kotlin": {"roles": ["Android Developer", "Mobile Developer"], "weight": 0.8},
    "r": {"roles": ["Data Scientist", "Data Analyst", "Statistician"], "weight": 0.75},
    
    # Web Development
    "html": {"roles": ["Frontend Developer", "Web Developer", "UI Developer"], "weight": 0.7},
    "css": {"roles": ["Frontend Developer", "Web Developer", "UI Developer"], "weight": 0.7},
    "react": {"roles": ["Frontend Developer", "UI Developer", "Full Stack Developer"], "weight": 0.9},
    "angular": {"roles": ["Frontend Developer", "UI Developer"], "weight": 0.8},
    "vue": {"roles": ["Frontend Developer", "UI Developer"], "weight": 0.75},
    "node.js": {"roles": ["Backend Developer", "Full Stack Developer"], "weight": 0.85},
    "node": {"roles": ["Backend Developer", "Full Stack Developer"], "weight": 0.85},
    "express": {"roles": ["Backend Developer", "Full Stack Developer"], "weight": 0.7},
    "django": {"roles": ["Backend Developer", "Python Developer"], "weight": 0.75},
    "flask": {"roles": ["Backend Developer", "Python Developer"], "weight": 0.7},
    "spring": {"roles": ["Backend Developer", "Java Developer"], "weight": 0.8},
    "jquery": {"roles": ["Frontend Developer", "Web Developer"], "weight": 0.5},
    "graphql": {"roles": ["Backend Developer", "Full Stack Developer"], "weight": 0.7},
    "rest api": {"roles": ["Backend Developer", "Full Stack Developer"], "weight": 0.8},
    
    # Data Science & ML
    "pandas": {"roles": ["Data Scientist", "Data Analyst", "ML Engineer"], "weight": 0.85},
    "numpy": {"roles": ["Data Scientist", "ML Engineer"], "weight": 0.8},
    "scikit-learn": {"roles": ["Data Scientist", "ML Engineer"], "weight": 0.85},
    "tensorflow": {"roles": ["ML Engineer", "Data Scientist", "AI Engineer"], "weight": 0.9},
    "pytorch": {"roles": ["ML Engineer", "Data Scientist", "AI Engineer"], "weight": 0.9},
    "keras": {"roles": ["ML Engineer", "Data Scientist"], "weight": 0.8},
    "machine learning": {"roles": ["ML Engineer", "Data Scientist"], "weight": 0.95},
    "deep learning": {"roles": ["ML Engineer", "AI Engineer"], "weight": 0.9},
    "nlp": {"roles": ["ML Engineer", "Data Scientist", "NLP Engineer"], "weight": 0.85},
    "computer vision": {"roles": ["ML Engineer", "Computer Vision Engineer"], "weight": 0.85},
    
    # Cloud & DevOps
    "aws": {"roles": ["Cloud Engineer", "DevOps Engineer", "Solutions Architect"], "weight": 0.9},
    "azure": {"roles": ["Cloud Engineer", "DevOps Engineer", "Solutions Architect"], "weight": 0.85},
    "gcp": {"roles": ["Cloud Engineer", "DevOps Engineer"], "weight": 0.85},
    "docker": {"roles": ["DevOps Engineer", "Cloud Engineer", "Software Engineer"], "weight": 0.9},
    "kubernetes": {"roles": ["DevOps Engineer", "Cloud Engineer"], "weight": 0.9},
    "terraform": {"roles": ["DevOps Engineer", "Cloud Engineer", "Site Reliability Engineer"], "weight": 0.85},
    "ci/cd": {"roles": ["DevOps Engineer", "Site Reliability Engineer"], "weight": 0.85},
    "jenkins": {"roles": ["DevOps Engineer", "Build Engineer"], "weight": 0.75},
    "prometheus": {"roles": ["DevOps Engineer", "Site Reliability Engineer"], "weight": 0.75},
    "grafana": {"roles": ["DevOps Engineer", "Site Reliability Engineer"], "weight": 0.7},
    
    # Database
    "sql": {"roles": ["Data Analyst", "Data Engineer", "Backend Developer", "Database Administrator"], "weight": 0.9},
    "postgresql": {"roles": ["Database Administrator", "Backend Developer", "Data Engineer"], "weight": 0.8},
    "mysql": {"roles": ["Database Administrator", "Backend Developer"], "weight": 0.75},
    "mongodb": {"roles": ["Backend Developer", "Database Administrator"], "weight": 0.8},
    "nosql": {"roles": ["Backend Developer", "Database Administrator"], "weight": 0.75},
    "oracle": {"roles": ["Database Administrator", "Backend Developer"], "weight": 0.7},
    "elasticsearch": {"roles": ["Search Engineer", "Data Engineer"], "weight": 0.7},
    "hadoop": {"roles": ["Data Engineer", "Big Data Engineer"], "weight": 0.8},
    "spark": {"roles": ["Data Engineer", "Big Data Engineer", "Data Scientist"], "weight": 0.85},
    "kafka": {"roles": ["Data Engineer", "Software Engineer"], "weight": 0.75},
    
    # UI/UX Design
    "figma": {"roles": ["UI Designer", "UX Designer", "Product Designer"], "weight": 0.9},
    "sketch": {"roles": ["UI Designer", "UX Designer"], "weight": 0.8},
    "adobe xd": {"roles": ["UI Designer", "UX Designer"], "weight": 0.8},
    "photoshop": {"roles": ["UI Designer", "Graphic Designer"], "weight": 0.7},
    "illustrator": {"roles": ["UI Designer", "Graphic Designer"], "weight": 0.7},
    "user research": {"roles": ["UX Designer", "UX Researcher"], "weight": 0.85},
    "wireframing": {"roles": ["UX Designer", "UI Designer"], "weight": 0.8},
    "prototyping": {"roles": ["UX Designer", "UI Designer", "Product Designer"], "weight": 0.85},
    
    # Product Management
    "product management": {"roles": ["Product Manager", "Product Owner"], "weight": 0.95},
    "agile": {"roles": ["Product Manager", "Scrum Master", "Project Manager"], "weight": 0.8},
    "scrum": {"roles": ["Product Manager", "Scrum Master", "Project Manager"], "weight": 0.85},
    "kanban": {"roles": ["Product Manager", "Project Manager"], "weight": 0.7},
    "jira": {"roles": ["Product Manager", "Project Manager", "Scrum Master"], "weight": 0.7},
    "product roadmap": {"roles": ["Product Manager", "Product Owner"], "weight": 0.85},
    "user stories": {"roles": ["Product Manager", "Product Owner", "Business Analyst"], "weight": 0.8},
    
    # Blockchain
    "blockchain": {"roles": ["Blockchain Developer", "Smart Contract Engineer"], "weight": 0.9},
    "ethereum": {"roles": ["Blockchain Developer", "Smart Contract Engineer"], "weight": 0.85},
    "solidity": {"roles": ["Smart Contract Engineer", "Blockchain Developer"], "weight": 0.9},
    "web3": {"roles": ["Blockchain Developer", "Web3 Engineer"], "weight": 0.9},
    "smart contract": {"roles": ["Smart Contract Engineer", "Blockchain Developer"], "weight": 0.9},
    
    # Cybersecurity
    "penetration testing": {"roles": ["Security Engineer", "Penetration Tester"], "weight": 0.9},
    "security analysis": {"roles": ["Security Engineer", "Security Analyst"], "weight": 0.85},
    "vulnerability assessment": {"roles": ["Security Engineer", "Security Analyst"], "weight": 0.85},
    "network security": {"roles": ["Network Security Engineer", "Security Engineer"], "weight": 0.8},
    "cryptography": {"roles": ["Security Engineer", "Cryptographer"], "weight": 0.8},
    "siem": {"roles": ["Security Analyst", "Security Engineer"], "weight": 0.75},
}

# Comprehensive skill categories
SKILL_CATEGORIES = {
    "Programming Languages": {
        "python", "java", "javascript", "typescript", "c++", "c#", "go", 
        "rust", "php", "ruby", "swift", "kotlin", "r", "scala"
    },
    "Web Development": {
        "html", "css", "react", "angular", "vue", "node.js", "express", 
        "django", "flask", "spring", "jquery", "graphql", "rest api",
        "asp.net", "bootstrap", "tailwind", "webpack", "babel"
    },
    "Data Science & ML": {
        "machine learning", "deep learning", "tensorflow", "pytorch", "keras",
        "pandas", "numpy", "scikit-learn", "nlp", "computer vision", "data mining",
        "statistical analysis", "forecasting", "a/b testing", "big data"
    },
    "Cloud & DevOps": {
        "aws", "azure", "gcp", "docker", "kubernetes", "terraform", "ci/cd",
        "jenkins", "prometheus", "grafana", "ansible", "puppet", "chef",
        "cloudformation", "lambda", "microservices", "serverless"
    },
    "Database": {
        "sql", "postgresql", "mysql", "mongodb", "nosql", "oracle", 
        "elasticsearch", "hadoop", "spark", "kafka", "redis", "cassandra",
        "dynamodb", "database design", "data modeling", "etl"
    },
    "UI/UX Design": {
        "figma", "sketch", "adobe xd", "photoshop", "illustrator", 
        "user research", "wireframing", "prototyping", "usability testing",
        "information architecture", "interaction design", "visual design"
    },
    "Project Management": {
        "agile", "scrum", "kanban", "jira", "project planning", 
        "stakeholder management", "risk management", "sprint planning",
        "product roadmap", "user stories", "pmp", "prince2"
    },
    "Blockchain": {
        "blockchain", "ethereum", "solidity", "web3", "smart contract",
        "cryptocurrency", "defi", "consensus algorithms", "tokenomics"
    },
    "Cybersecurity": {
        "penetration testing", "security analysis", "vulnerability assessment",
        "network security", "cryptography", "siem", "soc", "threat intelligence",
        "incident response", "security auditing", "ethical hacking"
    },
    "Soft Skills": {
        "communication", "leadership", "teamwork", "problem solving",
        "critical thinking", "time management", "creativity", "adaptability",
        "negotiation", "presentation", "stakeholder management"
    }
}

# High-value skills for modern job market (dynamic - could be loaded from DB/API)
CRITICAL_SKILLS = {
    "Software Engineer": {"python", "javascript", "ci/cd", "git", "cloud", "testing"},
    "Data Scientist": {"python", "machine learning", "sql", "pandas", "statistics"},
    "ML Engineer": {"tensorflow", "pytorch", "machine learning", "python", "deployment"},
    "Frontend Developer": {"react", "javascript", "typescript", "css", "responsive design"},
    "Backend Developer": {"node.js", "python", "java", "databases", "api design"},
    "DevOps Engineer": {"docker", "kubernetes", "ci/cd", "aws", "terraform"},
    "Product Manager": {"product strategy", "stakeholder management", "agile", "user stories", "roadmapping"},
    "UX Designer": {"figma", "user research", "wireframing", "prototyping", "usability testing"},
    "Data Engineer": {"python", "sql", "etl", "spark", "data modeling"},
    "Cloud Engineer": {"aws", "azure", "kubernetes", "terraform", "networking"},
    "Blockchain Developer": {"solidity", "web3", "smart contracts", "ethereum", "security"},
    # Add more roles as needed
}

# Resume sections (for section detection)
RESUME_SECTIONS = [
    "education", "experience", "work experience", "employment", "skills", 
    "projects", "publications", "certifications", "courses", "awards", 
    "summary", "objective", "professional summary", "about me", "contact",
    "interests", "languages", "volunteering", "references"
]

# Educational degrees for education quality evaluation
DEGREE_LEVELS = {
    "phd": 5, 
    "doctorate": 5,
    "masters": 4, 
    "mba": 4, 
    "ms": 4, 
    "ma": 4, 
    "bachelors": 3, 
    "bs": 3, 
    "ba": 3, 
    "btech": 3, 
    "associate": 2, 
    "certificate": 1, 
    "diploma": 1
}

# ATS keyword boosters
ATS_BOOSTERS = {
    "results", "achieved", "improved", "increased", "decreased", "reduced", 
    "managed", "led", "developed", "created", "implemented", "designed", 
    "launched", "built", "executed", "strategic", "responsible for",
    "accountable for", "directed", "coordinated", "spearheaded"
}

# ---------------------------
# 📄 Extract text from PDF with error handling
# ---------------------------
def extract_text_from_pdf(file_stream):
    try:
        with pdfplumber.open(file_stream) as pdf:
            text = "\n".join(page.extract_text() or "" for page in pdf.pages)
            logger.info(f"Successfully extracted {len(text)} characters from PDF")
            return text
    except Exception as e:
        logger.error(f"Error extracting text from PDF: {str(e)}")
        return ""

# ---------------------------
# 🔍 Identify resume sections
# ---------------------------
def identify_sections(text):
    lines = text.split('\n')
    sections = {}
    current_section = "header"
    
    # More robust section detection patterns
    section_patterns = {
        "summary": r'(?i)^(?:professional\s+)?summary|profile|objective|about\s+me',
        "experience": r'(?i)^(?:work\s+)?experience|employment|work\s+history|career',
        "education": r'(?i)^education|academic|qualification',
        "skills": r'(?i)^(?:technical\s+)?skills|technologies|expertise|competencies',
        "projects": r'(?i)^projects|personal\s+projects|portfolio|works',
        "certifications": r'(?i)^certifications|certificates|qualifications',
        "contact": r'(?i)^contact|personal\s+details|contact\s+information'
    }
    
    for i, line in enumerate(lines):
        line_lower = line.strip().lower()
        
        # Check section headers based on patterns
        found_section = False
        for section_name, pattern in section_patterns.items():
            if re.search(pattern, line_lower) and len(line_lower) < 40:
                current_section = section_name
                sections[current_section] = []
                found_section = True
                break
        
        # Handle bullet points as potential section markers
        if not found_section and (line_lower.startswith('•') or line_lower.startswith('-')):
            content = line.strip()
            if i > 0 and lines[i-1].strip() and not lines[i-1].strip().startswith('•') and not lines[i-1].strip().startswith('-'):
                potential_section = lines[i-1].strip().lower()
                if len(potential_section) < 30 and not potential_section.startswith('•') and not potential_section.startswith('-'):
                    # Previous line might be a section header
                    for section_name in RESUME_SECTIONS:
                        if section_name.lower() in potential_section:
                            current_section = section_name
                            sections[current_section] = [content]
                            found_section = True
                            break
        
        # Add line to current section
        if not found_section:
            if current_section in sections:
                sections[current_section].append(line)
            else:
                sections[current_section] = [line]
    
    # Convert lists to strings
    for section, content in sections.items():
        sections[section] = "\n".join(content)
    
    return sections
# ---------------------------
# 🧠 Extract skills with context awareness
# ---------------------------
def extract_skills(text, sections=None):
    text = text.lower()
    
    # Prioritize specific sections for skills detection
    skills_text = text
    if sections:
        prioritized_sections = ["skills", "experience", "projects", "technical skills"]
        section_texts = []
        for section_name in prioritized_sections:
            if section_name in sections:
                section_texts.append(sections[section_name])
        if section_texts:
            skills_text = "\n".join(section_texts) + "\n" + text
    
    # Enhanced skills detection with better context handling
    skills_found = []
    
    # Direct matching of known skills
    for skill, info in SKILL_TO_ROLE.items():
        # Handle variations of the skill (e.g., "nodejs" vs "node.js")
        variations = [
            skill, 
            skill.replace(" ", ""), 
            skill.replace(".", ""), 
            skill.replace("-", ""),
            skill.replace(" ", "-"),
            skill.replace("-", " ")
        ]
        
        # Check for skills with variations
        if any(var in skills_text for var in variations):
            skills_found.append(skill)
            continue
            
        # Check for skills in context (with word boundaries)
        skill_pattern = r'\b' + re.escape(skill) + r'\b'
        if re.search(skill_pattern, skills_text):
            skills_found.append(skill)
    
    # Additional technology pattern matching (for skills not in our predefined list)
    tech_patterns = [
        r'\b[A-Za-z]+[Jj][Ss]\b',  # Match frameworks ending with JS/js
        r'\b[A-Za-z]+\.[A-Za-z]+\b',  # Match tech with dots
        r'\b[A-Za-z]+(?:-[A-Za-z]+)+\b'  # Match hyphenated tech names
    ]
    
    for pattern in tech_patterns:
        matches = re.findall(pattern, skills_text)
        for match in matches:
            match_lower = match.lower()
            if match_lower not in [s.lower() for s in skills_found]:
                # Verify it's not just a common word
                if len(match) > 2 and match_lower not in common_words:
                    skills_found.append(match_lower)
    
    return list(set(skills_found))
# ---------------------------
# 🧩 Predict roles with weighted algorithm
# ---------------------------
def predict_roles(skills):
    if not skills:
        return ["Generalist"]
    
    role_scores = defaultdict(float)
    
    # Calculate weighted scores for each role based on skills
    for skill in skills:
        if skill in SKILL_TO_ROLE:
            skill_info = SKILL_TO_ROLE[skill]
            for role in skill_info["roles"]:
                role_scores[role] += skill_info["weight"]
    
    # Sort roles by score
    sorted_roles = sorted(role_scores.items(), key=lambda x: x[1], reverse=True)
    
    # Return list of roles (or "Generalist" if none found)
    return [role for role, score in sorted_roles] if sorted_roles else ["Generalist"]

# ---------------------------
# 📊 Experience level detection
# ---------------------------
def detect_experience_level(text, sections=None):
    exp_text = text
    if sections and "experience" in sections:
        exp_text = sections["experience"]
    
    # Look for years of experience
    year_patterns = [
        r'(\d+)\+?\s*years?\s+(?:of\s+)?experience',
        r'experience\s+(?:of\s+)?(\d+)\+?\s*years?',
        r'worked\s+(?:for\s+)?(\d+)\+?\s*years?'
    ]
    
    max_years = 0
    for pattern in year_patterns:
        matches = re.findall(pattern, exp_text.lower())
        for match in matches:
            try:
                years = int(match)
                max_years = max(max_years, years)
            except ValueError:
                continue
    
    # Count employment entries
    job_count = 0
    if sections and "experience" in sections:
        # Simple heuristic: count date patterns
        date_patterns = [
            r'\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]* \d{4}\s*[–-]\s*((jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]* \d{4}|present|current)',
            r'\b\d{4}\s*[–-]\s*(\d{4}|present|current)',
            r'\b\d{2}/\d{4}\s*[–-]\s*(\d{2}/\d{4}|present|current)'
        ]
        
        for pattern in date_patterns:
            job_count += len(re.findall(pattern, sections["experience"].lower()))
    
    # Determine level based on years and job count
    if max_years > 10 or job_count >= 5:
        return "Senior"
    elif max_years >= 5 or job_count >= 3:
        return "Mid-level"
    elif max_years >= 2 or job_count >= 1:
        return "Junior"
    else:
        return "Entry-level"

# ---------------------------
# 📚 Categorize skills by domain
# ---------------------------
def categorize_skills(skills):
    categorized = {}
    for category, skillset in SKILL_CATEGORIES.items():
        matched = [skill for skill in skills if skill in skillset]
        if matched:
            categorized[category] = matched
    return categorized

# ---------------------------
# 🎯 Resume compatibility scoring (for specific job match)
# ---------------------------
def compute_job_match_score(skills, job_title, job_description=None):
    if not job_title:
        return 0
    
    job_title_lower = job_title.lower()
    
    # Find most relevant target role based on job title
    target_role = None
    max_similarity = 0
    
    for role in CRITICAL_SKILLS:
        # Simple word matching similarity
        role_words = set(role.lower().split())
        job_words = set(job_title_lower.split())
        intersection = len(role_words.intersection(job_words))
        union = len(role_words.union(job_words))
        
        if union > 0:
            similarity = intersection / union
            if similarity > max_similarity:
                max_similarity = similarity
                target_role = role
    
    # If no good match, use Generalist skills
    if not target_role or max_similarity < 0.3:
        target_role = "Generalist"
        critical_skills = set()
    else:
        critical_skills = CRITICAL_SKILLS.get(target_role, set())
    
    # Calculate match percentage
    if not critical_skills:
        return 50  # Default moderate score
    
    skills_set = set(skills)
    matches = skills_set.intersection(critical_skills)
    match_percentage = (len(matches) / len(critical_skills)) * 100
    
    # Consider job description if available
    if job_description:
        job_desc_lower = job_description.lower()
        additional_match_points = 0
        
        # Check how many resume skills appear in job description
        for skill in skills_set:
            if skill in job_desc_lower:
                additional_match_points += 1
        
        # Normalize and add to score (max 20 additional points)
        additional_score = min(20, additional_match_points * 2)
        match_percentage = min(100, match_percentage + additional_score)
    
    return round(match_percentage)

# ---------------------------
# 📐 ATS compatibility scoring
# ---------------------------
def compute_ats_compatibility_score(resume_text, skills, sections=None):
    score_components = {
        "formatting": 0,
        "contentQuality": 0,
        "skillsPresentation": 0,
        "keywordOptimization": 0,
        "contactInfo": 0
    }
    
    # Check for contact information (improved detection)
    if re.search(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', resume_text):  # Email
        score_components["contactInfo"] += 3
    
    if re.search(r'\b(?:\+\d{1,3}[-\s]?)?\d{3}[-\s]?\d{3}[-\s]?\d{4}\b', resume_text):  # Phone with international format
        score_components["contactInfo"] += 3
    
    # Check for LinkedIn/social presence (even if just username)
    if re.search(r'(?:linkedin|github|twitter|ï|§)\s*[a-zA-Z0-9_-]+', resume_text, re.IGNORECASE):
        score_components["contactInfo"] += 4
    
    # Better section detection and scoring
    if sections:
        key_sections = {"summary": 5, "experience": 7, "education": 5, "skills": 8}
        for section, score in key_sections.items():
            if any(s in sections for s in [section, f"{section}s"]):
                score_components["formatting"] += score
    
    # Check for bullet points or organized list items
    bullet_count = resume_text.count('•') + resume_text.count('- ') + resume_text.count('– ')
    if bullet_count > 10:
        score_components["formatting"] += 5
    elif bullet_count > 5:
        score_components["formatting"] += 3
    
    # Content quality - look for action verbs and metrics
    action_verbs = ["developed", "implemented", "created", "designed", "managed", "led", "improved", 
                   "built", "collaborated", "maintained", "authored", "integrated", "deployed"]
    verb_count = sum(1 for verb in action_verbs if verb in resume_text.lower())
    score_components["contentQuality"] = min(15, verb_count * 2)
    
    # Check for quantifiable results 
    metrics_pattern = r'\b\d+%|\$\d+|\d+\s+(?:users|clients|team|people|developers|students)\b'
    metrics_count = len(re.findall(metrics_pattern, resume_text.lower()))
    score_components["contentQuality"] += min(10, metrics_count * 2)
    
    # Skills presentation
    if "skills" in sections or "technical skills" in sections:
        score_components["skillsPresentation"] += 10
        
        # Check for categorized skills
        if any(":" in line for line in (sections.get("skills", "") or "").split('\n')):
            score_components["skillsPresentation"] += 10
    else:
        # Even if no dedicated skills section, check if skills are clearly presented
        skills_in_text = sum(1 for skill in skills if skill in resume_text.lower())
        score_components["skillsPresentation"] += min(10, skills_in_text)
    
    # Keyword optimization
    for skill in skills:
        # Check if skill appears in context
        skill_pattern = r'\b' + re.escape(skill) + r'\b'
        if re.search(skill_pattern, resume_text.lower()):
            score_components["keywordOptimization"] += 1
    
    score_components["keywordOptimization"] = min(20, score_components["keywordOptimization"])
    
    # Calculate total score
    total_score = sum(score_components.values())
    
    return {
        "total": total_score,
        "breakdown": score_components
    }
# ---------------------------
# 🔍 Education quality assessment
# ---------------------------
def assess_education(text, sections=None):
    education_text = text
    if sections and "education" in sections:
        education_text = sections["education"]
    
    edu_score = 0
    institutions = []
    degrees = []
    
    # Extract degree information with better pattern matching
    degree_patterns = {
        "phd": r'\b(?:ph\.?d|doctorate|doctor of philosophy)\b',
        "masters": r'\bm\.?(?:sc|tech|eng|s|a|b\.?a|arch|phil|fa|com)\b|master of|masters',
        "bachelors": r'\bb\.?(?:tech|sc|a|arch|des|com)\b|bachelor of|bachelors',
        "diploma": r'\bdiploma\b'
    }
    
    for degree, pattern in degree_patterns.items():
        if re.search(pattern, education_text.lower()):
            edu_score = max(edu_score, DEGREE_LEVELS.get(degree, 0) * 5)
            degrees.append(degree)
    
    # Detect institutions with better name extraction
    if re.search(r'(?i)college|university|institute|school', education_text):
        institution_pattern = r'(?i)([A-Z][A-Za-z\s]+(?:College|University|Institute|School)[A-Za-z\s]*)'
        matches = re.findall(institution_pattern, education_text)
        if matches:
            institutions = matches
            edu_score += 5
    
    # Check for CGPA/percentage
    gpa_pattern = r'(?i)(?:CGPA|GPA):\s*(\d+\.\d+)'
    gpa_matches = re.findall(gpa_pattern, education_text)
    if gpa_matches:
        edu_score += 5
        
    percentage_pattern = r'(?i)percentage:\s*(\d+(?:\.\d+)?)'
    percentage_matches = re.findall(percentage_pattern, education_text)
    if percentage_matches:
        edu_score += 5
        
    # Extract graduation years
    year_pattern = r'(20\d{2})(?:\s*[-–]\s*(20\d{2}|present))?'
    if re.search(year_pattern, education_text):
        edu_score += 5
    
    # Cap at 25 points
    edu_score = min(25, edu_score)
    
    return {
        "score": edu_score,
        "institutions": institutions,
        "degrees": degrees
    }
# ---------------------------
# 🔧 Advanced formatting analysis
# ---------------------------
def get_advanced_formatting_suggestions(text, sections=None):
    suggestions = []
    
    # Contact information
    if not has_linkedin(text):
        suggestions.append("Include a LinkedIn profile link.")
    if not re.search(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', text):
        suggestions.append("Add an email address.")
    if not re.search(r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b', text):
        suggestions.append("Include a phone number for contact.")
    
    # Core sections
    missing_sections = []
    if sections:
        core_sections = ["summary", "experience", "education", "skills"]
        for section in core_sections:
            if not any(s in sections for s in [section, f"{section}s"]):
                missing_sections.append(section.title())
    
    if missing_sections:
        suggestions.append(f"Add these essential sections: {', '.join(missing_sections)}.")
    
    # Length check
    word_count = len(text.split())
    if word_count < 300:
        suggestions.append("Resume is too short. Aim for at least 400–600 words.")
    elif word_count > 1000:
        suggestions.append("Resume may be too long. Consider condensing to 1-2 pages.")
    
    # Formatting elements
    if text.count("•") < 5 and text.count("- ") < 5:
        suggestions.append("Use bullet points to list experience and achievements.")
    
    # Check for action verbs and quantifiable achievements
    action_verbs = ["managed", "developed", "created", "improved", "increased", "reduced"]
    if not any(verb in text.lower() for verb in action_verbs):
        suggestions.append("Use more action verbs to describe your experience.")
    
    if not re.search(r'\b\d+%|\$\d+|\d+ (users|clients|customers|projects)\b', text):
        suggestions.append("Include quantifiable achievements (e.g., 'Increased sales by 20%', 'Managed a team of 15 developers').")
    
    # Check for personal pronouns (I, my, me)
    if re.search(r'\b(I|my|me)\b', text, re.IGNORECASE):
        suggestions.append("Avoid personal pronouns (I, my, me) - use action verbs instead.")
    
    # Check for consistent tense
    past_tense = ["managed", "developed", "created", "implemented", "led", "designed"]
    present_tense = ["manage", "develop", "create", "implement", "lead", "design"]
    
    past_count = sum(1 for word in past_tense if re.search(rf'\b{word}\b', text.lower()))
    present_count = sum(1 for word in present_tense if re.search(rf'\b{word}\b', text.lower()))
    
    if past_count > 0 and present_count > 0 and sections and "experience" in sections:
        if past_count < present_count:
            suggestions.append("Use past tense consistently for previous positions.")
        
    # Check for dates in experience
    if sections and "experience" in sections and not re.search(r'\b(20\d{2}|19\d{2})\b', sections["experience"]):
        suggestions.append("Include dates (month/year) for each position in your experience section.")
    
    # Check for file naming
    if hasattr(text, 'name') and not re.search(r'resume|cv', text.name, re.IGNORECASE):
        suggestions.append("Name your file appropriately (e.g., 'FirstName_LastName_Resume.pdf').")
    
    # Check for education details
    if sections and "education" in sections:
        edu_text = sections["education"].lower()
        if not re.search(r'\b(gpa|grade|cum laude|honors)\b', edu_text):
            suggestions.append("Consider adding GPA or academic honors if they strengthen your application.")
    
    # Check for contact section placement
    if sections and "header" in sections and len(sections["header"]) < 50:
        suggestions.append("Ensure your contact information is prominently displayed at the top of the resume.")
    
    # Check for modern skills
    modern_tech = ["cloud", "machine learning", "data", "agile", "mobile", "analytics"]
    if not any(tech in text.lower() for tech in modern_tech) and "technology" in " ".join(suggestions).lower():
        suggestions.append("Consider highlighting modern technology skills relevant to your field.")
    
    # Check for proper section ordering
    ideal_order = ["summary", "experience", "skills", "education"]
    if sections and all(section in sections for section in ideal_order):
        section_positions = {section: list(sections.keys()).index(section) for section in ideal_order}
        if not all(section_positions[ideal_order[i]] < section_positions[ideal_order[i+1]] for i in range(len(ideal_order)-1)):
            suggestions.append("Consider a standard section order: Summary, Experience, Skills, Education.")
    
    # Check for file type
    if hasattr(text, 'name') and not text.name.lower().endswith('.pdf'):
        suggestions.append("Save your resume as a PDF to ensure consistent formatting across devices.")
    
    return suggestions   

# ---------------------------
# 📊 Generate comprehensive report
# ---------------------------
def generate_resume_report(text, file_name=None):
    # Extract sections
    sections = identify_sections(text)
    
    # Extract skills
    skills = extract_skills(text, sections)
    categorized_skills = categorize_skills(skills)
    
    # Role predictions
    predicted_roles = predict_roles(skills)
    primary_role = predicted_roles[0] if predicted_roles else "Generalist"
    
    # Experience level
    experience_level = detect_experience_level(text, sections)
    
    # Education assessment
    education_assessment = assess_education(text, sections)
    
    # ATS compatibility
    ats_score = compute_ats_compatibility_score(text, skills, sections)
    
    # Get missing skills for primary role
    missing_skills = get_missing_skills_for_role(primary_role, skills)
    
    # Formatting suggestions
    formatting_suggestions = get_advanced_formatting_suggestions(text, sections)
    
    # Calculate overall score
    overall_score = calculate_overall_score(ats_score, education_assessment["score"], skills, experience_level)
    
    # Create final report
    report = {
        "fileName": file_name,
        "analysisDate": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "overallScore": overall_score,
        "atsCompatibility": ats_score,
        "skillsExtracted": skills,
        "categorizedSkills": categorized_skills,
        "predictedRoles": predicted_roles,
        "primaryRole": primary_role,
        "experienceLevel": experience_level,
        "educationAssessment": education_assessment,
        "missingCriticalSkills": missing_skills,
        "improvementSuggestions": formatting_suggestions,
        "keywordDensity": calculate_keyword_density(text, skills)
    }
    
    return report

# ---------------------------
# 🎯 Calculate overall resume score
# ---------------------------
def calculate_overall_score(ats_score, education_score, skills, experience_level):
    # Base weights
    weights = {
        "ats": 0.4,         # 40% for ATS compatibility
        "education": 0.2,    # 20% for education quality
        "skills": 0.3,       # 30% for skills relevance and breadth
        "experience": 0.1    # 10% for experience level
    }
    
    # Calculate skills score (0-100)
    skills_score = min(len(skills) * 5, 100)  # Each skill worth 5 points, max 100
    
    # Calculate experience level score (0-100)
    experience_scores = {
        "Entry-level": 60,
        "Junior": 70,
        "Mid-level": 85,
        "Senior": 100
    }
    exp_score = experience_scores.get(experience_level, 60)
    
    # Calculate weighted score
    weighted_score = (
        (ats_score["total"] * weights["ats"]) +
        (education_score * weights["education"]) +
        (skills_score * weights["skills"]) +
        (exp_score * weights["experience"])
    )
    
    # Round to nearest integer
    return round(weighted_score)

# ---------------------------
# 📈 Get missing skills for specific role
# ---------------------------
def get_missing_skills_for_role(role, current_skills):
    if role not in CRITICAL_SKILLS:
        return []
    
    # Get critical skills for role
    critical = CRITICAL_SKILLS.get(role, set())
    current = set(current_skills)
    
    # Find missing critical skills
    missing = critical - current
    
    return list(missing)

# ---------------------------
# 📝 Calculate keyword density
# ---------------------------
def calculate_keyword_density(text, skills):
    words = text.lower().split()
    total_words = len(words)
    
    if total_words == 0:
        return {}
    
    # Count occurrences of each skill
    skill_counts = {}
    for skill in skills:
        # Count occurrences of skill (handling multi-word skills)
        if " " in skill:
            count = text.lower().count(skill)
        else:
            count = sum(1 for word in words if word == skill)
        
        if count > 0:
            skill_counts[skill] = {
                "count": count,
                "density": round((count / total_words) * 100, 2)
            }
    
    # Sort by density
    sorted_density = {k: v for k, v in sorted(
        skill_counts.items(), 
        key=lambda item: item[1]["density"], 
        reverse=True
    )}
    
    return sorted_density

# ---------------------------
# 🧠 LinkedIn profile detection
# ---------------------------
def has_linkedin(text):
    patterns = [
        r"linkedin\.com\/in\/[a-zA-Z0-9-_%]+",
        r"linkedin:?\s*[a-zA-Z0-9-_%]+",
        r"linkedin\.com\/[a-zA-Z0-9-_%]+"
    ]
    
    for pattern in patterns:
        if re.search(pattern, text.lower()):
            return True
    return False

# ---------------------------
# 💼 Check for portfolio/GitHub links
# ---------------------------
def has_portfolio_or_github(text):
    patterns = [
        r"github\.com\/[a-zA-Z0-9-_%]+",
        r"github:?\s*[a-zA-Z0-9-_%]+",
        r"portfolio:?\s*https?:\/\/[a-zA-Z0-9-_%\.\/]+",
        r"portfolio:?\s*[a-zA-Z0-9-_%\.\/]+\.(com|io|net|org)",
        r"(website|site|blog):?\s*https?:\/\/[a-zA-Z0-9-_%\.\/]+",
        r"Link\s*$",  # For "Link" text at end of project descriptions
        r"§\s*[a-zA-Z0-9-_%]+"  # For LinkedIn/GitHub usernames after § symbol
    ]
    
    for pattern in patterns:
        if re.search(pattern, text, re.IGNORECASE):
            return True
    return False
# ---------------------------
# 📊 Detect resume gaps
# ---------------------------
def detect_resume_gaps(text, sections=None):
    if not sections or "experience" not in sections:
        return {"hasGaps": False, "details": "No experience section found"}
    
    experience_text = sections["experience"]
    
    # Extract all date ranges
    date_patterns = [
        r'(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]* (\d{4})\s*[–-]\s*((jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]* (\d{4})|present|current)',
        r'(\d{4})\s*[–-]\s*((\d{4})|present|current)'
    ]
    
    date_ranges = []
    
    for pattern in date_patterns:
        matches = re.finditer(pattern, experience_text.lower())
        for match in matches:
            if match.groups()[0] in ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']:
                # Month year format
                start_year = int(match.groups()[1])
                end_str = match.groups()[2]
                if end_str in ["present", "current"]:
                    end_year = datetime.now().year
                else:
                    end_year = int(match.groups()[4])
            else:
                # Just year format
                start_year = int(match.groups()[0])
                end_str = match.groups()[1]
                if end_str in ["present", "current"]:
                    end_year = datetime.now().year
                else:
                    end_year = int(end_str)
            
            date_ranges.append((start_year, end_year))
    
    # Sort by start date
    if not date_ranges:
        return {"hasGaps": False, "details": "No date ranges detected"}
    
    date_ranges.sort()
    
    # Check for gaps (more than 6 months between positions)
    gaps = []
    for i in range(len(date_ranges) - 1):
        current_end = date_ranges[i][1]
        next_start = date_ranges[i+1][0]
        
        if next_start - current_end > 1:  # Gap of more than a year
            gaps.append(f"{current_end} - {next_start}")
        elif next_start - current_end == 1:  # Potential partial year gap
            gaps.append(f"{current_end} - {next_start} (potential gap)")
    
    return {
        "hasGaps": len(gaps) > 0,
        "gaps": gaps
    }

# ---------------------------
# 📊 Generate action items
# ---------------------------
def generate_action_items(report):
    actions = []
    
    # ATS compatibility actions
    if report["atsCompatibility"]["total"] < 70:
        if report["atsCompatibility"]["breakdown"]["formatting"] < 15:
            actions.append("Improve resume formatting with clear section headers and consistent spacing")
        if report["atsCompatibility"]["breakdown"]["contentQuality"] < 15:
            actions.append("Add more quantifiable achievements and action verbs to your experience")
        if report["atsCompatibility"]["breakdown"]["skillsPresentation"] < 10:
            actions.append("Create a dedicated skills section with categories")
    
    # Missing skills actions
    if report["missingCriticalSkills"]:
        top_missing = report["missingCriticalSkills"][:3]
        actions.append(f"Add these critical skills to your resume if applicable: {', '.join(top_missing)}")
    
    # Keyword density actions
    low_density = True
    for _, data in report["keywordDensity"].items():
        if data["density"] > 0.5:
            low_density = False
            break
    
    if low_density:
        actions.append("Increase keyword density by mentioning your core skills more frequently")
    
    # Education action
    if report["educationAssessment"]["score"] < 10:
        actions.append("Enhance your education section with more details about degrees and achievements")
    
    # Portfolio/GitHub action
    if "hasPortfolio" in report and not report["hasPortfolio"]:
        actions.append("Add links to your portfolio, GitHub, or personal website")
    
    # Improvement suggestions
    for suggestion in report["improvementSuggestions"][:3]:
        actions.append(suggestion)
    
    return actions

# ---------------------------
# 🚀 MAIN ANALYSIS FUNCTION
# ---------------------------
def analyze_resume1(file_stream, job_title=None, job_description=None):
    try:
        # Extract text from PDF
        resume_text = extract_text_from_pdf(file_stream)
        if not resume_text:
            return {"error": "Could not extract text from resume"}
        
        # Generate full report
        report = generate_resume_report(resume_text, getattr(file_stream, 'name', None))
        
        # Additional checks
        report["hasLinkedIn"] = has_linkedin(resume_text)
        report["hasPortfolio"] = has_portfolio_or_github(resume_text)
        report["gapAnalysis"] = detect_resume_gaps(resume_text, identify_sections(resume_text))
        
        # If job title provided, calculate job match score
        if job_title:
            report["jobMatchScore"] = compute_job_match_score(
                report["skillsExtracted"], 
                job_title, 
                job_description
            )
        
        # Generate prioritized action items
        report["actionItems"] = generate_action_items(report)
        
        return report
        
    except Exception as e:
        logger.error(f"Error analyzing resume: {str(e)}")
        return {"error": f"Analysis failed: {str(e)}"}

# ---------------------------
# 🛠️ Command Line Interface 
# ---------------------------
def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='Analyze a resume PDF file.')
    parser.add_argument('pdf_path', help='Path to the resume PDF file')
    parser.add_argument('--job-title', help='Optional job title for targeted analysis')
    parser.add_argument('--job-desc', help='Optional job description for detailed matching')
    parser.add_argument('--output', help='Output path for JSON results')
    
    args = parser.parse_args()
    
    try:
        with open(args.pdf_path, 'rb') as f:
            results = analyze_resume(f, args.job_title, args.job_desc)
            
        if args.output:
            with open(args.output, 'w') as f:
                json.dump(results, f, indent=2)
            print(f"Results saved to {args.output}")
        else:
            print(json.dumps(results, indent=2))
            
    except FileNotFoundError:
        print(f"Error: File not found: {args.pdf_path}")
        return 1
    except Exception as e:
        print(f"Error: {str(e)}")
        return 1
        
    return 0

if __name__ == "__main__":
    exit(main())