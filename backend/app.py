from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import csv
from image_captioner import generate_caption
from mcq_generator import generate_mcqs
from pdf_extractor import read_pdf  # Import the function to extract PDF content

app = Flask(__name__)
CORS(app)

# Directory to save uploaded images and documents
UPLOAD_FOLDER = '/home/vignesh496/Fest/backend/uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/generate-questions', methods=['POST'])
def generate_questions():
    prompt = ""
    n = 5  # Default number of questions
    difficulty = 'easy'  # Default difficulty

    print(f"Content-Type: {request.content_type}")

    # Check if the request is a multipart form (for image or document upload)
    if request.content_type.startswith('multipart/form-data'):
        # Handle image file
        if 'image' in request.files:
            file = request.files['image']
            if file.filename == '':
                return jsonify({"error": "No selected file"}), 400

            # Save the uploaded image to the uploads folder
            file_path = os.path.join(UPLOAD_FOLDER, file.filename)
            file.save(file_path)
            print(f"Image saved to {file_path}")

            # Generate caption using the image_captioner module
            prompt = generate_caption(file_path)
            print(f"Generated caption: {prompt}")

        # Handle PDF/document file
        elif 'document' in request.files:
            file = request.files['document']
            if file.filename == '':
                return jsonify({"error": "No selected file"}), 400

            # Save the uploaded document to the uploads folder
            file_path = os.path.join(UPLOAD_FOLDER, file.filename)
            file.save(file_path)
            print(f"Document saved to {file_path}")

            # Extract text from the PDF using pdf_extractor
            prompt = read_pdf(file_path)
            print(f"Extracted text from PDF: {prompt[:500]}")  # Show first 500 characters of extracted text

        # Extract form data for number of questions and difficulty
        n = request.form.get('number_of_questions', '5')
        difficulty = request.form.get('difficulty', 'easy')

        # Ensure that number_of_questions is correctly parsed to an integer
        try:
            n = int(n)
        except ValueError:
            return jsonify({"error": "Invalid value for number_of_questions"}), 400

        # Extract any additional text prompt from the form data
        text_prompt = request.form.get('prompt', '')
        if text_prompt:
            # Combine text prompt and image/PDF text if both are present
            prompt = text_prompt if not prompt else prompt + " " + text_prompt

        # Debugging logs to ensure correct values are captured
        print(f"Form Data - number_of_questions: {n}, difficulty: {difficulty}, text_prompt: {text_prompt}")

    # Handle JSON-based input (text prompt only, no image or PDF)
    elif request.content_type == 'application/json':
        data = request.json
        prompt = data.get('prompt', '')  # Text-based prompt
        n = int(data.get('number_of_questions', 5))
        difficulty = data.get('difficulty', 'easy')

        print(f"JSON Data - number_of_questions: {n}, difficulty: {difficulty}, prompt: {prompt}")

    else:
        return jsonify({"error": "Unsupported Media Type. Please use multipart/form-data or application/json."}), 415

    if not prompt:
        return jsonify({"error": "No prompt provided"}), 400

    print(f"Final Prompt: {prompt}, Number of Questions: {n}, Difficulty: {difficulty}")

    # Generate MCQs using the prompt
    response = generate_mcqs(prompt, n, difficulty)

    # Process response and write to CSV
    output_data = response.split('\n\n')
    with open('/home/vignesh496/Fest/backend/questions.csv', mode='w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(['Question', 'Option A', 'Option B', 'Option C', 'Option D', 'Right Answer'])

        for question_block in output_data:
            if question_block.strip():
                lines = question_block.split('\n')
                question_line = lines[0].replace("Question: ", "").strip()
                options_line = lines[1].replace("Options: ", "").strip().strip('[]').replace('"', '').split(', ')
                right_answer_line = lines[2].replace("Right Answer: ", "").strip()

                if len(options_line) == 4:
                    writer.writerow([question_line] + options_line + [right_answer_line])

    return jsonify({"message": "Questions generated and saved to CSV."})

@app.route('/get-quiz', methods=['GET'])
def get_quiz():
    quiz_data = []
    try:
        with open('/home/vignesh496/Fest/backend/questions.csv', mode='r') as file:
            reader = csv.DictReader(file)
            for row in reader:
                quiz_data.append({
                    'question': row['Question'],
                    'options': [row['Option A'], row['Option B'], row['Option C'], row['Option D']],
                    'correct_answer': row['Right Answer']
                })
    except FileNotFoundError:
        return jsonify({"message": "CSV file not found."}), 404

    return jsonify(quiz_data)

if __name__ == '__main__':
    app.run(debug=True)
