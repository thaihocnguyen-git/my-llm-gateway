---
title: "[US-1.2] Host Hardware, GPU Drivers & Container Runtime Verification"
milestone: ""
labels: ["setup", "devops"]
---

# [US-1.2] Host Hardware, GPU Drivers & Container Runtime Verification

## User Story Statement
- **Role:** As a Systems Administrator
- **Goal:** I want to verify that the host OS, NVIDIA display drivers, CUDA runtime, and Docker Desktop are operational
- **Benefit:** So that the machine is confirmed capable of running hardware-accelerated local inference and Dockerized supporting services.

#### Technical Scope & Context
Confirm `DESKTOP-E9DFIES` environment: Intel i5-11400F, 32 GB RAM, NVIDIA GeForce RTX 3060 12GB VRAM. Verify NVIDIA driver (supports CUDA >= 12.0), PowerShell 7 or Windows PowerShell 5.1+, and Docker Desktop with WSL2 backend.

#### Detailed Tasks
1. Run `nvidia-smi` to confirm GPU detection, VRAM capacity (12,288 MB), and driver/CUDA versions.
2. Verify Docker Desktop installation and start status (`docker --version`, `docker compose version`).
3. Verify Docker WSL2 backend memory limit and container execution (`docker run --rm hello-world`).
4. Document the baseline driver and system info in `scripts/windows/health-check.ps1` host check function.

#### Acceptance Criteria
- **Scenario 1: GPU and Driver Status**
  - **Given** Windows host `DESKTOP-E9DFIES`
  - **When** running `nvidia-smi`
  - **Then** NVIDIA GeForce RTX 3060 with 12 GB VRAM is detected, and CUDA version is >= 12.2.
- **Scenario 2: Docker Engine Readiness**
  - **Given** Docker Desktop is running
  - **When** executing `docker compose version`
  - **Then** Docker Compose v2.x returns success without daemon communication errors.

#### Definition of Done
- GPU details and driver versions logged.
- Docker Desktop verified functional with hello-world test.

---

## Epic 2 (M1): Local Inference Engine Setup & Benchmarking

---
*Generated from [tasks-breakdown-user-stories.md](tasks-breakdown-user-stories.md)*
