---
title: "[US-5.2] Tailscale Serve Private HTTPS Ingress Setup"
milestone: "M4: Private Remote Access"
labels: ["milestone-4", "networking", "tailscale"]
---

# [US-5.2] Tailscale Serve Private HTTPS Ingress Setup

## User Story Statement
- **Role:** As a Systems Administrator
- **Goal:** I want to configure Tailscale Serve to provide private HTTPS termination and reverse-proxy to `127.0.0.1:4000`
- **Benefit:** So that remote clients have automatic valid TLS certificates on the tailnet without manual certificate renewal or public DNS exposure.

#### Technical Scope & Context
Tailscale Serve automatically provisions Let's Encrypt certificates for the MagicDNS domain inside the private tailnet. It terminates TLS on port 443 and forwards requests to LiteLLM at `http://127.0.0.1:4000`.

#### Detailed Tasks
1. Enable Tailscale HTTPS feature in Tailscale admin console if not already enabled.
2. Execute command: `tailscale serve --bg https / http://127.0.0.1:4000` (or `tailscale serve --bg 443 127.0.0.1:4000`).
3. Validate configuration with `tailscale serve status`.
4. Test HTTPS connection from an authorized remote device: `curl -k https://<device>.<tailnet>.ts.net/health`.
5. Script the setup command into `scripts/windows/setup-tailscale-serve.ps1`.

#### Acceptance Criteria
- **Scenario 1: Valid HTTPS Termination on Tailnet**
  - **Given** Tailscale Serve running on the gateway host
  - **When** an authorized device on the tailnet performs `GET https://<device>.<tailnet>.ts.net/health`
  - **Then** the TLS handshake succeeds with a valid Tailscale certificate and returns HTTP 200.
- **Scenario 2: Remote OpenAI Request over Tailscale HTTPS**
  - **Given** client running on an authorized remote laptop on the tailnet
  - **When** sending POST to `https://<device>.<tailnet>.ts.net/v1/chat/completions` with valid virtual key
  - **Then** the request is forwarded to LiteLLM, executed on Ollama, and returned cleanly over HTTPS.

#### Definition of Done
- Tailscale Serve active in background, valid TLS verified from remote tailnet client.

---

---
*Generated from [tasks-breakdown-user-stories.md](tasks-breakdown-user-stories.md)*
