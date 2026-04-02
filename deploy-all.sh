#!/bin/bash
# deploy-all.sh

echo "🚀 Deploying Full Microservices Stack to Namespace 'microservices'..."

# 1. Namespace
kubectl apply -f k8s/namespace.yaml

# 2. Storage & NFS Server
kubectl apply -f k8s/pvc.yaml
kubectl apply -f k8s/nfs-server.yaml

# 3. Databases (StatefulSets)
kubectl apply -f k8s/databases.yaml

# 4. Wait for Databases to be ready
echo "⏳ Waiting for databases to be ready..."
kubectl rollout status statefulset/mongodb -n microservices
kubectl rollout status statefulset/postgres-groupe -n microservices
kubectl rollout status statefulset/postgres-travail -n microservices

# 5. Microservices
kubectl apply -f k8s/etudiant-service.yaml
kubectl apply -f k8s/groupe-service.yaml
kubectl apply -f k8s/travail-service.yaml
kubectl apply -f k8s/api-gateway.yaml
kubectl apply -f k8s/frontend-react.yaml

# 6. Ingress
kubectl apply -f k8s/microservices-ingress.yaml

echo "✅ All resources applied."
echo "Check status: kubectl get pods -n microservices"
