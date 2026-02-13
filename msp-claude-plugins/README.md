# MSP Claude Plugins

![Claude Code](https://img.shields.io/badge/Claude_Code-✓_Full_Support-blue?logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyem0wIDE4Yy00LjQyIDAtOC0zLjU4LTgtOHMzLjU4LTggOC04IDggMy41OCA4IDgtMy41OCA4LTggOHoiLz48L3N2Zz4=)
![Claude Desktop](https://img.shields.io/badge/Claude_Desktop-Partial_(MCP_only)-yellow?logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0yMSAzSDNjLTEuMSAwLTIgLjktMiAydjE0YzAgMS4xLjkgMiAyIDJoMThjMS4xIDAgMi0uOSAyLTJWNWMwLTEuMS0uOS0yLTItMnptMCAxNkgzVjVoMTh2MTR6Ii8+PC9zdmc+)
![Claude Cowork](https://img.shields.io/badge/Claude_Cowork-✓_Full_Support-blue)
![License](https://img.shields.io/badge/License-Apache_2.0-green)

Community-driven Claude Code plugins for Managed Service Providers.

## Compatibility

| Platform | Support | Notes |
|----------|---------|-------|
| **Claude Code** | ✅ Full | All skills, commands, and MCP servers (stdio) |
| **Claude Cowork** | ✅ Full | All MCP servers via HTTP transport |
| **Claude Desktop** | ⚠️ Partial | MCP servers only. Hosted MCP servers available. |

## Quick Start

```bash
/plugin marketplace add wyre-technology/msp-claude-plugins
```

## Available Plugins

| Plugin | Vendor | Status | Code | Cowork | Desktop | Description |
|--------|--------|--------|------|--------|---------|-------------|
| `autotask` | Kaseya | ✅ Validated | ✅ | ✅ | ✅ | Tickets, CRM, projects, contracts |
| `datto-rmm` | Kaseya | ✅ Validated | ✅ | ✅ | ✅ | Devices, alerts, jobs, patches |
| `it-glue` | Kaseya | ✅ Validated | ✅ | ✅ | ✅ | Organizations, assets, passwords, documents |
| `syncro` | Syncro | 🧪 Community | ✅ | ✅ | ✅ | Tickets, customers, assets, invoicing |
| `atera` | Atera | 🧪 Community | ✅ | ✅ | ✅ | Tickets, agents, alerts, monitors |
| `superops` | SuperOps | 🧪 Community | ✅ | ✅ | ✅ | Tickets, assets, alerts, runbooks |
| `halopsa` | Halo | 🧪 Community | ✅ | ✅ | ✅ | Tickets, clients, assets, contracts |
| `connectwise-psa` | ConnectWise | 🧪 Community | ✅ | 🔜 | 🔜 | Tickets, companies, projects, time |
| `connectwise-automate` | ConnectWise | 🧪 Community | ✅ | ✅ | ✅ | Computers, scripts, monitors |
| `shared-skills` | — | ✅ Validated | ✅ | — | — | MSP terminology and ticket triage |

**Status:** ✅ Validated = Tested against production APIs | 🧪 Community = May need adjustments
**Code:** Claude Code (stdio) | **Cowork:** Claude Cowork (HTTP) | **Desktop:** Claude Desktop (MCP)

## Deployment

All MCP servers support dual transport:
- **stdio** (default) — for Claude Code local usage
- **HTTP** — for Claude Cowork, Docker, and cloud deployments

### Self-host with Docker

```bash
docker run -p 8080:8080 \
  -e MCP_TRANSPORT=http \
  -e AUTH_MODE=env \
  -e VENDOR_API_KEY=your-key \
  ghcr.io/wyre-technology/{vendor}-mcp:latest
```

### Cloud deployment

Each MCP server includes configs for:
- **Cloudflare Workers** — `wrangler.json` in each repo
- **DigitalOcean App Platform** — `.do/app.yaml` in each repo

See the [deployment docs](https://wyre-technology.github.io/msp-claude-plugins/deployment/) for full guides.

## Commands (71 total)

### Autotask (14 commands)

| Command | Description |
|---------|-------------|
| `/create-ticket` | Create a new service ticket |
| `/search-tickets` | Search for tickets by criteria |
| `/update-ticket` | Update ticket fields |
| `/my-tickets` | List your assigned tickets |
| `/add-note` | Add a note to a ticket |
| `/time-entry` | Log time against a ticket or project |
| `/lookup-company` | Find company by name or ID |
| `/lookup-contact` | Find contact by name or email |
| `/lookup-asset` | Find configuration item |
| `/check-contract` | Check contract status and billing |
| `/reassign-ticket` | Reassign ticket to another resource |

### Syncro (10 commands)

| Command | Description |
|---------|-------------|
| `/create-ticket` | Create a new service ticket |
| `/search-tickets` | Search for tickets by criteria |
| `/update-ticket` | Update ticket status or fields |
| `/add-ticket-comment` | Add comment to a ticket |
| `/log-time` | Log time entry on a ticket |
| `/get-customer` | Get customer details |
| `/list-alerts` | List active RMM alerts |
| `/resolve-alert` | Resolve an alert |
| `/search-assets` | Search for assets |
| `/create-appointment` | Create calendar appointment |

### HaloPSA (10 commands)

| Command | Description |
|---------|-------------|
| `/create-ticket` | Create a new service ticket |
| `/search-tickets` | Search for tickets by criteria |
| `/update-ticket` | Update ticket fields |
| `/show-ticket` | Get detailed ticket information |
| `/add-action` | Add an action to a ticket |
| `/sla-dashboard` | View SLA status dashboard |
| `/search-clients` | Search for clients |
| `/search-assets` | Search for assets |
| `/kb-search` | Search knowledge base |
| `/contract-status` | Check contract status |

### Atera (10 commands)

| Command | Description |
|---------|-------------|
| `/create-ticket` | Create a new service ticket |
| `/search-agents` | Search for agents |
| `/update-ticket` | Update ticket fields |
| `/list-alerts` | List active alerts |
| `/resolve-alert` | Resolve an alert |
| `/run-powershell` | Run PowerShell script on agent |
| `/search-customers` | Search for customers |
| `/create-monitor` | Create HTTP/SNMP/TCP monitor |
| `/get-kb-articles` | Search knowledge base |
| `/log-time` | Log time entry |

### SuperOps (10 commands)

| Command | Description |
|---------|-------------|
| `/create-ticket` | Create a new service ticket |
| `/list-assets` | List and filter assets |
| `/update-ticket` | Update ticket fields |
| `/add-ticket-note` | Add note to a ticket |
| `/log-time` | Log time entry |
| `/list-alerts` | List active alerts |
| `/acknowledge-alert` | Acknowledge an alert |
| `/resolve-alert` | Resolve an alert |
| `/run-script` | Run script on asset |
| `/get-asset` | Get asset details |

### ConnectWise PSA (10 commands)

| Command | Description |
|---------|-------------|
| `/create-ticket` | Create a new service ticket |
| `/search-tickets` | Search tickets with conditions |
| `/get-ticket` | Get ticket details |
| `/update-ticket` | Update ticket fields |
| `/add-note` | Add note to a ticket |
| `/close-ticket` | Close a ticket |
| `/log-time` | Log time entry |
| `/lookup-config` | Look up configuration item |
| `/check-agreement` | Check agreement status |
| `/schedule-entry` | Create schedule entry |

### ConnectWise Automate (2 commands)

| Command | Description |
|---------|-------------|
| `/list-computers` | List computers by client |
| `/run-script` | Run script on computer |

### Datto RMM (4 commands)

| Command | Description |
|---------|-------------|
| `/device-lookup` | Look up device by name or ID |
| `/resolve-alert` | Resolve an alert |
| `/run-job` | Run a job on device |
| `/site-devices` | List devices at a site |

### IT Glue (4 commands)

| Command | Description |
|---------|-------------|
| `/lookup-asset` | Look up configuration asset |
| `/search-docs` | Search documents |
| `/get-password` | Retrieve password (requires access) |
| `/find-organization` | Find organization by name |

## Skills (57 total)

Skills provide domain knowledge without requiring API calls. They help Claude understand vendor-specific concepts, best practices, and terminology.

| Vendor | Skills |
|--------|--------|
| Autotask | tickets, crm, projects, contracts, time-entries, configuration-items, api-patterns |
| Syncro | tickets, customers, assets, invoices, api-patterns |
| HaloPSA | tickets, clients, assets, contracts, api-patterns |
| Atera | tickets, agents, customers, alerts, devices, api-patterns |
| SuperOps | tickets, assets, clients, alerts, runbooks, api-patterns |
| ConnectWise PSA | tickets, companies, contacts, projects, time-entries, api-patterns |
| ConnectWise Automate | computers, clients, scripts, monitors, alerts, api-patterns |
| Datto RMM | devices, alerts, sites, jobs, audit, variables, api-patterns |
| IT Glue | organizations, configurations, contacts, passwords, documents, flexible-assets, api-patterns |
| Shared | msp-terminology, ticket-triage |

## Configuration

Each plugin requires API credentials. See the individual plugin READMEs for configuration:

| Plugin | Configuration Guide |
|--------|---------------------|
| Autotask | [kaseya/autotask/README.md](./kaseya/autotask/README.md#configuration) |
| Syncro | [syncro/syncro-msp/README.md](./syncro/syncro-msp/README.md#configuration) |
| HaloPSA | [halopsa/halopsa/README.md](./halopsa/halopsa/README.md#configuration) |
| Atera | [atera/atera/README.md](./atera/atera/README.md#configuration) |
| SuperOps | [superops/superops-ai/README.md](./superops/superops-ai/README.md#configuration) |
| ConnectWise PSA | [connectwise/manage/README.md](./connectwise/manage/README.md#configuration) |
| ConnectWise Automate | [connectwise/automate/README.md](./connectwise/automate/README.md) |
| Datto RMM | [kaseya/datto-rmm/README.md](./kaseya/datto-rmm/README.md) |
| IT Glue | [kaseya/it-glue/README.md](./kaseya/it-glue/README.md) |

## Documentation

Full documentation: [https://wyre-technology.github.io/msp-claude-plugins/](https://wyre-technology.github.io/msp-claude-plugins/)

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## License

Apache 2.0 License - see [LICENSE](./LICENSE) for details.
