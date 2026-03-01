#!/bin/bash

# Configuration
GCP_PROJECT="creative-storyteller-488810"
GCP_REGION="us-central1"
BACKEND_SERVICE="storyteller-backend"
FRONTEND_SERVICE="storyteller-frontend"

echo "🚀 Starting deployment for project: $GCP_PROJECT"

# 1. Ensure APIs are enabled
echo "🔧 Enabling Google Cloud Services..."
gcloud services enable run.googleapis.com \
  cloudbuild.googleapis.com \
  aiplatform.googleapis.com \
  texttospeech.googleapis.com \
  --project $GCP_PROJECT

# 2. Deploy Backend
echo "📦 Deploying Backend (FastAPI)..."
cd backened
gcloud run deploy $BACKEND_SERVICE \
  --source . \
  --region $GCP_REGION \
  --allow-unauthenticated \
  --set-env-vars GCP_PROJECT=$GCP_PROJECT,GCP_REGION=$GCP_REGION \
  --project $GCP_PROJECT
cd ..

# 3. Get Backend URL
BACKEND_URL=$(gcloud run services describe $BACKEND_SERVICE --region $GCP_REGION --format='value(status.url)' --project $GCP_PROJECT)
echo "✅ Backend URL: $BACKEND_URL"

# 4. Deploy Frontend
echo "📦 Deploying Frontend (Next.js) using Cloud Build..."
cd frontend

# Submit to Cloud Build with the backend URL as a substitution
gcloud builds submit \
  --config cloudbuild.yaml \
  --substitutions=_NEXT_PUBLIC_API_URL="$BACKEND_URL",_REGION="$GCP_REGION" \
  --project $GCP_PROJECT

cd ..

echo "🎉 Deployment Complete!"
echo "🔗 Frontend URL: $(gcloud run services describe $FRONTEND_SERVICE --region $GCP_REGION --format='value(status.url)' --project $GCP_PROJECT)"
