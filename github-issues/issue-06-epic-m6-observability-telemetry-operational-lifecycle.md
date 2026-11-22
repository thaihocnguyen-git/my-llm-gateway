---
title: "[Epic] M6: Observability, Telemetry & Operational Lifecycle"
milestone: "M6: Monitoring & Ops Hardening"
labels: ["epic", "milestone-6", "monitoring"]
---

# [Epic] M6: Observability, Telemetry & Operational Lifecycle

## Epic Overview
Implement Milestone 6 (M6): Deploy Prometheus & Grafana in Docker, configure host & GPU telemetry, set up automated Windows boot recovery, and configure database backups.

### Included Stories
- [ ] #US-7.1: Prometheus Monitoring Stack & LiteLLM Metrics Scraping
- [ ] #US-7.2: Windows Host & NVIDIA GPU Telemetry Exporters
- [ ] #US-7.3: Grafana Operational Dashboard & Alerting Rules
- [ ] #US-7.4: Automated System Boot Lifecycle & Process Supervision
- [ ] #US-7.5: PostgreSQL Database Backup & Disaster Recovery Automation

### Milestone Acceptance Criteria
- [ ] Dashboard visualizes API traffic, GPU VRAM/temperature, host metrics, and latency
- [ ] Alerts trigger on service failure
- [ ] Automated recovery verified after host restart
