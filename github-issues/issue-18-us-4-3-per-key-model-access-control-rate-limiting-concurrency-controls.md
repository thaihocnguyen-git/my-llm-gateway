---
title: "[US-4.3] Per-Key Model Access Control, Rate Limiting & Concurrency Controls"
milestone: "M3: Auth & Security Hardening"
labels: ["milestone-3", "security", "auth"]
---

# [US-4.3] Per-Key Model Access Control, Rate Limiting & Concurrency Controls

## User Story Statement
- **Role:** As a Systems Administrator
- **Goal:** I want to enforce per-key model permissions, rate limits (RPM), and global/per-key concurrency limits
- **Benefit:** So that clients cannot access unauthorized models, flood the GPU, or cause OOM crashes.

#### Technical Scope & Context
In LiteLLM, assign `models` allowlists to each key:
- `coding-agent`: allowed `["coding"]` only.
- `mobile-client`: allowed `["general"]` only.
- `personal-dev`: allowed `["general", "coding"]`.
Configure operational limits:
- Max concurrency: 1–2 requests globally or per key.
- RPM: 10 requests per minute per key.
- Max tokens: 2048 generated tokens.

#### Detailed Tasks
1. Configure model allowlists during virtual key creation in `scripts/windows/manage-keys.ps1`.
2. Configure rate limits (RPM/TPM) and max concurrency in `config/litellm/config.yaml` or key generation payload.
3. Create automated test `tests/test-auth.ps1` testing:
   - Request with unauthorized model name.
   - Request exceeding rate limits or concurrency.

#### Acceptance Criteria
- **Scenario 1: Model Permission Enforcement**
  - **Given** virtual key for `coding-agent` (allowed: `["coding"]`)
  - **When** attempting a completion request with `"model": "general"`
  - **Then** LiteLLM rejects the request with HTTP 403 Forbidden or model access error.
- **Scenario 2: Concurrency & Rate Limit Throttling**
  - **Given** rate limit of 10 RPM
  - **When** client sends 15 rapid requests in 10 seconds
  - **Then** requests exceeding the limit receive HTTP 429 Too Many Requests.

#### Definition of Done
- Model allowlists and rate limits enforced and verified with automated tests.

---

---
*Generated from [tasks-breakdown-user-stories.md](tasks-breakdown-user-stories.md)*
