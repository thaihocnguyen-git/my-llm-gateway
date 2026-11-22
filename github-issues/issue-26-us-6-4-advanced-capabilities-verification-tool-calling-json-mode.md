---
title: "[US-6.4] Advanced Capabilities Verification (Tool Calling & JSON Mode)"
milestone: "M5: Client Compatibility"
labels: ["milestone-5", "client-testing"]
---

# [US-6.4] Advanced Capabilities Verification (Tool Calling & JSON Mode)

## User Story Statement
- **Role:** As an AI Application Developer
- **Goal:** I want to verify if the selected models (`qwen2.5-coder:7b`) support tool/function calling and JSON mode through LiteLLM
- **Benefit:** So that agentic harnesses can invoke tools reliably without syntax errors.

#### Technical Scope & Context
LiteLLM translates OpenAI `tools` and `response_format: {"type": "json_object"}` to Ollama's underlying format. Validate whether `qwen2.5-coder:7b` produces valid function calls and valid JSON schema outputs.

#### Detailed Tasks
1. Create `tests/test-tool-calling.py` defining a mock weather or calculator tool.
2. Send request with `tools=[...]` and `tool_choice="auto"`.
3. Verify that the response returns `finish_reason: "tool_calls"` and well-formed JSON arguments.
4. Test `response_format={"type": "json_object"}` with a prompt instructing JSON output.

#### Acceptance Criteria
- **Scenario 1: Tool Call Generation**
  - **Given** a prompt requiring calculation and a calculator tool schema
  - **When** sending request to `model="coding"`
  - **Then** the model returns a `tool_calls` array containing function name and parseable JSON arguments.
- **Scenario 2: Structured JSON Output**
  - **Given** `response_format={"type": "json_object"}` specified
  - **When** the response completes
  - **Then** the returned text content parses successfully via `json.loads()` without syntax errors.

#### Definition of Done
- Tool calling and JSON mode tested; capabilities and edge cases documented.

---

---
*Generated from [tasks-breakdown-user-stories.md](tasks-breakdown-user-stories.md)*
