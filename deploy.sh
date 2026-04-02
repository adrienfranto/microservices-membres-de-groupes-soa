#!/bin/bash
# Set Project ID
PROJECT_ID="project-f3cc5de9-ac6f-4df9-88a"
gcloud config set project $PROJECT_ID

# Authenticate Docker to GCR
gcloud auth configure-docker --quiet

# Build and Push Images
services=("etudiant-service" "groupe-service" "travail-service" "api-gateway" "frontend_react")

for service in "${services[@]}"; do
    echo "Building and pushing $service..."
    docker build -t gcr.io/$PROJECT_ID/$service:latest ./$service/
    docker push gcr.io/$PROJECT_ID/$service:latest
done

# Apply Kubernetes Manifests
echo "Applying Kubernetes manifests..."
kubectl apply -f k8s/pvc.yaml
kubectl apply -f k8s/databases.yaml
kubectl apply -f k8s/etudiant-service.yaml
kubectl apply -f k8s/groupe-service.yaml
kubectl apply -f k8s/travail-service.yaml
kubectl apply -f k8s/api-gateway.yaml
kubectl apply -f k8s/managed-cert.yaml
kubectl apply -f k8s/ingress.yaml
kubectl apply -f k8s/frontend-react.yaml

# Monitor deployment
echo "Deployment initiated. Check status with: kubectl get pods"
