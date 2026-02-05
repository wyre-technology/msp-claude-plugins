# Atera Plugin

Claude Code plugin for Atera RMM/PSA integration.

## Overview

This plugin provides Claude with deep knowledge of Atera RMM/PSA, enabling:

- **Ticket Management** - Create, search, update, and manage service tickets
- **Agent Management** - Monitor and manage RMM agents, run PowerShell scripts
- **Customer Operations** - Customer CRUD operations and contact management
- **Alert Management** - View, acknowledge, and resolve alerts
- **Device Monitoring** - HTTP, SNMP, and TCP device monitors

## Prerequisites

### API Credentials

You need an Atera API key from your Atera account:

1. Log into Atera
2. Navigate to Admin > API
3. Generate or copy your API key

### Environment Variables

Set the following environment variable:

```bash
export ATERA_API_KEY="your-api-key-here"
```

## Installation

1. Clone this plugin to your Claude plugins directory
2. Configure the environment variable
3. The MCP server will be automatically started when needed

## Available Skills

| Skill | Description |
|-------|-------------|
| `tickets` | Service ticket management with filters, statuses, comments, work hours |
| `agents` | RMM agent management and PowerShell execution |
| `customers` | Customer and contact management |
| `alerts` | Alert monitoring, acknowledgment, and resolution |
| `devices` | HTTP, SNMP, and TCP device monitors |
| `api-patterns` | X-API-KEY auth, OData pagination, rate limiting |

## Available Commands

| Command | Description |
|---------|-------------|
| `/create-ticket` | Create a new service ticket |
| `/search-agents` | Search for agents by customer or machine name |

## Rate Limits

Atera enforces a rate limit of **700 requests per minute**. The MCP server includes automatic throttling to stay within limits.

## API Documentation

- [Atera API Documentation](https://app.atera.com/apidocs/)
- [Atera Support - APIs](https://support.atera.com/hc/en-us/articles/219083397-APIs)

## Contributing

See the main [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

All contributions require a PRD in the `prd/` directory before implementation.
