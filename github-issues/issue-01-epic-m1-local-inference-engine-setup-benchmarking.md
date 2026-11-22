---
title: "[Epic] M1: Local Inference Engine Setup & Benchmarking"
milestone: "M1: Local Inference Engine"
labels: ["epic", "milestone-1", "performance"]
---

# [Epic] M1: Local Inference Engine Setup & Benchmarking

## Epic Overview
Implement Milestone 1 (M1) from [local-llm-gateway-design-latest.md](local-llm-gateway-design-latest.md): Install and validate local inference runtime (Ollama) with full NVIDIA GPU offload on Windows host `DESKTOP-E9DFIES`.

### Included Stories
- [ ] #US-2.1: Ollama Installation & Windows Service Lifecycle
- [ ] #US-2.2: Initial Model Download & Tag Verification (`qwen2.5:7b`, `qwen2.5-coder:7b`)
- [ ] #US-2.3: GPU Acceleration, Memory Footprint & Latency Benchmarking

### Milestone Acceptance Criteria
- [ ] Ollama successfully serves local requests on `127.0.0.1:11434`
- [ ] GPU acceleration confirmed (100% layer offload to RTX 3060 12GB)
- [ ] Baseline general and coding models benchmarked for TTFT and TPS
