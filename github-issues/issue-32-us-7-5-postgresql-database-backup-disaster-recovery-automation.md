---
title: "[US-7.5] PostgreSQL Database Backup & Disaster Recovery Automation"
milestone: "M6: Monitoring & Ops Hardening"
labels: ["milestone-6", "monitoring", "automation"]
---

# [US-7.5] PostgreSQL Database Backup & Disaster Recovery Automation

## User Story Statement
- **Role:** As a Database Administrator
- **Goal:** I want an automated backup and restore script for PostgreSQL database records and LiteLLM configuration
- **Benefit:** So that virtual keys, usage records, and configurations can be restored quickly in case of database corruption or drive failure.

#### Technical Scope & Context
Create backup script using `docker exec -t <postgres_container> pg_dump -U ...`. Backups should be timestamped, compressed, and stored in a secure backup location (e.g. `D:\Backups\llm-gateway\`). Create corresponding restore script.

#### Detailed Tasks
1. Create `scripts/windows/backup-db.ps1`:
   - Runs `pg_dump` inside container.
   - Saves compressed `.sql.gz` with date/timestamp.
   - Rotates backups (retains last 7 daily backups).
2. Create `scripts/windows/restore-db.ps1`:
   - Restores target `.sql.gz` into PostgreSQL container.
3. Verify backup and restore procedure with test data.

#### Acceptance Criteria
- **Scenario 1: Automated Database Backup**
  - **Given** active virtual keys in PostgreSQL
  - **When** `scripts/windows/backup-db.ps1` executes
  - **Then** a non-empty SQL dump file is created with timestamped filename.
- **Scenario 2: Disaster Recovery Restoration**
  - **Given** a corrupted or empty database volume
  - **When** running `scripts/windows/restore-db.ps1` with the latest backup
  - **Then** all tables, virtual keys, and metadata are restored and functional in LiteLLM.

#### Definition of Done
- Backup and restore scripts verified end-to-end.

---

## Epic 8: Acceptance Test Suite & Ubuntu Migration Readiness

---
*Generated from [tasks-breakdown-user-stories.md](tasks-breakdown-user-stories.md)*
