# 🎬 Creative Storyteller

An AI-powered multimodal storytelling & educational explainer platform built with:

- ⚡ FastAPI (Backend)
- 🎨 Next.js + Tailwind (Frontend)
- 🤖 Gemini (Vertex AI)
- ☁️ Google Cloud Run

Generates:
- Text
- Diagrams / Images
- Structured interleaved output
- Educational explainers

---

# 🏗 Project Structure

creative-storyteller/
├── backend/     # FastAPI + Gemini
├── frontend/    # Next.js UI
└── README.md

---

# 🖥️ RUNNING LOCALLY (STEP BY STEP)

---

## ✅ 1️⃣ Prerequisites

Install:

- Python 3.10+
- Node.js 18+
- Google Cloud SDK

Check versions:

python3 --version  
node --version  
gcloud --version  

---

# 🔹 BACKEND SETUP (FastAPI + Gemini)

---

## 2️⃣ Navigate to backend

cd backend

---

## 3️⃣ Create Virtual Environment

python3 -m venv .venv  
source .venv/bin/activate  

---

## 4️⃣ Install Dependencies

pip install -r requirements.txt  

If requirements.txt doesn't exist:

pip install fastapi uvicorn google-cloud-aiplatform pydantic pydantic-settings  

---

## 5️⃣ Authenticate Google Cloud (IMPORTANT)

Login:

gcloud auth application-default login  

Set project:

gcloud config set project YOUR_PROJECT_ID  

Enable Vertex AI API:

gcloud services enable aiplatform.googleapis.com  

---

## 6️⃣ Create .env File (backend/.env)

GCP_PROJECT=your-project-id  
GCP_REGION=us-central1  
GEMINI_MODEL=gemini-1.5-pro  

---

## 7️⃣ Run Backend

uvicorn app.main:app --reload --port 8000  

Backend runs at:

http://127.0.0.1:8000  

Swagger Docs:

http://127.0.0.1:8000/docs  

---

# 🔹 FRONTEND SETUP (Next.js)

---

## 8️⃣ Navigate to frontend

cd ../frontend  

---

## 9️⃣ Install Dependencies

npm install  

If axios not installed:

npm install axios  

---

## 🔟 Create .env.local

NEXT_PUBLIC_API_URL=http://127.0.0.1:8000  

---

## 1️⃣1️⃣ Run Frontend

npm run dev  

Frontend runs at:

http://localhost:3000  

---

# ✅ LOCAL DEVELOPMENT FLOW

Frontend (localhost:3000)  
        ↓  
FastAPI (localhost:8000)  
        ↓  
Vertex AI Gemini  

---

# ☁️ DEPLOY TO GOOGLE CLOUD (STEP BY STEP)

We deploy backend to Cloud Run.
Frontend can be deployed to Vercel or Cloud Run.

---

# 🚀 BACKEND DEPLOYMENT TO CLOUD RUN

---

## 1️⃣ Enable Required APIs

gcloud services enable run.googleapis.com  
gcloud services enable aiplatform.googleapis.com  
gcloud services enable cloudbuild.googleapis.com  

---

## 2️⃣ Deploy Backend

From backend folder:

gcloud run deploy creative-storyteller-backend \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GCP_PROJECT=your-project-id,GCP_REGION=us-central1  

After deployment, you’ll get a URL like:

https://creative-storyteller-backend-xxxx.run.app  

Save this URL.

---

## 3️⃣ Grant IAM Role (If Needed)

Ensure Cloud Run service account has:

- Vertex AI User

You can check in:
IAM & Admin → Service Accounts

---

# 🚀 FRONTEND DEPLOYMENT

---

## Option A: Deploy to Vercel (Recommended)

1. Push project to GitHub  
2. Import frontend folder into Vercel  
3. Set environment variable:

NEXT_PUBLIC_API_URL=https://your-cloud-run-url  

Deploy.

---

## Option B: Deploy to Cloud Run

From frontend folder:

gcloud run deploy creative-storyteller-frontend \
  --source . \
  --region us-central1 \
  --allow-unauthenticated  

Set environment variable in Cloud Run UI:

NEXT_PUBLIC_API_URL=https://your-backend-url  

---

# 🧠 Environment Variables Summary

Backend (.env or Cloud Run env):

GCP_PROJECT  
GCP_REGION  
GEMINI_MODEL  

Frontend (.env.local or Cloud Run env):

NEXT_PUBLIC_API_URL  

---

# 🔐 Common Errors & Fixes

---

## 403 Permission Denied

Run:

gcloud auth application-default login  

---

## CORS Error

Ensure FastAPI has:

CORSMiddleware configured for frontend URL.

---

## Model Not Found

Try:

GEMINI_MODEL=gemini-1.5-flash  

---

# 📦 Production Recommendations

- Use gemini-1.5-pro for high quality
- Use gemini-1.5-flash for lower cost
- Commit package-lock.json
- Commit requirements.txt
- Enable Cloud Logging

---

# 🎯 What This Project Demonstrates

- Multimodal AI
- Structured interleaved output
- FastAPI architecture
- Next.js frontend
- Google Cloud deployment
- Vertex AI integration

---

# 🔥 Future Enhancements

- Streaming output
- Real-time narration
- Video export
- Save/share stories
- Multi-language support