# model.py
import torch
from transformers import TrOCRProcessor, VisionEncoderDecoderModel
import numpy as np
import cv2
from docx import Document
import re

# Load processor and model
processor = TrOCRProcessor.from_pretrained("microsoft/trocr-base-handwritten")
model = VisionEncoderDecoderModel.from_pretrained("microsoft/trocr-base-handwritten")
device = "cuda" if torch.cuda.is_available() else "cpu"
model.to(device)

def preprocess_image(image):
    if len(image.shape) == 3:
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    else:
        gray = image

    max_height = 1280
    if gray.shape[0] > max_height:
        scale = max_height / gray.shape[0]
        gray = cv2.resize(gray, None, fx=scale, fy=scale)

    binary = cv2.adaptiveThreshold(
        gray, 255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY_INV, 11, 2
    )

    kernel = np.ones((2, 2), np.uint8)
    binary = cv2.morphologyEx(binary, cv2.MORPH_OPEN, kernel)
    return binary

def segment_lines(image):
    binary = preprocess_image(image)
    horizontal_proj = np.sum(binary, axis=1)

    lines = []
    start = None
    threshold = np.mean(horizontal_proj) * 0.5
    min_line_height = 10

    for i, val in enumerate(horizontal_proj):
        if val > threshold and start is None:
            start = i
        elif val <= threshold and start is not None:
            if i - start > min_line_height:
                lines.append((start, i))
            start = None

    if start is not None and len(binary) - start > min_line_height:
        lines.append((start, len(binary)))

    if not lines:
        return [image]

    return [image[top:bottom, :] for top, bottom in lines]

def clean_text(text):
    lines = text.split("\n")
    cleaned = []

    for line in lines:
        line = line.strip()

        # Remove repeated words like "ever ever ever"
        line = re.sub(r'\b(\w+)( \1\b)+', r'\1', line, flags=re.IGNORECASE)

        # Skip empty or very short lines
        if len(line) < 5:
            continue

        # Skip lines with no alphabet characters
        if not any(c.isalpha() for c in line):
            continue

        # Skip if more than 35% symbols
        symbol_count = sum(not c.isalnum() and not c.isspace() for c in line)
        if symbol_count / len(line) > 0.35:
            continue

        # Skip if more than 45% digits
        digit_count = sum(c.isdigit() for c in line)
        if digit_count / len(line) > 0.45:
            continue

        # Skip alphabet sequences like "a b c d e f"
        if re.fullmatch(r'([a-zA-Z]\s+){3,}[a-zA-Z]', line):
            continue

        # Skip lines that are mostly the same word repeated
        words = line.lower().split()
        if len(words) > 5 and len(set(words)) <= 2:
            continue

        cleaned.append(line)

    return "\n".join(cleaned)

def predict_text(image):
    lines = segment_lines(image)
    results = []

    for line_img in lines:
        if len(line_img.shape) == 2:
            rgb = cv2.cvtColor(line_img, cv2.COLOR_GRAY2RGB)
        else:
            rgb = cv2.cvtColor(line_img, cv2.COLOR_BGR2RGB)

        pixel_values = processor(images=rgb, return_tensors="pt").pixel_values.to(device)

        with torch.no_grad():
            generated_ids = model.generate(pixel_values)

        prediction = processor.batch_decode(generated_ids, skip_special_tokens=True)[0]
        results.append(prediction.strip())

    return clean_text("\n".join(results))

def generate_word(text, filename):
    doc = Document()
    for line in text.split("\n"):
        doc.add_paragraph(line)
    doc.save(filename)