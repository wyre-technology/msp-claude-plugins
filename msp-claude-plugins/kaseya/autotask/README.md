# Kaseya Autotask Plugin

Claude Code plugin for Kaseya Autotask PSA integration.

## Overview

This plugin provides Claude with deep knowledge of Autotask PSA, enabling:

- **Ticket Management** - Create, search, update, and manage service tickets
- **CRM Operations** - Company and contact management
- **Project Management** - Project creation, task tracking, resource assignment
- **Contract Management** - Service agreements, billing, renewals
- **Time Entry** - Log time against tickets and projects

## Configuration

### Claude Code Settings (Recommended)

Add your credentials to `~/.claude/settings.json` (user scope, encrypted on macOS):

```json
{
  "env": {
    "AUTOTASK_USERNAME": "api-user@mycompany.com",
    "AUTOTASK_SECRET": "your-secret-key",
    "AUTOTASK_INTEGRATION_CODE": "ABC123DEF456",
    "AUTOTASK_API_ZONE": "webservices5"
  }
}
```

For project-specific configuration, use `.claude/settings.local.json` (gitignored):

```json
{
  "env": {
    "AUTOTASK_USERNAME": "api-user@mycompany.com",
    "AUTOTASK_SECRET": "your-secret-key",
    "AUTOTASK_INTEGRATION_CODE": "ABC123DEF456",
    "AUTOTASK_API_ZONE": "webservices5"
  }
}
```

### Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `AUTOTASK_USERNAME` | Yes | API user email address |
| `AUTOTASK_SECRET` | Yes | API secret key |
| `AUTOTASK_INTEGRATION_CODE` | Yes | Your integration code |
| `AUTOTASK_API_ZONE` | Yes | Data center zone (e.g., `webservices5`) |

### Obtaining API Credentials

1. **Create an API User**
   - Log into Autotask as an administrator
   - Navigate to **Admin > Resources (Users) > Resources/Users**
   - Create a new resource with **API User** security level
   - Note the username (email) and generate a secret key

2. **Get Your Integration Code**
   - Navigate to **Admin > Account Settings & Users > Other > API Integration Code**
   - Copy your integration code (or create one if none exists)

3. **Find Your API Zone**
   - Your zone is determined by your Autotask data center location
   - Common zones: `webservices1`, `webservices2`, `webservices5`, `webservices6`
   - Use the [Zone Information API](https://webservices5.autotask.net/atservicesrest/v1.0/zoneInformation?user=youremail@company.com) to find your zone:

   ```bash
   curl "https://webservices5.autotask.net/atservicesrest/v1.0/zoneInformation?user=your-email@company.com"
   ```

### Testing Your Connection

Once configured in Claude Code settings, test the connection:

```bash
# Test connection (using the Autotask MCP tool)
# Claude Code will inject the environment variables automatically
mcp-cli call autotask-mcp/autotask_test_connection '{}'

# Or test manually with curl (env vars must be set)
curl "https://webservices5.autotask.net/atservicesrest/v1.0/zoneInformation?user=${AUTOTASK_USERNAME}"
```

### API Documentation

- [Autotask REST API Documentation](https://ww5.autotask.net/help/DeveloperHelp/Content/APIs/REST/REST_API_Home.htm)
- [Zone Information](https://www.autotask.net/help/DeveloperHelp/Content/APIs/REST/API_Calls/REST_API_Zone_Information.htm)

## Installation

1. Clone this plugin to your Claude plugins directory
2. Configure environment variables
3. The MCP server will be automatically started when needed

## Available Skills

| Skill | Description |
|-------|-------------|
| `tickets` | Service ticket management and workflows |
| `crm` | Company and contact management |
| `projects` | Project and task management |
| `contracts` | Service agreement and billing |
| `api-patterns` | Common Autotask API patterns |

## Available Commands

| Command | Description |
|---------|-------------|
| `/create-ticket` | Create a new service ticket |
| `/search-tickets` | Search for tickets by criteria |
| `/update-account` | Update company information |
| `/create-project` | Create a new project |
| `/time-entry` | Log time against a ticket or project |

## API Documentation

- [Autotask REST API Documentation](https://ww5.autotask.net/help/DeveloperHelp/Content/APIs/REST/REST_API_Home.htm)

## Contributing

See the main [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

All contributions require a PRD in the `prd/` directory before implementation.
