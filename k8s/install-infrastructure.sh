#!/bin/bash
# install-infrastructure.sh - Improved for Lightweight Reconstruction
# Run this from your host or VM where kubectl is configured.

echo "🚀 Installing Lightweight Kubernetes Infrastructure..."

# 1. Namespace for Microservices and ArgoCD
echo "➡️ Creating namespaces..."
kubectl create namespace microservices --dry-run=client -o yaml | kubectl apply -f -
kubectl create namespace argocd --dry-run=client -o yaml | kubectl apply -f -

# 2. Local Path Provisioner (Storage)
echo "➡️ Installing Rancher Local Path Provisioner..."
kubectl apply -f https://raw.githubusercontent.com/rancher/local-path-provisioner/v0.0.30/deploy/local-path-storage.yaml
kubectl patch storageclass local-path -p '{"metadata": {"annotations":{"storageclass.kubernetes.io/is-default-class":"true"}}}'

# 3. Nginx Ingress Controller
echo "➡️ Installing Nginx Ingress Controller..."
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.11.0/deploy/static/provider/baremetal/deploy.yaml

# 4. ArgoCD Installation (Lightweight)
echo "➡️ Installing ArgoCD..."
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/v2.13.3/manifests/install.yaml

# 5. Apply Critical Fixes (ApplicationSet + Proxy Bypass)
echo "➡️ Applying ArgoCD Stability Fixes..."
# Fix ApplicationSet CRD
kubectl apply -f https://raw.githubusercontent.com/argoproj/argo-cd/v2.13.3/manifests/crds/applicationset-crd.yaml

# Bypass internal cluster proxy (Prevents timeouts)
kubectl set env -n argocd statefulset/argocd-application-controller \
  NO_PROXY=10.96.0.1,kubernetes.default.svc,.svc,.cluster.local
kubectl set env -n argocd deployment/argocd-repo-server \
  NO_PROXY=10.96.0.1,kubernetes.default.svc,.svc,.cluster.local

echo "✅ Infrastructure setup initiated."
echo "Check pods status with: kubectl get pods -A"
