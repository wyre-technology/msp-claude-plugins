# Atera Plugin

Claude Code plugin for Atera RMM/PSA integration.

## Overview

This plugin provides Claude with deep knowledge of Atera RMM/PSA, enabling:

- **Ticket Management** - Create, search, update, and manage service tickets
- **Agent Management** - Monitor and manage RMM agents, run PowerShell scripts
- **Customer Operations** - Customer CRUD operations and contact management
- **Alert Management** - View, acknowledge, and resolve alerts
- **Device Monitoring** - HTTP, SNMP, and TCP device monitors

## Configuration

### Claude Code Settings (Recommended)

Add your credentials to `~/.claude/settings.json` (user scope, encrypted on macOS):

```json
{
  "env": {
    "ATERA_API_KEY": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
  }
}
```

For project-specific configuration, use `.claude/settings.local.json` (gitignored):

```json
{
  "env": {
    "ATERA_API_KEY": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
  }
}
```

### Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `ATERA_API_KEY` | Yes | API key from Admin > API |

### Obtaining API Credentials

1. **Log into Atera**
   - Navigate to [https://app.atera.com](https://app.atera.com)

2. **Generate an API Key**
   - Go to **Admin > API**
   - Click **Generate API Key**
   - Copy the generated key (it will only be shown once)

3. **API Key Permissions**
   - The API key inherits the permissions of the user who created it
   - Ensure your user has appropriate permissions for the operations you need

### Testing Your Connection

Once configured in Claude Code settings, test the connection (env vars injected by Claude Code):

```bash
# Test connection
curl -s "https://app.atera.com/api/v3/customers" \
  -H "X-API-KEY: ${ATERA_API_KEY}" \
  -H "Accept: application/json" | jq
```

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
