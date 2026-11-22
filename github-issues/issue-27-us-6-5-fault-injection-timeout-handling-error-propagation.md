---
title: "[US-6.5] Fault Injection, Timeout Handling & Error Propagation"
milestone: "M5: Client Compatibility"
labels: ["milestone-5", "client-testing"]
---

# [US-6.5] Fault Injection, Timeout Handling & Error Propagation

## User Story Statement
- **Role:** As a Reliability Engineer
- **Goal:** I want to test gateway behavior under upstream failure conditions (Ollama stopped, PostgreSQL down, GPU OOM)
- **Benefit:** So that client applications receive clean HTTP error codes (502, 503, 504) rather than hung sockets or raw stack traces.

#### Technical Scope & Context
Validate error handling and graceful degradation:
- Stop Ollama -> Verify LiteLLM returns HTTP 502/503.
- Disconnect PostgreSQL -> Verify key caching or safe failure.
- Kill client mid-stream -> Verify cancellation and VRAM release.

#### Detailed Tasks
1. Build `tests/test-resilience.ps1` to automate failure injection scenarios.
2. Simulate Ollama service stoppage during active request.
3. Simulate request cancellation (client terminates TCP connection during streaming).
4. Verify Ollama aborts generation and GPU memory is freed promptly.

#### Acceptance Criteria
- **Scenario 1: Upstream Inference Service Down**
  - **Given** Ollama is stopped
  - **When** client sends a chat completion request to LiteLLM
  - **Then** LiteLLM returns HTTP 502 Bad Gateway or 503 Service Unavailable within 5 seconds.
- **Scenario 2: Mid-Stream Client Disconnect**
  - **Given** a long streaming response in progress
  - **When** client abruptly closes the HTTP connection
  - **Then** LiteLLM drops upstream inference, and Ollama unloads/stops GPU generation for that request.

#### Definition of Done
- Resilience test script implemented and all scenarios pass with clean status codes.

---

## Epic 7 (M6): Observability, Telemetry & Operational Lifecycle

---
*Generated from [tasks-breakdown-user-stories.md](tasks-breakdown-user-stories.md)*
