---
title: "[Epic] M3: Identity, Authorization & Gateway Security Hardening"
milestone: "M3: Auth & Security Hardening"
labels: ["epic", "milestone-3", "security"]
---

# [Epic] M3: Identity, Authorization & Gateway Security Hardening

## Epic Overview
Implement Milestone 3 (M3): Enforce multi-tier security, separate administrative credentials from client credentials, generate virtual keys, and enforce model allowlists and rate limits.

### Included Stories
- [ ] #US-4.1: Master Key & Administrative Credential Isolation
- [ ] #US-4.2: Client Virtual API Key Lifecycle Management
- [ ] #US-4.3: Per-Key Model Access Control, Rate Limiting & Concurrency Controls
- [ ] #US-4.4: Security Hardening, Payload Limits & Sensitive Data Redaction

### Milestone Acceptance Criteria
- [ ] Unauthorized requests rejected with HTTP 401
- [ ] Client keys restricted from administrative endpoints
- [ ] Model restrictions and rate limits enforced
