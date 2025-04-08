# src/models/logistic_model.py
import pickle
import os

# Define the current directory
CURRENT_DIR = os.path.dirname(__file__)

# Paths to the serialized objects.
LOG_MODEL_PATH = os.path.join(CURRENT_DIR, 'log_model.pkl')
SCALER_PATH = os.path.join(CURRENT_DIR, 'scaler.pkl')
KMEANS_PATH = os.path.join(CURRENT_DIR, 'kmeans.pkl')

# Load the logistic regression model.
with open(LOG_MODEL_PATH, 'rb') as f:
    model = pickle.load(f)

# Load the scaler.
with open(SCALER_PATH, 'rb') as f:
    scaler = pickle.load(f)

# Load the KMeans model.
with open(KMEANS_PATH, 'rb') as f:
    kmeans = pickle.load(f)

# Optionally, print confirmation that each object is loaded.
print("Logistic Regression model loaded:", model)
print("Scaler loaded:", scaler)
print("KMeans model loaded:", kmeans)
