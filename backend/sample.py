import os
from PIL import Image
import torch
from transformers import BlipProcessor, BlipForConditionalGeneration

def load_blip_model(model_dir='blip_model'):
    # Load BLIP processor and model
    processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-large")
    model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-large")
    
    # Save the model and processor
    processor.save_pretrained(model_dir)
    model.save_pretrained(model_dir)
    
    return processor, model

def generate_caption(image_path, processor, model):
    # Load and preprocess the image
    image = Image.open(image_path).convert("RGB")
    inputs = processor(image, return_tensors="pt")
    
    # Generate a single caption
    with torch.no_grad():
        output = model.generate(**inputs, max_length=30)
        caption = processor.decode(output[0], skip_special_tokens=True)
    
    return caption

def main():
    processor, model = load_blip_model()

    image_path = input("Enter the path to your image: ")
    while not os.path.exists(image_path):
        image_path = input("Invalid path. Please enter a valid path to your image: ")

    caption = generate_caption(image_path, processor, model)
    print("Generated Caption:")
    print(caption)

if __name__ == "__main__":
    main()
