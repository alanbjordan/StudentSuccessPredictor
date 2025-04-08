# routes/all_routes.py

# Importing necessary libraries
import io
import os
from config import Config
from datetime import datetime
from flask import Blueprint, jsonify, request, g
from helpers.cors_helpers import pre_authorized_cors_preflight
from helpers.data_loading_helpers import load_csv_to_dataframe

# Blueprint for all routes
all_routes_bp = Blueprint('all_routes', __name__)

# Upload Endpoint
@pre_authorized_cors_preflight
@all_routes_bp.route('/upload', methods=['POST'])
def upload_file():
    """
    Endpoint to receive a file upload (CSV) containing student data.
    Returns a success message along with the basic DataFrame info.
    """
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # Read the file into a DataFrame safely using our helper
    df = load_csv_to_dataframe(file)
    if df is None:
        return jsonify({'error': 'Failed to process the file. Ensure it is a valid CSV.'}), 400

    # For debugging/demonstration purposes, we return the DataFrame's head and column names.
    result = {
        'columns': list(df.columns),
        'head': df.head(5).to_dict(orient='records')
    }
    return jsonify({'message': 'File successfully ingested and processed', 'result': result}), 200


# Prediction Endpoint
@all_routes_bp.route('/predict', methods=['POST'])
def predict():
    """
    Endpoint to handle predictions.
    """
    data = request.get_json()

    # Validate input data
    if not data or 'input' not in data:
        return jsonify({"error": "Invalid input data"}), 400

    # Perform prediction logic here (dummy response for now)
    prediction = {"result": "dummy_prediction"}

    return jsonify(prediction), 200

# Report Endpoint
@all_routes_bp.route('/report', methods=['POST'])
def report():
    """
    Endpoint to handle reporting.
    """
    data = request.get_json()

    # Validate input data
    if not data or 'report' not in data:
        return jsonify({"error": "Invalid report data"}), 400

    # Perform reporting logic here (dummy response for now)
    report_result = {"status": "success"}

    return jsonify(report_result), 200
