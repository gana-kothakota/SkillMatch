# Free Tier Deployment Guide (Vercel + Render + Neon)

## 1. Database Deployment (Neon PostgreSQL)
1. Create a free PostgreSQL instance on [Neon.tech](https://neon.tech).
2. Copy the connection string `postgresql://user:password@ep-xxx.neon.tech/neondb?sslmode=require`.

## 2. Backend Deployment (Render)
1. Create a Web Service on [Render](https://render.com).
2. Root Directory: `backend`
3. Environment: `Python 3`
4. Build Command: `pip install -r requirements.txt && python manage.py migrate && python manage.py seed_data`
5. Start Command: `gunicorn config.wsgi:application --bind 0.0.0.0:$PORT`
6. Environment Variables:
   - `SECRET_KEY` = your-production-secret-key
   - `DEBUG` = False
   - `DATABASE_URL` = your-neon-connection-string
   - `CORS_ALLOWED_ORIGINS` = https://skillmatch-ai.vercel.app

## 3. Frontend Deployment (Vercel)
1. Connect repository on [Vercel](https://vercel.com).
2. Root Directory: `frontend`
3. Framework Preset: `Vite`
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Environment Variables:
   - `VITE_API_BASE_URL` = https://skillmatch-ai-backend.onrender.com/api/v1
