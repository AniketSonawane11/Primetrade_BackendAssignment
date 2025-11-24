🚀 Backend Developer Assignment – Django REST API + Vanilla JS Frontend
A Complete Scalable Backend System with Authentication, RBAC, CRUD, Swagger, and Frontend UI

📘 Overview

This project was built as part of the Primetrade.ai Backend Developer Internship Assignment.
It demonstrates the development of a secure, modular, scalable backend API with a simple frontend interface for interaction.

The system includes:

🔐 JWT Authentication

👥 Role-Based Access Control (Admin/User)

📝 CRUD operations for Tasks

🧪 Swagger API Docs

🗄️ MySQL DB Integration

🌐 Frontend UI (Bootstrap + Vanilla JS)

📦 API Versioning (api/v1/)

🔧 Scalable architecture ready for production

⚙️ Tech Stack
Backend

Python 3.12

Django 5

Django REST Framework (DRF)

MySQL

SimpleJWT

CORS Headers

drf_yasg (Swagger UI)

python-dotenv

Frontend

HTML5

Bootstrap 5

Vanilla JavaScript

Fetch API

🚀 Features Implemented
🔑 Authentication

User Registration

Secure Login (JWT - Access + Refresh tokens)

Hashed passwords

Role-based access via is_admin

📝 Task Management

CRUD operations

Every task belongs to a user

Admin can access all tasks

Users can only access their own tasks

🔒 Security

JWT protected routes

Custom permission class: IsAdminOrOwner

Input validation

CORS setup

.env based configuration

🌐 Frontend UI

Register new users

Login to get JWT

View user-specific tasks

Add, delete tasks

Shows success/error responses

🧩 API Endpoints
🔐 Authentication Endpoints
Method	Endpoint	Description	Auth
POST	/api/v1/accounts/register/	Register user	❌
POST	/api/v1/token/	Login (JWT)	❌
GET	/api/v1/accounts/me/	Get current logged-in user	✅
📝 Task Endpoints
Method	Endpoint	Description	Auth
GET	/api/v1/tasks/	List tasks	✅
POST	/api/v1/tasks/	Create new task	✅
PUT	/api/v1/tasks/{id}/	Update task	✅
DELETE	/api/v1/tasks/{id}/	Delete task	✅
🧪 API Documentation
Swagger UI

🔗 http://127.0.0.1:8000/api/docs/

🧠 Scalability Notes
Architecture

App-based modular structure (accounts, tasks)

JWT allows horizontal scaling

DB-agnostic ORM (can switch to PostgreSQL easily)

.env separates prod/dev configs

Scaling Options

Add Redis cache

Dockerize project (backend + MySQL)

Use Nginx + Gunicorn in production

Deploy on:

Render

Railway

AWS EC2

DigitalOcean

⚡ Setup Instructions
1️⃣ Clone Repository
git clone https://github.com/YourUsername/Primetrade_BackendAssignment.git
cd Primetrade_BackendAssignment

2️⃣ Create Virtual Environment
python -m venv venv
venv\Scripts\activate   # Windows

3️⃣ Install Dependencies
pip install -r requirements.txt

4️⃣ Add .env File
SECRET_KEY=django-insecure-yourkey
DEBUG=True

DB_ENGINE=django.db.backends.mysql
DB_NAME=primetrade_ai
DB_USER=root
DB_PASSWORD=yourpassword
DB_HOST=127.0.0.1
DB_PORT=3306

5️⃣ Run Migrations
python manage.py makemigrations
python manage.py migrate

6️⃣ Start Server
python manage.py runserver

🌐 Frontend Usage

Open the frontend/index.html file in your browser.

Features available:

Register user

Login

Manage tasks using JWT

Live CRUD features

📁 Project Structure
Primetrade_BackendAssignment/
│── accounts/
│── tasks/
│── core/
│── frontend/
│   ├── index.html
│   ├── dashboard.html
│   ├── script.js
│── manage.py
│── requirements.txt
│── README.md
│── .env (not included in repo)

👨‍💻 Author

Aniket Sonawane
Backend Developer – Python | Django | DRF
📧 sonawane.aniket1105@gmail.com

📞 +91 9552383172
🌐 GitHub | LinkedIn
