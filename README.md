# Welcome to your CPU Chatbot

🎓 Student Information Chatbot System

An AI-powered Student Information Chatbot System designed to provide instant, accurate, and real-time responses to student queries related to academic and administrative services.

🚀 Overview

The Student Information Chatbot acts as a virtual assistant for educational institutions. It helps students get quick answers about:

📅 Timetables
📝 Exams & Results
💰 Fees & Payments
🎓 Admissions
🏠 Hostel Facilities
📚 General Campus Information

This system reduces manual workload and improves communication between students and the institution.

✨ Features
💬 AI Chatbot Interface (Real-time responses)
🎤 Voice Recognition Support (Speech to Text)
🧠 NLP-based Query Processing (NLTK / spaCy)
📊 Previous Questions History
⚡ Instant FAQ Responses
📱 Responsive & Colorful UI
🔄 Fallback Responses for Unknown Queries
🛠️ Tech Stack
🔹 Frontend
HTML5
CSS3
JavaScript
🔹 Backend
Python (Flask / FastAPI)
🔹 Database
SQLite
🔹 AI / NLP
NLTK / spaCy
📁 Project Structure
student-chatbot/
│
├── static/
│   ├── css/
│   ├── js/
│   └── assets/
│
├── templates/
│   ├── index.html
│   ├── chatbot.html
│   ├── history.html
│
├── backend/
│   ├── app.py
│   ├── nlp.py
│   └── database.db
│
├── data/
│   └── faq_data.json
│
├── requirements.txt
└── README.md
⚙️ Installation & Setup
1️⃣ Clone the Repository
git clone https://github.com/your-username/student-chatbot.git
cd student-chatbot
2️⃣ Create Virtual Environment
python -m venv venv
source venv/bin/activate   # (Linux/Mac)
venv\Scripts\activate      # (Windows)
3️⃣ Install Dependencies
pip install -r requirements.txt
4️⃣ Run the Server
python backend/app.py
5️⃣ Open in Browser
http://localhost:5000
🧠 How It Works
User enters query (text or voice)
Query is processed using NLP techniques:
Tokenization
Lemmatization
Keyword Matching
System matches query with FAQ dataset
Returns best possible response
Stores query in database for history
📊 Sample Queries
“When are exams starting?”
“How to pay fees online?”
“What is hostel fee?”
“Where can I get timetable?”
🎯 Objectives
Automate student query handling
Reduce administrative workload
Provide 24/7 support
Improve student experience
🔮 Future Enhancements
🤖 AI Model (Machine Learning / Deep Learning)
🌐 Multi-language support
📲 Mobile App Integration
🔐 Authentication System
📡 Live Chat with Admin
👩‍💻 Author

Lavanya Sharma
🎓 BCA (Data Science), Final Year, 6th Sem
Career Point University

📜 License

This project is for educational purposes only.
