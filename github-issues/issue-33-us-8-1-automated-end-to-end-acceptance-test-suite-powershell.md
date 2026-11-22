---
title: "[US-8.1] Automated End-to-End Acceptance Test Suite (PowerShell)"
milestone: ""
labels: ["qa", "migration"]
---

# [US-8.1] Automated End-to-End Acceptance Test Suite (PowerShell)

## User Story Statement
- **Role:** As a QA Engineer
- **Goal:** I want a comprehensive automated acceptance test suite covering the 14 test scenarios in ADR §15
- **Benefit:** So that the entire gateway can be verified in seconds before release and after any configuration change.

#### Technical Scope & Context
Implement `tests/run-acceptance-suite.ps1` executing the full acceptance matrix:
1. Valid API key (HTTP 200)
2. Invalid API key (HTTP 401)
3. Revoked API key (HTTP 401)
4. Unauthorized model (HTTP 403)
5. Valid chat completion
6. Streaming completion (SSE)
7. Excessive concurrency / rate limit (HTTP 429)
8. Invalid request body (HTTP 400)
9. Client key attempts admin operation (Denied)
10. Ollama unavailable upstream error
11. Tailnet boundary enforcement
12. Monitoring endpoint restriction

#### Detailed Tasks
1. Create `tests/run-acceptance-suite.ps1`.
2. Implement automated checks for each scenario using `Invoke-RestMethod` and `Invoke-WebRequest`.
3. Output test summary table with PASS/FAIL status and latency metrics.

#### Acceptance Criteria
- **Scenario 1: Acceptance Test Execution**
  - **Given** healthy gateway and test virtual keys
  - **When** executing `powershell tests/run-acceptance-suite.ps1`
  - **Then** all 14 test cases execute, and the overall test suite exits with return code 0.

#### Definition of Done
- Complete test suite committed and passing on host.

---

---
*Generated from [tasks-breakdown-user-stories.md](tasks-breakdown-user-stories.md)*
