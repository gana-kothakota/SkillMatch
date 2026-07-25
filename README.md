# SkillMatch AI — Enterprise-Grade AI Job Portal

[![CI/CD Pipeline](https://github.com/your-org/SkillMatch-AI/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/your-org/SkillMatch-AI/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Django](https://img.shields.io/badge/Django-5.0+-092E20?logo=django)](https://djangoproject.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)

**SkillMatch AI** is a production-ready, enterprise-grade AI-powered job portal built with React 19 + Vite on the frontend and Python 3.13 + Django 5 + DRF + PostgreSQL on the backend. Designed for portfolio presentation and enterprise engineering interviews.

---

## ⚡ Key Capabilities & Features

- **AI Skill Match Score:** Automatically extracts skills from candidate PDF resumes, compares against job specifications, and calculates a percentage match meter with circular progress bars, matched skills tags, missing competencies, and AI recommendations.
- **Smart Recommendations:** Recommends jobs tailored to candidate skill profiles and saved jobs history.
- **Unified Global Search:** Instant modal search across jobs, companies, and skills.
- **8-Stage Application Timeline:** `Applied` → `Under Review` → `Interview Scheduled` → `Technical Round` → `HR Round` → `Offer Extended` → `Hired / Rejected`.
- **Role-Based Portals:**
  - **Applicant:** Resume uploader, job search, application status timeline, saved jobs.
  - **Recruiter:** Job posting, applicant pipeline management, Recharts analytics dashboard.
  - **Admin:** User activation/deactivation, enterprise management, system security logs.
- **Security & Logging:** JWT token refresh rotation, RBAC permissions, request duration middleware, structured security & application logging (`logs/application.log`, `logs/security.log`, `logs/error.log`).
- **Interactive OpenAPI/Swagger Documentation:** Auto-generated swagger docs available at `/api/docs/`.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS v4, React Router DOM v7, Axios, Framer Motion, Recharts, React Circular Progressbar, Lucide React, React Hot Toast.
- **Backend:** Python 3.13, Django 5, Django REST Framework, Simple JWT, PostgreSQL / SQLite.
- **Deployment & DevOps:** Vercel (Frontend), Render (Backend API), Neon PostgreSQL (Cloud Database), GitHub Actions (CI/CD).

---

## 📁 Project Structure

```text
SkillMatch-AI/
├── backend/
│   ├── manage.py
│   ├── config/ (Django settings, urls, wsgi/asgi)
│   ├── apps/
│   │   ├── accounts/ (Custom UUID User model, JWT Auth, RBAC permissions)
│   │   ├── companies/ (Company entity management)
│   │   ├── jobs/ (Job CRUD, SavedJobs, filters)
│   │   ├── applications/ (Timeline status tracking & AI score computation)
│   │   ├── resume/ (PDF parser & PyPDF2 skill extraction)
│   │   ├── analytics/ (Recharts data aggregation services)
│   │   ├── notifications/ (User notifications & status alerts)
│   │   └── core/ (Logging middleware, exceptions, AI matcher, Global search)
│   └── logs/ (application.log, security.log, error.log)
├── frontend/
│   ├── src/
│   │   ├── components/ (Common, UI, Jobs, Resume, Analytics)
│   │   ├── context/ (AuthContext, ThemeContext, NotificationContext)
│   │   ├── pages/ (Public, Applicant, Recruiter, Admin)
│   │   ├── services/ (Axios API instance with JWT refresh interceptor)
│   │   └── styles/ (Tailwind CSS index.css)
├── docs/ (Architecture, ER Diagram, API specifications, Deployment guide)
└── .github/workflows/ (CI/CD GitHub Actions pipeline)
```

---

## 🚀 Quick Start Guide

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# On Windows: venv\Scripts\activate
# On macOS/Linux: source venv/bin/activate

pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py seed_data
python manage.py runserver
```

### Authentication & Password Security
- **Google OAuth 2.0 Single Sign-On**: Native support for Google OAuth registration and single sign-on (`/api/v1/auth/google/`).
- **PBKDF2 SHA-256 Password Hashing**: All candidate & recruiter passwords are salt-hashed using Django's enterprise PBKDF2 Password Hasher before database persistence.
- **JWT Token Refresh Rotation**: Short-lived Access Tokens with blacklisted Refresh Tokens.

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🧪 Testing

Run backend test suite:
```bash
cd backend
python manage.py test apps/accounts/tests apps/jobs/tests
```

Build production bundle:
```bash
cd frontend
npm run build
```

---

## 📄 License
MIT License. Built for portfolio & enterprise engineering demonstration.

## users credentials
Applicant	        :applicant@gmail.com	Applicant123
Recruiter	        :recruiter@techcorp.com	Recruiter123!	
Admin	            :admin@skillmatch.ai	Admin123!