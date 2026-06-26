# Splunk SIEM Lab Implementation Plan

This project will expand your local homelab by deploying **Splunk Enterprise**—the industry-leading SIEM platform. You will learn how to deploy a SIEM, monitor its status, and ingest logs from your local systems to simulate a Security Operations Center (SOC) environment.

---

## User Review Required

> [!IMPORTANT]
> **System Resources:**
> Splunk Enterprise is a heavy application compared to Homepage and Uptime Kuma. It requires at least **4GB of RAM** allocated to Docker Desktop to run smoothly. Please make sure your computer has at least 8GB-16GB of total RAM.
>
> **Access Credentials:**
> Splunk requires an administrator password on startup. We will define a default secure password in the configurations, which you can change upon logging in.

---

## Open Questions

> [!IMPORTANT]
> **Port Configuration:**
> By default, Splunk's Web interface runs on port `8000`. Please let us know if you have any other local application using port `8000` so we can adjust it to `8086` or similar.

---

## Proposed Changes

### Homelab Component

We will modify your existing `homelab` files to add Splunk:

#### [MODIFY] [docker-compose.yml](file:///c:/Users/jesti/OneDrive%20-%20Deakin%20University/Desktop/Portfolio/homelab/docker-compose.yml)
- Add a `splunk` service running `splunk/splunk:latest`.
- Map port `8000:8000` (Web UI) and `9997:9997` (Splunk log indexer).
- Mount a named volume `splunk_data` to preserve search history and settings.
- Pass environment variables (`SPLUNK_START_ARGS=--accept-license`, `SPLUNK_PASSWORD=<SecurePassword>`).

#### [MODIFY] [homepage-config/services.yaml](file:///c:/Users/jesti/OneDrive%20-%20Deakin%20University/Desktop/Portfolio/homelab/homepage-config/services.yaml)
- Add Splunk to the "System Management" section so it appears on your visual dashboard.

---

## Verification & Lab Plan

### 1. Verification
* Access Splunk Web UI at `http://localhost:8000` using the username `admin` and the password we configure.
* Confirm Splunk is monitored on Uptime Kuma.
* Confirm Splunk shows up as online on your Homepage Dashboard.

### 2. The SIEM Lab Exercises
Once everything is running, we will perform the following hands-on security exercises:
* **Exercise 1 (Log Ingestion):** Forward container stdout logs into Splunk's indexing engine.
* **Exercise 2 (Search queries):** Write Splunk Search Processing Language (SPL) queries to find specific event logs (e.g. searching for Uptime Kuma's ping requests).
* **Exercise 3 (Dashboarding):** Create a visual dashboard inside Splunk displaying event count over time.
