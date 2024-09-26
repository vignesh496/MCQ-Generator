# image_captioner.py
from PIL import Image
from transformers import BlipProcessor, BlipForConditionalGeneration

# Load BLIP model and processor
processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
blip_model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")

def generate_caption(image_path):
    """
    Generates a caption for the given image.
    :param image_path: The path to the image file.
    :return: The generated caption as a string.
    """
    image = Image.open(image_path)
    inputs = processor(images=image, return_tensors="pt")
    output = blip_model.generate(**inputs)
    caption = processor.decode(output[0], skip_special_tokens=True)
    return caption
