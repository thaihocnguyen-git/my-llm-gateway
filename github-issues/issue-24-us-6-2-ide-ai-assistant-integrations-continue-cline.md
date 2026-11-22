---
title: "[US-6.2] IDE AI Assistant Integrations (Continue & Cline)"
milestone: "M5: Client Compatibility"
labels: ["milestone-5", "client-testing"]
---

# [US-6.2] IDE AI Assistant Integrations (Continue & Cline)

## User Story Statement
- **Role:** As a Software Developer
- **Goal:** I want to configure Continue and Cline extensions in VS Code / JetBrains to use the local LLM gateway
- **Benefit:** So that I can use local coding models directly in my IDE for code completion, refactoring, and inline chat.

#### Technical Scope & Context
Configure IDE plugins using OpenAI-compatible configuration:
- Base URL: `https://<device>.<tailnet>.ts.net/v1`
- Model: `coding`
- API Key: Virtual key for `coding-agent`
Document settings for both Continue (`config.json`) and Cline.

#### Detailed Tasks
1. Document Continue configuration snippet in `docs/client-setup/continue.md`.
2. Document Cline configuration steps in `docs/client-setup/cline.md`.
3. Test inline code completion and sidebar chat in VS Code using Continue.
4. Verify memory and token limits during large context code explanations.

#### Acceptance Criteria
- **Scenario 1: Continue Extension Chat & Refactor**
  - **Given** Continue configured with `api_base: https://<device>.<tailnet>.ts.net/v1` and `model: coding`
  - **When** sending a code explanation or edit request in VS Code
  - **Then** the response generates in the Continue sidebar with syntax highlighting.
- **Scenario 2: Cline Tool Execution**
  - **Given** Cline configured with the gateway endpoint
  - **When** requesting code analysis
  - **Then** Cline communicates with the gateway without communication protocol errors.

#### Definition of Done
- Configuration files tested and documented in `docs/client-setup/`.

---

---
*Generated from [tasks-breakdown-user-stories.md](tasks-breakdown-user-stories.md)*
