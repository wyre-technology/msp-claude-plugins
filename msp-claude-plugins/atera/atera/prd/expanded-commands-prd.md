# Atera Expanded Commands PRD

> Version: 1.0.0
> Created: 2026-02-04
> Status: Draft

## Overview

This PRD defines 8 additional slash commands for the Atera Claude Code plugin. These commands extend the existing `/create-ticket` and `/search-agents` functionality to provide comprehensive ticket management, alert handling, PowerShell execution, and monitoring capabilities unique to Atera's unified RMM/PSA platform.

## Commands Summary

| Priority | Command | Description |
|----------|---------|-------------|
| P0 | `/update-ticket` | Update ticket fields (status, priority, technician) |
| P0 | `/list-alerts` | List active RMM alerts |
| P0 | `/resolve-alert` | Resolve an RMM alert |
| P1 | `/run-powershell` | Execute PowerShell script on an agent |
| P1 | `/search-customers` | Search for customers by name or criteria |
| P1 | `/create-monitor` | Create a threshold-based monitor |
| P1 | `/get-kb-articles` | Search knowledge base articles |
| P2 | `/log-time` | Log work hours on a ticket |

---

## Command Specifications

### 1. /update-ticket

**Description:** Update fields on an existing Atera ticket including status, priority, technician assignment, and custom fields.

**Priority:** P0 - Core workflow command

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `ticket_id` | integer | Yes | The Atera ticket ID to update |
| `status` | string | No | New status: "Open", "Pending", "Resolved", "Closed" |
| `priority` | string | No | Priority: "Low", "Medium", "High", "Critical" |
| `technician_email` | string | No | Technician email to assign |
| `ticket_type` | string | No | Type: "Problem", "Request", "Incident", "Change" |
| `impact` | string | No | Impact level: "Minor", "Major", "Crisis", "No Impact" |

#### API Endpoints Used

```
PUT /api/v3/tickets/{ticketId}
GET /api/v3/tickets/{ticketId} (for validation)
GET /api/v3/technicians (for assignment lookup)
```

#### Example Usage

```
/update-ticket 12345 --status "Pending" --priority High

/update-ticket 12345 --technician_email "john.doe@msp.com" --ticket_type "Incident"

/update-ticket 12345 --impact "Major" --status "Resolved"
```

#### Why It's Valuable

Ticket status updates are constant in MSP workflows. Quick updates from the command line maintain accurate ticket states without context switching.

---

### 2. /list-alerts

**Description:** List active RMM alerts with filtering by customer, severity, and alert type.

**Priority:** P0 - RMM core command

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `customer_id` | integer | No | Filter by customer ID |
| `severity` | string | No | Filter: "Information", "Warning", "Critical" |
| `alert_category` | string | No | Filter: "Hardware", "Disk", "Availability", "Performance", "General" |
| `since` | datetime | No | Alerts since date (default: last 24 hours) |
| `limit` | integer | No | Maximum results (default: 50, max: 500) |

#### API Endpoints Used

```
GET /api/v3/alerts
GET /api/v3/alerts?customerId={id}
```

#### Example Usage

```
/list-alerts

/list-alerts --customer_id 12345 --severity Critical

/list-alerts --alert_category Disk --since "2026-02-01"

/list-alerts --severity Warning --limit 100
```

#### Why It's Valuable

Proactive alert monitoring is fundamental to MSP operations. Quick alert visibility enables rapid response and prioritization without switching to the Atera dashboard.

---

### 3. /resolve-alert

**Description:** Resolve an RMM alert and optionally create an associated ticket.

**Priority:** P0 - RMM core command

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `alert_id` | integer | Yes | The alert ID to resolve |
| `resolution_note` | string | No | Note describing the resolution |
| `create_ticket` | boolean | No | Create a ticket from this alert (default: false) |
| `ticket_title` | string | No | Title if creating ticket |

#### API Endpoints Used

```
POST /api/v3/alerts/{alertId}/resolve
POST /api/v3/tickets (if create_ticket=true)
GET /api/v3/alerts/{alertId} (for context)
```

#### Example Usage

```
/resolve-alert 9876 --resolution_note "Disk space issue resolved by cleanup script"

/resolve-alert 9876 --create_ticket true --ticket_title "Critical disk alert - resolved"

/resolve-alert 9876
```

#### Why It's Valuable

Quick alert resolution maintains accurate system status and reduces alert fatigue. Optional ticket creation ensures work documentation without manual data entry.

---

### 4. /run-powershell

**Description:** Execute a PowerShell script on a specific Atera agent (endpoint).

**Priority:** P1 - RMM automation command

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `agent_id` | integer | Yes | The agent ID to execute on |
| `script` | string | No* | Inline PowerShell script |
| `script_id` | integer | No* | Saved script ID from Atera library |
| `run_as` | string | No | Execution context: "System", "LoggedOnUser" (default: "System") |
| `timeout` | integer | No | Timeout in seconds (default: 300) |

*Either `script` or `script_id` is required

#### API Endpoints Used

```
POST /api/v3/agents/{agentId}/runpowershell
GET /api/v3/agents/{agentId}/powershellstatus/{executionId}
GET /api/v3/customscripts (for script library)
```

#### Example Usage

```
/run-powershell 12345 --script "Get-Process | Where-Object {$_.CPU -gt 100}"

/run-powershell 12345 --script_id 567 --run_as LoggedOnUser

/run-powershell 12345 --script "Restart-Service Spooler" --timeout 60
```

#### Why It's Valuable

Remote script execution is essential for troubleshooting and remediation. Direct execution from the command line enables rapid response without navigating multiple UI screens.

---

### 5. /search-customers

**Description:** Search for Atera customers by name, domain, or other attributes.

**Priority:** P1 - Supporting lookup command

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | Yes | Customer name or partial match |
| `include_contacts` | boolean | No | Include contact list (default: false) |
| `include_agents` | boolean | No | Include agent count/summary (default: false) |
| `limit` | integer | No | Maximum results (default: 25) |

#### API Endpoints Used

```
GET /api/v3/customers?filter=name contains '{query}'
GET /api/v3/customers/{id}/contacts
GET /api/v3/agents?customerId={id}
```

#### Example Usage

```
/search-customers "Acme"

/search-customers "Acme Corp" --include_contacts true

/search-customers "Acme" --include_agents true --limit 10
```

#### Why It's Valuable

Customer lookup is foundational for ticket creation and context gathering. Quick search provides essential information without UI navigation.

---

### 6. /create-monitor

**Description:** Create a threshold-based monitor for an agent (HTTP, TCP, or SNMP).

**Priority:** P1 - RMM automation command

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `agent_id` | integer | Yes | The agent ID to monitor |
| `monitor_type` | string | Yes | Type: "HTTP", "TCP", "SNMP" |
| `name` | string | Yes | Monitor display name |
| `target` | string | Yes | URL, port, or OID to monitor |
| `interval` | integer | No | Check interval in minutes (default: 5) |
| `threshold` | string | No | Alert threshold value |
| `alert_severity` | string | No | Severity: "Information", "Warning", "Critical" (default: "Warning") |

#### API Endpoints Used

```
POST /api/v3/agents/{agentId}/monitors/http
POST /api/v3/agents/{agentId}/monitors/tcp
POST /api/v3/agents/{agentId}/monitors/snmp
```

#### Example Usage

```
/create-monitor 12345 --monitor_type HTTP --name "Website Check" --target "https://example.com" --interval 5

/create-monitor 12345 --monitor_type TCP --name "SQL Port" --target "1433" --alert_severity Critical

/create-monitor 12345 --monitor_type SNMP --name "CPU Usage" --target "1.3.6.1.2.1.25.3.3.1.2" --threshold "90"
```

#### Why It's Valuable

Custom monitoring extends Atera's capabilities to specific customer needs. Quick monitor creation enables proactive monitoring setup during troubleshooting sessions.

---

### 7. /get-kb-articles

**Description:** Search the Atera knowledge base for articles and solutions.

**Priority:** P1 - Knowledge management command

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | Yes | Search terms for knowledge base |
| `folder` | string | No | Filter by KB folder name |
| `visibility` | string | No | Filter: "Internal", "CustomerPortal", "All" (default: "All") |
| `limit` | integer | No | Maximum results (default: 10) |

#### API Endpoints Used

```
GET /api/v3/knowledgebase/articles?search={query}
GET /api/v3/knowledgebase/folders (for folder list)
```

#### Example Usage

```
/get-kb-articles "password reset"

/get-kb-articles "printer setup" --folder "How-To Guides"

/get-kb-articles "VPN" --visibility Internal --limit 20
```

#### Why It's Valuable

Knowledge base access during troubleshooting improves resolution times. Quick article search surfaces relevant solutions without leaving the workflow.

---

### 8. /log-time

**Description:** Log work hours on an Atera ticket for billing and tracking.

**Priority:** P2 - Time tracking command

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `ticket_id` | integer | Yes | The ticket ID to log time against |
| `hours` | decimal | Yes | Hours worked (e.g., 0.5, 1.25, 2) |
| `notes` | string | No | Work description |
| `date` | date | No | Date of work (default: today) |
| `billable` | boolean | No | Mark as billable (default: true) |
| `hourly_rate` | decimal | No | Override hourly rate |

#### API Endpoints Used

```
POST /api/v3/tickets/{ticketId}/workhours
GET /api/v3/tickets/{ticketId} (for validation)
```

#### Example Usage

```
/log-time 12345 1.5 --notes "Troubleshot network connectivity issue"

/log-time 12345 0.5 --billable false --notes "Internal documentation"

/log-time 12345 2 --date "2026-02-03" --hourly_rate 150
```

#### Why It's Valuable

Accurate time tracking directly impacts MSP revenue. Quick time logging reduces lost billable hours and supports accurate customer billing.

---

## Implementation Notes

### Authentication

Atera uses API key authentication:
- Header: `X-API-KEY: {your-api-key}`
- Base URL: `https://app.atera.com/api/v3`

### Rate Limiting

Atera enforces 700 requests per minute. Commands should:
- Implement exponential backoff on 429 responses
- Cache frequently accessed data (customers, agents)
- Batch requests when possible

### Error Handling

Common error scenarios to handle:
- Invalid entity IDs (404)
- Permission denied (403)
- Rate limiting (429)
- Validation errors (400 with error details)
- Offline agent for PowerShell execution

### Pagination

Atera uses OData-style pagination:
- `$top`: Number of records (max 50 for most endpoints)
- `$skip`: Number of records to skip
- Returns `Page`, `ItemsInPage`, `TotalPages`, `TotalItemsCount`

### Caching Strategy

- Cache customer list for 10 minutes
- Cache agent list for 5 minutes
- Cache KB articles for 30 minutes
- Cache technician list for 15 minutes

### PowerShell Execution Notes

- Scripts run asynchronously; poll for completion
- Maximum script output: 100KB
- Timeout handling is critical for long-running scripts
- Consider security implications of inline scripts

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Command adoption | 50% of users using 3+ commands within 30 days |
| Alert resolution time | 20% improvement in MTTR |
| PowerShell usage | 30% of automation tasks via command |
| Time entry capture rate | 15% improvement in logged time |

---

## Dependencies

- Atera API v3
- Valid API key with appropriate permissions
- Atera subscription with API access

## References

- [Atera API Documentation](https://app.atera.com/apidocs/)
- [Atera Developer Portal](https://support.atera.com/hc/en-us/categories/200325185-Integrations-API)
