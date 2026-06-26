Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "       Starting Local Homelab Stack      " -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# 1. Check if Docker is running
Write-Host "Checking if Docker is running..." -ForegroundColor Gray
$dockerCheck = docker info 2>&1
if ($LastExitCode -ne 0) {
    Write-Host "Error: Docker Daemon is not running." -ForegroundColor Red
    Write-Host "Please start 'Docker Desktop' on your Windows machine and wait for it to be ready." -ForegroundColor Yellow
    Write-Host "Once Docker Desktop is running, try executing this script again." -ForegroundColor Yellow
    exit 1
}

Write-Host "Docker is running! Starting containers..." -ForegroundColor Green

# 2. Start the stack
docker compose up -d

if ($LastExitCode -eq 0) {
    Write-Host ""
    Write-Host "=========================================" -ForegroundColor Green
    Write-Host "   Homelab Stack successfully started!   " -ForegroundColor Green
    Write-Host "=========================================" -ForegroundColor Green
    Write-Host "You can access your services here:"
    Write-Host "  * Homepage Dashboard: http://localhost:8085" -ForegroundColor Cyan
    Write-Host "  * Portainer (Docker GUI): http://localhost:9000 (HTTP) or https://localhost:9443 (HTTPS)" -ForegroundColor Cyan
    Write-Host "  * Uptime Kuma (Monitor): http://localhost:3001" -ForegroundColor Cyan
    Write-Host "  * Splunk Enterprise (SIEM): http://localhost:8000" -ForegroundColor Cyan
    Write-Host "=========================================" -ForegroundColor Green
} else {
    Write-Host "Failed to start Docker containers. Check the errors above." -ForegroundColor Red
}
