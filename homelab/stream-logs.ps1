# PowerShell Docker Logs to Splunk HEC Streamer
# decodes logs from active containers and streams them to Splunk HTTP Event Collector (HEC)

param (
    [string]$SplunkHECUrl = "http://localhost:8088/services/collector/event",
    [string]$HECToken = "00000000-0000-0000-0000-000000000000" # Replace with your actual Splunk HEC Token
)

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "      Docker to Splunk HEC Forwarder     " -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# 1. Test Connection to Splunk HEC
Write-Host "Verifying connection to Splunk HEC at $SplunkHECUrl..." -ForegroundColor Gray
try {
    $response = Invoke-RestMethod -Uri $SplunkHECUrl -Method Get -SkipHeaderValidation -ErrorAction Stop
} catch {
    # If connection refused
    if ($_.Exception.Message -match "refused" -or $_.Exception.InnerException.Message -match "refused") {
        Write-Host "Error: Cannot connect to Splunk HEC. Make sure Splunk is running and HEC is enabled on port 8088." -ForegroundColor Red
        exit 1
    }
}
Write-Host "HEC endpoint is reachable!" -ForegroundColor Green

# 2. Get running containers
$containers = docker ps --format "{{.Names}}"
if ($containers.Count -eq 0 -or $containers -eq $null) {
    Write-Host "No running Docker containers found. Start your homelab first!" -ForegroundColor Yellow
    exit 1
}

Write-Host "Found running containers:" -ForegroundColor Gray
foreach ($c in $containers) {
    Write-Host "  * $c" -ForegroundColor Cyan
}

Write-Host "Starting background threads to stream logs to Splunk (Press Ctrl+C to stop)..." -ForegroundColor Green

# 3. Decoupled Streaming Ingestion Loop
$jobs = @()
foreach ($c in $containers) {
    Write-Host "Launching background logger stream for container: $c" -ForegroundColor Gray
    
    # Start a background job to tail logs and stream to Splunk HEC
    $job = Start-Job -ScriptBlock {
        param($containerName, $hecUrl, $token)
        
        # Non-blocking docker log stream loop
        docker logs -f --tail 0 $containerName 2>&1 | ForEach-Object {
            $logMessage = $_.ToString().Trim()
            if ($logMessage) {
                # Format structured JSON payload
                $timestamp = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
                
                $payload = @{
                    time = $timestamp
                    host = "homelab-host"
                    source = "docker:$containerName"
                    sourcetype = "_json"
                    event = @{
                        message = $logMessage
                        container = $containerName
                        level = if ($logMessage -match "error|fail|warn") { "WARNING" } else { "INFO" }
                    }
                } | ConvertTo-Json -Compress
                
                # Forward to Splunk HEC
                try {
                    $headers = @{
                        "Authorization" = "Splunk $token"
                    }
                    $body = [System.Text.Encoding]::UTF8.GetBytes($payload)
                    $webRequest = [System.Net.WebRequest]::Create($hecUrl)
                    $webRequest.Method = "POST"
                    $webRequest.ContentType = "application/json"
                    $webRequest.Headers.Add("Authorization", "Splunk $token")
                    
                    $requestStream = $webRequest.GetRequestStream()
                    $requestStream.Write($body, 0, $body.Length)
                    $requestStream.Close()
                    
                    $webResponse = $webRequest.GetResponse()
                    $webResponse.Close()
                } catch {
                    # Silent fail in background threads to avoid blocking app
                }
            }
        }
    } -ArgumentList $c, $SplunkHECUrl, $HECToken
    
    $jobs += $job
}

# Keep script running to maintain background jobs
try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
} finally {
    Write-Host "`nStopping background logging streams..." -ForegroundColor Yellow
    foreach ($j in $jobs) {
        Stop-Job $j
        Remove-Job $j
    }
    Write-Host "Streams stopped." -ForegroundColor Green
}
