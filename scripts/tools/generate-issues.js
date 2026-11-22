const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, 'tasks-breakdown-user-stories.md');
const content = fs.readFileSync(sourcePath, 'utf8');

const epics = [
  {
    title: "[Epic] M1: Local Inference Engine Setup & Benchmarking",
    milestone: "M1: Local Inference Engine",
    labels: ["epic", "milestone-1", "performance"],
    body: `## Epic Overview
Implement Milestone 1 (M1) from [local-llm-gateway-design-latest.md](local-llm-gateway-design-latest.md): Install and validate local inference runtime (Ollama) with full NVIDIA GPU offload on Windows host \`DESKTOP-E9DFIES\`.

### Included Stories
- [ ] #US-2.1: Ollama Installation & Windows Service Lifecycle
- [ ] #US-2.2: Initial Model Download & Tag Verification (\`qwen2.5:7b\`, \`qwen2.5-coder:7b\`)
- [ ] #US-2.3: GPU Acceleration, Memory Footprint & Latency Benchmarking

### Milestone Acceptance Criteria
- [ ] Ollama successfully serves local requests on \`127.0.0.1:11434\`
- [ ] GPU acceleration confirmed (100% layer offload to RTX 3060 12GB)
- [ ] Baseline general and coding models benchmarked for TTFT and TPS`
  },
  {
    title: "[Epic] M2: Gateway Deployment & Core Routing Engine",
    milestone: "M2: Gateway Deployment",
    labels: ["epic", "milestone-2", "gateway"],
    body: `## Epic Overview
Implement Milestone 2 (M2): Deploy PostgreSQL in Docker and LiteLLM Proxy natively on Windows to provide model routing, logical abstraction, and OpenAI-compatible API endpoints.

### Included Stories
- [ ] #US-3.1: PostgreSQL Persistent Database Deployment via Docker Compose
- [ ] #US-3.2: LiteLLM Proxy Native Windows Installation & Environment Setup
- [ ] #US-3.3: Model Mapping, Abstraction & Provider Configuration
- [ ] #US-3.4: OpenAI API Compatibility & Server-Sent Events (SSE) Streaming

### Milestone Acceptance Criteria
- [ ] OpenAI SDK communicates with local models through LiteLLM
- [ ] Logical model aliases (\`general\`, \`coding\`) resolve to Ollama models
- [ ] Token-by-token streaming works end-to-end`
  },
  {
    title: "[Epic] M3: Identity, Authorization & Gateway Security Hardening",
    milestone: "M3: Auth & Security Hardening",
    labels: ["epic", "milestone-3", "security"],
    body: `## Epic Overview
Implement Milestone 3 (M3): Enforce multi-tier security, separate administrative credentials from client credentials, generate virtual keys, and enforce model allowlists and rate limits.

### Included Stories
- [ ] #US-4.1: Master Key & Administrative Credential Isolation
- [ ] #US-4.2: Client Virtual API Key Lifecycle Management
- [ ] #US-4.3: Per-Key Model Access Control, Rate Limiting & Concurrency Controls
- [ ] #US-4.4: Security Hardening, Payload Limits & Sensitive Data Redaction

### Milestone Acceptance Criteria
- [ ] Unauthorized requests rejected with HTTP 401
- [ ] Client keys restricted from administrative endpoints
- [ ] Model restrictions and rate limits enforced`
  },
  {
    title: "[Epic] M4: Private Remote Access via Tailscale",
    milestone: "M4: Private Remote Access",
    labels: ["epic", "milestone-4", "networking"],
    body: `## Epic Overview
Implement Milestone 4 (M4): Configure Tailscale VPN mesh network and Tailscale Serve HTTPS termination to allow secure remote access from authorized devices without opening public router ports.

### Included Stories
- [ ] #US-5.1: Tailscale Node Configuration & Access Control (ACL/Grants)
- [ ] #US-5.2: Tailscale Serve Private HTTPS Ingress Setup
- [ ] #US-5.3: Network Exposure Audit & Port Lockdown Verification

### Milestone Acceptance Criteria
- [ ] Authorized tailnet devices can reach gateway via \`https://<device>.<tailnet>.ts.net/v1\`
- [ ] Non-tailnet and direct LAN access to raw ports (11434, 5432, 4000) are blocked`
  },
  {
    title: "[Epic] M5: Client Integration & Upstream Robustness",
    milestone: "M5: Client Compatibility",
    labels: ["epic", "milestone-5", "client-testing"],
    body: `## Epic Overview
Implement Milestone 5 (M5): Validate client integrations (OpenAI SDK, Continue, Cline, Copilot CLI), verify tool-calling / structured JSON outputs, and harden upstream failure recovery.

### Included Stories
- [ ] #US-6.1: OpenAI Python SDK & Standard Client Verification
- [ ] #US-6.2: IDE AI Assistant Integrations (Continue & Cline)
- [ ] #US-6.3: GitHub Copilot Integration & Capability Assessment
- [ ] #US-6.4: Advanced Capabilities Verification (Tool Calling & JSON Mode)
- [ ] #US-6.5: Fault Injection, Timeout Handling & Error Propagation

### Milestone Acceptance Criteria
- [ ] Clients operate without custom inference code
- [ ] Tool calling and JSON mode verified on target models
- [ ] Upstream failures produce controlled HTTP error codes`
  },
  {
    title: "[Epic] M6: Observability, Telemetry & Operational Lifecycle",
    milestone: "M6: Monitoring & Ops Hardening",
    labels: ["epic", "milestone-6", "monitoring"],
    body: `## Epic Overview
Implement Milestone 6 (M6): Deploy Prometheus & Grafana in Docker, configure host & GPU telemetry, set up automated Windows boot recovery, and configure database backups.

### Included Stories
- [ ] #US-7.1: Prometheus Monitoring Stack & LiteLLM Metrics Scraping
- [ ] #US-7.2: Windows Host & NVIDIA GPU Telemetry Exporters
- [ ] #US-7.3: Grafana Operational Dashboard & Alerting Rules
- [ ] #US-7.4: Automated System Boot Lifecycle & Process Supervision
- [ ] #US-7.5: PostgreSQL Database Backup & Disaster Recovery Automation

### Milestone Acceptance Criteria
- [ ] Dashboard visualizes API traffic, GPU VRAM/temperature, host metrics, and latency
- [ ] Alerts trigger on service failure
- [ ] Automated recovery verified after host restart`
  }
];

// Parse User Stories from markdown
const storySections = content.split(/### (US-\d+\.\d+:[^\n]+)/g);
const stories = [];

for (let i = 1; i < storySections.length; i += 2) {
  const header = storySections[i].trim();
  const bodyText = storySections[i + 1].trim();
  
  const idMatch = header.match(/(US-\d+\.\d+)/);
  const storyId = idMatch ? idMatch[1] : "";
  const title = `[${storyId}] ${header.replace(/^US-\d+\.\d+:\s*/, '')}`;
  
  let labels = [];
  let milestone = null;
  
  if (storyId.startsWith('US-1.')) {
    labels = ['setup', 'devops'];
  } else if (storyId.startsWith('US-2.')) {
    labels = ['milestone-1', 'performance', 'ollama'];
    milestone = "M1: Local Inference Engine";
  } else if (storyId.startsWith('US-3.')) {
    labels = ['milestone-2', 'gateway', 'litellm'];
    milestone = "M2: Gateway Deployment";
  } else if (storyId.startsWith('US-4.')) {
    labels = ['milestone-3', 'security', 'auth'];
    milestone = "M3: Auth & Security Hardening";
  } else if (storyId.startsWith('US-5.')) {
    labels = ['milestone-4', 'networking', 'tailscale'];
    milestone = "M4: Private Remote Access";
  } else if (storyId.startsWith('US-6.')) {
    labels = ['milestone-5', 'client-testing'];
    milestone = "M5: Client Compatibility";
  } else if (storyId.startsWith('US-7.')) {
    labels = ['milestone-6', 'monitoring', 'automation'];
    milestone = "M6: Monitoring & Ops Hardening";
  } else if (storyId.startsWith('US-8.')) {
    labels = ['qa', 'migration'];
  }
  
  const body = `## User Story Statement
${bodyText}

---
*Generated from [tasks-breakdown-user-stories.md](tasks-breakdown-user-stories.md)*`;

  stories.push({
    title,
    milestone,
    labels,
    body
  });
}

const allIssues = [...epics, ...stories];
fs.writeFileSync(path.join(__dirname, 'github-issues-data.json'), JSON.stringify(allIssues, null, 2), 'utf8');

// Write individual markdown issues in github-issues/
const issuesDir = path.join(__dirname, 'github-issues');
if (!fs.existsSync(issuesDir)) fs.mkdirSync(issuesDir, { recursive: true });

let catalog = `# GitHub Issues Catalog — Local LLM Gateway

**Total Issues:** ${allIssues.length} (6 Milestone Epics + 28 User Stories)  
**Target Repository:** [\`thaihocnguyen-git/my-llm-gateway\`](https://github.com/thaihocnguyen-git/my-llm-gateway)  
**Automated Deployer Script:** [\`scripts/windows/create-github-issues.ps1\`](file:///D:/Sources/my-llm-gateway/scripts/windows/create-github-issues.ps1)

---

## How to Publish These Issues to GitHub

You can publish all 34 issues, labels, and milestones automatically using PowerShell:

\`\`\`powershell
# Set your Personal Access Token (requires 'repo' scope)
$env:GITHUB_TOKEN = "ghp_yourPersonalAccessTokenHere"

# Run the automated issue creator
.\\scripts\\windows\\create-github-issues.ps1
\`\`\`

---

## Issue Master Table

| # | Issue Title | Milestone | Labels | Local Markdown File |
|---|---|---|---|---|
`;

allIssues.forEach((issue, idx) => {
  const num = (idx + 1).toString().padStart(2, "0");
  const slug = issue.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const fileName = `issue-${num}-${slug}.md`;
  const filePath = path.join(issuesDir, fileName);
  
  const mdContent = `---
title: "${issue.title.replace(/"/g, '\\"')}"
milestone: "${issue.milestone || ''}"
labels: [${issue.labels.map(l => `"${l}"`).join(', ')}]
---

# ${issue.title}

${issue.body}
`;
  fs.writeFileSync(filePath, mdContent, 'utf8');
  catalog += `| ${num} | **${issue.title}** | ${issue.milestone || '*(None)*'} | \`${issue.labels.join('`, `')}\` | [${fileName}](file:///D:/Sources/my-llm-gateway/github-issues/${fileName}) |\n`;
});

fs.writeFileSync(path.join(__dirname, 'github-issues-catalog.md'), catalog, 'utf8');
console.log(`Successfully generated:`);
console.log(`- github-issues-data.json (${allIssues.length} issues)`);
console.log(`- github-issues/ directory with ${allIssues.length} markdown issue files`);
console.log(`- github-issues-catalog.md`);
