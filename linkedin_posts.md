# High-Impact LinkedIn Posts for SOC Analyst Roles

These drafts are tailored to showcase your hands-on technical competencies. Each post focuses on a specific, real-world project from your studies and internship to highlight threat-hunting, network forensics, automation, and secure development.

---

## 📌 Post 1: The Transition & Core Focus (General Intro)
**Goal:** Announce graduation, credentials, and state clearly what roles you are seeking.

```text
🚀 I am excited to share that I have officially graduated with my Bachelor of Cyber Security from Deakin University! 🎓

Throughout my degree, I focused heavily on security operations, forensics, and automation. My academic journey has given me deep hands-on exposure to malware analysis, network forensics, and secure coding. To complement my degree, I am currently wrapping up the Google Cybersecurity Professional Certificate to ensure my skills align with industry frameworks like NIST and MITRE ATT&CK.

As a graduate, I believe in showing, not just telling. That’s why I’ve built a portfolio highlighting real laboratory investigations, including:
🔍 Memory Forensics: Identifying process hollowing with Volatility 3.
network WiFi Forensics: Cracking and decrypting WEP traffic flows using tcpdump and aircrack-ng.
⚙️ Security Automation: Writing custom Python parsers to automate recon workflows (AppAttack).

I am actively looking for starting opportunities in Melbourne, Australia, specifically as a SOC Analyst, Junior Incident Responder, or Security Consultant.

Check out my full portfolio and interactive write-ups here: https://jes360.github.io/Portfolio-website/

If you are hiring or have advice for a hungry cybersecurity graduate, I would love to connect!

#Cybersecurity #GraduateJobs #SOCAnalyst #MelbourneTech #InfoSec #CareerStart #SecurityOperations
```

---

## 📌 Post 2: Volatility Memory Forensics (Threat Hunting)
**Goal:** Show deep OS internals knowledge and Volatility 3 threat-hunting capabilities.

```text
🔍 Threat Hunting in Memory: Detecting Process Hollowing with Volatility 3

For my latest forensics lab, I simulated an incident response scenario to investigate a stealthy process injection technique known as Process Hollowing. Here’s a summary of my methodology and findings:

1️⃣ Acquisition: Configured VirtualBox debugging variables on my host and executed a malware sample (Sample-task8.exe) inside a Windows VM. I dumped the VM's physical memory using the VirtualBox debugger console command:
   .pgmphystofile "C:\SIT324_memdump.bin"

2️⃣ Process Auditing: Ran Volatility 3's `windows.pslist` plugin. I identified the malware loader PID 7560, but noted it had already exited—a common behavior for loaders.

3️⃣ PEB vs. VAD Analysis: To detect if the loader hollowed out a legitimate process, I audited active processes. I compared the Process Environment Block (PEB) module list (via `windows.dlllist`) with the actual Virtual Address Descriptor (VAD) memory allocations (via `windows.ldrmodules`). 

4️⃣ Finding the Injection: The comparison revealed discrepancies in a running `svchost.exe` (PID 5636). Running a global `windows.malfind` scan confirmed the injection, exposing unbacked memory pages marked as PAGE_EXECUTE_READWRITE containing active PE headers. Additionally, I found similar code injections targeting the Windows Defender Engine (MsMpEng.exe, PID 3136).

💡 SOC Analyst Takeaway: Monitoring process trees is not enough. Attackers hide inside trusted processes. Knowing how to parse memory structures (PEB vs. VAD) is crucial for Tier 2 triage.

Check out my detailed writeup and command log on my portfolio: https://jes360.github.io/Portfolio-website/

#MemoryForensics #Volatility3 #IncidentResponse #ThreatHunting #BlueTeam #SOCAnalyst #MalwareAnalysis
```

📸 **Recommended Image Attachment**: Attach `volatility_8.1P_img_1.png` (Volatility Windows Info output) and `volatility_8.2c_img_1.png` (Malfind code injection page detection) from your `portfolio-website/images/` folder to show your Volatility CLI investigation.

---

## 📌 Post 3: WiFi Forensics & Traffic Decryption (Network Forensics)
**Goal:** Demonstrate packet analysis (tcpdump/tshark/Wireshark) and wireless security knowledge.

```text
packets WiFi Forensics: Cracking WEP and Decrypting Traffic Flows 🌐

Wireless security has evolved, but understanding legacy protocols like WEP is a masterclass in packet analysis and traffic redirection. In my recent network forensics investigation, I audited a capture file (wifi.pcap) to reconstruct a wireless intrusion:

🎯 Step 1: Isolating Protected Frames
I used tcpdump with custom bitwise filters targeting the IEEE 802.11 Frame Control fields:
`tcpdump -nne -r wifi.pcap '(wlan[0] & 0x0C = 0x08) and (wlan[1] & 0x40 = 0x40)'`
This isolated 802.11 data frames (Type 2) with the 'Protected Frame' bit set. I counted 29,719 unique Initialization Vectors (IVs)—sufficient for statistical cracking.

🔑 Step 2: Cracking the WEP Key
I ran `aircrack-ng` on the capture, which processed the IVs and successfully cracked the WEP key in seconds: D0:E5:9E:B9:04.

🔓 Step 3: Decrypting & Analysing the Attack Flow
I loaded the key into Wireshark to decrypt the data payloads and ran tshark to extract the MAC communication pairs:
`tshark -r wifi.pcap -Y "wlan.fc.type == 2 && wlan.fc.protected == 1" -T fields -e wlan.sa -e wlan.da | sort | uniq -c | sort -nr`

The output exposed the attack profile: an attacker MAC (1c:4b:d6:69:cd:07) flooding the Access Point (00:23:69:61:00:d0) with a massive broadcast of ARP Replay packets. This forced the AP to rapidly generate new IVs, enabling the statistical crack.

💡 SOC Analyst Takeaway: Protocol fluency is key. Bitwise filtering in tcpdump and traffic flow visualization in tshark allow analysts to parse gigabytes of network logs quickly during an active incident.

Full lab breakdown on my portfolio: https://jes360.github.io/Portfolio-website/

#NetworkForensics #Wireshark #tshark #tcpdump #BlueTeam #WirelessSecurity #PacketAnalysis
```

📸 **Recommended Image Attachment**: Attach `wifi_page_1_img_1.png` (Wireshark packet view) and `wifi_page_2_img_3.png` (Aircrack-ng WEP crack success) from your `portfolio-website/images/` folder to show your packet capture and cracking workflow.

---

## 📌 Post 4: SDN Network Security & DoS Benchmarking (Network Resilience)
**Goal:** Show knowledge of Software-Defined Networking (SDN) and DDoS traffic analysis.

```text
⚙️ Benchmarking Network Resilience: SDN Security Testing in Mininet & ONOS

Software-Defined Networking (SDN) centralizes control, but it also centralizes the threat landscape. In this network security project, I simulated and analysed the impact of a Denial of Service (DoS) attack on an OpenFlow network:

🏗️ The Architecture:
I configured a custom single topology in Mininet and mapped it to a remote ONOS (Open Network Operating System) controller:
`sudo mn --topo=single,3 --controller=remote,ip=127.0.0.1 --mac`

📊 Establishing the Baseline:
I measured normal TCP and UDP throughput using `iperf3`. Under baseline conditions, network throughput was stable, with minimal jitter and 0% packet loss.

pw Simulated DoS Flood:
Using hping3 from an attacker host, I launched a high-velocity UDP flood targeting host h1:
`hping3 --flood --udp -p 80 10.0.0.1`

📉 The Impact:
Under attack, UDP bandwidth testing crashed immediately. Active sessions reported 'Connection refused' errors, TCP throughput collapsed from 95% capacity to 0%, and packet drop rates spiked catastrophically.

💡 SOC Analyst Takeaway: Understanding flow-based switching and controllers like ONOS is crucial as modern enterprises move to SD-WAN. Detecting anomalies in flow rules and traffic spikes is the first line of defence against infrastructure exhaustion.

Read my complete research paper on my portfolio: https://jes360.github.io/Portfolio-website/

#SDN #Mininet #ONOS #OpenFlow #DDoS #NetworkSecurity #TrafficAnalysis #iperf3
```

📸 **Recommended Image Attachment**: Attach `sdn_page_2_img_3.png` (iperf3 baseline performance) and `sdn_page_4_img_8.png` (network throughput collapse under flood attack) from your `portfolio-website/images/` folder to show the SDN performance differences under attack.

---

## 📌 Post 5: AppAttack Security Automation (SOAR)
**Goal:** Highlight scripting skills (Python/Bash) and how you use them to automate security operations.

```text
⚙️ Streamlining Security Operations: Building the AppAttack Automation Toolkit

In security operations, speed is critical. Automating repetitive triage and scan actions saves time and reduces human error. During my Capstone project, I co-developed AppAttack—a toolkit designed to automate scanning, password testing, and exploitation workflows.

Here is what I engineered:
🐍 Python XML Output Parsers: Security tools export data in vastly different formats. I wrote Python parsers to extract raw data from Nmap XML reports, Metasploit search outputs, and John the Ripper logs, translating them into structured, unified JSON files.
🐚 Bash Automation Runner: Chained host discovery, port scanning, vulnerability scanning, and local credentials audits into a single-command executable script.
📊 Metric Mapping: Integrated vulnerability databases to automatically match open ports with relevant Metasploit auxiliary or exploit modules.

💡 SOC Analyst Takeaway: A modern SOC relies heavily on SOAR (Security Orchestration, Automation, and Response). Scripting in Python and Bash allows analysts to automate alert enrichment, freeing up time to focus on complex threat investigations.

Check out the parser code and design architecture on my portfolio: https://jes360.github.io/Portfolio-website/

#SecurityAutomation #Python #BashScripting #DevSecOps #SOAR #VulnerabilityManagement #GitHub
```

📸 **Recommended Image Attachment**: Attach `capstone_evi_img_1.png` (active tool recon log output) and `capstone_evi_img_5.png` (Metasploit vulnerability mapping JSON objects) from your `portfolio-website/images/` folder to showcase your tool development.
