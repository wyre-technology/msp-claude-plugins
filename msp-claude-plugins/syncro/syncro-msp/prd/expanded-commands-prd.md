# Syncro MSP Expanded Commands PRD

> Version: 1.0.0
> Created: 2026-02-04
> Status: Draft

## Overview

This PRD defines 8 additional slash commands for the Syncro MSP Claude Code plugin. These commands extend the existing `/create-ticket` and `/search-tickets` functionality to provide comprehensive ticket management, time tracking, alert handling, and customer operations support.

## Commands Summary

| Priority | Command | Description |
|----------|---------|-------------|
| P0 | `/update-ticket` | Update ticket fields (status, priority, assignee) |
| P0 | `/add-ticket-comment` | Add a comment to an existing ticket |
| P0 | `/log-time` | Log time entry against a ticket |
| P1 | `/get-customer` | Get detailed customer information |
| P1 | `/list-alerts` | List active RMM alerts |
| P1 | `/resolve-alert` | Resolve an RMM alert |
| P1 | `/search-assets` | Search for customer assets |
| P2 | `/create-appointment` | Create a calendar appointment |

---

## Command Specifications

### 1. /update-ticket

**Description:** Update fields on an existing Syncro ticket including status, priority, problem type, and assignment.

**Priority:** P0 - Core workflow command

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `ticket_id` | integer | Yes | The Syncro ticket ID to update |
| `status` | string | No | New status: "New", "In Progress", "Resolved", "Closed" |
| `priority` | string | No | Priority: "Low", "Medium", "High", "Urgent" |
| `problem_type` | string | No | Problem type category |
| `user_id` | integer | No | Technician user ID to assign |
| `due_date` | datetime | No | Due date for the ticket |

#### API Endpoints Used

```
PUT /api/v1/tickets/{id}
GET /api/v1/tickets/{id} (for validation)
GET /api/v1/ticket_statuses (for status lookup)
```

#### Example Usage

```
/update-ticket 12345 --status "In Progress" --priority High

/update-ticket 12345 --user_id 567 --due_date "2026-02-10"
```

#### Why It's Valuable

Technicians need to update ticket status in real-time as work progresses. This command keeps them in their workflow without context-switching to the Syncro web UI.

---

### 2. /add-ticket-comment

**Description:** Add a comment to an existing Syncro ticket, with options for visibility and internal notes.

**Priority:** P0 - Core workflow command

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `ticket_id` | integer | Yes | The Syncro ticket ID |
| `comment` | string | Yes | The comment content |
| `hidden` | boolean | No | Hide from customer portal (default: false) |
| `do_not_email` | boolean | No | Prevent email notification (default: false) |

#### API Endpoints Used

```
POST /api/v1/tickets/{id}/comments
GET /api/v1/tickets/{id}/comments (for history)
```

#### Example Usage

```
/add-ticket-comment 12345 "Customer confirmed issue is resolved"

/add-ticket-comment 12345 "Internal: Need to escalate to vendor" --hidden true

/add-ticket-comment 12345 "Following up on issue" --do_not_email true
```

#### Why It's Valuable

Ticket documentation is critical for MSP operations. Quick comment addition encourages thorough documentation and maintains communication history.

---

### 3. /log-time

**Description:** Log a time entry against a Syncro ticket for billing and tracking purposes.

**Priority:** P0 - Core workflow command

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `ticket_id` | integer | Yes | The ticket ID to log time against |
| `duration` | string | Yes | Duration in minutes or HH:MM format |
| `notes` | string | No | Work description/notes |
| `billable` | boolean | No | Mark as billable (default: true) |
| `timer_started_at` | datetime | No | Start time (defaults to now minus duration) |
| `product_id` | integer | No | Product/service ID for billing |

#### API Endpoints Used

```
POST /api/v1/tickets/{id}/timer_entries
GET /api/v1/products (for product lookup)
```

#### Example Usage

```
/log-time 12345 30 --notes "Troubleshot network connectivity issue"

/log-time 12345 "1:30" --billable true --notes "Server migration work"

/log-time 12345 45 --billable false --notes "Internal documentation"
```

#### Why It's Valuable

Accurate time tracking directly impacts MSP revenue. Quick time logging reduces lost billable hours and improves reporting accuracy.

---

### 4. /get-customer

**Description:** Retrieve detailed customer information including contacts, assets, and recent tickets.

**Priority:** P1 - Supporting lookup command

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `customer_id` | integer | No* | Customer ID to look up |
| `query` | string | No* | Search by customer name |
| `include_assets` | boolean | No | Include asset list (default: false) |
| `include_tickets` | boolean | No | Include recent tickets (default: false) |

*Either `customer_id` or `query` is required

#### API Endpoints Used

```
GET /api/v1/customers/{id}
GET /api/v1/customers?query={query}
GET /api/v1/customers/{id}/assets
GET /api/v1/tickets?customer_id={id}
```

#### Example Usage

```
/get-customer 12345

/get-customer --query "Acme Corp"

/get-customer 12345 --include_assets true --include_tickets true
```

#### Why It's Valuable

Customer context is essential for ticket handling and service delivery. Quick access to customer details, contracts, and history improves service quality.

---

### 5. /list-alerts

**Description:** List active RMM alerts across all customers or filtered by criteria.

**Priority:** P1 - RMM integration command

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `customer_id` | integer | No | Filter by customer ID |
| `severity` | string | No | Filter by severity: "Low", "Medium", "High", "Critical" |
| `status` | string | No | Filter: "active", "resolved", "all" (default: "active") |
| `asset_id` | integer | No | Filter by specific asset |
| `limit` | integer | No | Maximum results (default: 25) |

#### API Endpoints Used

```
GET /api/v1/rmm_alerts
GET /api/v1/rmm_alerts?customer_id={id}
```

#### Example Usage

```
/list-alerts

/list-alerts --customer_id 12345 --severity Critical

/list-alerts --status active --limit 50
```

#### Why It's Valuable

Alert visibility is critical for proactive MSP operations. Quick alert access enables faster response times and better prioritization.

---

### 6. /resolve-alert

**Description:** Resolve an RMM alert and optionally create a ticket or add resolution notes.

**Priority:** P1 - RMM integration command

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `alert_id` | integer | Yes | The alert ID to resolve |
| `resolution_note` | string | No | Note explaining the resolution |
| `create_ticket` | boolean | No | Create a ticket from this alert (default: false) |
| `ticket_subject` | string | No | Subject if creating ticket |

#### API Endpoints Used

```
PUT /api/v1/rmm_alerts/{id}/resolve
POST /api/v1/tickets (if create_ticket=true)
```

#### Example Usage

```
/resolve-alert 9876 --resolution_note "Disk space cleared by removing temp files"

/resolve-alert 9876 --create_ticket true --ticket_subject "Server disk space issue - resolved"

/resolve-alert 9876
```

#### Why It's Valuable

Quick alert resolution maintains accurate system status and clears noise from alert dashboards. Optional ticket creation ensures documentation of work performed.

---

### 7. /search-assets

**Description:** Search for customer assets by name, serial number, type, or customer association.

**Priority:** P1 - Supporting lookup command

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | No* | Search by asset name or serial |
| `customer_id` | integer | No | Filter by customer ID |
| `asset_type` | string | No | Filter by type: "Desktop", "Laptop", "Server", "Printer", etc. |
| `status` | string | No | Filter by status: "Active", "Inactive" |
| `limit` | integer | No | Maximum results (default: 25) |

*Required if customer_id not provided

#### API Endpoints Used

```
GET /api/v1/assets?query={query}
GET /api/v1/customers/{id}/assets
```

#### Example Usage

```
/search-assets "ACME-WS"

/search-assets --customer_id 12345 --asset_type Server

/search-assets "Dell" --status Active --limit 10
```

#### Why It's Valuable

Asset lookup is essential for ticket context and remote support. Quick access to asset details, installed software, and history improves troubleshooting efficiency.

---

### 8. /create-appointment

**Description:** Create a calendar appointment for scheduled work, optionally linked to a ticket.

**Priority:** P2 - Scheduling command

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `subject` | string | Yes | Appointment subject/title |
| `start_time` | datetime | Yes | Start date and time |
| `end_time` | datetime | Yes | End date and time |
| `customer_id` | integer | No | Associated customer |
| `ticket_id` | integer | No | Associated ticket |
| `user_id` | integer | No | Assigned technician (defaults to current user) |
| `location` | string | No | Appointment location |
| `notes` | string | No | Additional notes |

#### API Endpoints Used

```
POST /api/v1/appointments
GET /api/v1/users (for user validation)
```

#### Example Usage

```
/create-appointment "Server Maintenance" "2026-02-10 09:00" "2026-02-10 11:00" --customer_id 12345

/create-appointment "On-site Support" "2026-02-11 14:00" "2026-02-11 16:00" --ticket_id 9876 --location "123 Main St"

/create-appointment "Weekly Check-in" "2026-02-12 10:00" "2026-02-12 10:30" --notes "Remote meeting"
```

#### Why It's Valuable

Appointment scheduling is essential for on-site work and project planning. Quick scheduling from the command line streamlines workflow without switching to a calendar application.

---

## Implementation Notes

### Authentication

All commands use the Syncro API with:
- API key passed as `api_key` query parameter
- Base URL: `https://{subdomain}.syncromsp.com/api/v1`

### Rate Limiting

Syncro enforces 180 requests per minute. Commands should:
- Implement exponential backoff on 429 responses
- Cache frequently accessed data (customers, users)
- Batch lookups when possible

### Error Handling

Common error scenarios to handle:
- Invalid entity IDs (404)
- Permission denied (403)
- Rate limiting (429)
- Validation errors (422 with error details)
- Required field missing (400)

### Pagination

Syncro uses page-based pagination:
- `page`: Page number (1-based)
- `per_page`: Records per page (max 100)
- Returns `total_pages` and `total_entries` in response

### Caching Strategy

- Cache user list for 15 minutes
- Cache customer lookups for 5 minutes
- Cache ticket statuses for 1 hour

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Command adoption | 50% of users using 3+ commands within 30 days |
| Time saved per operation | 20+ seconds vs. UI |
| Error rate | < 5% of command invocations |
| Time entry capture rate | 15% improvement in logged time |

---

## Dependencies

- Syncro API v1
- Valid API key with appropriate permissions
- Syncro MSP subscription with API access

## References

- [Syncro API Documentation](https://api-docs.syncromsp.com/)
- [Syncro Developer Resources](https://help.syncromsp.com/hc/en-us/articles/360023308074-API-Overview)
