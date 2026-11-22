---
title: "[US-7.2] Windows Host & NVIDIA GPU Telemetry Exporters"
milestone: "M6: Monitoring & Ops Hardening"
labels: ["milestone-6", "monitoring", "automation"]
---

# [US-7.2] Windows Host & NVIDIA GPU Telemetry Exporters

## User Story Statement
- **Role:** As a Systems Administrator
- **Goal:** I want to export host metrics (CPU, RAM, disk) and NVIDIA GPU telemetry (utilization, VRAM, temperature, power)
- **Benefit:** So that resource bottlenecks, thermal throttling, and VRAM saturation are visible before system crashes occur.

#### Technical Scope & Context
For Windows, evaluate:
- Host: `windows_exporter` running as a Windows service or local binary.
- GPU: A lightweight telemetry collector calling `nvidia-smi` periodically or `prometheus-nvidia-smi-exporter`.
Prometheus scrapes these endpoints to collect GPU and host health.

#### Detailed Tasks
1. Set up `windows_exporter` for Windows CPU, memory, disk, and network stats.
2. Set up GPU exporter on Windows polling `nvidia-smi` metrics (temperature, VRAM used, GPU utilization %).
3. Add scrape jobs to `config/monitoring/prometheus.yml`.
4. Validate metric availability in Prometheus (e.g. `gpu_memory_used_bytes`, `windows_cpu_time_total`).

#### Acceptance Criteria
- **Scenario 1: GPU Metrics Scraping**
  - **Given** the GPU telemetry exporter running
  - **When** querying Prometheus for GPU VRAM usage
  - **Then** Prometheus returns the real-time VRAM usage matching `nvidia-smi`.
- **Scenario 2: Host Metrics Scraping**
  - **Given** `windows_exporter` active
  - **When** querying CPU and RAM utilization metrics
  - **Then** Prometheus reports active system utilization metrics.

#### Definition of Done
- Exporters running on Windows host, scraped by Prometheus, metrics validated.

---

---
*Generated from [tasks-breakdown-user-stories.md](tasks-breakdown-user-stories.md)*
