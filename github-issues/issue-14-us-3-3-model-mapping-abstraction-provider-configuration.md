---
title: "[US-3.3] Model Mapping, Abstraction & Provider Configuration"
milestone: "M2: Gateway Deployment"
labels: ["milestone-2", "gateway", "litellm"]
---

# [US-3.3] Model Mapping, Abstraction & Provider Configuration

## User Story Statement
- **Role:** As an API Architect
- **Goal:** I want to configure LiteLLM model routing to map logical model names (`general`, `coding`) to internal Ollama tags
- **Benefit:** So that client applications use stable model names that do not break when underlying Ollama model tags or versions change.

#### Technical Scope & Context
Implement `config/litellm/config.yaml` as defined in ADR §8. Map:
- `model_name: general` -> `ollama_chat/qwen2.5:7b` (at `http://127.0.0.1:11434`)
- `model_name: coding` -> `ollama_chat/qwen2.5-coder:7b` (at `http://127.0.0.1:11434`)
Configure `keep_alive: 10m` to prevent cold model unload between frequent developer queries.

#### Detailed Tasks
1. Create `config/litellm/config.yaml` specifying `model_list` with logical aliases and provider settings.
2. Link database connection string via `general_settings.database_url: os.environ/DATABASE_URL`.
3. Configure `master_key: os.environ/LITELLM_MASTER_KEY`.
4. Verify model discovery endpoint `/v1/models` lists `general` and `coding`.

#### Acceptance Criteria
- **Scenario 1: Model Discovery Endpoint**
  - **Given** LiteLLM Proxy is initialized with the config
  - **When** sending `GET http://127.0.0.1:4000/v1/models` with master key authorization
  - **Then** the response JSON contains model objects with `id: "general"` and `id: "coding"`.
- **Scenario 2: Logical Routing to Ollama**
  - **Given** a request sent to `/v1/chat/completions` with `"model": "coding"`
  - **When** LiteLLM forwards the request
  - **Then** Ollama receives the request targeted at `qwen2.5-coder:7b` and returns the inference output.

#### Definition of Done
- Logical aliases configured, verifiable via `/v1/models` and routed correctly to Ollama.

---

---
*Generated from [tasks-breakdown-user-stories.md](tasks-breakdown-user-stories.md)*
