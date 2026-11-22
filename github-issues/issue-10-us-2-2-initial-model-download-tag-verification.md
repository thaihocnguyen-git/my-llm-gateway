---
title: "[US-2.2] Initial Model Download & Tag Verification"
milestone: "M1: Local Inference Engine"
labels: ["milestone-1", "performance", "ollama"]
---

# [US-2.2] Initial Model Download & Tag Verification

## User Story Statement
- **Role:** As an AI Engineer
- **Goal:** I want to download and verify the baseline models for general reasoning and code assistance
- **Benefit:** So that the inference engine possesses the target quantized models fitting within the 12GB VRAM constraint.

#### Technical Scope & Context
Download selected baseline models:
- General model: `qwen2.5:7b` or `qwen2.5:8b` (quantized 4-bit / Q4_K_M)
- Coding model: `qwen2.5-coder:7b` (quantized Q4_K_M)
Total weights per model ~4.5 GB to 5.5 GB, leaving 5–6 GB of VRAM headroom for KV cache and context window (up to 8k-16k tokens) on the RTX 3060 12GB.

#### Detailed Tasks
1. Execute `ollama pull qwen2.5:7b` (or chosen general model baseline).
2. Execute `ollama pull qwen2.5-coder:7b`.
3. Verify models appear in local registry with `ollama list`.
4. Inspect model parameters and template metadata using `ollama show --modelfile qwen2.5-coder:7b`.

#### Acceptance Criteria
- **Scenario 1: Model Pull Completion**
  - **Given** an active internet connection on the host
  - **When** `ollama pull qwen2.5-coder:7b` finishes
  - **Then** `ollama list` output includes `qwen2.5-coder:7b` with status OK and valid size (~4.7 GB).
- **Scenario 2: Model Query Execution**
  - **Given** the downloaded models
  - **When** running `ollama run qwen2.5-coder:7b "Write a Python fibonacci generator"`
  - **Then** the response is generated without error and outputs valid Python code.

#### Definition of Done
- Both baseline models downloaded and verified via CLI inference.

---

---
*Generated from [tasks-breakdown-user-stories.md](tasks-breakdown-user-stories.md)*
