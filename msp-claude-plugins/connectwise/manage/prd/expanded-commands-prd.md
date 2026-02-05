# ConnectWise Manage Expanded Commands PRD

> Version: 1.0.0
> Created: 2026-02-04
> Status: Draft

## Overview

This PRD defines 8 slash commands for the ConnectWise Manage Claude Code plugin. These commands provide comprehensive ticket lifecycle management, time tracking, configuration item lookups, and scheduling capabilities for MSP technicians.

## Commands Summary

| Priority | Command | Description |
|----------|---------|-------------|
| P0 | `/get-ticket` | Get detailed ticket information |
| P0 | `/update-ticket` | Update ticket fields (status, priority, board) |
| P0 | `/add-note` | Add internal or discussion note to ticket |
| P0 | `/close-ticket` | Close a ticket with resolution notes |
| P1 | `/log-time` | Log time entry against ticket |
| P1 | `/lookup-config` | Search configuration items |
| P1 | `/check-agreement` | View agreement status and entitlements |
| P2 | `/schedule-entry` | Create a schedule entry/appointment |

---

## Command Specifications

### 1. /get-ticket

**Description:** Retrieve detailed ticket information including status, notes, time entries, and configuration items.

**Priority:** P0 - Core workflow command

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `ticket_id` | integer | Yes | The ConnectWise ticket ID |
| `include_notes` | boolean | No | Include ticket notes (default: true) |
| `include_time` | boolean | No | Include time entries (default: false) |
| `include_configs` | boolean | No | Include associated configuration items (default: false) |
| `include_tasks` | boolean | No | Include service ticket tasks (default: false) |

#### API Endpoints Used

```
GET /service/tickets/{id}
GET /service/tickets/{id}/notes
GET /service/tickets/{id}/timeentries
GET /service/tickets/{id}/configurations
GET /service/tickets/{id}/tasks
```

#### Example Usage

```
/get-ticket 12345

/get-ticket 12345 --include_time true --include_configs true

/get-ticket 12345 --include_notes true --include_tasks true
```

#### Why It's Valuable

Complete ticket context is essential for effective troubleshooting. Quick access to all ticket details, history, and related items enables technicians to understand issues without navigating the ConnectWise UI.

---

### 2. /update-ticket

**Description:** Update fields on an existing ConnectWise ticket including status, priority, board, and assignment.

**Priority:** P0 - Core workflow command

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `ticket_id` | integer | Yes | The ConnectWise ticket ID to update |
| `status` | string | No | New status name (e.g., "In Progress", "Waiting on Customer") |
| `priority` | string | No | Priority name (e.g., "Priority 1 - Critical") |
| `board` | string | No | Service board name to move ticket to |
| `type` | string | No | Ticket type (e.g., "Service Request", "Incident") |
| `subtype` | string | No | Ticket subtype |
| `owner` | string | No | Member identifier to assign ticket |
| `summary` | string | No | Update ticket summary/title |

#### API Endpoints Used

```
PATCH /service/tickets/{id}
GET /service/tickets/{id} (for validation)
GET /service/boards/{id}/statuses (for status lookup)
GET /service/priorities (for priority lookup)
GET /service/boards (for board lookup)
GET /system/members (for owner lookup)
```

#### Example Usage

```
/update-ticket 12345 --status "In Progress" --priority "Priority 2 - High"

/update-ticket 12345 --board "Escalations" --owner "jsmith"

/update-ticket 12345 --type "Incident" --subtype "Hardware"
```

#### Why It's Valuable

Ticket updates are the most common PSA operation. This command eliminates UI navigation for routine status changes, keeping technicians productive in their preferred environment.

---

### 3. /add-note

**Description:** Add an internal or external note to a ConnectWise ticket.

**Priority:** P0 - Core workflow command

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `ticket_id` | integer | Yes | The ConnectWise ticket ID |
| `text` | string | Yes | The note content (supports multi-line) |
| `detail_description` | boolean | No | Add to detail description (default: false) |
| `internal_analysis` | boolean | No | Add to internal analysis (default: false) |
| `resolution` | boolean | No | Add to resolution field (default: false) |
| `flag` | string | No | Note flag: "internal" (default), "external", "both" |

#### API Endpoints Used

```
POST /service/tickets/{id}/notes
PATCH /service/tickets/{id} (for detail/analysis/resolution fields)
```

#### Example Usage

```
/add-note 12345 "Contacted customer, issue reproduced on their end"

/add-note 12345 "Applied KB12345 patch, monitoring for recurrence" --flag external

/add-note 12345 "Root cause identified as DNS misconfiguration" --internal_analysis true

/add-note 12345 "Issue resolved by correcting DNS settings" --resolution true
```

#### Why It's Valuable

Thorough documentation improves service quality and knowledge transfer. Quick note addition encourages better ticket hygiene without workflow disruption.

---

### 4. /close-ticket

**Description:** Close a ConnectWise ticket with resolution notes and optional time entry.

**Priority:** P0 - Core workflow command

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `ticket_id` | integer | Yes | The ConnectWise ticket ID to close |
| `resolution` | string | Yes | Resolution notes describing how issue was resolved |
| `status` | string | No | Closed status name (defaults to board's default closed status) |
| `time_minutes` | integer | No | Log final time entry in minutes |
| `time_notes` | string | No | Notes for the time entry (if time_minutes provided) |
| `billable` | boolean | No | Mark time as billable (default: true) |

#### API Endpoints Used

```
PATCH /service/tickets/{id}
POST /service/tickets/{id}/notes (for resolution note)
POST /time/entries (if time provided)
GET /service/boards/{boardId}/statuses (for closed status lookup)
```

#### Example Usage

```
/close-ticket 12345 "Password reset completed and verified with user"

/close-ticket 12345 "Server patched and rebooted successfully" --time_minutes 30 --time_notes "Applied security patches"

/close-ticket 12345 "Hardware replaced under warranty" --status "Completed" --billable false
```

#### Why It's Valuable

Ticket closure is a critical workflow step that often requires multiple UI interactions. This command streamlines the process while ensuring proper documentation and time capture.

---

### 5. /log-time

**Description:** Log a time entry against a ConnectWise ticket.

**Priority:** P1 - Time tracking command

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `ticket_id` | integer | Yes | The ticket ID to log time against |
| `time_start` | datetime | Yes | Start time of the work |
| `time_end` | datetime | No | End time (required if actual_hours not provided) |
| `actual_hours` | decimal | No | Hours worked (alternative to time_end) |
| `notes` | string | No | Work description/notes |
| `billable` | string | No | Billable option: "Billable", "DoNotBill", "NoCharge" |
| `work_type` | string | No | Work type name (e.g., "Remote Support") |
| `work_role` | string | No | Work role name (e.g., "Engineer") |

#### API Endpoints Used

```
POST /time/entries
GET /time/workTypes (for work type lookup)
GET /time/workRoles (for work role lookup)
GET /service/tickets/{id} (for ticket validation)
```

#### Example Usage

```
/log-time 12345 "2026-02-04 09:00" --actual_hours 1.5 --notes "Troubleshot network connectivity"

/log-time 12345 "2026-02-04 10:00" "2026-02-04 11:30" --billable Billable --work_type "Remote Support"

/log-time 12345 "2026-02-04 14:00" --actual_hours 0.5 --billable DoNotBill --notes "Internal documentation"
```

#### Why It's Valuable

Accurate time tracking directly impacts MSP profitability. Quick time entry reduces lost billable hours and encourages real-time logging instead of end-of-day estimates.

---

### 6. /lookup-config

**Description:** Search for configuration items (assets) by name, serial number, tag number, or company.

**Priority:** P1 - Supporting lookup command

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | No* | Search by name, serial, or tag number |
| `company_id` | integer | No | Filter by company ID |
| `type` | string | No | Configuration type name (e.g., "Workstation", "Server") |
| `status` | string | No | Configuration status (e.g., "Active", "Inactive") |
| `limit` | integer | No | Maximum results (default: 25, max: 100) |

*Required if company_id not provided

#### API Endpoints Used

```
GET /company/configurations?conditions=name like '%{query}%'
GET /company/configurations?conditions=serialNumber='{query}'
GET /company/configurations?conditions=tagNumber='{query}'
GET /company/configurations/types (for type lookup)
GET /company/configurations/statuses (for status lookup)
```

#### Example Usage

```
/lookup-config "ACME-WS-001"

/lookup-config --company_id 12345 --type "Server" --status "Active"

/lookup-config "SN123456789" --limit 10

/lookup-config "Dell" --type "Workstation"
```

#### Why It's Valuable

Configuration item context is critical for troubleshooting and impact assessment. Quick lookup provides hardware specs, warranty info, and related tickets without leaving the workflow.

---

### 7. /check-agreement

**Description:** View agreement status, covered products, and remaining hours/incidents for a company.

**Priority:** P1 - Business operations command

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `company_id` | integer | No* | Company ID to check agreements for |
| `agreement_id` | integer | No* | Specific agreement ID to check |
| `include_additions` | boolean | No | Include agreement additions (default: true) |
| `active_only` | boolean | No | Only show active agreements (default: true) |

*Either `company_id` or `agreement_id` is required

#### API Endpoints Used

```
GET /finance/agreements?conditions=company/id={companyId}
GET /finance/agreements/{id}
GET /finance/agreements/{id}/additions
GET /finance/agreements/{id}/workTypes
GET /finance/agreements/{id}/workRoles
```

#### Example Usage

```
/check-agreement --company_id 12345

/check-agreement --agreement_id 9876 --include_additions true

/check-agreement --company_id 12345 --active_only true
```

#### Output Includes

- Agreement name, type, and status
- Covered work types and work roles
- Prepaid hours remaining (for block agreements)
- Incident packs remaining
- Covered configuration types
- Expiration date and billing information

#### Why It's Valuable

Understanding agreement coverage is essential before committing to work. This prevents billing disputes and ensures proper work type selection for covered services.

---

### 8. /schedule-entry

**Description:** Create a schedule entry/appointment in ConnectWise, optionally linked to a ticket.

**Priority:** P2 - Scheduling command

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | Yes | Schedule entry name/subject |
| `start_date` | datetime | Yes | Start date and time |
| `end_date` | datetime | Yes | End date and time |
| `member` | string | No | Member identifier (defaults to current user) |
| `ticket_id` | integer | No | Associated ticket ID |
| `type` | string | No | Schedule type (e.g., "Service", "Sales", "Meeting") |
| `location` | string | No | Location/address |
| `reminder_minutes` | integer | No | Reminder time in minutes before start |
| `status` | string | No | Schedule status (e.g., "Firm", "Tentative") |

#### API Endpoints Used

```
POST /schedule/entries
GET /schedule/types (for type lookup)
GET /schedule/statuses (for status lookup)
GET /system/members (for member lookup)
```

#### Example Usage

```
/schedule-entry "Server Maintenance" "2026-02-10 09:00" "2026-02-10 12:00" --ticket_id 12345

/schedule-entry "On-site Support" "2026-02-11 14:00" "2026-02-11 17:00" --location "123 Main St" --type "Service"

/schedule-entry "Customer Meeting" "2026-02-12 10:00" "2026-02-12 11:00" --status "Tentative" --reminder_minutes 30
```

#### Why It's Valuable

Scheduling is integral to service delivery. Quick schedule creation from the command line, especially when linked to tickets, ensures appointments are properly tracked in the PSA.

---

## Implementation Notes

### Authentication

ConnectWise Manage uses REST API with Basic Authentication:
- **Format:** `company+publicKey:privateKey` (Base64 encoded)
- **Headers:**
  - `Authorization: Basic {encoded_credentials}`
  - `clientId: {your_client_id}` (required for API access)
  - `Content-Type: application/json`

Example:
```
Authorization: Basic Y29tcGFueStwdWJsaWNLZXk6cHJpdmF0ZUtleQ==
clientId: abc123-def456-ghi789
```

### Rate Limiting

ConnectWise rate limits vary by endpoint and are based on:
- **Per-minute limits:** Varies by endpoint category
- **Burst limits:** Short-term request spikes
- **Headers:** `X-RateLimit-Remaining`, `X-RateLimit-Limit`, `Retry-After`

Commands should:
- Implement exponential backoff on 429 responses
- Cache lookup results (statuses, priorities, boards)
- Respect `Retry-After` header values

### Error Handling

Common error scenarios to handle:
- Invalid entity IDs (404 Not Found)
- Permission denied (401/403)
- Rate limiting (429 Too Many Requests)
- Validation errors (400 with error array)
- Field-level errors in response body

Error response format:
```json
{
  "code": "InvalidArgument",
  "message": "Status is not valid for this board",
  "errors": [
    {
      "code": "InvalidArgument",
      "message": "Status must be one of: New, In Progress, Completed",
      "resource": "ticket",
      "field": "status"
    }
  ]
}
```

### Pagination

ConnectWise uses page-based pagination:
- `page`: Page number (1-based)
- `pageSize`: Records per page (max 1000)
- Response includes `Link` header with pagination URLs

### Conditions Syntax

ConnectWise uses a conditions query parameter for filtering:
```
?conditions=field1='value1' and field2 like '%value%'
```

Operators: `=`, `!=`, `<`, `>`, `<=`, `>=`, `like`, `contains`, `in`

### Caching Strategy

- Cache board statuses for 1 hour
- Cache priorities for 1 hour
- Cache work types/roles for 1 hour
- Cache member list for 15 minutes
- Cache company lookups for 5 minutes

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Command adoption | 50% of users using 3+ commands within 30 days |
| Time saved per ticket update | 25+ seconds vs. UI |
| Error rate | < 5% of command invocations |
| Time entry capture rate | 20% improvement in logged time |
| User satisfaction | NPS > 50 for command experience |

---

## Dependencies

- ConnectWise Manage REST API v2021.1+
- Valid API credentials (public/private key pair)
- ClientId registered with ConnectWise Developer Network
- Appropriate member API permissions

## References

- [ConnectWise Manage REST API Documentation](https://developer.connectwise.com/Products/Manage/REST)
- [ConnectWise Developer Network](https://developer.connectwise.com/)
- [API Authentication Guide](https://developer.connectwise.com/Products/Manage/Developer_Guide/Authentication)
