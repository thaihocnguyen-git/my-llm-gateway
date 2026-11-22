---
title: "[US-7.3] Grafana Operational Dashboard & Alerting Rules"
milestone: "M6: Monitoring & Ops Hardening"
labels: ["milestone-6", "monitoring", "automation"]
---

# [US-7.3] Grafana Operational Dashboard & Alerting Rules

## User Story Statement
- **Role:** As an Operations Specialist
- **Goal:** I want to deploy Grafana with a provisioned dashboard and alert rules for service degradation
- **Benefit:** So that I have a unified visual control plane for gateway traffic, GPU load, and failure alerts.

#### Technical Scope & Context
Deploy Grafana (`grafana/grafana:11.0.0`) in `deployment/compose.monitoring.yaml`. Port 3000 bound to `127.0.0.1:3000`. Auto-provision datasource (Prometheus) and dashboard covering:
1. Gateway status & uptime
2. Request rate & HTTP error rate
3. Request latency & TTFT
4. Tokens per second
5. GPU utilization & VRAM usage
6. Host CPU/RAM/Disk
7. Database status

#### Detailed Tasks
1. Add `grafana` service to `deployment/compose.monitoring.yaml`.
2. Configure Grafana datasource provisioning in `config/monitoring/grafana/provisioning/datasources/`.
3. Create pre-built dashboard JSON in `config/monitoring/grafana/dashboards/llm-gateway.json`.
4. Configure Prometheus alerting rules for:
   - LiteLLM Down
   - Ollama Down
   - GPU VRAM > 90%
   - GPU Temperature > 80°C
   - Request Error Rate > 5%

#### Acceptance Criteria
- **Scenario 1: Dashboard Visualization**
  - **Given** Grafana running at `http://localhost:3000`
  - **When** navigating to the "Local LLM Gateway" dashboard
  - **Then** all 10 key metric panels display live data without datasource query errors.
- **Scenario 2: Alert Trigger on Failure**
  - **Given** alerting rules active
  - **When** the Ollama service is stopped for > 1 minute
  - **Then** the `OllamaDown` alert transitions to `FIRING` state in Grafana/Prometheus.

#### Definition of Done
- Grafana dashboard provisioned; panels and alerts verified functional.

---

---
*Generated from [tasks-breakdown-user-stories.md](tasks-breakdown-user-stories.md)*
