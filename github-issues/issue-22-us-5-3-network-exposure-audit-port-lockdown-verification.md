---
title: "[US-5.3] Network Exposure Audit & Port Lockdown Verification"
milestone: "M4: Private Remote Access"
labels: ["milestone-4", "networking", "tailscale"]
---

# [US-5.3] Network Exposure Audit & Port Lockdown Verification

## User Story Statement
- **Role:** As a Security Auditor
- **Goal:** I want to perform a comprehensive port and firewall audit to ensure raw ports (11434, 5432, 9090, 4000) are strictly inaccessible from LAN and WAN
- **Benefit:** So that no attacker on the local Wi-Fi/LAN or internet can bypass authentication or query inference directly.

#### Technical Scope & Context
Audit all listening ports using Windows PowerShell / netstat / nmap. Verify:
- Port 11434 (Ollama): `127.0.0.1` ONLY.
- Port 5432 (Postgres): `127.0.0.1` / Docker internal ONLY.
- Port 4000 (LiteLLM): `127.0.0.1` ONLY.
- Port 9090 (Prometheus): `127.0.0.1` ONLY.
- Port 3000 (Grafana): `127.0.0.1` ONLY.
- Router: No port forwarding configured. Tailscale Funnel is DISABLED.

#### Detailed Tasks
1. Create `tests/audit-network-exposure.ps1`.
2. Probe all sensitive ports from a separate machine on the same local LAN (Wi-Fi/Ethernet).
3. Validate that Windows Firewall drops or rejects inbound connections to non-Tailscale ports.
4. Verify `tailscale funnel status` confirms Funnel is inactive.

#### Acceptance Criteria
- **Scenario 1: LAN Direct Access Attempt to Ollama**
  - **Given** another computer on the local home LAN (e.g. `192.168.1.x`)
  - **When** attempting `curl http://<host-lan-ip>:11434/api/tags`
  - **Then** the connection fails (Connection refused / timed out).
- **Scenario 2: LAN Direct Access Attempt to LiteLLM**
  - **Given** another computer on the local home LAN
  - **When** attempting `curl http://<host-lan-ip>:4000/health`
  - **Then** the connection fails (Connection refused / timed out).

#### Definition of Done
- Port audit completed and documented; zero exposed service ports on LAN/WAN.

---

## Epic 6 (M5): Client Integration & Upstream Robustness

---
*Generated from [tasks-breakdown-user-stories.md](tasks-breakdown-user-stories.md)*
