# Homelab Setup Guide & Explanation

Welcome to your new local Homelab! This guide explains the core concepts behind the setup we just created, why we structured it this way, and how it works under the hood.

---

## 1. What We Did: The Architecture

We set up a local containerized infrastructure using **Docker Compose**. We created a dedicated directory `homelab` containing:
- `docker-compose.yml`: The blueprint of your lab.
- `homepage-config/`: Folder containing configuration files for your visual homepage.
- `start-homelab.ps1` / `stop-homelab.ps1`: Automated PowerShell control scripts.

```mermaid
flowchart TD
    subgraph Windows Host
        DockerDesktop[Docker Desktop Daemon]
        PSStart[start-homelab.ps1] -->|Commands| DockerDesktop
        PSStop[stop-homelab.ps1] -->|Commands| DockerDesktop
        Browser[Web Browser] -->|http://localhost:8085| Homepage
        Browser -->|http://localhost:9000| Portainer
        Browser -->|http://localhost:3001| UptimeKuma
    end

    subgraph Docker Engine (Containers)
        Homepage[Homepage Dashboard]
        Portainer[Portainer Manager]
        UptimeKuma[Uptime Kuma Monitor]
        
        Homepage -.->|Monitors Containers via| DockerSocket
        Portainer -.->|Manages Containers via| DockerSocket
        DockerSocket[/var/run/docker.sock]
    end
    
    subgraph Persistent Storage (Volumes)
        V1[(homepage-config/)] -->|Binds| Homepage
        V2[(portainer_data)] -->|Binds| Portainer
        V3[(uptime_kuma_data)] -->|Binds| UptimeKuma
    end
```

---

## 2. Why We Did It: The Components

Instead of running applications directly on your Windows OS (which can clutter your system registry, conflict with ports, or leave orphaned files), we used **Docker containers**. Here is why we chose this specific starter stack:

### A. Docker & Docker Compose (The Foundation)
- **Why:** Running applications in containers ensures they are completely isolated. Docker Compose acts as **Infrastructure as Code (IaC)**. Instead of typing long, complex `docker run` commands with dozens of arguments, we define everything in a single `docker-compose.yml` file. You can share this file, edit it, or spin it up on another machine, and it will run exactly the same.

### B. Portainer (The Manager)
- **Why:** Working with containers via the terminal can feel tedious. Portainer provides a beautiful graphical interface (GUI) to see running containers, inspect logs, restart services, and monitor container performance without touching the CLI. It makes container management visual and beginner-friendly.

### C. Homepage (The Entry Point)
- **Why:** As your homelab grows, you will have dozens of local URLs and ports to remember. Homepage provides a unified, highly aesthetic dashboard. It displays real-time server stats (CPU, RAM, Disk) and groups your service links in one page.

### D. Uptime Kuma (The Watchdog)
- **Why:** How do you know when your services go down or run slowly? Uptime Kuma monitors your services (via pings or HTTP requests) and graphs their response times. It teaches you the basics of monitoring, health checking, and status page hosting.

---

## 3. How We Did It: Key Concepts

Let's break down the mechanics of the files we created:

### Concept 1: Port Mapping (`ports:`)
In [docker-compose.yml](file:///c:/Users/jesti/OneDrive%20-%20Deakin%20University/Desktop/Portfolio/homelab/docker-compose.yml), you will see configurations like:
```yaml
ports:
  - "8085:3000"
```
- **How it works:** The container runs its internal server on port `3000` (inside its isolated network). The `8085:3000` mapping tells Docker: *"Route any traffic coming to the Windows host on port `8085` to port `3000` inside this container."* This allows you to type `http://localhost:8085` in your web browser to reach the app.

### Concept 2: Persistent Storage (`volumes:`)
By default, Docker containers are **ephemeral**—if you delete a container, all its data is wiped. To prevent this, we use volumes:
- **Bind Mounts:** `./homepage-config:/app/config` maps a folder on your Windows drive (`./homepage-config`) directly to a folder inside the container. When you edit the YAML configuration files on Windows, the Homepage dashboard container sees the changes instantly.
- **Named Volumes:** `portainer_data:/data` lets Docker handle storage optimization, ensuring that Portainer retains your login credentials and configurations even if you update or rebuild the container.

### Concept 3: The Docker Socket (`/var/run/docker.sock`)
```yaml
volumes:
  - /var/run/docker.sock:/var/run/docker.sock
```
- **How it works:** The Docker socket is the API channel that commands use to control Docker. By mounting it inside Portainer and Homepage, we grant them permission to communicate with the host's Docker engine. This allows Portainer to manage other containers and allows Homepage to show whether your containers are online/offline.

## 4. Next Steps: How to Start the Lab on your New PC

To get your Homelab running on your new PC, please follow these steps:

1. **Pull the latest code from GitHub**:
   - On your new PC, open a terminal in your `portfolio-website` folder.
   - Run `git pull` to fetch the new `homelab` folder.

2. **Start Docker Desktop**:
   - Open your Start menu, type **Docker Desktop**, and open it.
   - Wait 1-2 minutes until it shows a **green bar** in the bottom left corner, indicating the engine is running.

3. **Execute the Start Script**:
   - Open a PowerShell terminal.
   - Navigate to the new homelab folder:
     ```powershell
     cd "c:\Users\jesti\OneDrive - Deakin University\Desktop\Portfolio\portfolio-website\homelab"
     ```
   - Run the script:
     ```powershell
     powershell -ExecutionPolicy Bypass -File .\start-homelab.ps1
     ```

4. **Set Up Fresh Services (First Time Only)**:
   > [!NOTE]
   > Named volumes (`portainer_data`, `uptime_kuma_data`, `splunk_data`) are stored locally inside each computer's Docker database. They do not sync through GitHub or OneDrive. Therefore, your services will start fresh on the new PC:
   - **Portainer (`http://localhost:9000`)**: Set up your admin account/password when opening it for the first time.
   - **Uptime Kuma (`http://localhost:3001`)**: Set up your login account when opening it for the first time.
   - **Splunk (`http://localhost:8000`)**: Log in with User: `admin` and Password: `Sudo_cyber_secure123`.

5. **Re-add Uptime Kuma Splunk Monitor**:
   - In Uptime Kuma, click **Add New Monitor**.
   - Set Monitor Type to `HTTP(s)`.
   - Set Friendly Name to `Splunk SIEM`.
   - Set URL to `http://splunk:8000` (this uses internal Docker networking to check Splunk's health).
   - Click **Save**.

