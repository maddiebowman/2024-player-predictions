from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
import pandas as pd
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

# Load data into memory (can load from CSVs or database)
DATA_DIR = 'data'  # Directory where the CSV files are stored

# Route for serving the main dashboard HTML
@app.route('/')
def index():
    return render_template('index.html')

# API endpoint to fetch data for each position
@app.route('/get_data/<position>', methods=['GET'])
def get_position_data(position):
    file_map = {
        'qb': 'qb_data.csv',
        'wr': 'wr_data.csv',
        'rb': 'rb_data.csv',
        'te': 'te_data.csv'
    }

    # Validate position
    if position not in file_map:
        return jsonify({'error': 'Invalid position'}), 400

    # Get the file path
    file_path = os.path.join(DATA_DIR, file_map[position])

    # Check if the file exists
    if not os.path.exists(file_path):
        return jsonify({'error': 'Data file not found'}), 404

    # Read the data from CSV
    try:
        df = pd.read_csv(file_path)
        data = df.to_dict(orient='records')  # Convert to list of dictionaries
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
