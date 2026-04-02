#!/bin/bash
# install-infrastructure.sh
# Run this from your Control Plane node (franto) or host if kubectl is configured.

echo "🚀 Installing Local Kubernetes Infrastructure..."

# 1. Namespace for Microservices
echo "➡️ Creating namespace 'microservices'..."
kubectl create namespace microservices --dry-run=client -o yaml | kubectl apply -f -

# 2. Local Path Provisioner (Storage)
echo "➡️ Installing Rancher Local Path Provisioner..."
kubectl apply -f https://raw.githubusercontent.com/rancher/local-path-provisioner/v0.0.30/deploy/local-path-storage.yaml
kubectl patch storageclass local-path -p '{"metadata": {"annotations":{"storageclass.kubernetes.io/is-default-class":"true"}}}'

# 3. Nginx Ingress Controller
echo "➡️ Installing Nginx Ingress Controller..."
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.11.0/deploy/static/provider/baremetal/deploy.yaml

echo "✅ Infrastructure setup initiated."
echo "Check pods status with: kubectl get pods -A"
