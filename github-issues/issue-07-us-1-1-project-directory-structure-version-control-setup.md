---
title: "[US-1.1] Project Directory Structure & Version Control Setup"
milestone: ""
labels: ["setup", "devops"]
---

# [US-1.1] Project Directory Structure & Version Control Setup

## User Story Statement
- **Role:** As a DevOps engineer / Developer
- **Goal:** I want to establish a clean, standardized repository structure, gitignore, and configuration templates
- **Benefit:** So that all service configs, automation scripts, and deployment files are versioned securely without risking credential exposure.

#### Technical Scope & Context
Establish the repository hierarchy defined in ADR §12. Ensure `.gitignore` ignores `.env`, private keys, secrets, database data files, log dumps, and model caches. Create `.env.example` defining all required configuration variables without real secrets.

#### Detailed Tasks
1. Initialize Git repository in `D:\Sources\my-llm-gateway` (if not already initialized).
2. Create directories:
   - `config/litellm/`
   - `config/monitoring/grafana/`
   - `deployment/postgres/`
   - `scripts/windows/`
   - `scripts/linux/`
   - `tests/`
3. Create `.gitignore` to exclude `.env`, `*.log`, `*.db`, `postgres_data/`, `certs/`, and credentials.
4. Create `.env.example` containing placeholders: `LITELLM_MASTER_KEY`, `LITELLM_SALT_KEY`, `DATABASE_URL`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `TAILSCALE_HOSTNAME`.
5. Create initial `README.md` documenting project structure, prerequisites, and quick links.

#### Acceptance Criteria
- **Scenario 1: Clean Git Scaffolding**
  - **Given** the project workspace directory `D:\Sources\my-llm-gateway`
  - **When** `git status` is executed
  - **Then** all directories and template files exist, and untracked secret files are properly ignored.
- **Scenario 2: Sensitive Information Protection**
  - **Given** a newly created `.env` file containing test secrets
  - **When** `git status` or `git add .` is executed
  - **Then** Git must ignore `.env` and prevent committing sensitive material.

#### Definition of Done
- Directory structure matches ADR §12.
- `.gitignore` and `.env.example` are committed to the repository.

---

---
*Generated from [tasks-breakdown-user-stories.md](tasks-breakdown-user-stories.md)*
