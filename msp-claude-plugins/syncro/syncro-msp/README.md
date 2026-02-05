# Syncro MSP Plugin

Claude Code plugin for Syncro MSP integration.

## Overview

This plugin provides Claude with domain knowledge of Syncro MSP, enabling:

- **Ticket Management** - Create, search, update, and manage service tickets
- **Customer Operations** - Customer and contact management
- **Asset Management** - Asset tracking and RMM integration
- **Invoice Management** - Invoice generation, payments, and billing

## Installation

```bash
# Clone the repository
git clone https://github.com/asachs01/msp-claude-plugins.git

# Navigate to plugin
cd msp-claude-plugins/syncro/syncro-msp

# Use with Claude Code
claude --plugin .
```

## Skills

| Skill | Description |
|-------|-------------|
| `tickets` | Service ticket management, statuses, timers |
| `customers` | Customer and contact management |
| `assets` | Asset tracking and RMM integration |
| `invoices` | Invoice generation and payments |
| `api-patterns` | Syncro API authentication, pagination, rate limits |

## Commands

| Command | Description |
|---------|-------------|
| `/create-ticket` | Create a new service ticket |
| `/search-tickets` | Search for tickets by criteria |

## API Reference

- **Base URL**: `https://{subdomain}.syncromsp.com/api/v1`
- **Auth**: API key passed as query parameter `api_key`
- **Rate Limit**: 180 requests per minute
- **Docs**: [Syncro API Documentation](https://api-docs.syncromsp.com/)

## Contributing

See the main [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.
