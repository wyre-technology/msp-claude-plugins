# Atera Plugin

Claude Code plugin for Atera RMM/PSA integration.

## Overview

This plugin provides Claude with deep knowledge of Atera RMM/PSA, enabling:

- **Ticket Management** - Create, search, update, and manage service tickets
- **Agent Management** - Monitor and manage RMM agents, run PowerShell scripts
- **Customer Operations** - Customer CRUD operations and contact management
- **Alert Management** - View, acknowledge, and resolve alerts
- **Device Monitoring** - HTTP, SNMP, and TCP device monitors

## Installation

```bash
# Clone the repository
git clone https://github.com/asachs01/msp-claude-plugins.git

# Navigate to plugin
cd msp-claude-plugins/atera/atera

# Use with Claude Code
claude --plugin .
```

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

## API Reference

- **Base URL**: `https://app.atera.com/api/v3`
- **Auth**: `X-API-KEY` header
- **Rate Limit**: 700 requests per minute
- **Docs**: [Atera API Documentation](https://app.atera.com/apidocs/)

## Contributing

See the main [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.
