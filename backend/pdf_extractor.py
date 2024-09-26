import pdfplumber
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
import re  # Import regular expressions module

# Function to extract text from PDF
def extract_text_from_pdf(pdf_path):
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text += page.extract_text() + " "
    return text.strip()


def read_pdf(pdf_path):
    
    # Extract text
    pdf_text = extract_text_from_pdf(pdf_path)
    
    # Preprocess to make it a single paragraph
    # Remove newlines and extra spaces
    pdf_text = re.sub(r'\s+', ' ', pdf_text.replace("\n", " ")).strip()
    
    tokenizer = Tokenizer()
    tokenizer.fit_on_texts([pdf_text])
    sequences = tokenizer.texts_to_sequences([pdf_text])
    max_length = 100  # Adjust based on your needs
    pad_sequences(sequences, maxlen=max_length)

    return pdf_text