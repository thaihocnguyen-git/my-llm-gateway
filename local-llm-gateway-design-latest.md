# Local LLM Inference Gateway

## Architecture Decision Record and Implementation Plan

**Status:** Accepted baseline for v1\
**Version:** 2.0\
**Date:** 2026-11-22\
**Project:** Self-hosted local LLM inference gateway

------------------------------------------------------------------------

## 1. Purpose and scope

Build a private, self-hosted LLM inference gateway on the user's
existing Windows PC. The service is responsible only for receiving LLM
requests, authenticating clients, routing requests to local models, and
returning standardized responses.

Client-side applications and harnesses own all other responsibilities,
including user interfaces, conversation management, RAG, agents, tools,
business logic, and application-specific workflows.

### In scope

-   Serve local LLM inference requests.
-   Expose an OpenAI-compatible API.
-   Support remote access through a private VPN.
-   Authenticate and authorize clients.
-   Route logical model names to local inference models.
-   Support streaming responses.
-   Provide operational health checks, logs, metrics, and recovery
    procedures.
-   Keep the deployment portable enough to migrate from Windows to
    Ubuntu later.

### Out of scope for v1

-   Chat UI or custom frontend.
-   Conversation or application-level state management.
-   RAG, document ingestion, agents, and business workflows.
-   Public internet access.
-   Image and video generation.
-   OpenAI Responses API (deferred until required).
-   Multi-node inference or high availability.
-   Dual-boot installation or a second operating system.

------------------------------------------------------------------------

## 2. Host hardware and operating system

  Component                 Specification
  ------------------------- --------------------------------------------
  Host                      `DESKTOP-E9DFIES`
  Current OS                Windows (exact edition/version to verify)
  Future migration target   Ubuntu Server 24.04 LTS
  CPU                       Intel Core i5-11400F, 6 cores / 12 threads
  RAM                       32 GB
  GPU                       NVIDIA GeForce RTX 3060
  VRAM                      12 GB
  Architecture              64-bit x86

### Host OS decision

**Decision: Keep Windows for v1. Do not install dual boot now.**

Reasons:

-   The PC remains available as the user's normal desktop.
-   Ollama supports NVIDIA GPU inference on Windows.
-   Avoids the cost and disruption of an OS migration before the service
    is validated.
-   The architecture will keep configuration and application behavior
    portable for a future Ubuntu migration.

Ubuntu Server 24.04 LTS is the preferred future target if the PC becomes
a dedicated, always-on server. The expected benefits are server-oriented
service management, systemd, native Docker Engine, and a mature Linux
monitoring ecosystem. A migration is not expected to produce a dramatic
inference-speed improvement by itself.

### Portability principle

The migration should not require changes to:

-   Client-facing API contract.
-   Logical model names.
-   LiteLLM virtual-key strategy.
-   Client base URLs beyond the Tailscale hostname if it changes.
-   Application-level configuration and request behavior.

OS-specific differences should be isolated in deployment scripts,
service definitions, networking, GPU setup, and storage paths.

The 12 GB VRAM capacity remains the primary constraint for model
selection, context length, and concurrency. Begin with quantized 7B--8B
models and benchmark actual memory use and generation performance.

------------------------------------------------------------------------

## 3. Architecture decisions

  -----------------------------------------------------------------------
  Area                                Decision
  ----------------------------------- -----------------------------------
  Service responsibility              LLM inference gateway only

  Current host OS                     Windows

  Future host OS                      Ubuntu Server 24.04 LTS

  Inference runtime                   Ollama

  API gateway                         LiteLLM Proxy

  Public API contract                 OpenAI-compatible Chat Completions

  Future API compatibility            Responses API, only when required

  Remote networking                   Tailscale private VPN

  HTTPS                               Tailscale Serve

  Authentication                      LiteLLM virtual API keys

  Authorization                       Per-key model permissions and
                                      limits

  Persistent gateway data             PostgreSQL

  Initial deployment                  Ollama and LiteLLM native on
                                      Windows; PostgreSQL in Docker

  Monitoring                          Health checks, structured logs,
                                      Prometheus and Grafana

  Frontend                            None
  -----------------------------------------------------------------------

### Architectural principles

1.  **Separation of concerns:** Ollama executes models; LiteLLM provides
    gateway capabilities.
2.  **Client independence:** Clients communicate with LiteLLM, never
    directly with Ollama.
3.  **Secure by default:** No public exposure and no unauthenticated
    inference endpoint.
4.  **Model abstraction:** Clients use stable logical model names, not
    physical Ollama tags.
5.  **Replaceable infrastructure:** Keep the client-facing API
    independent of the selected inference runtime where practical.
6.  **Configuration as code:** Version configuration and deployment
    scripts; never commit secrets.
7.  **Portable deployment:** Keep OS-specific lifecycle and networking
    logic separate from service configuration.

------------------------------------------------------------------------

## 4. Logical architecture and request flow

``` text
Remote clients
  - GitHub Copilot CLI / supported Copilot integrations
  - Continue / Cline
  - OpenAI SDK clients
  - Custom Python / Java / other applications
          |
          | OpenAI-compatible HTTPS API
          v
Tailscale private network
          |
          v
Tailscale Serve
  - Private tailnet HTTPS endpoint
  - Forwards to local LiteLLM listener
          |
          v
LiteLLM Proxy
  - API key authentication
  - Model authorization and routing
  - Rate / concurrency limits
  - Request and usage logging
  - OpenAI API compatibility
          |
          v
LiteLLM Ollama provider
          |
          v
Ollama (localhost only)
          |
          v
NVIDIA RTX 3060 12 GB
```

Supporting services:

``` text
LiteLLM -----------------> PostgreSQL
Prometheus --------------> LiteLLM metrics endpoint
Prometheus --------------> Host / GPU / PostgreSQL exporters
Grafana -----------------> Prometheus
Windows host ------------> Ollama
Windows host ------------> Tailscale
```

### Request flow

1.  A remote client connects to the server through Tailscale.
2.  Tailscale Serve terminates HTTPS and forwards the request to the
    local LiteLLM service.
3.  LiteLLM validates the virtual API key and checks model permissions
    and limits.
4.  LiteLLM routes the request to Ollama.
5.  Ollama performs inference using the GPU where supported.
6.  LiteLLM returns a standard response or streams Server-Sent Events
    (SSE) chunks to the client.

------------------------------------------------------------------------

## 5. Component responsibilities

  -----------------------------------------------------------------------
  Component               Responsibility          Must not be responsible
                                                  for
  ----------------------- ----------------------- -----------------------
  Tailscale               Private connectivity,   LLM API authorization
                          device identity,        
                          network access policy   

  Tailscale Serve         Private HTTPS endpoint  Model execution
                          and local forwarding    

  LiteLLM                 API gateway, virtual    Model execution
                          keys, model routing,    
                          limits, usage tracking  

  Ollama                  Model loading and       External client
                          inference               authentication

  PostgreSQL              Persistent gateway      Inference
                          data, keys and usage    
                          metadata as configured  

  Prometheus              Metrics collection and  Request routing
                          time-series storage     

  Grafana                 Dashboards and alert    Inference
                          visualization           

  Exporters               Expose host, GPU, and   API authorization
                          database metrics        

  Windows host            GPU, process and        Application-level
                          service lifecycle       business logic
  -----------------------------------------------------------------------

Clients must not access Ollama's management API or PostgreSQL directly.

------------------------------------------------------------------------

## 6. Network and deployment topology

### Initial Windows deployment

Run Ollama and LiteLLM natively on Windows initially. Run PostgreSQL and
monitoring components in Docker Desktop.

This keeps Ollama's GPU execution straightforward and avoids unnecessary
container GPU and host-network complexity. Running LiteLLM natively also
avoids having to expose Ollama on a non-loopback interface merely to
make it reachable from a Docker container.

``` text
Windows host: DESKTOP-E9DFIES
|
+-- Tailscale
|    +-- Tailscale Serve
|         +-- Private HTTPS hostname
|         +-- Forward to 127.0.0.1:4000
|
+-- LiteLLM Proxy (native Windows process)
|    +-- Listen on 127.0.0.1:4000
|    +-- Connect to PostgreSQL
|    +-- Connect to Ollama at 127.0.0.1:11434
|
+-- Ollama (native Windows process)
|    +-- Listen on localhost:11434
|    +-- NVIDIA GPU inference
|
+-- Docker Desktop
     +-- PostgreSQL
     +-- Prometheus
     +-- Grafana
     +-- Monitoring exporters where supported
```

### Network exposure policy

  ------------------------------------------------------------------------
  Service                                       Port Exposure
  --------------------- ---------------------------- ---------------------
  LiteLLM                                       4000 Localhost only;
                                                     published through
                                                     Tailscale Serve

  Ollama                                       11434 Localhost only

  PostgreSQL                                    5432 Docker internal
                                                     network only; do not
                                                     publish to LAN or
                                                     internet

  Prometheus                                    9090 Localhost / internal
                                                     monitoring network
                                                     only

  Grafana                                       3000 Localhost by default;
                                                     optionally private
                                                     tailnet access

  Tailscale Serve                              HTTPS Authorized tailnet
                                                     devices only
  ------------------------------------------------------------------------

Do not configure router port forwarding. Do not use Tailscale Funnel. Do
not expose Ollama directly.

The exact Tailscale Serve configuration and Windows service behavior
must be validated during deployment.

### Future Ubuntu deployment

On Ubuntu, run Ollama natively with NVIDIA drivers and use Docker Engine
/ Docker Compose for PostgreSQL and monitoring. LiteLLM may run in
Docker after validating secure connectivity to the host Ollama service,
or as a native Python service managed by systemd.

Do not solve container-to-host connectivity by casually exposing Ollama
to the whole LAN. Any non-loopback binding must be paired with a
restrictive firewall policy and tested explicitly.

------------------------------------------------------------------------

## 7. API contract

### Base URL

``` text
https://<device>.<tailnet>.ts.net/v1
```

The actual hostname is determined by the Tailscale installation.

### Version 1 endpoints

  ------------------------------------------------------------------------------
  Method            Endpoint                 Priority          Purpose
  ----------------- ------------------------ ----------------- -----------------
  GET               `/v1/models`             Required          Discover
                                                               available models

  POST              `/v1/chat/completions`   Required          Chat and coding
                                                               requests

  GET               `/health`                Required          Gateway health

  GET               `/health/liveliness`     Optional          Process liveness,
                                                               if enabled

  GET               `/health/readiness`      Optional          Dependency
                                                               readiness, if
                                                               enabled

  GET               `/metrics`               Required for      Prometheus
                                             monitoring        metrics, if
                                                               enabled
  ------------------------------------------------------------------------------

Health and metrics routes must be checked against the pinned LiteLLM
version. They must not disclose secrets or sensitive configuration.
Restrict metrics access to the monitoring network or localhost.

### Chat request example

``` json
{
  "model": "general",
  "messages": [
    {
      "role": "system",
      "content": "You are a helpful assistant."
    },
    {
      "role": "user",
      "content": "Explain Java virtual threads."
    }
  ],
  "temperature": 0.7,
  "max_tokens": 2048,
  "stream": true
}
```

### Feature priorities

  Feature                            Priority
  ---------------------------------- ----------
  Standard chat messages and roles   P0
  Streaming via SSE                  P0
  Model discovery                    P0
  Temperature, top_p, max_tokens     P0
  Stop sequences                     P0
  Tool/function calling              P1
  JSON mode / structured output      P1
  Usage/token statistics             P1
  Embeddings                         P2
  OpenAI Responses API               P2

API compatibility does not guarantee model capability. Tool calling,
JSON output, context length, and streaming must be tested for each
model.

### Model abstraction

Expose stable logical model names to clients and map them to Ollama
model tags internally.

  Public model name   Example internal Ollama model
  ------------------- -------------------------------
  `general`           `qwen3:8b`
  `coding`            `qwen2.5-coder:7b`

These are initial examples, not permanent choices. Model tags must be
verified against the Ollama library and benchmarked on the target
hardware.

Changing the underlying model should not require changing client
configuration.

------------------------------------------------------------------------

## 8. LiteLLM configuration baseline

Proposed configuration file: `config/litellm/config.yaml`

``` yaml
model_list:
  - model_name: general
    litellm_params:
      model: ollama_chat/qwen3:8b
      api_base: http://127.0.0.1:11434
      keep_alive: 10m

  - model_name: coding
    litellm_params:
      model: ollama_chat/qwen2.5-coder:7b
      api_base: http://127.0.0.1:11434
      keep_alive: 10m

general_settings:
  master_key: os.environ/LITELLM_MASTER_KEY
  database_url: os.environ/DATABASE_URL
```

This is a configuration starting point, not a complete production
deployment. Validate parameter names and provider behavior against the
exact LiteLLM version selected. Add the required listener, virtual-key
policy, limits, and operational settings during implementation.

### Environment variables

Example `.env.example`:

``` dotenv
LITELLM_MASTER_KEY=replace-with-generated-secret
LITELLM_SALT_KEY=replace-with-generated-secret
DATABASE_URL=postgresql://...
```

Requirements:

-   Generate strong, unique random secrets.
-   Never commit `.env` or real credentials.
-   Never distribute the LiteLLM master key to clients.
-   Keep the salt key stable and backed up securely.
-   Use a dedicated PostgreSQL database and user.
-   Pin LiteLLM and PostgreSQL image versions; do not use floating
    `latest` tags in deployment.
-   Protect backups and configuration files.

------------------------------------------------------------------------

## 9. Authentication and authorization

Use two credential levels.

### Administrator credential

-   LiteLLM master key.
-   Used only for administration and virtual-key management.
-   Never used by ordinary clients.
-   Stored securely and excluded from source control.

### Client credentials

Create one LiteLLM virtual key per client or application.

  Client                 Key alias         Model permissions
  ---------------------- ----------------- ---------------------
  Personal development   `personal-dev`    `general`, `coding`
  Coding harness         `coding-agent`    `coding`
  Mobile application     `mobile-client`   `general`

Virtual keys should have explicit model allowlists, individual limits,
and revocation capability.

### Initial operational limits

These are starting values to be tuned after benchmarking.

  Policy                          Initial value
  ------------------------------- -----------------------------------
  Concurrent inference requests   1--2
  Maximum generated tokens        2,048
  Request rate                    5--10 requests per minute per key
  API key lifetime                90 days
  Model permissions               Explicit allowlist
  Request timeout                 5 minutes

### Security controls

-   Bearer API key authentication.
-   Store only supported secure representations of keys; never log
    plaintext keys.
-   Per-key model authorization.
-   Per-key RPM/TPM and concurrency controls where supported.
-   Key expiration, rotation, and revocation.
-   Maximum request body size.
-   Request and generation timeouts.
-   Redact authorization headers and secrets from logs.
-   Avoid logging full prompts by default.
-   Keep administrative endpoints unavailable to ordinary clients.
-   Keep Ollama bound to localhost.
-   Keep PostgreSQL on an internal Docker network.
-   Back up persistent data and configuration securely.

Tailscale device authentication and LiteLLM API-key authentication are
separate controls. Use both.

------------------------------------------------------------------------

## 10. Tailscale access policy and client compatibility

Use Tailscale as the only remote network path for v1.

Allow only explicitly authorized personal devices to reach the LLM
gateway over HTTPS. Use Tailscale Grants or an appropriately restrictive
access policy. Use Tailscale Serve for private HTTPS forwarding.

Do not grant remote clients access to:

-   Ollama port 11434.
-   PostgreSQL port 5432.
-   Docker management endpoints.
-   Unneeded LiteLLM administrative routes.
-   Prometheus or exporter endpoints.

### Client connection settings

Clients use:

``` text
Base URL: https://<device>.<tailnet>.ts.net/v1
API key:  <client-specific-litellm-key>
Model:    coding
```

Tailscale is a network layer. A client does not need a special Tailscale
integration; its machine needs to be connected to the tailnet and able
to reach the private HTTPS endpoint.

  -----------------------------------------------------------------------
  Client                  Compatibility           Important consideration
  ----------------------- ----------------------- -----------------------
  GitHub Copilot CLI      Potentially compatible  Verify current CLI
                          through supported       configuration and
                          custom model/provider   requirements, including
                          configuration           streaming and tool
                                                  calling

  GitHub Copilot app / VS Depends on the specific Chat model support does
  Code                    Copilot surface and     not imply inline
                          BYOK support            completion or every
                                                  hosted feature is
                                                  supported

  Continue                OpenAI-compatible       Check model-specific
                          provider configuration  capabilities

  Cline                   OpenAI-compatible       Tool calling is
                          provider configuration  important

  OpenAI Python SDK       Supported               Configure custom
                                                  `base_url`

  Custom Java/Python      Supported               Use an
  applications                                    OpenAI-compatible
                                                  client
  -----------------------------------------------------------------------

Compatibility must be verified against the exact client version and
feature. An OpenAI-compatible Chat Completions endpoint does not
guarantee compatibility with every agent harness feature.

Using a custom model endpoint does not necessarily remove the need for
GitHub account or application services.

------------------------------------------------------------------------

## 11. Monitoring and observability

Monitoring is part of v1, but it should be introduced in stages.

### Level 1: Basic health checks and logs

Monitor each component independently.

  Component    What to check                           Example
  ------------ --------------------------------------- ---------------------
  LiteLLM      API health and readiness                `/health`
  Ollama       Process, loaded models, inference       `ollama ps`
  PostgreSQL   Container and database health           `docker compose ps`
  NVIDIA GPU   Utilization, VRAM, temperature, power   `nvidia-smi`
  Tailscale    Tailnet connectivity                    `tailscale status`
  Docker       Container health and restart status     `docker compose ps`

Example Windows checks:

``` powershell
# Check LiteLLM
Invoke-RestMethod http://localhost:4000/health

# Check Ollama
ollama ps

# Check GPU
nvidia-smi

# Check containers
docker compose ps

# Check Tailscale
tailscale status
```

Health endpoints must be confirmed against the selected LiteLLM version.

### Level 2: Prometheus and Grafana

Recommended monitoring stack:

-   **Prometheus:** Collects and stores time-series metrics.
-   **Grafana:** Dashboards and alerts.
-   **LiteLLM metrics:** API request and usage metrics.
-   **Host exporter:** CPU, RAM, disk, and network metrics; choose an
    exporter supported on the current Windows host.
-   **NVIDIA GPU telemetry:** Start with `nvidia-smi` on Windows. For
    Ubuntu, evaluate NVIDIA DCGM Exporter.
-   **PostgreSQL exporter:** Database health and performance metrics.

LiteLLM provides a Prometheus metrics endpoint. Confirm the endpoint,
metric names, and enablement settings for the pinned release.

Keep Prometheus and exporter endpoints private. Grafana should be
localhost-only by default; optionally make Grafana available to
authorized tailnet devices through a separately restricted path.

### Metrics to collect

  Category         Metrics
  ---------------- --------------------------------------------------
  API              Request count, success/error rate, latency
  Inference        Time to first token, tokens per second
  Usage            Input/output tokens, usage per API key
  Runtime          Loaded model, model loading time
  GPU              Utilization, VRAM used/total, temperature, power
  Host             CPU, RAM, disk, network
  Infrastructure   PostgreSQL, LiteLLM, Ollama uptime
  Networking       Tailscale connectivity

Some inference-specific metrics, particularly time to first token and
tokens per second, may require additional instrumentation rather than
relying on standard gateway metrics alone.

### Dashboard panels

The first Grafana dashboard should include:

1.  Gateway status and uptime.
2.  Request rate and error rate.
3.  Request latency and time to first token.
4.  Tokens per second.
5.  Active/in-flight requests.
6.  GPU utilization and VRAM usage.
7.  CPU and RAM usage.
8.  Loaded model and model load behavior.
9.  PostgreSQL health.
10. Tailscale connectivity, checked by a separate health probe if
    needed.

### Alerts

Start with a small set of useful alerts:

-   LiteLLM is unavailable.
-   Ollama is unavailable.
-   PostgreSQL is unavailable.
-   GPU VRAM is close to capacity.
-   GPU temperature exceeds a chosen safe threshold.
-   Request error rate remains elevated.
-   Disk space is low.
-   The host or tailnet health probe fails.

Do not expose monitoring ports to the public internet. Restrict access
to localhost or a private monitoring network.

------------------------------------------------------------------------

## 12. Repository structure

``` text
local-llm-gateway/
├── config/
│   ├── litellm/
│   │   └── config.yaml
│   └── monitoring/
│       ├── prometheus.yml
│       └── grafana/
├── deployment/
│   ├── compose.yaml
│   ├── compose.monitoring.yaml
│   └── postgres/
├── scripts/
│   ├── windows/
│   │   ├── start.ps1
│   │   ├── stop.ps1
│   │   └── health-check.ps1
│   └── linux/
│       ├── start.sh
│       ├── stop.sh
│       └── health-check.sh
├── tests/
│   ├── test-auth.ps1
│   ├── test-chat.ps1
│   ├── test-streaming.ps1
│   └── test-models.ps1
├── .env.example
├── .gitignore
└── README.md
```

Keep secrets out of Git. The `scripts/windows` and `scripts/linux`
directories contain OS-specific lifecycle operations only. Keep service
configuration and test intent portable where practical.

------------------------------------------------------------------------

## 13. Operational lifecycle

### Windows startup sequence

1.  Windows boots.
2.  Docker Desktop and Tailscale start.
3.  PostgreSQL starts and passes its health check.
4.  Ollama starts and its local API becomes ready.
5.  LiteLLM starts after its dependencies are available.
6.  Tailscale Serve exposes the local gateway over the private tailnet.
7.  Health checks verify gateway and inference readiness.
8.  Monitoring containers start and collect metrics.

Use Windows services or Task Scheduler where appropriate. Verify startup
behavior after a real Windows restart; do not assume that an interactive
desktop login is always available.

### Shutdown and recovery

-   Stop the gateway gracefully before planned maintenance.
-   Preserve PostgreSQL data in a persistent volume.
-   Configure restart behavior for supporting containers.
-   Test recovery after Windows restarts.
-   Document manual recovery steps if automatic startup fails.
-   Back up LiteLLM configuration, PostgreSQL data, and secret material
    securely.
-   Document how to re-download model weights if model storage is not
    backed up.

### Future Ubuntu lifecycle

-   Use systemd for native Ollama and, if selected, native LiteLLM.
-   Use Docker Compose for PostgreSQL and monitoring.
-   Use persistent volumes for database and monitoring state.
-   Keep the same logical model aliases and client API contract.
-   Revalidate NVIDIA drivers, GPU access, Tailscale Serve, firewall
    rules, and storage paths.

------------------------------------------------------------------------

## 14. Implementation roadmap

### M1 --- Local inference on Windows

Tasks:

-   Confirm Windows version and NVIDIA driver.
-   Install or update Ollama.
-   Download initial models.
-   Verify GPU acceleration.
-   Measure VRAM use, context capacity, time to first token, and
    generation speed.

Acceptance criteria:

-   Ollama successfully serves local requests.
-   GPU acceleration is confirmed.
-   At least one general model and one coding model are benchmarked.

### M2 --- Gateway deployment

Tasks:

-   Pin and install LiteLLM Proxy.
-   Deploy PostgreSQL using Docker Compose.
-   Configure Ollama model providers.
-   Configure logical model aliases.
-   Verify `/v1/models`, chat completions, and streaming.

Acceptance criteria:

-   OpenAI SDK communicates with local models through LiteLLM.
-   Model aliases work.
-   Streaming works end to end.

### M3 --- Authentication and authorization

Tasks:

-   Configure the master key.
-   Create virtual keys.
-   Restrict models per key.
-   Configure request, token, and concurrency limits.
-   Test invalid, expired, and revoked credentials.

Acceptance criteria:

-   Unauthorized requests are rejected.
-   Client keys cannot perform administrative operations.
-   Model restrictions and limits are enforced.

### M4 --- Remote access

Tasks:

-   Install and configure Tailscale.
-   Authorize personal devices.
-   Configure restrictive Grants/access policy.
-   Configure Tailscale Serve.
-   Test HTTPS access from outside the home network.

Acceptance criteria:

-   Authorized tailnet devices can reach the gateway.
-   Devices outside the tailnet cannot reach it.
-   Ollama and PostgreSQL remain inaccessible remotely.

### M5 --- Client compatibility

Tasks:

-   Test the OpenAI Python SDK.
-   Test streaming and cancellation behavior.
-   Test tool calling and structured output.
-   Test Continue and/or Cline.
-   Test GitHub Copilot CLI custom model support where available.
-   Test upstream failure handling and restarts.

Acceptance criteria:

-   Supported clients use the gateway without custom inference code.
-   Required tool-calling behavior works with the selected model.
-   Unsupported API features fail clearly.
-   Upstream failures produce controlled errors.

### M6 --- Monitoring and operational hardening

Tasks:

-   Deploy Prometheus and Grafana.
-   Configure LiteLLM metrics scraping.
-   Add host, GPU, and PostgreSQL telemetry where supported.
-   Build the initial dashboard.
-   Configure log rotation and basic alerts.
-   Configure automatic startup.
-   Implement PostgreSQL backups.
-   Document recovery procedures.
-   Review firewall and access policies.

Acceptance criteria:

-   Dashboard shows gateway, inference, GPU, and infrastructure health.
-   Alerts detect critical service failures.
-   The service recovers after normal Windows restarts.
-   Data can be restored from backup.
-   Operational procedures are documented.

### Estimated effort

Approximately 3--5 focused days for a working MVP, plus 2--4 days for
testing and hardening. Monitoring depth and client-specific
compatibility may add effort. This estimate assumes no significant
driver, networking, or deployment issues.

------------------------------------------------------------------------

## 15. Acceptance test plan

  -----------------------------------------------------------------------
  Test                                Expected result
  ----------------------------------- -----------------------------------
  Valid API key                       HTTP 200 for valid request

  Invalid API key                     HTTP 401

  Revoked API key                     HTTP 401

  Unauthorized model                  Access denied

  Valid chat request                  Valid completion

  Streaming request                   SSE chunks arrive incrementally

  Excessive concurrency               HTTP 429 or controlled rejection

  Invalid request body                HTTP 400

  Ollama unavailable                  Controlled upstream error

  PostgreSQL unavailable              Gateway fails safely for operations
                                      requiring persistence

  Request outside tailnet             Unreachable

  Monitoring endpoint from            Unreachable
  unauthorized network                

  Windows restart                     Services recover automatically

  Client key attempts admin operation Denied
  -----------------------------------------------------------------------

Also verify that an inference key cannot create other keys or access
administrative functionality.

------------------------------------------------------------------------

## 16. Future migration plan: Windows to Ubuntu

Migration is a future option, not part of the current v1 installation.

### Migration preparation

Before migration:

1.  Back up LiteLLM configuration.
2.  Back up PostgreSQL using a database-aware backup procedure.
3.  Back up `.env` and secret material securely.
4.  Record Ollama model names and parameters; models can be re-pulled if
    needed.
5.  Export or record Tailscale access policy and Serve configuration.
6.  Record firewall and port-binding rules.
7.  Save Grafana dashboards and Prometheus configuration.

### Migration execution outline

1.  Install Ubuntu Server 24.04 LTS.
2.  Install NVIDIA drivers and validate GPU access.
3.  Install Ollama and restore or re-download models.
4.  Deploy PostgreSQL and monitoring using Docker Compose.
5.  Deploy LiteLLM using the selected native or containerized approach.
6.  Restore database state and secrets.
7.  Configure Tailscale and private HTTPS access.
8.  Run the complete acceptance test suite.
9.  Update client base URLs only if the Tailscale hostname changes.

### Migration acceptance criteria

-   Same logical model names are available.
-   Existing client API behavior remains compatible.
-   Virtual keys and relevant gateway state are preserved.
-   GPU inference works.
-   Tailscale-only access remains enforced.
-   Monitoring and alerts work.
-   Backup and restore procedures are validated.

------------------------------------------------------------------------

## 17. Deferred extensions

Do not implement these in v1 unless a concrete requirement justifies
them.

  -----------------------------------------------------------------------
  Extension                           Trigger for implementation
  ----------------------------------- -----------------------------------
  OpenAI Responses API                A client requires it

  Anthropic Messages API              An Anthropic-compatible harness
                                      requires it

  Embeddings endpoint                 Local RAG is introduced

  Redis                               Multiple gateway instances or
                                      shared distributed state are needed

  vLLM                                A different inference runtime is
                                      justified by performance or feature
                                      needs

  Advanced GPU telemetry              Basic GPU monitoring is
                                      insufficient

  Public HTTPS endpoint               A deliberate requirement for
                                      non-tailnet users arises

  Custom administration UI            Key and model management becomes
                                      inconvenient

  Ubuntu migration                    The PC becomes a dedicated server
                                      or Windows operations become
                                      limiting
  -----------------------------------------------------------------------

GitHub Copilot compatibility must be verified for the exact Copilot
surface and version. OpenAI-compatible Chat Completions support alone
does not guarantee support for every Copilot feature, including inline
completions or GitHub-hosted capabilities.

------------------------------------------------------------------------

## 18. Key risks and mitigations

  -----------------------------------------------------------------------
  Risk                                Mitigation
  ----------------------------------- -----------------------------------
  12 GB VRAM limits model size and    Start with quantized 7B--8B models;
  context                             benchmark before increasing limits

  Concurrent requests compete for one Start with 1--2 concurrent requests
  GPU                                 and measure

  Ollama provider feature differences Test each model and capability end
                                      to end

  Gateway or database restart         Health checks, startup
                                      dependencies, persistent volumes,
                                      recovery tests

  Credential leakage                  Separate master/client keys, secret
                                      storage, log redaction

  Accidental network exposure         Localhost binding, Tailscale-only
                                      access, firewall review

  Docker-to-host networking           Keep Ollama and LiteLLM native on
  complexity                          Windows initially

  Copilot feature incompatibility     Verify the exact client integration
                                      and model capabilities

  OS migration breaks service         Isolate OS-specific scripts and
  lifecycle                           document restore/redeployment

  Monitoring exposes sensitive        Restrict exporters and dashboards
  endpoints                           to localhost or private networks
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## 19. Reference documentation

-   LiteLLM Proxy quickstart:
    https://docs.litellm.ai/docs/proxy/quick_start
-   LiteLLM virtual keys:
    https://docs.litellm.ai/docs/proxy/virtual_keys
-   LiteLLM Ollama integration:
    https://docs.litellm.ai/docs/providers/ollama
-   LiteLLM security: https://docs.litellm.ai/docs/proxy/security
-   LiteLLM Prometheus metrics:
    https://docs.litellm.ai/docs/proxy/prometheus
-   Ollama documentation: https://docs.ollama.com/
-   Ollama Windows documentation:
    https://github.com/ollama/ollama/blob/main/docs/windows.mdx
-   Tailscale Serve: https://tailscale.com/docs/features/tailscale-serve
-   Tailscale access control:
    https://tailscale.com/docs/features/access-control
-   NVIDIA DCGM Exporter:
    https://docs.nvidia.com/datacenter/dcgm/latest/gpu-telemetry/dcgm-exporter.html
-   Prometheus documentation: https://prometheus.io/docs/
-   Grafana documentation: https://grafana.com/docs/
-   VS Code language model configuration:
    https://code.visualstudio.com/docs/agent-customization/language-models
-   GitHub Copilot custom models:
    https://docs.github.com/en/copilot/how-tos/github-copilot-app/add-llm-models

------------------------------------------------------------------------

## 20. Final decision summary

The accepted v1 architecture is:

**Windows + Ollama + LiteLLM Proxy + PostgreSQL + Tailscale Serve +
Prometheus + Grafana**

-   Keep Windows as the current host OS; no dual boot.
-   Run Ollama and LiteLLM natively on Windows initially.
-   Run PostgreSQL and monitoring components in Docker.
-   Expose a private, authenticated OpenAI-compatible Chat Completions
    API.
-   Use LiteLLM virtual keys and stable logical model names.
-   Keep Ollama and PostgreSQL inaccessible to remote clients.
-   Use Tailscale as the only remote network path.
-   Monitor API health, usage, latency, GPU, host, and database status.
-   Keep OS-specific deployment scripts separate so Ubuntu Server 24.04
    LTS remains a viable future migration target.

**Architecture status:** Accepted for v1 implementation. Validate exact
component versions, endpoint behavior, client compatibility, and Windows
startup behavior during implementation.
