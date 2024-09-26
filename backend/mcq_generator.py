import google.generativeai as genai


def generate_mcqs(prompt, n, difficulty):

    genai.configure(api_key="AIzaSyBZi8btM5GtRPjyoCBpuGgG-BLDDtY5G2I")

    generation_config = {
        "temperature": 1,
        "top_p": 0.95,
        "top_k": 64,
        "max_output_tokens": 8192,
        "response_mime_type": "text/plain",
    }

    model = genai.GenerativeModel(
        model_name="gemini-1.0-pro",
        generation_config=generation_config,
    )

    response = model.generate_content([
        "input: Study materials from books that has been recognized text using OCR Techniques or Image recognized and vocabulary and features are extracted are given as input.",
        "output: MCQs only from the given content, but not extra or out of the given content, either in sentence. Give MCQ as much as possible. I want only mcqs and no other comments. Each question marked in serial numbers. At last, give with answers as options.",
        "input: Python is a high level, scripting programming language. It is used to make AI/ML models.\n\n1 question, easy level.",
        "output: Question: What level of programming language is Python?\nOptions: [\"A. Low level\", \"B. High level\", \"C. Machine level\", \"D. Assembly level\"]\nRight Answer: B.",
        "input: Jasmine is a fragrant flowering plant, known for its delicate white or yellow blooms. Often used in perfumes and teas, jasmine symbolizes love and beauty in many cultures. It thrives in warm climates and can be grown as a vine or shrub, attracting pollinators like bees and butterflies.\n\n3 questions, easy level.",
        "output: 1. What is the color of jasmine flowers?\nOptions: [\"A. Red and purple\", \"B. Blue and green\", \"C. White and yellow\", \"D. Orange and brown\"]\nRight Answer: C\n\n2. What is jasmine often used for?\nOptions: [\"A. Cooking spices\", \"B. Perfumes and teas\", \"C. Building materials\", \"D. Medicinal herbs\"]\nRight Answer: B\n\n3. What kind of climate does jasmine prefer?\nOptions: [\"A. Cold and dry\", \"B. Warm and humid\", \"C. Wet and shady\", \"D. Windy and cool\"]\nRight Answer: B.",
        "input: " + prompt + f'\n{n} questions, {difficulty} level',
        "output: ",
    ])

    return response.text
