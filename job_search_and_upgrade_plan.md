# 💼 Job Search Strategy & Daily Upgrade Plan

This document outlines a targeted job application strategy optimized for your **485 Temporary Graduate Visa** status, clarifies what you can and cannot apply for, explains how we will work together to apply for jobs daily, and provides a structured roadmap to upgrade your technical capabilities for a Security Operations Center (SOC) role.

---

## ⚠️ CRITICAL: Visa Status & Targeting (Citizenship/PR vs. 485)

> [!WARNING]
> **Important Clarification on Your Work Rights**
> You mentioned: *"i got full work rights and 485 2 years i can apply for jobs that require citizenship or PR"*. 
>
> **This is a common and critical misunderstanding:**
> * **485 Temporary Graduate Visa:** Gives you **full work rights** (unlimited hours) with any employer in Australia for 2 years. However, it is a **temporary visa** and does **NOT** make you an Australian Citizen or Permanent Resident (PR).
> * **Jobs requiring Citizenship or PR:** Many cybersecurity roles (especially in government, defense, or with government contractors) require a **National Security Clearance** (e.g., Baseline, NV1, NV2). By law, these clearances are strictly restricted to **Australian Citizens** (and in extremely rare cases, Permanent Residents). 
> * **Conclusion:** You **cannot** apply for jobs that explicitly require Australian Citizenship or Permanent Residency. If you apply, your application will be automatically rejected by the applicant tracking systems (ATS) during the screening questions.

### Where You SHOULD Focus Your Job Search
To maximize your chances and avoid wasting time, focus 100% of your energy on the **Private Commercial Sector** and companies that do not require government security clearances.

| Target Sector | Description / Examples | Visa Accessibility |
| :--- | :--- | :--- |
| **Managed Security Service Providers (MSSPs)** | Companies that manage security for other businesses (e.g., **Trustwave, CyberCX, Wipro, NTT, NTT DATA, DXC Technology, Interactive, CyberOps**). | **High** (Always hiring graduates/juniors, highly open to 485 visas). |
| **Global IT & Tech Consultancies** | The Big 4 and other tech consulting firms (e.g., **Deloitte, EY, KPMG, PwC, Capgemini, Infosys, Accenture**). | **High** (Have large commercial cybersecurity streams that accept visa holders). |
| **Private Commercial Enterprises** | Banks, retail brands, insurance, energy, and telecom companies (e.g., **Kmart, Telstra, Optus, ANZ, NAB, Medibank, Coles, BHP**). | **Medium to High** (Commercial roles rarely require security clearances). |
| **Mid-Market MSPs & IT Support** | Local Melbourne IT support agencies. | **High** (Great entry-point to gain local Australian IT experience). |

---

## 🤖 How We Will Apply for Jobs Together (The AI Partnership)

> [!IMPORTANT]
> **Why I Cannot Apply Directly on Your Behalf**
> Due to security controls (Multi-Factor Authentication / MFA), account passwords, and legal declarations (e.g., verifying visa details under penalty of law), AI systems cannot log into your SEEK, LinkedIn, or Indeed accounts to submit applications on your behalf.
> 
> **How We Will Work Together to Apply in Under 3 Minutes:**
> 1. **You Find a Job:** Go to SEEK, LinkedIn, or Indeed using the links below and find an open role.
> 2. **Share the Details:** Paste the job description or link directly into our chat.
> 3. **I Generate Your Materials:** I will instantly write:
>    * A **custom Cover Letter** tailored precisely to that job's keywords.
>    * Specific **Resume bullet point adjustments** to match their requirements.
> 4. **You Submit:** You copy-paste the materials and submit the application on the job portal.

---

## 📅 Daily 20-Minute Job Application Strategy

Commit to applying for **3 to 5 jobs every single day**. Follow this simple routine:

### 🔍 Step 1: Use Curated Search Queries (Melbourne & Remote)
Click or search these links on your job boards:
* **SEEK:** [Junior Cyber Security Jobs in Melbourne](https://www.seek.com.au/junior-cyber-security-jobs/in-Melbourne-VIC)
* **Indeed:** [Entry Level Cyber Security Melbourne](https://au.indeed.com/jobs?q=cyber+security+entry+level&l=Melbourne+VIC)
* **LinkedIn:** Search keywords `"Junior SOC Analyst"`, `"Cyber Security Graduate"`, or `"Junior Security Operations"` filtering for location **Melbourne, Australia**.
* **Prosple (Graduate Programs):** Search for [Cyber Security Graduate Programs Australia](https://au.prosple.com/search?study_fields=516&locations=9549) (Filter for employers accepting applications from temporary visa holders).

### 🛠️ Step 2: Leverage IT Helpdesk / Service Desk as a Gateway
If you struggle to land a pure SOC analyst role immediately, **do not hesitate to apply for IT Helpdesk or Service Desk Analyst roles**. 
* **Why?** 90% of successful SOC analysts started in IT Support. It proves you understand networks, Active Directory, ticketing systems, and customer service. It also gives you invaluable **local Australian work experience** on your resume.
* **Search Query:** [Service Desk Analyst Jobs in Melbourne](https://www.seek.com.au/service-desk-analyst-jobs/in-Melbourne-VIC)

---

## 📈 Daily 1-Hour Skill Upgrade Roadmap

To stand out to SOC managers, you must showcase practical skills that go beyond a degree. Follow this **1-hour-a-day schedule** to build hands-on blue-team expertise:

### 📅 Monday: SIEM & Log Analysis (The Core SOC Skill)
* **Focus:** Understanding how to search, filter, and analyze logs in a Security Information and Event Management (SIEM) tool.
* **Weekly Tasks:**
  1. Create a free account on **Splunk Lantern** or download **Splunk Enterprise (Free trial)** locally.
  2. Complete the free **Splunk Basics** or **TryHackMe SOC Level 1 Pathway** (Splunk modules).
  3. Practice writing basic search queries (SPL) to locate anomalies (e.g., failed logins, suspicious execution flags).

### 📅 Tuesday: Network Traffic Analysis (PCAP Analysis)
* **Focus:** Analyzing packet captures to identify malicious command-and-control (C2) channels, exfiltration, or scanning.
* **Weekly Tasks:**
  1. Open **Wireshark** and download sample packet captures from [Wireshark Sample Captures](https://wiki.wireshark.org/SampleCaptures) or malware analysis sites (e.g., malware-traffic-analysis.net).
  2. Practice applying filters: isolate HTTP GET/POST requests, filter out TCP handshakes, follow stream paths, and identify anomalous payloads.
  3. Master `tshark` command-line filtering for bulk parsing.

### 📅 Wednesday: Endpoint Detection & Threat Hunting (EDR)
* **Focus:** Understanding how endpoint telemetry is monitored and how process structures function.
* **Weekly Tasks:**
  1. Set up **Wazuh** (a free, open-source host-based security monitoring tool) in your local VM lab.
  2. Inspect Windows Event Logs (specifically **Sysmon** Logs) to trace process executions (Event ID 1) and network connections (Event ID 3).
  3. Review Volatility 3 command outputs to map how hidden parent/child process relationships appear in memory.

### 📅 Thursday: Security Automation (Python/Bash)
* **Focus:** Building operational scripts to automate alert notifications or parse log telemetry.
* **Weekly Tasks:**
  1. Refactor your **AppAttack** script or write a Python script that reads an active system log (e.g., `auth.log` or Windows Event XML) and triggers a command-line alert if it detects more than 5 failed logins from the same IP in 10 seconds.
  2. Push your automation scripts to GitHub weekly to keep your repository active.

### 📅 Friday: Threat Intelligence & Sigma Rules
* **Focus:** Writing detection rules to capture new threat behaviors.
* **Weekly Tasks:**
  1. Study a recent Threat Intelligence report (from CISA, AlienVault, or Talos) and identify the MITRE ATT&CK techniques used.
  2. Write a basic **Sigma rule** or **Snort rule** designed to detect that specific threat technique (e.g., detecting PowerShell executing with `-nop -w hidden` flags).

### 📅 Saturday & Sunday: Branding & LinkedIn Networking
* **Focus:** Marketing your skills and connecting with hiring managers.
* **Weekly Tasks:**
  1. Publish one of the **technical LinkedIn drafts** we generated (e.g., your Volatility Memory Forensic write-up) and attach the corresponding screenshots from your portfolio directory.
  2. Connect with 5 local Melbourne Cyber Security Managers, SOC Leads, or Recruiters. Send a brief, polite note:
     > *"Hi [Name], I recently graduated with my Bachelor of Cyber Security from Deakin and have been building security automation and forensics labs. I'd love to connect and follow your team's work!"*
