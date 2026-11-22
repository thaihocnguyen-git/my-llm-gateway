---
title: "[US-5.1] Tailscale Node Configuration & Access Control (ACL/Grants)"
milestone: "M4: Private Remote Access"
labels: ["milestone-4", "networking", "tailscale"]
---

# [US-5.1] Tailscale Node Configuration & Access Control (ACL/Grants)

## User Story Statement
- **Role:** As a Network / Security Engineer
- **Goal:** I want to connect the Windows host to a private Tailscale network and enforce strict ACLs
- **Benefit:** So that only authorized personal devices can route traffic to the host without any public internet exposure.

#### Technical Scope & Context
Tailscale provides zero-trust mesh networking. The Windows host `DESKTOP-E9DFIES` joins the user's tailnet. In the Tailscale admin console, configure Tailscale Grants / ACLs so that only tagged personal devices can connect to the host on the HTTPS port.

#### Detailed Tasks
1. Verify Tailscale installation on Windows host and join the target tailnet (`tailscale up`).
2. Record the MagicDNS hostname (e.g. `desktop-e9dfies.<tailnet>.ts.net`).
3. Define Tailscale ACL policy in Tailscale admin console:
   - Restrict inbound traffic to the gateway node to authorized personal user devices only.
   - Deny all public access.
4. Verify tailnet connectivity using `tailscale status` and `tailscale ping`.

#### Acceptance Criteria
- **Scenario 1: Tailnet Connectivity**
  - **Given** Tailscale active on the host
  - **When** running `tailscale status`
  - **Then** the node is shown connected with a valid Tailscale IP and MagicDNS name.
- **Scenario 2: Access Restriction to Authorized Devices**
  - **Given** Tailscale ACL policy applied
  - **When** an unauthorized device or external network attempts to route to the node
  - **Then** network packets are dropped at the Tailscale wireguard layer.

#### Definition of Done
- Tailscale active, MagicDNS resolved, ACL policy documented and enforced.

---

---
*Generated from [tasks-breakdown-user-stories.md](tasks-breakdown-user-stories.md)*
