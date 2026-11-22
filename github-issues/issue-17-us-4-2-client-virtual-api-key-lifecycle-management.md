---
title: "[US-4.2] Client Virtual API Key Lifecycle Management"
milestone: "M3: Auth & Security Hardening"
labels: ["milestone-3", "security", "auth"]
---

# [US-4.2] Client Virtual API Key Lifecycle Management

## User Story Statement
- **Role:** As an API Administrator
- **Goal:** I want to generate and manage dedicated virtual keys for distinct clients (`personal-dev`, `coding-agent`, `mobile-client`)
- **Benefit:** So that individual clients have isolated credentials that can be revoked or rotated independently without affecting others.

#### Technical Scope & Context
LiteLLM provides key management endpoints (`/key/generate`, `/key/info`, `/key/delete`). Implement a management script `scripts/windows/manage-keys.ps1` supporting actions: create, list, inspect, and revoke.

#### Detailed Tasks
1. Build `scripts/windows/manage-keys.ps1` wrapping the LiteLLM key management REST API.
2. Generate virtual keys for defined clients:
   - `personal-dev`
   - `coding-agent`
   - `mobile-client`
3. Store key metadata (alias, creation date, expiry date: 90 days).
4. Verify key revocation functionality.

#### Acceptance Criteria
- **Scenario 1: Virtual Key Creation**
  - **Given** the master key
  - **When** generating a virtual key with alias `personal-dev` and duration `90d`
  - **Then** a virtual key starting with `sk-` is created and stored in PostgreSQL with appropriate expiry.
- **Scenario 2: Revoked Key Rejection**
  - **Given** a previously valid virtual key that has been deleted or revoked
  - **When** sending a chat completion request with that key
  - **Then** the gateway immediately rejects the request with HTTP 401 Unauthorized.

#### Definition of Done
- Script `scripts/windows/manage-keys.ps1` functional; creation and revocation verified.

---

---
*Generated from [tasks-breakdown-user-stories.md](tasks-breakdown-user-stories.md)*
