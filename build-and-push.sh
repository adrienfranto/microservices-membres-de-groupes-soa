#!/bin/bash
# build-and-push.sh
DOCKER_HUB_USER="adrienfranto"
SERVICES=("api-gateway" "etudiant-service" "groupe-service" "travail-service" "frontend-react")

echo "🚀 Starting Production Build and Push (Linux)..."

for service in "${SERVICES[@]}"; do
    dir=$service
    [[ "$service" == "frontend-react" ]] && dir="frontend_react"
    
    echo "🛠️ Building $service from ./$dir/..."
    docker build -t "$DOCKER_HUB_USER/$service:1.0" "./$dir/"
    
    echo "⬆️ Pushing $service to Docker Hub..."
    docker push "$DOCKER_HUB_USER/$service:1.0"
done

echo "✅ All images built and pushed successfully!"
