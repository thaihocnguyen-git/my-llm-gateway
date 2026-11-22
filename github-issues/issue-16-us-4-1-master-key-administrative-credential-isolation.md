---
title: "[US-4.1] Master Key & Administrative Credential Isolation"
milestone: "M3: Auth & Security Hardening"
labels: ["milestone-3", "security", "auth"]
---

# [US-4.1] Master Key & Administrative Credential Isolation

## User Story Statement
- **Role:** As a Security Engineer
- **Goal:** I want to generate cryptographically strong master and salt keys and protect administrative endpoints
- **Benefit:** So that only authorized administration scripts can manage keys, while ordinary clients cannot access management APIs.

#### Technical Scope & Context
Generate secure random strings for `LITELLM_MASTER_KEY` (e.g. `sk-admin-...`) and `LITELLM_SALT_KEY` using crypto random generation (32+ bytes). Ensure administrative operations (`/key/generate`, `/key/delete`, `/model/new`) require the master key.

#### Detailed Tasks
1. Create a PowerShell key generation script `scripts/windows/generate-secrets.ps1` utilizing `[System.Security.Cryptography.RandomNumberGenerator]`.
2. Populate `.env` with generated `LITELLM_MASTER_KEY` and `LITELLM_SALT_KEY`.
3. Verify that requests without the master key to `/key/generate` are rejected with HTTP 401 or 403.

#### Acceptance Criteria
- **Scenario 1: Administrative Endpoint Protection**
  - **Given** an unauthenticated client or a client using a standard virtual key
  - **When** calling `POST /key/generate`
  - **Then** the request is rejected with HTTP 401 Unauthorized or HTTP 403 Forbidden.
- **Scenario 2: Valid Master Key Operation**
  - **Given** the master key supplied as Bearer token
  - **When** calling `POST /key/generate`
  - **Then** the key generation operation succeeds.

#### Definition of Done
- Master key generated, saved to `.env`, and verified to restrict administrative endpoints.

---

---
*Generated from [tasks-breakdown-user-stories.md](tasks-breakdown-user-stories.md)*
