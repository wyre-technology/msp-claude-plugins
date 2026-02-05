# Autotask Expanded Commands PRD

> Version: 1.0.0
> Created: 2026-02-04
> Status: Draft

## Overview

This PRD defines 8 additional slash commands for the Kaseya Autotask Claude Code plugin. These commands extend the existing `/create-ticket` and `/search-tickets` functionality to provide comprehensive ticket lifecycle management, entity lookups, and technician workflow support.

## Commands Summary

| Priority | Command | Description |
|----------|---------|-------------|
| P0 | `/update-ticket` | Update ticket fields (status, priority, assignee) |
| P0 | `/add-note` | Add a note/comment to an existing ticket |
| P0 | `/my-tickets` | List tickets assigned to the current user |
| P1 | `/lookup-company` | Search for companies by name or ID |
| P1 | `/lookup-contact` | Search for contacts by name, email, or company |
| P1 | `/lookup-asset` | Search for configuration items/assets |
| P1 | `/check-contract` | View contract status and entitlements |
| P2 | `/reassign-ticket` | Reassign a ticket to a different resource |

---

## Command Specifications

### 1. /update-ticket

**Description:** Update fields on an existing Autotask ticket including status, priority, queue, and custom fields.

**Priority:** P0 - Core workflow command

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `ticket_id` | integer | Yes | The Autotask ticket ID to update |
| `status` | string | No | New status (e.g., "In Progress", "Waiting Customer") |
| `priority` | integer | No | Priority level (1-4, where 1=Critical) |
| `queue` | string | No | Queue/service board name to move ticket to |
| `due_date` | datetime | No | New due date for the ticket |
| `assigned_resource` | string | No | Resource email or name to assign |

#### API Endpoints Used

```
PATCH /Tickets/{id}
GET /Tickets/{id} (for validation)
GET /TicketStatuses (for status lookup)
GET /Resources (for assignee lookup)
```

#### Example Usage

```
/update-ticket 12345 --status "In Progress" --priority 2

/update-ticket 12345 --queue "Escalations" --due_date "2026-02-10"
```

#### Why It's Valuable

Technicians frequently need to update ticket status as they work. This command eliminates navigating the Autotask UI to make common updates, keeping technicians in their IDE or terminal workflow.

---

### 2. /add-note

**Description:** Add a note (internal or public) to an existing Autotask ticket.

**Priority:** P0 - Core workflow command

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `ticket_id` | integer | Yes | The Autotask ticket ID |
| `note` | string | Yes | The note content (supports multi-line) |
| `type` | string | No | Note type: "internal" (default) or "public" |
| `publish` | string | No | Publish destination: "none", "portal", "email" |

#### API Endpoints Used

```
POST /TicketNotes
GET /TicketNotes/entityInformation (for field validation)
```

#### Example Usage

```
/add-note 12345 "Contacted customer, awaiting callback" --type internal

/add-note 12345 "Issue resolved by applying patch KB12345" --type public --publish portal
```

#### Why It's Valuable

Documentation is critical in MSP workflows. Quick note addition without leaving the current context encourages better ticket hygiene and knowledge capture.

---

### 3. /my-tickets

**Description:** List all tickets currently assigned to the authenticated user with filtering options.

**Priority:** P0 - Core workflow command

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `status` | string | No | Filter by status (e.g., "Open", "In Progress") |
| `priority` | integer | No | Filter by priority (1-4) |
| `queue` | string | No | Filter by queue name |
| `limit` | integer | No | Maximum results (default: 25, max: 100) |
| `sort` | string | No | Sort field: "due_date", "priority", "created" |

#### API Endpoints Used

```
GET /Tickets?search={"filter":[{"op":"eq","field":"assignedResourceID","value":{currentResourceId}}]}
GET /Resources (to get current user's resource ID)
```

#### Example Usage

```
/my-tickets

/my-tickets --status "In Progress" --sort priority

/my-tickets --priority 1 --limit 10
```

#### Why It's Valuable

Technicians need a quick view of their workload without opening the Autotask web interface. This supports daily standup preparation and workload management.

---

### 4. /lookup-company

**Description:** Search for Autotask companies/accounts by name, ID, or other attributes.

**Priority:** P1 - Supporting lookup command

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | Yes | Company name, partial name, or ID |
| `type` | string | No | Company type filter (e.g., "Customer", "Lead") |
| `active` | boolean | No | Filter active companies only (default: true) |
| `limit` | integer | No | Maximum results (default: 10) |

#### API Endpoints Used

```
GET /Companies?search={"filter":[{"op":"contains","field":"companyName","value":"{query}"}]}
GET /CompanyTypes (for type validation)
```

#### Example Usage

```
/lookup-company "Acme"

/lookup-company "Acme Corp" --type Customer --active true

/lookup-company 12345
```

#### Why It's Valuable

Company lookup is required before creating tickets or viewing account context. Quick lookup eliminates switching to the Autotask UI for simple ID retrieval.

---

### 5. /lookup-contact

**Description:** Search for contacts by name, email, phone, or associated company.

**Priority:** P1 - Supporting lookup command

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | Yes | Contact name, email, or phone number |
| `company_id` | integer | No | Filter by company ID |
| `active` | boolean | No | Filter active contacts only (default: true) |
| `limit` | integer | No | Maximum results (default: 10) |

#### API Endpoints Used

```
GET /Contacts?search={"filter":[{"op":"contains","field":"emailAddress","value":"{query}"}]}
GET /Contacts?search={"filter":[{"op":"contains","field":"firstName","value":"{query}"}]}
```

#### Example Usage

```
/lookup-contact "john.doe@acme.com"

/lookup-contact "John" --company_id 12345

/lookup-contact "555-1234"
```

#### Why It's Valuable

Contact association is essential for ticket creation and communication. Quick lookup enables proper ticket assignment without UI navigation.

---

### 6. /lookup-asset

**Description:** Search for configuration items/assets by name, serial number, or associated company.

**Priority:** P1 - Supporting lookup command

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | Yes | Asset name, serial number, or reference |
| `company_id` | integer | No | Filter by company ID |
| `type` | string | No | Asset type (e.g., "Workstation", "Server") |
| `active` | boolean | No | Filter active assets only (default: true) |
| `limit` | integer | No | Maximum results (default: 10) |

#### API Endpoints Used

```
GET /ConfigurationItems?search={"filter":[{"op":"contains","field":"referenceTitle","value":"{query}"}]}
GET /ConfigurationItemTypes (for type validation)
```

#### Example Usage

```
/lookup-asset "ACME-WS-001"

/lookup-asset "Dell" --company_id 12345 --type "Workstation"

/lookup-asset "SN12345678"
```

#### Why It's Valuable

Asset context is critical for troubleshooting. Quick asset lookup provides serial numbers, warranty info, and configuration details without leaving the workflow.

---

### 7. /check-contract

**Description:** View contract status, entitlements, and remaining hours for a company or specific contract.

**Priority:** P1 - Business operations command

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `company_id` | integer | No* | Company ID to check contracts for |
| `contract_id` | integer | No* | Specific contract ID to check |
| `include_expired` | boolean | No | Include expired contracts (default: false) |

*Either `company_id` or `contract_id` is required

#### API Endpoints Used

```
GET /Contracts?search={"filter":[{"op":"eq","field":"companyID","value":{companyId}}]}
GET /Contracts/{id}
GET /ContractBlocks (for block hour contracts)
GET /ContractServices (for service entitlements)
```

#### Example Usage

```
/check-contract --company_id 12345

/check-contract --contract_id 9876

/check-contract --company_id 12345 --include_expired true
```

#### Why It's Valuable

Understanding contract entitlements is essential before committing to work. This prevents scope creep and ensures proper billing categorization.

---

### 8. /reassign-ticket

**Description:** Reassign a ticket to a different resource or queue.

**Priority:** P2 - Workflow management command

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `ticket_id` | integer | Yes | The ticket ID to reassign |
| `resource` | string | No* | Resource email or name to assign |
| `queue` | string | No* | Queue name to assign ticket to |
| `note` | string | No | Note explaining the reassignment |

*Either `resource` or `queue` is required

#### API Endpoints Used

```
PATCH /Tickets/{id}
GET /Resources (for resource lookup)
GET /Queues (for queue lookup)
POST /TicketNotes (if note provided)
```

#### Example Usage

```
/reassign-ticket 12345 --resource "jane.doe@msp.com"

/reassign-ticket 12345 --queue "Level 2 Support" --note "Escalating per customer request"

/reassign-ticket 12345 --resource "john.smith@msp.com" --note "Taking over while Jane is OOO"
```

#### Why It's Valuable

Ticket reassignment is a common escalation and workload balancing activity. Quick reassignment with optional notes maintains audit trail while streamlining handoffs.

---

## Implementation Notes

### Authentication

All commands use the Autotask REST API with the following authentication:
- Username (API user email)
- Secret (API secret key)
- Integration Code
- Zone-specific endpoint (e.g., `webservices5.autotask.net`)

### Rate Limiting

Autotask enforces rate limits. Commands should:
- Implement exponential backoff on 429 responses
- Cache lookup results where appropriate (companies, resources)
- Batch operations when possible

### Error Handling

Common error scenarios to handle:
- Invalid ticket/entity IDs (404)
- Permission denied (403)
- Rate limiting (429)
- Validation errors (400 with error details)
- Required field mapping errors

### Caching Strategy

- Cache resource list for 15 minutes
- Cache company/contact lookups for 5 minutes
- Cache status and priority picklists for 1 hour

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Command adoption | 50% of users using 3+ commands within 30 days |
| Time saved per ticket update | 30+ seconds vs. UI |
| Error rate | < 5% of command invocations |
| User satisfaction | NPS > 50 for command experience |

---

## Dependencies

- Autotask REST API v1.6+
- Valid API credentials with appropriate permissions
- MCP server implementation (autotask-mcp)

## References

- [Autotask REST API Documentation](https://ww5.autotask.net/help/DeveloperHelp/Content/APIs/REST/REST_API_Home.htm)
- [Autotask API Entity Reference](https://ww5.autotask.net/help/DeveloperHelp/Content/APIs/REST/REST_API_Entity_Reference.htm)
