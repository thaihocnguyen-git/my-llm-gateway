---
title: "[US-7.4] Automated System Boot Lifecycle & Process Supervision"
milestone: "M6: Monitoring & Ops Hardening"
labels: ["milestone-6", "monitoring", "automation"]
---

# [US-7.4] Automated System Boot Lifecycle & Process Supervision

## User Story Statement
- **Role:** As a Systems Administrator
- **Goal:** I want to automate the startup order of all gateway components on Windows boot and provide clean start/stop scripts
- **Benefit:** So that the PC automatically recovers and resumes serving LLM requests after an unattended reboot without requiring manual user intervention.

#### Technical Scope & Context
Startup dependency order per ADR §13:
1. Docker Desktop & Tailscale start on boot.
2. PostgreSQL container starts and passes healthcheck.
3. Ollama starts natively on Windows.
4. LiteLLM Proxy starts after PostgreSQL and Ollama are healthy.
5. Tailscale Serve exposes the endpoint.
6. Healthcheck script confirms readiness.
Implement via Windows Task Scheduler or NSSM (Non-Sucking Service Manager) / Windows Services.

#### Detailed Tasks
1. Create master orchestrator script `scripts/windows/start.ps1`.
2. Create graceful shutdown script `scripts/windows/stop.ps1`.
3. Create comprehensive health check `scripts/windows/health-check.ps1`.
4. Configure Windows Task Scheduler task (`Run whether user is logged on or not` / `At system startup`) or Windows Service.
5. Test recovery by performing a simulated system restart.

#### Acceptance Criteria
- **Scenario 1: Sequential Startup Execution**
  - **Given** the machine is booted
  - **When** `scripts/windows/start.ps1` runs
  - **Then** services start in strict order (Docker/PostgreSQL -> Ollama -> LiteLLM -> Tailscale Serve) and verify healthy.
- **Scenario 2: Post-Reboot Automatic Recovery**
  - **Given** the host PC is restarted
  - **When** the system finishes booting to desktop/service state
  - **Then** `scripts/windows/health-check.ps1` reports all services healthy and remote HTTPS requests succeed without manual steps.

#### Definition of Done
- `start.ps1`, `stop.ps1`, and `health-check.ps1` tested and integrated into Windows startup automation.

---

---
*Generated from [tasks-breakdown-user-stories.md](tasks-breakdown-user-stories.md)*
