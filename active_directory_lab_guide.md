# 🛡️ Active Directory & Splunk Ingestion Lab Guide

Active Directory (AD) is the central identity management service used by 99% of enterprises globally. In both **IT Support (Helpdesk)** and **Security Operations (SOC)** roles, AD is the most common technology you will interact with.

* **In IT Support:** You will use AD daily to reset passwords, unlock accounts, manage permissions, and onboard new users.
* **In a SOC:** You will monitor AD security logs to detect brute-force attacks, lateral movement, and privilege escalation.

This guide outlines how to build a local Active Directory domain, populate it with users, simulate security events, and ingest those logs into your **Splunk SIEM**.

---

## 🏗️ Lab Architecture

We will build the following network topology using VirtualBox (or VMware Player):

```mermaid
flowchart TD
    subgraph Host OS (Windows)
        Splunk[Splunk SIEM - Port 8000/8088]
    </styled>
    
    subgraph Isolated VM Network (NAT Network / Host-Only)
        DC[Windows Server VM\nDomain Controller\nIP: 192.168.56.10\nDomain: homelab.local]
        WinClient[Windows 10/11 Client VM\nDomain Joined\nIP: 192.168.56.20]
    end

    WinClient -->|Logon Events / DNS| DC
    DC -.->|Forward Security Logs| Splunk
    WinClient -.->|Forward Security Logs| Splunk
```

---

## 📅 Step-by-Step Lab Setup

### 📥 Phase 1: Download & Install Software
1. Download **VirtualBox** (Free) if you haven't already.
2. Download **Windows Server Evaluation ISO** (Free 180-day trial from Microsoft Evaluation Center).
3. Download **Windows 10/11 Enterprise Evaluation ISO** (Free 90-day trial).

### 🖥️ Phase 2: Deploy the Domain Controller (DC)
1. Create a VM in VirtualBox, allocate 2-3GB of RAM, and install **Windows Server** (choose Desktop Experience).
2. Configure a static IP address in Windows Server (e.g., `192.168.56.10`, subnet `255.255.255.0`, Gateway `192.168.56.1`).
3. Open **Server Manager** -> **Add Roles and Features**.
4. Install **Active Directory Domain Services (AD DS)** and **DNS Server**.
5. Once installed, click the flag icon in Server Manager and select **Promote this server to a domain controller**.
6. Select **Add a new forest** and name your root domain `homelab.local`. Complete the setup and restart.

### 💻 Phase 3: Deploy the Client Machine & Join the Domain
1. Create a second VM and install **Windows 10/11 Enterprise**.
2. Configure its DNS settings to point to your Domain Controller (`192.168.56.10`) as the primary DNS server.
3. Open Windows Settings -> **About** -> **Rename this PC (advanced)**.
4. Under the Computer Name tab, click **Change**, select **Domain**, type `homelab.local`, and press enter.
5. Log in with your Windows Server administrator credentials. Upon restart, your client machine is successfully joined to the domain!

---

## 🛠️ Security & Automation Exercises

Once your domain is established, complete these two high-value portfolio exercises:

### 🐍 Exercise 1: Scripted User Provisioning (PowerShell)
Instead of creating users manually, write a PowerShell script to automate the creation of 10 dummy employees. Run this on your Domain Controller:

```powershell
# Create an Organizational Unit (OU) for Employees
New-ADOrganizationalUnit -Name "Staff" -Path "DC=homelab,DC=local"

# Array of dummy employees
$users = @(
    @{ FirstName="John"; LastName="Doe"; Username="jdoe"; Title="SOC Analyst" },
    @{ FirstName="Alice"; LastName="Smith"; Username="asmith"; Title="IT Support" },
    @{ FirstName="Bob"; LastName="Johnson"; Username="bjohnson"; Title="Network Admin" }
)

foreach ($u in $users) {
    $password = ConvertTo-SecureString "P@ssword123!" -AsPlainText -Force
    New-ADUser -Name "$($u.FirstName) $($u.LastName)" `
               -GivenName $u.FirstName `
               -Surname $u.LastName `
               -SamAccountName $u.Username `
               -UserPrincipalName "$($u.Username)@homelab.local" `
               -Path "OU=Staff,DC=homelab,DC=local" `
               -AccountPassword $password `
               -Title $u.Title `
               -Enabled $true
    Write-Host "Created AD User: $($u.Username)" -ForegroundColor Green
}
```

### 🎯 Exercise 2: Brute-Force & Account Lockout Simulation
1. Go to your client Windows VM.
2. Attempt to log in as user `jdoe` but type the wrong password 5-10 times consecutively.
3. AD will lock the account.
4. Log back in as Administrator on the Domain Controller.
5. Open **Event Viewer** -> **Windows Logs** -> **Security**.
6. Filter the logs to locate these critical Windows Event IDs:
   * **Event ID 4625:** An account failed to log on (shows the IP address of the client and username `jdoe`).
   * **Event ID 4740:** A user account was locked out (shows the exact time `jdoe` was locked out).

---

## 📊 Phase 4: Forward Logs to your Splunk SIEM
To make this a complete SOC project, forward these AD logs to your Splunk instance:

1. Download the **Splunk Universal Forwarder** for Windows on your Domain Controller VM.
2. Install it and configure it to point to your Splunk host IP on port `9997` (or port `8088` using the HEC forwarder we configured).
3. Update Splunk's configuration (`inputs.conf`) to monitor security logs:
   ```ini
   [WinEventLog://Security]
   disabled = 0
   start_from = oldest
   current_only = 0
   evt_resolve_ad_obj = 1
   checkpointInterval = 5
   whitelist = 4625,4740
   ```
4. Log into your **Splunk Web UI** (`http://localhost:8000`) and search for the logs:
   ```spl
   index=main EventCode=4740 OR EventCode=4625
   ```
5. Build a dashboard panel tracking failed logins by username to visually map brute-force attempts.
