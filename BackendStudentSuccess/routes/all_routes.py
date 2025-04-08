# routes/all_routes.py

# Importing necessary libraries
from flask import Blueprint, jsonify, request
from helpers.llm_utils import generate_llm_natural_output
from helpers.cors_helpers import pre_authorized_cors_preflight
from helpers.data_loading_helpers import load_csv_to_dataframe
from helpers.plain_language_utils import generate_plain_language_summary
# Blueprint for all routes
all_routes_bp = Blueprint('all_routes', __name__)

# Upload Endpoint
@pre_authorized_cors_preflight
@all_routes_bp.route('/upload', methods=['POST'])
def upload_file():
    """
    Endpoint to receive a file upload (CSV) containing student data.
    It loads the data into a Pandas DataFrame, generates basic statistics
    via the DataFrame's describe() method, converts those stats into a plain language 
    summary, and sends the result back to the frontend.
    """
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # Load the CSV into a DataFrame using our helper
    df = load_csv_to_dataframe(file)
    if df is None:
        return jsonify({'error': 'Failed to process the file. Ensure it is a valid CSV.'}), 400

    # Generate statistical summary of the DataFrame
    stats_df = df.describe()  # This provides statistics for numeric columns
    # Convert the DataFrame summary into a dictionary
    stats_dict = stats_df.to_dict()
    
    # Generate a plain language summary from the statistics
    plain_summary = generate_plain_language_summary(stats_dict)

    # Use the LLM to refine and improve the plain language summary
    refined_summary = generate_llm_natural_output(plain_summary)

    return jsonify({
        'message': 'File successfully ingested and processed',
        'refined_summary': refined_summary
    }), 200


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
