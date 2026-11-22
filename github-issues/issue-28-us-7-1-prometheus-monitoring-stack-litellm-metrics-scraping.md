---
title: "[US-7.1] Prometheus Monitoring Stack & LiteLLM Metrics Scraping"
milestone: "M6: Monitoring & Ops Hardening"
labels: ["milestone-6", "monitoring", "automation"]
---

# [US-7.1] Prometheus Monitoring Stack & LiteLLM Metrics Scraping

## User Story Statement
- **Role:** As an Observability Engineer
- **Goal:** I want to deploy Prometheus in Docker and configure scraping of LiteLLM proxy metrics
- **Benefit:** So that time-series metrics for API traffic, error rates, latencies, and token usage are preserved.

#### Technical Scope & Context
Deploy Prometheus (`prom/prometheus:v2.52.0`) in `deployment/compose.monitoring.yaml`. LiteLLM exports Prometheus metrics at `http://127.0.0.1:4000/metrics` or dedicated metrics route (per pinned LiteLLM version). Prometheus scrapes this endpoint at a 15-second interval.

#### Detailed Tasks
1. Create `config/monitoring/prometheus.yml` configured to scrape:
   - `litellm` (`host.docker.internal:4000` or `127.0.0.1:4000`)
   - `postgres-exporter` (internal docker network)
   - Host/GPU exporters
2. Create `deployment/compose.monitoring.yaml` defining `prometheus` container with persistent volume.
3. Configure LiteLLM settings to enable Prometheus metrics in `config/litellm/config.yaml`.
4. Verify Prometheus targets dashboard at `http://localhost:9090/targets` shows LiteLLM `UP`.

#### Acceptance Criteria
- **Scenario 1: LiteLLM Metrics Scraping**
  - **Given** Prometheus and LiteLLM are running
  - **When** querying `http://localhost:9090/api/v1/targets`
  - **Then** the `litellm` job is reported in state `HEALTHY` / `UP`.
- **Scenario 2: Metrics Ingestion**
  - **Given** chat requests processed by LiteLLM
  - **When** querying Prometheus for `litellm_requests_metric_total` or equivalent
  - **Then** counter increments match the number of executed requests.

#### Definition of Done
- Prometheus scrapes LiteLLM metrics successfully; config committed.

---

---
*Generated from [tasks-breakdown-user-stories.md](tasks-breakdown-user-stories.md)*
