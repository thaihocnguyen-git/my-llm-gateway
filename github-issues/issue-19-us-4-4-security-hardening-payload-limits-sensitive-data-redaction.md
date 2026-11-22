---
title: "[US-4.4] Security Hardening, Payload Limits & Sensitive Data Redaction"
milestone: "M3: Auth & Security Hardening"
labels: ["milestone-3", "security", "auth"]
---

# [US-4.4] Security Hardening, Payload Limits & Sensitive Data Redaction

## User Story Statement
- **Role:** As a Security Engineer
- **Goal:** I want to sanitize logs, set request timeouts and payload size limits, and redact credentials
- **Benefit:** So that sensitive prompts or API keys are never exposed in log files, and malformed large payloads cannot crash the service.

#### Technical Scope & Context
LiteLLM configuration must enforce:
- Request timeout: 300s (5 minutes).
- Max payload body size: e.g. 10MB.
- Log sanitization: redact `Authorization` headers.
- Disable logging full prompts in production log files by default (`litellm_settings.drop_params: true` or custom logging redaction).

#### Detailed Tasks
1. Update `config/litellm/config.yaml` with timeouts, request body size limits, and logging levels.
2. Verify that log files written to disk or terminal output do not print raw `sk-...` keys in plaintext.
3. Test oversized payload rejection (HTTP 413).

#### Acceptance Criteria
- **Scenario 1: Credential Redaction in Logs**
  - **Given** incoming requests containing `Authorization: Bearer sk-...`
  - **When** checking LiteLLM log outputs
  - **Then** the raw secret is redacted or masked, never logged in cleartext.
- **Scenario 2: Request Timeout Enforcement**
  - **Given** a downstream inference request hanging longer than configured timeout
  - **When** the timeout threshold is breached
  - **Then** the gateway aborts the connection and returns HTTP 504 Gateway Timeout.

#### Definition of Done
- Security settings in `config.yaml` active; credentials redacted from logs; payload limits tested.

---

## Epic 5 (M4): Private Remote Access via Tailscale

---
*Generated from [tasks-breakdown-user-stories.md](tasks-breakdown-user-stories.md)*
