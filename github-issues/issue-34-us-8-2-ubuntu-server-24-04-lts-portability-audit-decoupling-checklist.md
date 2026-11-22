---
title: "[US-8.2] Ubuntu Server 24.04 LTS Portability Audit & Decoupling Checklist"
milestone: ""
labels: ["qa", "migration"]
---

# [US-8.2] Ubuntu Server 24.04 LTS Portability Audit & Decoupling Checklist

## User Story Statement
- **Role:** As a Systems Architect
- **Goal:** I want to verify that all configurations, logical names, and compose files remain decoupled from Windows OS quirks
- **Benefit:** So that migrating to Ubuntu Server 24.04 LTS in the future requires zero changes to client configurations or database schemas.

#### Technical Scope & Context
Audit the architecture against the portability principles in ADR §2 & §16. Verify:
- Client-facing API contract and base URLs are decoupled from the OS.
- Compose files use standard POSIX-compatible mount syntax.
- Linux equivalent lifecycle scripts (`scripts/linux/start.sh`, `scripts/linux/stop.sh`, `scripts/linux/health-check.sh`) are drafted and mirror Windows operational intent.
- Model aliases and virtual keys are strictly portable.

#### Detailed Tasks
1. Draft Linux lifecycle scripts in `scripts/linux/`:
   - `start.sh` (systemd / docker compose)
   - `stop.sh`
   - `health-check.sh`
2. Audit `config/litellm/config.yaml` to ensure no Windows-specific absolute paths are hardcoded.
3. Document Ubuntu migration runbook in `docs/ubuntu-migration-guide.md` covering NVIDIA container toolkit, systemd services, and Docker Compose deployment.

#### Acceptance Criteria
- **Scenario 1: Portability Verification**
  - **Given** the configuration files and compose specifications
  - **When** inspected against Linux deployment requirements
  - **Then** zero Windows file path delimiters (`\`) or Windows-specific flags exist in shared configs (`config.yaml`, `compose.yaml`).
- **Scenario 2: Migration Runbook Completeness**
  - **Given** `docs/ubuntu-migration-guide.md`
  - **When** followed step-by-step
  - **Then** it contains complete commands for driver install, systemd setup, database restore, and test execution.

#### Definition of Done
- Linux lifecycle scripts drafted, shared configs audited, migration guide completed.

---

## Story Dependencies & Execution Roadmap

```mermaid
graph TD
    subgraph Epic 1 - Scaffolding
        US11[US-1.1: Repo Scaffolding] --> US12[US-1.2: Host & GPU Verification]
    end

    subgraph Epic 2 - Inference M1
        US12 --> US21[US-2.1: Ollama Setup]
        US21 --> US22[US-2.2: Model Download]
        US22 --> US23[US-2.3: GPU Benchmarking]
    end

    subgraph Epic 3 - Gateway M2
        US12 --> US31[US-3.1: Postgres Docker]
        US23 --> US32[US-3.2: LiteLLM Windows]
        US31 --> US32
        US32 --> US33[US-3.3: Model Routing]
        US33 --> US34[US-3.4: Chat & Streaming]
    end

    subgraph Epic 4 - Auth & Security M3
        US34 --> US41[US-4.1: Master Key]
        US41 --> US42[US-4.2: Virtual Keys]
        US42 --> US43[US-4.3: Model Limits & RPM]
        US43 --> US44[US-4.4: Hardening & Redaction]
    end

    subgraph Epic 5 - Remote Tailscale M4
        US44 --> US51[US-5.1: Tailscale Node]
        US51 --> US52[US-5.2: Tailscale Serve]
        US52 --> US53[US-5.3: Network Port Audit]
    end

    subgraph Epic 6 - Client Compatibility M5
        US53 --> US61[US-6.1: Python SDK]
        US61 --> US62[US-6.2: Continue / Cline]
        US61 --> US63[US-6.3: Copilot CLI Assessment]
        US61 --> US64[US-6.4: Tool Calling & JSON]
        US61 --> US65[US-6.5: Fault Injection]
    end

    subgraph Epic 7 - Observability M6
        US53 --> US71[US-7.1: Prometheus Scrape]
        US71 --> US72[US-7.2: Windows & GPU Exporter]
        US72 --> US73[US-7.3: Grafana Dashboard]
        US73 --> US74[US-7.4: Windows Auto Boot]
        US74 --> US75[US-7.5: DB Backup Automation]
    end

    subgraph Epic 8 - Acceptance & Portability
        US65 --> US81[US-8.1: Automated Test Suite]
        US75 --> US81
        US81 --> US82[US-8.2: Ubuntu Migration Audit]
    end
```

---

## Definition of Done (Global DoD Checklist)

For any User Story to be marked as **Completed**:
- [ ] **Code / Config Completed:** All YAML, PowerShell, Python, or SQL files are created in the target repository directory.
- [ ] **No Committed Secrets:** Secrets are read from `.env` or environment variables; no raw API keys or passwords in Git.
- [ ] **Acceptance Criteria Met:** All scenarios under the story's Acceptance Criteria have been manually or automatically verified.
- [ ] **Error Handling:** Graceful failures with informative logging; no uncaught script terminations.
- [ ] **Documentation:** Setup, commands, or operational changes are reflected in relevant markdown docs.
- [ ] **Regression & Isolation:** No unintended network ports exposed outside localhost/tailnet.

---
*Generated from [tasks-breakdown-user-stories.md](tasks-breakdown-user-stories.md)*
