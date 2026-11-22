---
title: "[US-3.2] LiteLLM Proxy Native Windows Installation & Environment Setup"
milestone: "M2: Gateway Deployment"
labels: ["milestone-2", "gateway", "litellm"]
---

# [US-3.2] LiteLLM Proxy Native Windows Installation & Environment Setup

## User Story Statement
- **Role:** As a Backend Engineer
- **Goal:** I want to install and configure LiteLLM Proxy natively on Windows using Python
- **Benefit:** So that LiteLLM can connect seamlessly to both local Ollama (`127.0.0.1:11434`) and local PostgreSQL (`127.0.0.1:5432`) without complex container-to-host bridge networking.

#### Technical Scope & Context
Per ADR §6, running LiteLLM natively on Windows avoids exposing Ollama on external interfaces. Install LiteLLM Proxy via a dedicated Python virtual environment (`.venv`) with pinned version (e.g. `litellm[proxy]~=1.40`). The proxy runs on `127.0.0.1:4000`.

#### Detailed Tasks
1. Create a Python virtual environment: `python -m venv .venv`.
2. Pin LiteLLM and proxy dependencies in `requirements.txt` (e.g., `litellm[proxy]>=1.40.0`, `psycopg2-binary`, `uvicorn`).
3. Install dependencies inside `.venv`.
4. Create `scripts/windows/run-litellm.ps1` to activate `.venv` and run `litellm --config config/litellm/config.yaml --port 4000 --host 127.0.0.1`.
5. Test startup and verify health endpoint `http://127.0.0.1:4000/health`.

#### Acceptance Criteria
- **Scenario 1: LiteLLM Localhost Listener**
  - **Given** LiteLLM Proxy is launched
  - **When** inspecting active sockets on port 4000
  - **Then** it listens strictly on `127.0.0.1:4000`.
- **Scenario 2: Gateway Health Probe**
  - **Given** LiteLLM Proxy is running
  - **When** sending `GET http://127.0.0.1:4000/health`
  - **Then** returns HTTP 200 OK.

#### Definition of Done
- LiteLLM installed in dedicated virtualenv, runnable via script, bound to loopback port 4000.

---

---
*Generated from [tasks-breakdown-user-stories.md](tasks-breakdown-user-stories.md)*
