---
title: "[US-3.1] PostgreSQL Persistent Database Deployment via Docker Compose"
milestone: "M2: Gateway Deployment"
labels: ["milestone-2", "gateway", "litellm"]
---

# [US-3.1] PostgreSQL Persistent Database Deployment via Docker Compose

## User Story Statement
- **Role:** As a Database Administrator / DevOps Engineer
- **Goal:** I want to deploy PostgreSQL in a Docker container with persistent volumes on an isolated internal network
- **Benefit:** So that LiteLLM Proxy can persist virtual keys, usage tracking, and audit data reliably across restarts.

#### Technical Scope & Context
Deploy PostgreSQL 16 (pinned version, e.g., `postgres:16-alpine`) using `deployment/compose.yaml`. The container must use a named Docker volume (`postgres_data`) for persistence. Port 5432 should bind ONLY to Docker internal network or `127.0.0.1:5432` on the host; it must NEVER be published to `0.0.0.0` or accessible externally.

#### Detailed Tasks
1. Author `deployment/compose.yaml` with the `postgres` service:
   - Image: `postgres:16-alpine`
   - Volume: `postgres_data:/var/lib/postgresql/data`
   - Environment: `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` read from `.env`
   - Port binding: `127.0.0.1:5432:5432` (restricted to localhost)
   - Healthcheck: `pg_isready -U $$POSTGRES_USER -d $$POSTGRES_DB`
   - Restart policy: `unless-stopped`
2. Create initialization scripts in `deployment/postgres/init.sql` if required.
3. Start the container with `docker compose -f deployment/compose.yaml up -d postgres`.
4. Validate health check status and data persistence across container restart.

#### Acceptance Criteria
- **Scenario 1: PostgreSQL Port Exposure Restriction**
  - **Given** the PostgreSQL container is running
  - **When** querying listening ports on the host
  - **Then** port 5432 is bound strictly to `127.0.0.1:5432` and cannot be reached from other LAN IPs.
- **Scenario 2: Persistence Across Restarts**
  - **Given** PostgreSQL running with persistent volume
  - **When** executing `docker compose -f deployment/compose.yaml restart postgres`
  - **Then** all database tables, schemas, and previously inserted records remain intact.

#### Definition of Done
- `deployment/compose.yaml` implemented, database healthy, data verified persistent across container restarts.

---

---
*Generated from [tasks-breakdown-user-stories.md](tasks-breakdown-user-stories.md)*
