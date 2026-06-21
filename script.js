/* Modern Cybersecurity Portfolio - Interactive Script */

// Project Showcase Data
const projectData = {
    volatility: {
        title: "Process Injection & Memory Forensics",
        role: "Memory Forensics / Incident Response",
        meta: "SIT324: Malware Analysis — Distinction Lab",
        desc: "A hands-on malware runtime analysis and memory forensics laboratory. The goal was to identify stealthy process injection (specifically Process Hollowing) within a compromised Windows environment using the Volatility 3 framework.",
        findings: [
            "<strong>Memory Acquisition:</strong> Successfully dumped physical memory of a target VirtualBox Windows VM (SIT324VM_T124) by configuring debug variables and utilizing the VirtualBox debugger command <code>.pgmphystofile</code> during active malware runtime.",
            "<strong>Process Discovery:</strong> Used <code>windows.pslist</code> to identify the main malware process (<code>Sample-task8.exe</code>, PID 7560) and detected its subsequent termination, indicating a loader execution flow.",
            "<strong>Hollowing Identification:</strong> Discovered an active compromised process (<code>svchost.exe</code>, PID 5636) by cross-referencing process modules from the Process Environment Block (PEB) via <code>windows.dlllist</code> and the Virtual Address Descriptor (VAD) tree using <code>windows.ldrmodules</code>, identifying anomalous discrepancies.",
            "<strong>Active Code Injection:</strong> Ran a global <code>windows.malfind</code> scan to isolate unbacked executable memory regions (marked as <code>PAGE_EXECUTE_READWRITE</code>), proving active injection in <code>svchost.exe</code> (PID 5636) and attempts to tamper with the Windows Defender Engine (<code>MsMpEng.exe</code>, PID 3136)."
        ],
        code: `# Volatility 3 Command Reference
# 1. Extract OS and profile information
python vol.py -f SIT324_8.3D.bin windows.info.Info

# 2. Run malfind to locate injected code regions
python vol.py -f SIT324_8.3D.bin windows.malfind.Malfind

# 3. Audit discrepancy between PEB and VAD for process hollowing
python vol.py -f SIT324_8.3D.bin windows.ldrmodules.LdrModules --pid 5636`,
        screenshots: [
            { url: "images/volatility_8.1P_img_1.png", caption: "Volatility 3 Windows Info output auditing the core parameters of target memory dump." },
            { url: "images/volatility_8.2c_img_1.png", caption: "Malfind scan output highlighting injected code signature in svchost.exe memory page." }
        ],
        socImpact: "This project demonstrates the core technical skills needed for Tier 2/3 SOC Analysts: operating system internals (PEB vs. VAD), virtualization debugging, virtual memory architecture, and threat-hunting using memory artifacts."
    },
    wifi: {
        title: "WiFi Forensics & Packet Decryption",
        role: "Network Forensics & Packet Analysis",
        meta: "SIT327: Network Forensics — Distinction Lab",
        desc: "A packet-level investigation of a wireless network attack, using Kali Linux network tools to isolate frames, crack encryption keys, decrypt captured payloads, and reconstruct the attacker's methodology.",
        findings: [
            "<strong>IV Analysis:</strong> Formulated custom <code>tcpdump</code> filters using bitwise operations (<code>wlan[0] & 0x0C = 0x08</code> and <code>wlan[1] & 0x40 = 0x40</code>) to filter WEP-protected data frames. Counted 29,719 unique Initialization Vectors (IVs), confirming statistical viability for offline cracking.",
            "<strong>WEP Key Crack:</strong> Orchestrated <code>aircrack-ng</code> against the capture file, successfully processing the IVs and recovering the raw WEP key: <code>D0:E5:9E:B9:04</code> in under 10 seconds.",
            "<strong>Traffic Decryption:</strong> Imported the recovered WEP key into Wireshark's IEEE 802.11 preferences, decrypting previously scrambled packets and exposing the underlying layers.",
            "<strong>Flow and Attack Reconstitution:</strong> Analysed the decrypted stream using <code>tshark</code> and custom shell pipelines (<code>sort | uniq -c | sort -nr</code>). Identified Client MACs, AP MAC (<code>00:23:69:61:00:d0</code>), and the Attacker MAC (<code>1c:4b:d6:69:cd:07</code>) performing a high-rate ARP Replay injection attack to force IV generation."
        ],
        code: `# Network Forensic Commands
# 1. Filter and count protected data frames using tcpdump
tcpdump -nne -r wifi.pcap '(wlan[0] & 0x0C = 0x08) and (wlan[1] & 0x40 = 0x40)' | wc -l

# 2. Extract and count unique MAC communication flows using tshark
tshark -r wifi.pcap -Y "wlan.fc.type == 2 && wlan.fc.protected == 1" -T fields -e wlan.sa -e wlan.da | sort | uniq -c | sort -nr

# 3. Crack WEP capture with aircrack-ng
aircrack-ng wifi.pcap`,
        screenshots: [
            { url: "images/wifi_page_1_img_1.png", caption: "Initial wireless packet capture analysis in Wireshark identifying WEP-protected data frames." },
            { url: "images/wifi_page_2_img_3.png", caption: "Decrypted ARP packets displaying clean IP address mappings and packet flow structures." }
        ],
        socImpact: "Demonstrates high-level packet analysis, wireless protocol knowledge, and proficiency in Linux CLI tools (tcpdump, tshark) which are essential for analysing PCAP files during network threat triage."
    },
    appattack: {
        title: "AppAttack Security Automation Toolkit",
        role: "Security Tool Engineering / SOAR",
        meta: "Academic Capstone Project",
        desc: "A custom automation utility built in Python and Bash to orchestrate security reconnaissance, scanning, and local cracking workflows, improving the speed and efficiency of security assessments.",
        findings: [
            "<strong>Python Scripting:</strong> Wrote modular Python parsers for Nmap XML, John the Ripper, and Metasploit, standardizing unstructured outputs into clean, unified JSON objects.",
            "<strong>Bash Orchestration:</strong> Engineered a robust Bash runner script that chains recon (passive and active), scans, and exploit verification sequentially, handling status flags and runtime variables.",
            "<strong>Vulnerability Mapping:</strong> Automatically parsed Metasploit search outputs, pairing discovered ports with exploit modules and presenting them in a dashboard structure.",
            "<strong>Agile/DevOps Practice:</strong> Managed codebase using Git/GitHub, tracking progress through Agile sprint iterations documented on Trello."
        ],
        code: `# Sample Python Parser Snippet from AppAttack
import xml.etree.ElementTree as ET
import json

def parse_nmap_xml(xml_file):
    tree = ET.parse(xml_file)
    root = tree.getroot()
    hosts_data = []
    for host in root.findall('host'):
        ip = host.find('address').attrib.get('addr')
        status = host.find('status').attrib.get('state')
        ports = []
        for port in host.findall('.//port'):
            port_id = port.attrib.get('portid')
            state = port.find('state').attrib.get('state')
            service = port.find('service').attrib.get('name') if port.find('service') is not None else 'unknown'
            ports.append({"port": port_id, "state": state, "service": service})
        hosts_data.append({"ip": ip, "status": status, "ports": ports})
    return json.dumps(hosts_data, indent=4)`,
        screenshots: [
            { url: "images/capstone_evi_img_1.png", caption: "AppAttack automation pipeline scanning a host machine and retrieving live vulnerability statuses." },
            { url: "images/capstone_evi_img_5.png", caption: "Modular Python security tool output files parsed into JSON objects for automated SIEM ingestion." }
        ],
        socImpact: "Demonstrates software engineering in security operations (SOAR), API parsing, scripting, and automation of repetitive tasks—highly valued for automating SOC alert validation."
    },
    sdn: {
        title: "SDN Security & DoS Benchmarking",
        role: "Software-Defined Networking / Traffic Analysis",
        meta: "SIT325: Advanced Network Security — Lab Report",
        desc: "Analysis of Software-Defined Network (SDN) resiliency and behavior. Implemented a network architecture in Mininet, routed through an ONOS controller, and measured the impact of a Denial of Service (DoS) flood.",
        findings: [
            "<strong>Topology Creation:</strong> Built single and custom linear OpenFlow topologies in Mininet and mapped them to a remote OpenFlow controller (ONOS).",
            "<strong>Baseline Benchmarking:</strong> Measured normal TCP/UDP bandwidth, latency, and packet loss using <code>iperf3</code> client-server flows.",
            "<strong>DoS Simulation:</strong> Launched high-volume UDP flood attacks to target internal nodes, immediately degrading network throughput and triggering 'Connection refused' errors in active sessions.",
            "<strong>Performance Audit:</strong> Captured the performance degradation curves, reporting throughput loss from 95% capacity down to 0% and noting massive packet drop rate spikes."
        ],
        code: `# SDN Benchmarking Commands
# 1. Initialize Mininet topology linked to ONOS controller
sudo mn --topo=single,3 --controller=remote,ip=127.0.0.1 --mac

# 2. Run iperf3 UDP bandwidth measurement
iperf3 -c 10.0.0.1 -u -b 10M -t 10

# 3. Launch simulated UDP flood (attacker node)
timeout 15 h3 hping3 --flood --udp -p 80 10.0.0.1`,
        screenshots: [
            { url: "images/sdn_page_2_img_3.png", caption: "SDN baseline performance charts displaying stable TCP and UDP throughput before flooding." },
            { url: "images/sdn_page_4_img_8.png", caption: "Throughput degradation charts showing 100% loss of UDP traffic connectivity under flood attack." }
        ],
        socImpact: "Demonstrates knowledge of modern network control planes (SDN), flow table rules, traffic benchmarking, and analysing DDoS impacts on infrastructure."
    },
    pipeline: {
        title: "Secure CI/CD DevOps Pipeline",
        role: "DevSecOps / Secure Coding",
        meta: "Academic Project",
        desc: "A secure build and release pipeline implementing static code analysis, unit testing, and security gates for a React.js and Node.js application stack.",
        findings: [
            "<strong>Pipeline Automation:</strong> Configured a Jenkins declarative pipeline triggered automatically upon Git commits.",
            "<strong>Security Quality Gates:</strong> Integrated SonarQube quality gates to perform static code analysis (SAST), checking for OWASP Top 10 vulnerabilities, code smells, and hardcoded secrets.",
            "<strong>Unit Testing:</strong> Integrated Jest test suites within the build phase, halting the pipeline if coverage fell below 80%.",
            "<strong>Technical Debt Mitigation:</strong> Reduced codebase technical debt by 70%, identifying duplicate code blocks and unsecure dependency trees."
        ],
        code: `// Jenkinsfile Snippet
pipeline {
    agent any
    stages {
        stage('Fetch Code') {
            steps { git 'https://github.com/Jes360/secure-app.git' }
        }
        stage('Unit Tests') {
            steps { sh 'npm install && npm run test' }
        }
        stage('SonarQube Static Analysis') {
            steps {
                withSonarQubeEnv('SonarQubeServer') {
                    sh 'sonar-scanner -Dsonar.projectKey=secure-app'
                }
            }
        }
    }
}`,
        socImpact: "Highlights DevSecOps integration, static analysis tools (SAST), vulnerability remediation, and collaboration with developers to secure the software supply chain."
    },
    "graph-api": {
        title: "Production Ready Microsoft Graph API",
        role: "Backend API Engineering & Monitoring",
        meta: "Personal / Academic Development",
        desc: "A production-grade Python web service integrating FastAPI with Microsoft Graph API using OAuth 2.0, optimized with Redis caching, Celery background tasks, and Prometheus metrics.",
        findings: [
            "<strong>OAuth 2.0 Integration:</strong> Implemented secure OAuth silent token acquisition and Client Credentials Grant Flow using Microsoft Authentication Library (MSAL).",
            "<strong>Performance Optimization:</strong> Configured Redis Cache backend to store expensive Graph API calls, significantly reducing API latency for profile retrievals.",
            "<strong>Background Worker:</strong> Utilized Celery with Redis broker to offload long-running batch synchronization tasks from the HTTP request loop.",
            "<strong>Monitoring & Metrics:</strong> Integrated Prometheus FastAPI Instrumentator, exposing standard metrics (HTTP request rates, latency distribution, error codes) for real-time observability."
        ],
        code: `# FastAPI Cache & MSAL Integration Snippet
from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend
from fastapi_cache.decorator import cache
import msal

@app.on_event("startup")
async def startup():
    redis = aioredis.from_url(os.getenv("REDIS_URL"), decode_responses=True)
    FastAPICache.init(RedisBackend(redis), prefix="prod-cache")

@app.get("/profile")
@cache(expire=60)
def get_profile():
    # Fetch from MS Graph API - Cached for 60 seconds
    return make_graph_request("https://graph.microsoft.com/v1.0/me", "profile")`,
        socImpact: "Demonstrates solid software engineering skills, API security, OAuth token lifecycle management, caching architectures, and building application performance metrics (essential for monitoring SOC dashboards)."
    }
};

// DOM Elements
const modalOverlay = document.getElementById('project-modal');
const modalTitleText = document.getElementById('modal-title-text');
const modalRoleText = document.getElementById('modal-role-text');
const modalBodyContent = document.getElementById('modal-body-content');
const modalCloseBtn = document.getElementById('modal-close-btn');
const projectCards = document.querySelectorAll('.project-card');

// Open Modal with Specific Project Data
function openModal(projectId) {
    const data = projectData[projectId];
    if (!data) return;

    modalTitleText.textContent = data.title;
    modalRoleText.textContent = data.role;

    let findingsHTML = '';
    data.findings.forEach(finding => {
        findingsHTML += `<li>${finding}</li>`;
    });

    let screenshotsHTML = '';
    if (data.screenshots && data.screenshots.length > 0) {
        screenshotsHTML += `
            <div>
                <div class="modal-section-title"><i class="fa-solid fa-images"></i> Lab Evidence & Screenshots</div>
                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin-top: 0.5rem;">
        `;
        data.screenshots.forEach(ss => {
            screenshotsHTML += `
                <div class="screenshot-item" style="background:var(--bg-darker); border:var(--border-normal); border-radius:8px; padding:0.5rem; display:flex; flex-direction:column; gap:0.5rem; transition:all var(--transition-speed);">
                    <img src="${ss.url}" style="width:100%; border-radius:4px; max-height:180px; object-fit:cover; border:1px solid rgba(255,255,255,0.05); cursor:zoom-in; transition:transform var(--transition-speed);" alt="${ss.caption}">
                    <span style="font-size:0.8rem; color:var(--text-muted); line-height:1.3;">${ss.caption}</span>
                </div>
            `;
        });
        screenshotsHTML += `
                </div>
            </div>
        `;
    }

    modalBodyContent.innerHTML = `
        <div class="modal-metadata">
            <span><strong>Course/Context:</strong> ${data.meta}</span>
        </div>
        <div>
            <div class="modal-section-title"><i class="fa-solid fa-file-invoice"></i> Executive Summary</div>
            <p>${data.desc}</p>
        </div>
        <div>
            <div class="modal-section-title"><i class="fa-solid fa-list-check"></i> Key Laboratory Findings & Actions</div>
            <ul class="modal-bullet-list">${findingsHTML}</ul>
        </div>
        <div>
            <div class="modal-section-title"><i class="fa-solid fa-terminal"></i> Technical Command / Code Reference</div>
            <pre class="modal-code-block"><code>${data.code}</code></pre>
        </div>
        ${screenshotsHTML}
        <div style="background: rgba(88, 166, 255, 0.05); border-left: 4px solid var(--cyber-blue); padding: 1rem; border-radius: 4px; margin-top: 1rem;">
            <div class="modal-section-title" style="border-bottom:none; color: var(--cyber-blue); margin-bottom: 0.25rem;"><i class="fa-solid fa-shield-halved"></i> SOC Analyst Impact</div>
            <p style="margin-bottom:0; font-size: 0.95rem;">${data.socImpact}</p>
        </div>
    `;

    // Make images zoomable on click
    const modalImages = modalBodyContent.querySelectorAll('.screenshot-item img');
    modalImages.forEach(img => {
        img.addEventListener('click', function() {
            if (this.style.maxHeight === 'none') {
                this.style.maxHeight = '180px';
                this.style.objectFit = 'cover';
            } else {
                this.style.maxHeight = 'none';
                this.style.objectFit = 'contain';
            }
        });
    });

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Disable background scroll
}

// Close Modal
function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = ''; // Re-enable scroll
}

// Event Listeners for Project Cards
projectCards.forEach(card => {
    card.addEventListener('click', () => {
        const projectId = card.getAttribute('data-project');
        openModal(projectId);
    });
});

modalCloseBtn.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
});

// Interactive CLI Terminal Emulator
const terminalBody = document.getElementById('terminal-body');
const terminalInput = document.getElementById('terminal-input');

const terminalCommands = {
    help: "Available commands:<br>- <strong>about</strong>: Professional summary of Jestine Jojo.<br>- <strong>skills</strong>: Summary of technical tools, languages, and platforms.<br>- <strong>projects</strong>: View a list of technical labs and projects.<br>- <strong>contact</strong>: Access email, phone, and social links.<br>- <strong>whoami</strong>: Displays current user session context.<br>- <strong>clear</strong>: Clears the terminal history.<br>- <strong>exit</strong>: Exits the terminal simulation.",
    about: "Jestine Jojo is a Graduate Cybersecurity Professional with a Bachelor of Cyber Security from Deakin University (Melbourne). Specialize in memory forensics, threat hunting, network traffic analysis, and security automation. Received the Community Impact Award during a website developer internship.",
    skills: "<strong>Security Tools:</strong> Volatility 3, Wireshark, tcpdump, tshark, aircrack-ng, Nmap, Autopsy, Metasploit, Nikto, OWASP ZAP<br><strong>Languages:</strong> Python, Bash, SQL, Java (Spring), JavaScript (React, Vue), HTML5/CSS3<br><strong>Platforms:</strong> Linux (Debian/Ubuntu), Windows, Git/GitHub, Jenkins CI/CD, Redis, Prometheus",
    projects: "Highlighted Projects:<br>1. <strong>volatility</strong>: Memory forensics & process injection identification.<br>2. <strong>wifi</strong>: WiFi pcap decryption & network forensics.<br>3. <strong>appattack</strong>: Automated security testing toolkit in Python/Bash.<br>4. <strong>sdn</strong>: Mininet network topology creation & DoS simulation.<br>5. <strong>pipeline</strong>: Jenkins declarative CI/CD security gate pipeline.<br>6. <strong>graph-api</strong>: FastAPI + Microsoft Graph OAuth caching service.<br><em>Type 'open [project_name]' (e.g., 'open volatility') to launch the visual writeup modal.</em>",
    contact: "Contact Information:<br>- Email: jestinejojo@gmail.com<br>- LinkedIn: linkedin.com/in/jestine-jojo<br>- GitHub: github.com/Jes360",
    whoami: "guest_session_ref_1002@jestine-portfolio.sh (Role: SOC Candidate, Source: Localhost)",
    exit: "Goodbye! Terminal simulation ended. (Feel free to refresh if you want to play again!)"
};

if (terminalInput) {
    terminalInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const rawInput = this.value.trim();
            const input = rawInput.toLowerCase();
            this.value = '';

            // 1. Create a line echoing the command
            const echoLine = document.createElement('div');
            echoLine.className = 'terminal-line';
            echoLine.innerHTML = `<span class="terminal-prompt">[guest@jestine-portfolio ~]$</span> <span style="color:#ffffff">${rawInput}</span>`;
            
            // Insert before the input line template
            const inputLineTemplate = document.getElementById('input-line-template');
            terminalBody.insertBefore(echoLine, inputLineTemplate);

            // 2. Process command and create output line
            let responseText = '';
            
            if (input === 'clear') {
                // Clear all terminal lines except welcome and input line
                const lines = terminalBody.querySelectorAll('.terminal-line');
                lines.forEach(line => line.remove());
                return;
            } else if (input === 'exit') {
                responseText = terminalCommands.exit;
                terminalInput.disabled = true;
                inputLineTemplate.style.display = 'none';
            } else if (input.startsWith('open ')) {
                const projId = input.substring(5).trim();
                if (projectData[projId]) {
                    responseText = `Launching modal writeup for project: <strong>${projId}</strong>...`;
                    openModal(projId);
                } else {
                    responseText = `Project '${projId}' not found. Type 'projects' to see available IDs.`;
                }
            } else if (terminalCommands[input]) {
                responseText = terminalCommands[input];
            } else if (input !== '') {
                responseText = `bash: command not found: ${rawInput}. Type 'help' to see list of valid commands.`;
            }

            if (responseText) {
                const responseLine = document.createElement('div');
                responseLine.className = 'terminal-line terminal-output';
                responseLine.innerHTML = responseText;
                terminalBody.insertBefore(responseLine, inputLineTemplate);
            }

            // Scroll terminal to bottom
            terminalBody.scrollTop = terminalBody.scrollHeight;
        }
    });

    // Make clicking the terminal container focus the input field
    document.querySelector('.terminal-container').addEventListener('click', () => {
        if (!terminalInput.disabled) {
            terminalInput.focus();
        }
    });
}

// Active Nav Highlighting on Scroll
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('#nav-menu a');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - 150)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});
