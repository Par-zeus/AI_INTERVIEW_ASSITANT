import pickle
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

# Sample training data
resumes = [
    "Python Machine Learning TensorFlow",
    "SQL Data Analysis Big Data",
    "Agile Scrum Product Management",
    "React JavaScript HTML CSS",
    "Node Express MongoDB SQL",
    "Python SQL Pandas Numpy",
    "Docker Kubernetes AWS",
    "Solidity Ethereum Web3"
]

roles = [
    "ML Engineer",
    "Data Analyst",
    "Product Manager",
    "Frontend Developer",
    "Backend Developer",
    "Data Scientist",
    "DevOps Engineer",
    "Blockchain Developer"
]

# Train TF-IDF vectorizer
vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(resumes)

# Train Logistic Regression model
model = LogisticRegression()
model.fit(X, roles)

# Save vectorizer
with open("models/vectorizer.pkl", "wb") as f:
    pickle.dump(vectorizer, f)

# Save model
with open("models/logistic_model.pkl", "wb") as f:
    pickle.dump(model, f)

print("✅ vectorizer.pkl and logistic_model.pkl saved successfully.")
