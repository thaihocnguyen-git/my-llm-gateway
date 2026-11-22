---
title: "[Epic] M2: Gateway Deployment & Core Routing Engine"
milestone: "M2: Gateway Deployment"
labels: ["epic", "milestone-2", "gateway"]
---

# [Epic] M2: Gateway Deployment & Core Routing Engine

## Epic Overview
Implement Milestone 2 (M2): Deploy PostgreSQL in Docker and LiteLLM Proxy natively on Windows to provide model routing, logical abstraction, and OpenAI-compatible API endpoints.

### Included Stories
- [ ] #US-3.1: PostgreSQL Persistent Database Deployment via Docker Compose
- [ ] #US-3.2: LiteLLM Proxy Native Windows Installation & Environment Setup
- [ ] #US-3.3: Model Mapping, Abstraction & Provider Configuration
- [ ] #US-3.4: OpenAI API Compatibility & Server-Sent Events (SSE) Streaming

### Milestone Acceptance Criteria
- [ ] OpenAI SDK communicates with local models through LiteLLM
- [ ] Logical model aliases (`general`, `coding`) resolve to Ollama models
- [ ] Token-by-token streaming works end-to-end
