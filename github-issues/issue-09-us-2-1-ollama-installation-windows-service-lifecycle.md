---
title: "[US-2.1] Ollama Installation & Windows Service Lifecycle"
milestone: "M1: Local Inference Engine"
labels: ["milestone-1", "performance", "ollama"]
---

# [US-2.1] Ollama Installation & Windows Service Lifecycle

## User Story Statement
- **Role:** As an AI Platform Engineer
- **Goal:** I want to install and configure Ollama natively on Windows bound exclusively to localhost (`127.0.0.1:11434`)
- **Benefit:** So that local LLM models can run with low overhead and full GPU acceleration without exposing the raw inference daemon to the network.

#### Technical Scope & Context
Ollama must run as a native Windows process. By default, Ollama binds to `127.0.0.1:11434`. Explicitly ensure `OLLAMA_HOST` is `127.0.0.1:11434` or left default (loopback only). Verify model storage directory path (`OLLAMA_MODELS`) is configured on a drive with sufficient storage (e.g. `D:\OllamaModels` or default `%USERPROFILE%\.ollama\models`).

#### Detailed Tasks
1. Download and install official Ollama for Windows.
2. Verify Ollama executable location and ensure it is accessible in PATH (`ollama --version`).
3. Configure environment variable `OLLAMA_MODELS` if model storage needs to be designated to a dedicated partition.
4. Verify port binding using `netstat -ano | findstr 11434` or `Get-NetTCPConnection -LocalPort 11434` to guarantee binding is loopback only (`127.0.0.1`), not `0.0.0.0`.
5. Create PowerShell lifecycle helper functions in `scripts/windows/start.ps1` and `scripts/windows/stop.ps1` to start/stop Ollama.

#### Acceptance Criteria
- **Scenario 1: Ollama Service Loopback Binding**
  - **Given** Ollama is running on the host
  - **When** inspecting local listeners on port 11434
  - **Then** the local address is `127.0.0.1:11434` (or `[::1]:11434`) and NOT `0.0.0.0:11434`.
- **Scenario 2: Ollama Local API Availability**
  - **Given** Ollama daemon is active
  - **When** sending `Invoke-RestMethod http://127.0.0.1:11434/api/tags`
  - **Then** HTTP 200 is returned with a JSON object containing the `models` array.

#### Definition of Done
- Ollama runs natively, bound to loopback only.
- Basic API responds on port 11434.

---

---
*Generated from [tasks-breakdown-user-stories.md](tasks-breakdown-user-stories.md)*
