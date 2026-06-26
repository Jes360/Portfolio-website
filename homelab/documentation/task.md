# Homelab Setup Checklist

- `[x]` Create `homelab` directory structure
- `[x]` Create `docker-compose.yml` defining services
- `[x]` Create Homepage config files (`settings.yaml`, `services.yaml`, `bookmarks.yaml`, `widgets.yaml`)
- `[x]` Create PowerShell scripts (`start-homelab.ps1`, `stop-homelab.ps1`)
- `[x]` Start Docker Desktop and run the lab
- `[x]` Verify services (Homepage, Portainer, Uptime Kuma) are accessible
- `[x]` Document the architecture and components

## Splunk SIEM Lab Expansion
- `[x]` Add Splunk configurations to `docker-compose.yml`, `services.yaml`, and `start-homelab.ps1`
- `[ ]` Launch the updated lab and start Splunk container
- `[ ]` Access Splunk Web and complete initial setup
- `[ ]` Configure Uptime Kuma to monitor Splunk health
- `[ ]` Perform SIEM lab exercises (search query SPL practice)
