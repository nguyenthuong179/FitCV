# FitCV AI - Full Stack MVP

AI job matching MVP for students and freshers.

## Stack

- Frontend: Next.js + TypeScript + Tailwind CSS
- Backend: FastAPI + Python
- AI provider: OpenAI API optional. If no API key is set, backend returns demo/mock data.

## Project structure

```txt
fitcv-ai-repo/
  frontend/
    app/
      page.tsx
      globals.css
      layout.tsx
    package.json
    tailwind.config.ts
    tsconfig.json
    next.config.js
    .env.example
  backend/
    app/
      main.py
      schemas.py
      services.py
    requirements.txt
    .env.example
  README.md
```

## 1. Run backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

Backend runs at:

```txt
http://localhost:8000
```

Health check:

```txt
http://localhost:8000/health
```

## 2. Run frontend

Open another terminal:

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Frontend runs at:

```txt
http://localhost:3000
```

## 3. Optional: enable OpenAI

In `backend/.env`:

```bash
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-4.1-mini
```

If `OPENAI_API_KEY` is empty, the backend will return deterministic demo data.

## API

### POST `/api/analyze`

Request:

```json
{
  "cv_text": "React developer intern with JavaScript...",
  "jd_text": "Frontend Fresher needed React, TypeScript, Docker..."
}
```

Response:

```json
{
  "match_score": 78,
  "summary": "...",
  "matching_skills": ["React"],
  "missing_skills": ["Docker"],
  "recommendations": []
}
```
