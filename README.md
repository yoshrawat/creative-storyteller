# 🎬 Creative Storyteller

An AI-powered multimodal storytelling platform that acts as a **Creative Director**. It seamlessly weaves together text, cinematic images, neural audio narration, and video clips in a single, fluid output stream.

## ✨ Features

- **🧠 Creative Director Agent**: Establishes a Character Style Guide for visual and narrative consistency.
- **🎙️ Neural Narration**: High-quality Text-to-Speech (TTS) for every scene.
- **🖼️ Cinematic Visuals**: Powered by Imagen 3 for consistent, high-quality illustrations.
- **📽️ Video Generation**: Dynamic 6-second cinematic clips generated via Veo.
- **🎭 Multiple Modes**:
  - **Interactive Storybook**: A paginated, book-like reading experience.
  - **Social Media**: Instagram-style cards with captions and hashtags.
  - **Marketing**: High-impact hero videos, banners, and professional copy.
  - **Educational**: Clear explainers with diagrams and instructional audio.
- **🎨 Style Selection**: Choose between Pixar, Anime, Realistic, Watercolor, and Cyberpunk.

---

## 🏗 Project Structure

```text
creative-storyteller/
├── backened/    # FastAPI + Gemini 2.0 + Imagen 3 + Veo + TTS
├── frontend/    # Next.js 14 + Tailwind CSS + Framer Motion
└── README.md
```

---

## 🖥️ Local Setup (Step-by-Step)

### 1️⃣ Prerequisites
- **Python 3.10+**
- **Node.js 18+**
- **Google Cloud SDK (gcloud)**
- **Google Cloud Project** with billing enabled.

### 🔹 Backend Setup (FastAPI)
1. **Navigate to backend**: `cd backened`
2. **Create Virtual Environment**:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```
3. **Install Dependencies**: `pip install -r requirements.txt`
4. **Authenticate Google Cloud**:
   ```bash
   gcloud auth application-default login
   gcloud config set project YOUR_PROJECT_ID
   ```
5. **Enable APIs**:
   ```bash
   gcloud services enable aiplatform.googleapis.com texttospeech.googleapis.com
   ```
6. **Create `.env` file**:
   ```env
   GCP_PROJECT=your-project-id
   GCP_REGION=us-central1
   GEMINI_MODEL=gemini-2.0-flash
   ```
7. **Run Backend**: `uvicorn app.main:app --reload --port 8000`

Backend runs at: `http://127.0.0.1:8000`  
Health Check: `http://127.0.0.1:8000/health`  
Swagger Docs: `http://127.0.0.1:8000/docs`

### 🔹 Frontend Setup (Next.js)
1. **Navigate to frontend**: `cd frontend`
2. **Install Dependencies**: `npm install`
3. **Create `.env.local`**:
   ```env
   NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
   ```
4. **Run Frontend**: `npm run dev` (Runs at `http://localhost:3000`)

---

## ☁️ Deploy to Google Cloud (Cloud Run)

### 1️⃣ Enable Cloud Run & Build APIs
```bash
gcloud services enable run.googleapis.com cloudbuild.googleapis.com
```

### 2️⃣ Deploy Backend
From the `backened/` folder:
```bash
gcloud run deploy storyteller-backend \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GCP_PROJECT=your-project-id,GCP_REGION=us-central1
```
**Important**: Note the Service URL provided after deployment (e.g., `https://storyteller-backend-xxxx.run.app`).

### 3️⃣ Deploy Frontend
From the `frontend/` folder:
1. Replace `https://your-backend-url` with your actual backend URL:
```bash
gcloud run deploy storyteller-frontend \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-build-env-vars NEXT_PUBLIC_API_URL=https://your-backend-url \
  --set-env-vars NEXT_PUBLIC_API_URL=https://your-backend-url
```
*(Note: Next.js requires the API URL during the build phase to bake it into the static pages, which is why we use `--set-build-env-vars`.)*

---

## 🗑️ Undeploy & Cleanup from Google Cloud

To completely remove the application and ensure no further charges are incurred, follow these steps:

### 1️⃣ Delete Cloud Run Services
This removes the running instances of your app.
```bash
# Delete the backend service
gcloud run services delete storyteller-backend --region us-central1 --quiet

# Delete the frontend service
gcloud run services delete storyteller-frontend --region us-central1 --quiet
```

### 2️⃣ Delete Container Images (Artifact Registry)
Every time you deploy, a container image is stored. Deleting the repository clears this storage.
```bash
gcloud artifacts repositories delete cloud-run-source-deploy --location us-central1 --quiet
```

### 3️⃣ Delete Source Code Buckets (Optional)
The `--source` deployment creates temporary Cloud Storage buckets for your code. You can find and delete them (names usually start with `gcf-sources-`):
```bash
# List buckets to find the correct ones
gcloud storage buckets list

# Delete a specific bucket (replace <BUCKET_NAME>)
gcloud storage buckets delete gs://<BUCKET_NAME> --recursive
```

### 4️⃣ Disable APIs (Optional)
If you are done with the project entirely, you can disable the AI and TTS services:
```bash
gcloud services disable aiplatform.googleapis.com texttospeech.googleapis.com
```

---

## 🔐 IAM Roles (Cloud Run)
Ensure the **Cloud Run Runtime Service Account** (usually `PROJECT_NUMBER-compute@developer.gserviceaccount.com`) has the following roles:
- **Vertex AI User** (`roles/aiplatform.user`)
- **Cloud TTS User** (`roles/texttospeech.user`)

You can grant these in the IAM & Admin console.

---

## 🧠 Environment Variables Summary

| Variable | Location | Description |
| :--- | :--- | :--- |
| `GCP_PROJECT` | Backend | Your Google Cloud Project ID |
| `GCP_REGION` | Backend | Cloud region (e.g., `us-central1`) |
| `GEMINI_MODEL` | Backend | Model version (e.g., `gemini-2.0-flash`) |
| `NEXT_PUBLIC_API_URL` | Frontend | Full URL of the backend API |

---

## 🎯 Technologies Used
- **Google Gemini 2.0**: Multimodal reasoning and story orchestration.
- **Imagen 3**: High-fidelity image generation.
- **Google Veo**: Cinematic video generation.
- **Cloud Text-to-Speech**: High-quality neural voices.
- **FastAPI**: Asynchronous high-performance API.
- **Next.js 14**: Modern reactive frontend.
