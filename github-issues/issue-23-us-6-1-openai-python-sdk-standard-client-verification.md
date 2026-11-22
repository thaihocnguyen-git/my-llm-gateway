---
title: "[US-6.1] OpenAI Python SDK & Standard Client Verification"
milestone: "M5: Client Compatibility"
labels: ["milestone-5", "client-testing"]
---

# [US-6.1] OpenAI Python SDK & Standard Client Verification

## User Story Statement
- **Role:** As a Software Engineer / Client Developer
- **Goal:** I want to connect to the gateway using the official OpenAI Python SDK and generic HTTP clients
- **Benefit:** So that any standard OpenAI-compatible tooling can interface with our local models without bespoke adapters.

#### Technical Scope & Context
Create a test harness in Python using the official `openai` Python SDK (v1.x). Set `base_url="https://<device>.<tailnet>.ts.net/v1"` and `api_key="sk-..."`.

#### Detailed Tasks
1. Create `tests/test-client-openai.py`.
2. Implement test cases for:
   - Client initialization with custom `base_url`.
   - Simple text completion with `"model": "general"`.
   - Streaming text completion with `"model": "coding"`.
   - Exception handling on invalid API key (verifies `openai.AuthenticationError`).

#### Acceptance Criteria
- **Scenario 1: Python SDK Chat Completion**
  - **Given** the OpenAI Python SDK configured with the Tailscale HTTPS base URL and virtual key
  - **When** calling `client.chat.completions.create(model="general", messages=[...])`
  - **Then** the SDK returns a valid `ChatCompletion` object with content and usage.
- **Scenario 2: Python SDK Streaming**
  - **Given** streaming enabled (`stream=True`)
  - **When** iterating `for chunk in response:`
  - **Then** `chunk.choices[0].delta.content` delivers tokens smoothly.

#### Definition of Done
- Test script `test-client-openai.py` passes all test cases.

---

---
*Generated from [tasks-breakdown-user-stories.md](tasks-breakdown-user-stories.md)*
