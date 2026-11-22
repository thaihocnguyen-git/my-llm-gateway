---
title: "[US-3.4] OpenAI API Compatibility & Server-Sent Events (SSE) Streaming"
milestone: "M2: Gateway Deployment"
labels: ["milestone-2", "gateway", "litellm"]
---

# [US-3.4] OpenAI API Compatibility & Server-Sent Events (SSE) Streaming

## User Story Statement
- **Role:** As a Software Engineer
- **Goal:** I want to validate OpenAI-compatible Chat Completions with non-streaming and streaming (SSE) modes
- **Benefit:** So that standard OpenAI client SDKs and UI harnesses receive responses token-by-token in real time.

#### Technical Scope & Context
Verify the `/v1/chat/completions` endpoint for both standard JSON responses and chunked SSE streaming (`"stream": true`). Test parameter compliance: `temperature`, `top_p`, `max_tokens`, `stop`.

#### Detailed Tasks
1. Create test script `tests/test-chat.ps1` for non-streaming completions.
2. Create test script `tests/test-streaming.ps1` that verifies SSE streaming chunks (`data: {...}\n\n`) and final `data: [DONE]`.
3. Verify response schema matches standard OpenAI Chat Completion specification.

#### Acceptance Criteria
- **Scenario 1: Non-Streaming Completion**
  - **Given** a valid POST to `/v1/chat/completions` with `"model": "general"`, `"stream": false`
  - **When** the model finishes generation
  - **Then** HTTP 200 is returned with JSON containing `choices[0].message.content` and usage stats.
- **Scenario 2: Streaming (SSE) Completion**
  - **Given** a valid POST to `/v1/chat/completions` with `"model": "coding"`, `"stream": true`
  - **When** the response begins streaming
  - **Then** the `Content-Type` is `text/event-stream`, tokens arrive incrementally, and stream terminates with `data: [DONE]`.

#### Definition of Done
- Both non-streaming and streaming tests pass against the local LiteLLM gateway.

---

## Epic 4 (M3): Identity, Authorization & Gateway Security Hardening

---
*Generated from [tasks-breakdown-user-stories.md](tasks-breakdown-user-stories.md)*
