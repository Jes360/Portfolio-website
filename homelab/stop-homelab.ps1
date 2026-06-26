Write-Host "=========================================" -ForegroundColor Yellow
Write-Host "       Stopping Local Homelab Stack      " -ForegroundColor Yellow
Write-Host "=========================================" -ForegroundColor Yellow

# 1. Stop the stack
docker compose down

if ($LastExitCode -eq 0) {
    Write-Host "Homelab Stack stopped successfully!" -ForegroundColor Green
} else {
    Write-Host "Failed to stop Docker containers. Check the errors above." -ForegroundColor Red
}
