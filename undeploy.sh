#!/bin/bash

# Configuration
# It's better to fetch the active project dynamically
GCP_PROJECT=$(gcloud config get-value project)
GCP_REGION="us-central1"
BACKEND_SERVICE="storyteller-backend"
FRONTEND_SERVICE="storyteller-frontend"

echo "🗑️ Starting cleanup for project: $GCP_PROJECT"

# 1. Delete Cloud Run Services
echo "🛑 Deleting Cloud Run services..."
gcloud run services delete $FRONTEND_SERVICE --region $GCP_REGION --project $GCP_PROJECT --quiet
gcloud run services delete $BACKEND_SERVICE --region $GCP_REGION --project $GCP_PROJECT --quiet

# 2. Delete Container Images (Artifact Registry)
# Cloud Run source deployment uses a default repository named 'cloud-run-source-deploy'
echo "📦 Deleting Artifact Registry repository (container images)..."
gcloud artifacts repositories delete cloud-run-source-deploy --location $GCP_REGION --project $GCP_PROJECT --quiet

# 3. Delete Source Buckets (Cleanup storage)
# When you use --source, Google creates temporary buckets like gcf-sources-PROJECT_NUMBER-REGION
echo "🪣 Cleaning up source code buckets in Cloud Storage..."
# Find buckets that start with gcf-sources
BUCKETS=$(gcloud storage buckets list --project $GCP_PROJECT --format="value(name)" | grep "gcf-sources")

for BUCKET in $BUCKETS; do
  echo "  Deleting bucket: $BUCKET"
  gcloud storage buckets delete gs://$BUCKET --recursive --quiet
done

# 4. Disable APIs (Optional, but keeps things clean)
# Uncomment the lines below if you want to completely disable the APIs
# echo "🔧 Disabling Google Cloud Services..."
# gcloud services disable run.googleapis.com 
#   cloudbuild.googleapis.com 
#   aiplatform.googleapis.com 
#   texttospeech.googleapis.com 
#   --project $GCP_PROJECT

echo "✅ Cleanup Complete! All resources for Creative Storyteller have been removed."
