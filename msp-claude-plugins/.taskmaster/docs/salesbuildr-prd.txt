# Plugin PRD: Salesbuildr/Salesbuildr/Core CRM

## Summary

A Claude Code plugin for Salesbuildr, a CRM platform purpose-built for MSP quoting and sales workflows. This plugin enables MSP sales teams to search customers, manage opportunities, create quotes with products, and track pipeline — all through natural language commands within Claude Code.

## Problem

MSP sales reps constantly context-switch between their PSA, Salesbuildr CRM, and communication tools when managing quotes and opportunities. Finding a customer's quote history, checking product pricing, or creating a new opportunity requires navigating multiple screens in the Salesbuildr web UI. This slows down sales cycles and increases the risk of errors in quotes.

## User Stories

- As an MSP sales rep, I want to search companies and contacts in Salesbuildr so I can quickly find customer records without leaving my coding workflow
- As an MSP sales rep, I want to create and track opportunities so I can manage my sales pipeline efficiently
- As an MSP sales rep, I want to create quotes with products so I can quickly generate proposals for customers
- As an MSP manager, I want to search products and pricing so I can verify quote accuracy
- As an MSP sales engineer, I want to look up existing quotes for a company so I can reference past proposals when building new ones

## Scope

### In Scope
- Companies: search, get by ID
- Contacts: search, get by ID, create
- Products: search, get by ID
- Opportunities: search, create, update status
- Quotes: search, get by ID, create with line items

### Out of Scope
- Quote Templates and Quote Widgets
- Pricing Books management
- Discount Groups configuration
- Sync State monitoring
- Contract Items (beta API)
- Categories management
- Bulk operations
- Webhook integrations

## Technical Approach

### API Base URL

`https://portal.salesbuildr.com/public-api`

### Authentication Requirements

- API key passed via `api-key` header on every request
- Key is generated in Salesbuildr portal under Settings > API Keys

### Rate Limiting

- 500 requests per 10 minutes
- Plugin should implement conservative request patterns

### API Endpoints Used

**Companies**
- `GET /companies` - Search companies (params: `search`, `from`, `size`)
- `GET /companies/{id}` - Get company by ID

**Contacts**
- `GET /contacts` - Search contacts (params: `search`, `company_id`, `from`, `size`)
- `GET /contacts/{id}` - Get contact by ID
- `POST /contacts` - Create contact (body: `first_name`, `last_name`, `email`, `company_id`, `phone`)

**Products**
- `GET /products` - Search products (params: `search`, `category_id`, `from`, `size`)
- `GET /products/{id}` - Get product by ID

**Opportunities**
- `GET /opportunities` - Search opportunities (params: `search`, `company_id`, `status`, `from`, `size`)
- `GET /opportunities/{id}` - Get opportunity by ID
- `POST /opportunities` - Create opportunity (body: `name`, `company_id`, `contact_id`, `value`, `stage`, `expected_close_date`)
- `PATCH /opportunities/{id}` - Update opportunity

**Quotes**
- `GET /quotes` - Search quotes (params: `search`, `company_id`, `opportunity_id`, `from`, `size`)
- `GET /quotes/{id}` - Get quote by ID with line items
- `POST /quotes` - Create quote (body: `name`, `company_id`, `contact_id`, `opportunity_id`, `items[]`)

### Pagination

Offset-based using `from` (starting index) and `size` (page size, default 20, max 100) parameters.

### Data Flow

Claude Code user issues command. Plugin constructs API request with `api-key` header. Salesbuildr API processes request. Response is parsed and formatted for display. Results are shown to user with relevant fields highlighted.

## Success Criteria

- [ ] Plugin can authenticate with Salesbuildr API using api-key header
- [ ] Company search returns results matching search term
- [ ] Contact search supports filtering by company
- [ ] Product search returns items with pricing information
- [ ] Opportunity creation succeeds with required fields
- [ ] Quote creation with line items succeeds
- [ ] All commands handle API errors gracefully with user-friendly messages
- [ ] Rate limiting is respected (no more than 500 requests per 10 minutes)
- [ ] Plugin passes PRD requirements checklist

## Open Questions

- Should we support quote PDF generation/download in v1?
- What is the optimal default page size for search results?
- Should opportunity stages be hardcoded or fetched dynamically?
