# SkillMatch AI — Architecture Specification

SkillMatch AI is an enterprise-grade AI-powered job portal built with a decoupled architecture: React 19 + Vite SPA on the frontend, and Python 3.13 + Django 5 + Django REST Framework on the backend.

```
[ Client Browser (React 19 SPA) ]
         │ (HTTP / JSON / JWT Bearer)
         ▼
[ Vercel CDN Edge ]
         │
         ▼
[ Render Web Service (Django 5 WSGI/Gunicorn) ]
         ├── Security Middleware (Rate Limiting, CORS, Headers)
         ├── Custom DRF Auth & Permissions (SimpleJWT)
         ├── AI Skill Match Engine (Normalization & Overlap Calculation)
         ├── PyPDF2 Resume Parser
         └── Structured Logging System (application.log, security.log, error.log)
         │
         ▼
[ Neon PostgreSQL Database (Free Tier SSL Cloud DB) ]
```

## Security & Auth
- JWT Authentication with short-lived Access Tokens (60m) & Refresh Token Rotation with Blacklisting.
- Role-Based Access Control (RBAC): Candidate/Applicant, Recruiter, Administrator.
- Object-level authorization preventing cross-user data tampering.
- Security headers & CSRF protection enabled.
