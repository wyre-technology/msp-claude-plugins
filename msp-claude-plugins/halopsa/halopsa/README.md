# HaloPSA Plugin

Claude Code plugin for HaloPSA integration.

## Overview

This plugin provides Claude with deep knowledge of HaloPSA, enabling:

- **Ticket Management** - Create, search, update, and manage service tickets with actions and attachments
- **Client Operations** - Client CRUD, sites, and contacts management
- **Asset Tracking** - Asset management and device tracking
- **Contract Management** - Service agreements, billing, and recurring items
- **API Patterns** - OAuth 2.0 Client Credentials flow, pagination, rate limiting

## Installation

```bash
# Clone the repository
git clone https://github.com/asachs01/msp-claude-plugins.git

# Navigate to plugin
cd msp-claude-plugins/halopsa/halopsa

# Use with Claude Code
claude --plugin .
```

## Available Skills

| Skill | Description |
|-------|-------------|
| `tickets` | Ticket management, actions, and attachments |
| `clients` | Client CRUD, sites, and contacts |
| `assets` | Asset tracking and device management |
| `contracts` | Contract management and billing |
| `api-patterns` | OAuth 2.0 authentication, pagination, rate limiting |

## Available Commands

| Command | Description |
|---------|-------------|
| `/create-ticket` | Create a new service ticket |
| `/search-tickets` | Search for tickets by criteria |

## API Reference

- **Base URL**: `https://{tenant}.halopsa.com/api`
- **Auth**: OAuth 2.0 Client Credentials
- **Rate Limit**: 500 requests per 3 minutes
- **Docs**: [HaloPSA API Documentation](https://halopsa.com/apidocs/)

## Contributing

See the main [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.
