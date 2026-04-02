# build-and-push.ps1
$DOCKER_HUB_USER = "adrienfranto"
$SERVICES = @("api-gateway", "etudiant-service", "groupe-service", "travail-service", "frontend-react")

Write-Host "🚀 Starting Production Build and Push..." -ForegroundColor Cyan

foreach ($service in $SERVICES) {
    $dir = $service
    if ($service -eq "frontend-react") { $dir = "frontend_react" }
    
    Write-Host "🛠️ Building $service..." -ForegroundColor Yellow
    docker build -t "$DOCKER_HUB_USER/$service:1.0" "./$dir/"
    
    Write-Host "⬆️ Pushing $service to Docker Hub..." -ForegroundColor Green
    docker push "$DOCKER_HUB_USER/$service:1.0"
}

Write-Host "✅ All images built and pushed successfully!" -ForegroundColor Green
