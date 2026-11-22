---
title: "[US-2.3] GPU Acceleration, Memory Footprint & Latency Benchmarking"
milestone: "M1: Local Inference Engine"
labels: ["milestone-1", "performance", "ollama"]
---

# [US-2.3] GPU Acceleration, Memory Footprint & Latency Benchmarking

## User Story Statement
- **Role:** As a Performance Engineer
- **Goal:** I want to benchmark VRAM consumption, time-to-first-token (TTFT), and generation speed (tokens/sec)
- **Benefit:** So that we confirm 100% GPU offloading, zero CPU fallback degradation, and establish baseline performance metrics.

#### Technical Scope & Context
When running models on Ollama, verify all layers are offloaded to CUDA (`CUDA0`). Track VRAM with `nvidia-smi` before, during, and after inference. Benchmark with context sizes of 1k, 4k, and 8k tokens.

#### Detailed Tasks
1. Create a PowerShell benchmark script `scripts/windows/benchmark-models.ps1` that sends timed API requests to `http://127.0.0.1:11434/api/generate`.
2. Measure:
   - Peak VRAM utilization via `nvidia-smi --query-gpu=memory.used,memory.free --format=csv`.
   - Time to first token (TTFT).
   - Sustained generation speed (tokens per second / TPS).
3. Validate that 100% of layers (`gpu_layers: all`) are loaded in GPU VRAM with no system RAM swapping.
4. Document the benchmark baseline in `docs/benchmark-results-windows.md`.

#### Acceptance Criteria
- **Scenario 1: 100% GPU Offload Verification**
  - **Given** model `qwen2.5-coder:7b` is actively loaded
  - **When** monitoring Ollama logs / `nvidia-smi` during generation
  - **Then** GPU utilization spikes, VRAM consumption increases by ~5.0 - 6.5 GB, and host CPU usage remains low.
- **Scenario 2: Performance Threshold Compliance**
  - **Given** single-stream generation on RTX 3060 12GB
  - **When** generating a 500-token response
  - **Then** generation speed achieves >= 25 tokens/second with TTFT < 800ms.

#### Definition of Done
- Benchmark results documented; 100% GPU offloading confirmed without out-of-memory (OOM) errors.

---

## Epic 3 (M2): Gateway Deployment & Core Routing Engine

---
*Generated from [tasks-breakdown-user-stories.md](tasks-breakdown-user-stories.md)*
