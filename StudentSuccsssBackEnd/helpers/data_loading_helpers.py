# data_loading_helpers.py

# Importing necessary libraries
import pandas as pd

# Function to load CSV data into a DataFrame
def load_csv_to_dataframe(file_stream):
    """
    Reads a CSV file stream into a Pandas DataFrame.
    Performs basic cleaning such as stripping column names.
    
    Args:
        file_stream: A stream object (from uploaded file) containing the CSV data.
        
    Returns:
        A cleaned Pandas DataFrame.
    """
    try:
        # Read CSV from the file stream
        df = pd.read_csv(file_stream)
        # Clean: strip any extra spaces from column names
        df.columns = df.columns.str.strip()
        # Optionally: clean values (e.g., trimming strings, fixing dtypes, etc.)
        return df
    except Exception as e:
        print("Error reading CSV:", e)
        return None