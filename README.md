# 📄 Script2Doc

> **Convert handwritten notes, scanned images, and PDFs into editable Word documents using AI-powered OCR.**

Script2Doc is a full-stack web application that allows users to upload handwritten images or PDFs and automatically extracts text using deep learning OCR models, then exports the result as a `.docx` file.

---

## ✨ Features

- 🧠 AI-powered handwritten text recognition (OCR)
- 🖼 Upload images (`.png`, `.jpg`) or PDFs
- 📄 Convert extracted text into editable Word documents
- 🔐 User authentication (Signup / Login)
- ⏳ Loading indicators and error handling
- 🌐 Clean web interface

---

## 🏗️ Tech Stack

### Frontend
- React.js
- HTML, CSS, JavaScript

### Backend
- Flask (Python)
- MongoDB (for authentication)
- REST API

### Machine Learning
- PyTorch
- Hugging Face Transformers
- TrOCR (handwritten OCR model)

---

## ⚙️ How It Works

1. User signs up / logs in.
2. Uploads handwritten images or PDFs.
3. The backend processes files using OCR.
4. Extracted text is generated.
5. A Word document is created and made available for download.

---

## 🖥️ Project Structure

```text
Script2Doc/
│
├── backend/
│   ├── app.py
│   ├── model.py
│   ├── requirements.txt
│   └── uploads/
│
├── frontend/
│   ├── src/
│   └── public/
│
└── README.md
```

---
🚀 Getting Started (Local Setup)
---
1️⃣ Clone the repository

git clone https://github.com/pullayithrisha/Script2doc.git

cd Script2doc

---

2️⃣ Backend setup

cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py

---

3️⃣ Frontend setup

cd frontend
npm install
npm start

---

🔐 Environment Variables

Create a .env file in the backend directory:

MONGO_URI=your_mongodb_connection_string
SECRET_KEY=your_secret_key

---

📌 Future Enhancements

Improve OCR accuracy with fine-tuned models

Add multilingual OCR support

Add user history and file storage

Add drag-and-drop upload

Improve UI/UX design

---
🤝 Contributing

Contributions are welcome!

Fork the repository

Create a new branch (feature/your-feature)

Commit your changes

Push to your fork

Create a Pull Request

---

👩‍💻 Author

P. Thrisha
B.Tech CSE Student
GitHub: pullayithrisha

---

📜 License

This project is licensed under the MIT License — feel free to use and modify it.
