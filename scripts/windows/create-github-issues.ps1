<#
.SYNOPSIS
    Automates the creation of GitHub Milestones, Labels, and Issues for the Local LLM Gateway project.

.DESCRIPTION
    Uses GitHub REST API v3 to create all 28 project issues (6 Milestone Epics + 22 Granular User Stories)
    in the target GitHub repository (thaihocnguyen-git/my-llm-gateway).

.PARAMETER Token
    GitHub Personal Access Token (PAT) with 'repo' scope. If not specified, reads from $env:GITHUB_TOKEN.

.PARAMETER Repo
    Target repository in format 'owner/repo'. Defaults to 'thaihocnguyen-git/my-llm-gateway'.
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory = $false)]
    [string]$Token = $env:GITHUB_TOKEN,

    [Parameter(Mandatory = $false)]
    [string]$Repo = "thaihocnguyen-git/my-llm-gateway"
)

$ErrorActionPreference = "Stop"

if (-not $Token) {
    Write-Host "No GITHUB_TOKEN provided in parameters or environment." -ForegroundColor Yellow
    $Token = Read-Host "Please enter your GitHub Personal Access Token (PAT with 'repo' scope)"
    if (-not $Token) {
        Write-Error "A GitHub Personal Access Token is required to create issues."
    }
}

$headers = @{
    "Authorization"        = "Bearer $Token"
    "Accept"               = "application/vnd.github+json"
    "X-GitHub-Api-Version" = "2022-11-28"
    "User-Agent"           = "PowerShell-LocalLLM-Gateway-Deployer"
}

$baseUrl = "https://api.github.com/repos/$Repo"

Write-Host "==> Verifying repository access for '$Repo'..." -ForegroundColor Cyan
try {
    $repoInfo = Invoke-RestMethod -Uri $baseUrl -Headers $headers -Method Get
    Write-Host "✓ Connected to $($repoInfo.full_name) (Default branch: $($repoInfo.default_branch))" -ForegroundColor Green
} catch {
    Write-Error "Failed to access $Repo. Please verify your token has 'repo' permissions. Error: $_"
}

# 1. Ensure Labels Exist
Write-Host "`n==> Creating/Checking Labels..." -ForegroundColor Cyan
$labels = @(
    @{ name = "epic"; color = "3E4B9E"; description = "High-level milestone tracking epic" },
    @{ name = "milestone-1"; color = "0E8A16"; description = "M1: Local inference on Windows" },
    @{ name = "milestone-2"; color = "1D76DB"; description = "M2: Gateway deployment & routing" },
    @{ name = "milestone-3"; color = "D93F0B"; description = "M3: Authentication & authorization" },
    @{ name = "milestone-4"; color = "5319E7"; description = "M4: Tailscale private remote access" },
    @{ name = "milestone-5"; color = "FBCA04"; description = "M5: Client compatibility & testing" },
    @{ name = "milestone-6"; color = "0052CC"; description = "M6: Monitoring & operational hardening" },
    @{ name = "security"; color = "B60205"; description = "Security controls and hardening" },
    @{ name = "networking"; color = "006B75"; description = "Network policies and ingress" },
    @{ name = "performance"; color = "C2E0C6"; description = "Benchmarking and VRAM optimization" },
    @{ name = "qa"; color = "BFD4F2"; description = "Acceptance testing and resilience" },
    @{ name = "migration"; color = "D4C5F9"; description = "Ubuntu portability and migration" }
)

foreach ($lbl in $labels) {
    try {
        $body = $lbl | ConvertTo-Json
        Invoke-RestMethod -Uri "$baseUrl/labels" -Headers $headers -Method Post -Body $body -ContentType "application/json" | Out-Null
        Write-Host "  + Created label: $($lbl.name)" -ForegroundColor Green
    } catch {
        # Already exists or minor error - ignore
        Write-Host "  . Label already present: $($lbl.name)" -ForegroundColor DarkGray
    }
}

# 2. Ensure Milestones Exist
Write-Host "`n==> Creating/Checking Milestones..." -ForegroundColor Cyan
$milestonesDef = @(
    @{ title = "M1: Local Inference Engine"; description = "Ollama setup, GPU validation, and model benchmarking" },
    @{ title = "M2: Gateway Deployment"; description = "PostgreSQL Docker, LiteLLM proxy, and model routing" },
    @{ title = "M3: Auth & Security Hardening"; description = "Master key, virtual keys, model allowlists, and rate limits" },
    @{ title = "M4: Private Remote Access"; description = "Tailscale VPN, Tailscale Serve HTTPS, and port lockdown" },
    @{ title = "M5: Client Compatibility"; description = "SDK testing, IDE integration, tool calling, and failure recovery" },
    @{ title = "M6: Monitoring & Ops Hardening"; description = "Prometheus, Grafana, telemetry exporters, and backup automation" }
)

$milestoneMap = @{}
try {
    $existingMilestones = Invoke-RestMethod -Uri "$baseUrl/milestones?state=all" -Headers $headers -Method Get
    foreach ($m in $existingMilestones) {
        $milestoneMap[$m.title] = $m.number
    }
} catch {
    Write-Warning "Could not list existing milestones: $_"
}

foreach ($m in $milestonesDef) {
    if (-not $milestoneMap.ContainsKey($m.title)) {
        try {
            $body = $m | ConvertTo-Json
            $created = Invoke-RestMethod -Uri "$baseUrl/milestones" -Headers $headers -Method Post -Body $body -ContentType "application/json"
            $milestoneMap[$m.title] = $created.number
            Write-Host "  + Created milestone: $($m.title) (ID: $($created.number))" -ForegroundColor Green
        } catch {
            Write-Warning "Failed to create milestone $($m.title): $_"
        }
    } else {
        Write-Host "  . Milestone exists: $($m.title) (ID: $($milestoneMap[$m.title]))" -ForegroundColor DarkGray
    }
}

# 3. Read Issues Definition
$issuesJsonPath = Join-Path $PSScriptRoot "..\..\github-issues-data.json"
if (-not (Test-Path $issuesJsonPath)) {
    Write-Error "Issue definition JSON not found at $issuesJsonPath"
}

$issuesList = Get-Content $issuesJsonPath -Raw -Encoding UTF8 | ConvertFrom-Json

Write-Host "`n==> Publishing $($issuesList.Count) Issues to GitHub..." -ForegroundColor Cyan

$successCount = 0
foreach ($issue in $issuesList) {
    $payload = @{
        title  = $issue.title
        body   = $issue.body
        labels = $issue.labels
    }

    if ($issue.milestone -and $milestoneMap.ContainsKey($issue.milestone)) {
        $payload["milestone"] = $milestoneMap[$issue.milestone]
    }

    $jsonPayload = $payload | ConvertTo-Json -Depth 5
    try {
        $created = Invoke-RestMethod -Uri "$baseUrl/issues" -Headers $headers -Method Post -Body $jsonPayload -ContentType "application/json; charset=utf-8"
        Write-Host "  + [#$($created.number)] $($issue.title)" -ForegroundColor Green
        $successCount++
        Start-Sleep -Milliseconds 600 # Respect GitHub secondary rate limits
    } catch {
        Write-Host "  X Failed to create '$($issue.title)': $_" -ForegroundColor Red
    }
}

Write-Host "`n=======================================================" -ForegroundColor Cyan
Write-Host " Successfully created $successCount / $($issuesList.Count) issues!" -ForegroundColor Green
Write-Host " View issues at: https://github.com/$Repo/issues" -ForegroundColor Yellow
Write-Host "=======================================================" -ForegroundColor Cyan
