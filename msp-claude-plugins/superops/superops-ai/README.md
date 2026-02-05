# SuperOps.ai Plugin

Claude Code plugin for SuperOps.ai PSA/RMM integration.

## Overview

This plugin provides Claude with deep knowledge of SuperOps.ai, enabling:

- **Ticket Management** - Create, search, update, and manage service tickets
- **Asset Management** - Query assets, run scripts, monitor patches
- **Client Operations** - Client and site management
- **Alert Handling** - Monitor, acknowledge, and resolve alerts
- **Runbook Execution** - Execute automation scripts on assets

## Installation

```bash
# Clone the repository
git clone https://github.com/asachs01/msp-claude-plugins.git

# Navigate to plugin
cd msp-claude-plugins/superops/superops-ai

# Use with Claude Code
claude --plugin .
```

## Available Skills

| Skill | Description |
|-------|-------------|
| `tickets` | Service ticket management and workflows |
| `assets` | Asset inventory and management |
| `clients` | Client and site management |
| `alerts` | Alert monitoring and resolution |
| `runbooks` | Script and runbook execution |
| `api-patterns` | Common SuperOps.ai GraphQL patterns |

## Available Commands

| Command | Description |
|---------|-------------|
| `/create-ticket` | Create a new service ticket |
| `/list-assets` | List and filter assets |

## API Reference

- **Base URL**: `https://api.superops.ai/graphql` (US) or `https://euapi.superops.ai/graphql` (EU)
- **Auth**: Bearer token + `CustomerSubDomain` header
- **Rate Limit**: 800 requests per minute
- **Docs**: [SuperOps.ai API Documentation](https://developer.superops.ai/)

## Contributing

See the main [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.
