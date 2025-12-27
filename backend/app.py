from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from model import predict_text, generate_word
import cv2, os, fitz, numpy as np

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
OUTPUT_FOLDER = "output"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

def pdf_to_images(pdf_path):
    doc = fitz.open(pdf_path)
    images = []
    for page in doc:
        pix = page.get_pixmap()
        img = np.frombuffer(pix.samples, dtype=np.uint8)
        img = img.reshape(pix.height, pix.width, pix.n)
        if pix.n == 4:
            img = cv2.cvtColor(img, cv2.COLOR_BGRA2BGR)
        images.append(img)
    return images

@app.route("/", methods=["POST"])
def home():
    files = request.files.getlist("files")
    all_text = []

    for file in files:
        path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(path)

        if file.filename.lower().endswith(".pdf"):
            images = pdf_to_images(path)
            for img in images:
                all_text.append(predict_text(img))
        else:
            image = cv2.imread(path)
            all_text.append(predict_text(image))

    final_text = "\n\n".join(all_text)
    doc_name = "script2doc_output.docx"
    doc_path = os.path.join(OUTPUT_FOLDER, doc_name)
    generate_word(final_text, doc_path)

    return jsonify({
        "text": final_text,
        "download": f"http://127.0.0.1:5001/download/{doc_name}"
    })

@app.route("/download/<filename>")
def download(filename):
    return send_file(os.path.join(OUTPUT_FOLDER, filename), as_attachment=True)

if __name__ == "__main__":
    app.run(debug=True, port=5001)
