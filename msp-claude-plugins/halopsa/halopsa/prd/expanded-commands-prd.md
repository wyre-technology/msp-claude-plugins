# HaloPSA Expanded Commands PRD

> Version: 1.0.0
> Created: 2026-02-04
> Status: Draft

## Overview

This PRD defines 8 additional slash commands for the HaloPSA Claude Code plugin. These commands extend the existing `/create-ticket` and `/search-tickets` functionality to provide comprehensive ticket lifecycle management, SLA monitoring, knowledge base access, and entity lookups.

## Commands Summary

| Priority | Command | Description |
|----------|---------|-------------|
| P0 | `/add-action` | Add an action (note/update) to a ticket |
| P0 | `/update-ticket` | Update ticket fields and status |
| P0 | `/show-ticket` | Display detailed ticket information |
| P1 | `/sla-dashboard` | View SLA status and breaches |
| P1 | `/search-clients` | Search for clients by name or criteria |
| P1 | `/search-assets` | Search for assets/configuration items |
| P1 | `/kb-search` | Search the knowledge base |
| P2 | `/contract-status` | Check contract status and entitlements |

---

## Command Specifications

### 1. /add-action

**Description:** Add an action (note, update, or response) to an existing HaloPSA ticket with configurable visibility and action type.

**Priority:** P0 - Core workflow command

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `ticket_id` | integer | Yes | The HaloPSA ticket ID |
| `note` | string | Yes | The action/note content |
| `action_type` | string | No | Type: "note", "update", "email_response", "phone" (default: "note") |
| `outcome` | string | No | Outcome code for the action |
| `hidden` | boolean | No | Hide from client portal (default: false) |
| `time_taken` | integer | No | Time taken in minutes |

#### API Endpoints Used

```
POST /api/Actions
GET /api/ActionTypes (for type validation)
GET /api/Tickets/{id} (for ticket validation)
```

#### Example Usage

```
/add-action 12345 "Contacted customer, issue reproduced successfully"

/add-action 12345 "Called customer to discuss resolution options" --action_type phone --time_taken 15

/add-action 12345 "Internal troubleshooting notes" --hidden true
```

#### Why It's Valuable

HaloPSA uses actions for all ticket interactions. Quick action creation maintains complete audit trails and supports SLA tracking without UI context switching.

---

### 2. /update-ticket

**Description:** Update fields on an existing HaloPSA ticket including status, priority, category, and assignment.

**Priority:** P0 - Core workflow command

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `ticket_id` | integer | Yes | The HaloPSA ticket ID to update |
| `status` | string | No | New status name or ID |
| `priority` | string | No | Priority name or ID |
| `category` | string | No | Category for classification |
| `team` | string | No | Team to assign ticket to |
| `agent` | string | No | Agent email or name to assign |
| `sla` | string | No | SLA profile to apply |

#### API Endpoints Used

```
POST /api/Tickets (HaloPSA uses POST for updates too)
GET /api/Tickets/{id}
GET /api/Status (for status lookup)
GET /api/Priority (for priority lookup)
GET /api/Agent (for agent lookup)
```

#### Example Usage

```
/update-ticket 12345 --status "In Progress" --agent "john.doe@msp.com"

/update-ticket 12345 --priority "High" --team "Level 2 Support"

/update-ticket 12345 --category "Network/Firewall" --sla "Premium"
```

#### Why It's Valuable

Ticket field updates are constant in MSP workflows. Quick updates maintain ticket accuracy and ensure proper routing without leaving the development environment.

---

### 3. /show-ticket

**Description:** Display comprehensive ticket information including history, actions, attachments, and related entities.

**Priority:** P0 - Core workflow command

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `ticket_id` | integer | Yes | The HaloPSA ticket ID |
| `include_actions` | boolean | No | Include action history (default: true) |
| `include_attachments` | boolean | No | List attachments (default: false) |
| `include_assets` | boolean | No | Include linked assets (default: false) |
| `format` | string | No | Output format: "summary", "full", "json" (default: "summary") |

#### API Endpoints Used

```
GET /api/Tickets/{id}
GET /api/Actions?ticket_id={id}
GET /api/Attachment?ticket_id={id}
GET /api/Asset?ticket_id={id}
```

#### Example Usage

```
/show-ticket 12345

/show-ticket 12345 --include_actions true --include_attachments true

/show-ticket 12345 --format full --include_assets true
```

#### Why It's Valuable

Complete ticket context is essential for effective troubleshooting. Quick access to full ticket details including history enables informed decision-making.

---

### 4. /sla-dashboard

**Description:** View SLA status across tickets, including approaching breaches and at-risk tickets.

**Priority:** P1 - Operational monitoring command

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `client_id` | integer | No | Filter by specific client |
| `team` | string | No | Filter by team |
| `status` | string | No | Filter: "breaching", "at_risk", "on_track", "all" |
| `period` | string | No | Time period: "today", "week", "month" (default: "today") |
| `limit` | integer | No | Maximum results (default: 25) |

#### API Endpoints Used

```
GET /api/Tickets?sla_status={status}
GET /api/SLA (for SLA definitions)
GET /api/Reports/SLA (if available)
```

#### Example Usage

```
/sla-dashboard

/sla-dashboard --status breaching --team "Service Desk"

/sla-dashboard --client_id 12345 --period week

/sla-dashboard --status at_risk --limit 50
```

#### Why It's Valuable

SLA management directly impacts customer satisfaction and contract compliance. Proactive visibility into SLA status enables intervention before breaches occur.

---

### 5. /search-clients

**Description:** Search for HaloPSA clients by name, domain, or other attributes.

**Priority:** P1 - Supporting lookup command

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | Yes | Client name, domain, or partial match |
| `client_type` | string | No | Filter by type: "Customer", "Prospect", "Vendor" |
| `active` | boolean | No | Filter active clients only (default: true) |
| `include_sites` | boolean | No | Include site information (default: false) |
| `limit` | integer | No | Maximum results (default: 10) |

#### API Endpoints Used

```
GET /api/Client?search={query}
GET /api/Site?client_id={id}
```

#### Example Usage

```
/search-clients "Acme"

/search-clients "acme.com" --client_type Customer

/search-clients "Acme Corp" --include_sites true --active true
```

#### Why It's Valuable

Client lookup is foundational for ticket creation, contract verification, and context gathering. Quick search eliminates UI navigation for simple lookups.

---

### 6. /search-assets

**Description:** Search for configuration items/assets by name, serial number, type, or client association.

**Priority:** P1 - Supporting lookup command

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | No* | Asset name, serial, or identifier |
| `client_id` | integer | No | Filter by client ID |
| `asset_type` | string | No | Filter by type: "Workstation", "Server", "Network", etc. |
| `status` | string | No | Filter: "Active", "Inactive", "Retired" |
| `limit` | integer | No | Maximum results (default: 25) |

*Required if client_id not provided

#### API Endpoints Used

```
GET /api/Asset?search={query}
GET /api/Asset?client_id={id}
GET /api/AssetType (for type validation)
```

#### Example Usage

```
/search-assets "ACME-SRV-01"

/search-assets --client_id 12345 --asset_type Server

/search-assets "Dell PowerEdge" --status Active --limit 10
```

#### Why It's Valuable

Asset context is critical for troubleshooting and ticket management. Quick asset lookup provides configuration details, warranty status, and history.

---

### 7. /kb-search

**Description:** Search the HaloPSA knowledge base for articles and solutions.

**Priority:** P1 - Knowledge management command

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | Yes | Search terms for knowledge base |
| `category` | string | No | Filter by KB category |
| `visibility` | string | No | Filter: "internal", "public", "all" (default: "all") |
| `limit` | integer | No | Maximum results (default: 10) |

#### API Endpoints Used

```
GET /api/KBArticle?search={query}
GET /api/KBCategory (for category list)
```

#### Example Usage

```
/kb-search "password reset"

/kb-search "VPN setup" --category "Network" --visibility internal

/kb-search "printer driver" --limit 20
```

#### Why It's Valuable

Knowledge base access during troubleshooting improves resolution times and consistency. Quick search surfaces relevant solutions without leaving the workflow.

---

### 8. /contract-status

**Description:** Check contract status, service entitlements, and billing information for a client.

**Priority:** P2 - Business operations command

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `client_id` | integer | No* | Client ID to check contracts |
| `contract_id` | integer | No* | Specific contract ID to view |
| `include_services` | boolean | No | Include service line details (default: false) |
| `include_usage` | boolean | No | Include usage/hours consumed (default: false) |

*Either `client_id` or `contract_id` is required

#### API Endpoints Used

```
GET /api/Contract?client_id={id}
GET /api/Contract/{id}
GET /api/RecurringInvoice?contract_id={id}
GET /api/ContractBlock?contract_id={id}
```

#### Example Usage

```
/contract-status --client_id 12345

/contract-status --contract_id 9876 --include_services true

/contract-status --client_id 12345 --include_usage true
```

#### Why It's Valuable

Understanding contract entitlements prevents scope creep and ensures proper service delivery. Quick contract access supports billing accuracy and customer communication.

---

## Implementation Notes

### Authentication

HaloPSA uses OAuth 2.0 Client Credentials:
- Client ID and Client Secret
- Token endpoint: `https://{tenant}.halopsa.com/auth/token`
- Tokens valid for 1 hour, refresh automatically

### Rate Limiting

HaloPSA enforces 500 requests per 3 minutes. Commands should:
- Implement exponential backoff on 429 responses
- Cache authentication tokens
- Batch related requests when possible

### Error Handling

Common error scenarios to handle:
- Invalid entity IDs (404)
- Token expired (401) - refresh and retry
- Permission denied (403)
- Rate limiting (429)
- Validation errors (400 with error details)

### Pagination

HaloPSA uses offset-based pagination:
- `page_no`: Page number (1-based)
- `page_size`: Records per page (max 100)
- Returns `record_count` for total

### Caching Strategy

- Cache OAuth tokens until expiry (minus 5-minute buffer)
- Cache agent/team lists for 15 minutes
- Cache status/priority lists for 1 hour
- Cache KB articles for 30 minutes

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Command adoption | 50% of users using 3+ commands within 30 days |
| SLA breach reduction | 10% reduction in SLA breaches |
| KB article utilization | 25% increase in KB searches |
| Time saved per operation | 25+ seconds vs. UI |

---

## Dependencies

- HaloPSA API (REST)
- Valid OAuth 2.0 credentials with appropriate scopes
- HaloPSA subscription with API access enabled

## References

- [HaloPSA API Documentation](https://halopsa.com/apidocs/)
- [HaloPSA Developer Guide](https://halopsa.com/guides/integrations-api/)
