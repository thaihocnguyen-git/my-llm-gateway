---
title: "[Epic] M4: Private Remote Access via Tailscale"
milestone: "M4: Private Remote Access"
labels: ["epic", "milestone-4", "networking"]
---

# [Epic] M4: Private Remote Access via Tailscale

## Epic Overview
Implement Milestone 4 (M4): Configure Tailscale VPN mesh network and Tailscale Serve HTTPS termination to allow secure remote access from authorized devices without opening public router ports.

### Included Stories
- [ ] #US-5.1: Tailscale Node Configuration & Access Control (ACL/Grants)
- [ ] #US-5.2: Tailscale Serve Private HTTPS Ingress Setup
- [ ] #US-5.3: Network Exposure Audit & Port Lockdown Verification

### Milestone Acceptance Criteria
- [ ] Authorized tailnet devices can reach gateway via `https://<device>.<tailnet>.ts.net/v1`
- [ ] Non-tailnet and direct LAN access to raw ports (11434, 5432, 4000) are blocked
