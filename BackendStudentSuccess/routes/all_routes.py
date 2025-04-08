# routes/all_routes.py

# Importing necessary libraries
from flask import Blueprint, jsonify, request
from helpers.llm_utils import generate_llm_natural_output
from helpers.cors_helpers import pre_authorized_cors_preflight
from helpers.data_loading_helpers import load_csv_to_dataframe
from helpers.plain_language_utils import generate_plain_language_summary
import pandas as pd
from models.logistic_model import model, scaler, kmeans
from helpers.llm_utils import generate_prediction_report
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


@all_routes_bp.route('/predict', methods=['POST'])
def predict():
    """
    Endpoint to handle predictions.
    Accepts the following fields:
    OnboardingTestScore, ClassesAttended, HomeworkSubmissionRate,
    HoursOnPlatform, ParticipationScore.
    
    It assigns a cluster using the scaler and KMeans model,
    then uses all features (including the computed Cluster) for logistic regression.
    """
    # Print the raw request data for debugging.
    data = request.get_json()
    print("Received data:", data)

    # Define required fields (the five features provided by the frontend).
    required_fields = [
        "OnboardingTestScore",
        "ClassesAttended",
        "HomeworkSubmissionRate",
        "HoursOnPlatform",
        "ParticipationScore"
    ]

    # Check for missing fields.
    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        print("Missing required fields:", missing_fields)
        return jsonify({"error": f"Missing required fields: {', '.join(missing_fields)}"}), 400

    # Convert inputs to floats.
    try:
        features = [float(data[field]) for field in required_fields]
        print("Parsed features:", features)
    except ValueError as ve:
        print("ValueError in converting inputs:", ve)
        return jsonify({"error": "One or more input fields contain invalid numeric data."}), 400

    # --- Assign the Cluster ---
    try:
        # Create a DataFrame from the input features.
        cluster_df = pd.DataFrame([dict(zip(required_fields, features))])
        print("DataFrame for clustering:", cluster_df)

        # Scale the inputs using the loaded scaler.
        features_scaled = scaler.transform(cluster_df)
        print("Scaled features:", features_scaled)

        # Predict cluster using the loaded KMeans model.
        cluster_label = int(kmeans.predict(features_scaled)[0])
        print("Predicted cluster:", cluster_label)
    except Exception as e:
        print("Exception during clustering:", e)
        return jsonify({"error": f"Cluster assignment error: {str(e)}"}), 500

    # --- Prepare features for logistic regression ---
    complete_features = features + [cluster_label]
    full_feature_columns = required_fields + ["Cluster"]
    features_df = pd.DataFrame([dict(zip(full_feature_columns, complete_features))])
    print("DataFrame for logistic regression prediction:", features_df)

    # --- Run prediction ---
    try:
        prediction_value = model.predict(features_df)
        print("Raw prediction value:", prediction_value)
    except Exception as e:
        print("Exception during prediction:", e)
        return jsonify({"error": f"Prediction error: {str(e)}"}), 500

    # Format the prediction for JSON serialization.
    prediction = {
        "result": prediction_value.tolist() if hasattr(prediction_value, "tolist") else prediction_value,
        "input_features": complete_features,
        "predicted_cluster": cluster_label
    }
    print("Final prediction output:", prediction)

    return jsonify(prediction), 200

# Report Endpoint
@all_routes_bp.route('/report', methods=['POST'])
def report():
    """
    Endpoint to handle reporting.
    Accepts prediction data from the client, uses a dedicated LLM prompt via the helper function,
    and returns a natural language report.
    """
    data = request.get_json()

    # Validate input data
    if not data or 'predictionData' not in data:
        return jsonify({"error": "Invalid prediction data"}), 400

    prediction_data = data['predictionData']

    try:
        # Use the new helper function with its dedicated prompt for prediction reports.
        refined_report = generate_prediction_report(prediction_data)
    except Exception as e:
        return jsonify({"error": f"LLM generation error: {str(e)}"}), 500

    return jsonify({"report": refined_report}), 200


