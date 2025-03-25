from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
import numpy as np
import librosa
import io
from pydub import AudioSegment
from werkzeug.utils import secure_filename
from flask_cors import CORS


# Initialize Flask app
app = Flask(__name__)

CORS(app)
# Load the pre-trained model
model = load_model('best_model.keras')

# Allowed file extensions for audio files
ALLOWED_EXTENSIONS = {'wav', 'mp3', 'flac'}

# Function to check allowed file extensions
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Define the prediction endpoint
@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Check if the post request has the audio file
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400
        
        file = request.files['file']

        # If no file is selected
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400

        # If the file has an allowed extension
        if file and allowed_file(file.filename):
            # Secure the filename
            filename = secure_filename(file.filename)

            # Read the audio file into memory as a byte stream
            file_bytes = io.BytesIO(file.read())

            # Use pydub to handle audio conversion and ensure it's in WAV format
            audio = AudioSegment.from_file(file_bytes)
            
            # Convert to mono (if stereo)
            audio = audio.set_channels(1)

            # Export the audio to a temporary buffer (WAV format)
            temp_wav = io.BytesIO()
            audio.export(temp_wav, format="wav")
            temp_wav.seek(0)  # Rewind the buffer to the beginning
            
            # Load the audio into librosa for further processing
            y, sr = librosa.load(temp_wav, sr=44100)

            # Preprocess the audio (e.g., MFCC extraction)
            mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)

            # Reshape or process depending on your model input
            input_data = mfcc.reshape(1, -1)  # Example for a classification model

            # Make prediction using the model
            prediction = model.predict(input_data)

            # Process prediction (e.g., classification or regression)
            predicted_class = np.argmax(prediction, axis=-1)  # For classification models

            # Return the result as a JSON response
            response = {'prediction': int(predicted_class[0])}  # Return as integer (class label)
            return jsonify(response)

        else:
            return jsonify({'error': 'Invalid file format'}), 400

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
