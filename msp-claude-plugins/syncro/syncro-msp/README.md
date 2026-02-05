# Syncro MSP Plugin

Claude Code plugin for Syncro MSP integration.

## Overview

This plugin provides Claude with deep knowledge of Syncro MSP, enabling:

- **Ticket Management** - Create, search, update, and manage service tickets
- **Customer Operations** - Customer and contact management
- **Asset Management** - Asset tracking and RMM integration
- **Invoice Management** - Invoice generation, payments, and billing
- **Contract Management** - Service agreements and recurring billing

## Prerequisites

### API Credentials

You need a Syncro MSP API key from your Syncro account:

1. Log into your Syncro MSP account
2. Go to your user profile
3. Generate or copy your API key

### Environment Variables

Set the following environment variables:

```bash
export SYNCRO_API_KEY="your-api-key"
export SYNCRO_SUBDOMAIN="your-subdomain"  # e.g., "acme" for acme.syncromsp.com
```

## Installation

1. Clone this plugin to your Claude plugins directory
2. Configure environment variables
3. The MCP server will be automatically started when needed

## Available Skills

| Skill | Description |
|-------|-------------|
| `tickets` | Service ticket management, statuses, timers |
| `customers` | Customer and contact management |
| `assets` | Asset tracking and RMM integration |
| `invoices` | Invoice generation and payments |
| `api-patterns` | Common Syncro API patterns |

## Available Commands

| Command | Description |
|---------|-------------|
| `/create-ticket` | Create a new service ticket |
| `/search-tickets` | Search for tickets by criteria |

## API Documentation

- [Syncro MSP API Documentation](https://api-docs.syncromsp.com/)

## Rate Limits

Syncro enforces a rate limit of **180 requests per minute** per IP address.

## Contributing

See the main [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

All contributions require a PRD in the `prd/` directory before implementation.
