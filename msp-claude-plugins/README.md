# MSP Claude Plugins Marketplace

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Changelog](https://img.shields.io/badge/changelog-Keep%20a%20Changelog-orange.svg)](CHANGELOG.md)

> A community-driven, open-source repository of Claude Code plugins and skills designed for Managed Service Providers (MSPs).

**[Documentation](docs/)** | **[Contributing](CONTRIBUTING.md)** | **[Changelog](CHANGELOG.md)**

---

## Overview

The MSP Claude Plugin Marketplace provides vendor-organized plugins that enable MSP technicians, engineers, and administrators to leverage Claude's capabilities with deep integration into PSA, RMM, and documentation tools.

Inspired by Anthropic's [knowledge-work-plugins](https://github.com/anthropics/knowledge-work-plugins), this marketplace follows the same architectural patterns while organizing content by MSP vendor ecosystem.

### Key Features

- **Vendor-Organized Structure** - Find plugins by the tools you use (Kaseya, ConnectWise, etc.)
- **Comprehensive Skills** - Domain knowledge for tickets, projects, contracts, and more
- **Slash Commands** - Quick actions like `/create-ticket` and `/time-entry`
- **MCP Integration** - Direct API connectivity to your PSA/RMM tools
- **Community-Driven** - Built by MSPs, for MSPs

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   MSP Claude Plugins                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Kaseya    │  │ ConnectWise │  │   Shared    │         │
│  │  ┌───────┐  │  │  ┌───────┐  │  │  ┌───────┐  │         │
│  │  │Autotask│  │  │  │Manage │  │  │  │ MSP   │  │         │
│  │  │       │  │  │  │       │  │  │  │Termin.│  │         │
│  │  │Skills │  │  │  │Skills │  │  │  └───────┘  │         │
│  │  │Commands│  │  │  │Commands│  │  │  ┌───────┐  │         │
│  │  │MCP    │  │  │  │MCP    │  │  │  │Ticket │  │         │
│  │  └───────┘  │  │  └───────┘  │  │  │Triage │  │         │
│  └─────────────┘  └─────────────┘  │  └───────┘  │         │
│                                     └─────────────┘         │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                  Quality Standards                    │  │
│  │  PRD Requirements │ Skill Checklist │ API Docs Guide │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                     Templates                         │  │
│  │   Plugin PRD │ Skill Template │ Command Template     │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Quick Start

### Prerequisites

- [Claude Code CLI](https://docs.anthropic.com/claude-code) installed
- API credentials for your PSA/RMM tool

### Installation

```bash
# Clone the repository
git clone https://github.com/OWNER/msp-claude-plugins.git
cd msp-claude-plugins

# Navigate to your vendor plugin
cd kaseya/autotask

# Configure API credentials
export AUTOTASK_USERNAME="your-api-user@domain.com"
export AUTOTASK_INTEGRATION_CODE="YOUR_INTEGRATION_CODE"
export AUTOTASK_SECRET="YOUR_SECRET"

# Launch Claude Code with the plugin
claude --plugin .
```

### Using Skills

Skills provide domain knowledge that Claude can reference:

```
You: How do I create a ticket with a critical priority?

Claude: Based on the Autotask ticket skill, critical priority is value 4
(higher number = higher priority in Autotask). Here's the API call:

POST /v1.0/Tickets
{
  "companyID": 12345,
  "title": "Server down - production outage",
  "priority": 4,
  "status": 1,
  "queueID": 8
}
```

### Using Commands

Commands provide slash-command shortcuts:

```
You: /create-ticket "Acme Corp" "Email not working" --priority 2

Claude: ✅ Ticket Created Successfully
Ticket Number: T20260204.0042
Company: Acme Corporation
Priority: High (2)
```

---

## Plugin Directory

### Kaseya Autotask (Active)

Full-featured plugin for Autotask PSA with comprehensive API coverage.

| Component | Description | Status |
|-----------|-------------|--------|
| **Skills** | | |
| [Tickets](kaseya/autotask/skills/tickets/SKILL.md) | Status codes, SLA calculations, escalation rules | ✅ Complete |
| [CRM](kaseya/autotask/skills/crm/SKILL.md) | Company and contact management | ✅ Complete |
| [Projects](kaseya/autotask/skills/projects/SKILL.md) | Project phases, tasks, resources | ✅ Complete |
| [Contracts](kaseya/autotask/skills/contracts/SKILL.md) | Service agreements, billing | ✅ Complete |
| [Time Entries](kaseya/autotask/skills/time-entries/SKILL.md) | Approval workflows, billing calculations | ✅ Complete |
| [API Patterns](kaseya/autotask/skills/api-patterns/SKILL.md) | All 14 query operators, authentication | ✅ Complete |
| [Configuration Items](kaseya/autotask/skills/configuration-items/SKILL.md) | Asset management, warranties | ✅ Complete |
| **Commands** | | |
| [/create-ticket](kaseya/autotask/commands/create-ticket.md) | Create service tickets | ✅ Complete |
| [/search-tickets](kaseya/autotask/commands/search-tickets.md) | Search and filter tickets | ✅ Complete |
| [/time-entry](kaseya/autotask/commands/time-entry.md) | Log time against tickets/projects | ✅ Complete |

### ConnectWise Manage (Planned)

Placeholder structure ready for community contributions.

| Component | Description | Status |
|-----------|-------------|--------|
| Plugin Structure | Manifest and MCP config | ✅ Ready |
| Skills | Service tickets, companies | 📋 Planned |
| Commands | Ticket operations | 📋 Planned |

### Shared Skills

Vendor-agnostic knowledge applicable across all MSP tools.

| Skill | Description |
|-------|-------------|
| [MSP Terminology](shared/skills/msp-terminology/SKILL.md) | Common MSP terms, acronyms, concepts |
| [Ticket Triage](shared/skills/ticket-triage/SKILL.md) | Best practices for prioritization and routing |

---

## Usage Examples

### Example 1: Ticket Creation with Context

```
You: A user at Acme Corp reports they can't access their email since 9am.
     Multiple users are affected. Create a ticket.

Claude: Based on the impact (multiple users) and service affected (email),
        this should be HIGH priority. Let me create the ticket:

        /create-ticket "Acme Corp" "Email outage - multiple users affected"
        --priority 2 --description "Sales team (5 users) unable to access
        Outlook since 9am. Webmail confirmed working."

        ✅ Ticket T20260204.0043 created
```

### Example 2: Time Entry with Budget Check

```
You: Log 2 hours against ticket T20260204.0042 for troubleshooting

Claude: I'll create the time entry and check the contract budget:

        /time-entry T20260204.0042 2.0 "Troubleshot email delivery issues,
        identified DNS misconfiguration"

        ✅ Time Entry Logged
        Billing: $300.00 (2.0 hrs @ $150/hr)
        Contract Budget: 45/50 hours used (90%)
        ⚠️ Warning: Approaching monthly allocation limit
```

### Example 3: Asset Lookup

```
You: What servers does Acme Corp have?

Claude: Let me query Configuration Items for Acme Corp servers:

        Found 3 servers:
        1. ACME-DC-SQL01 (Dell PowerEdge R750) - Active
           Warranty: Expires 2027-01-01 (335 days remaining)
        2. ACME-DC-FS01 (Dell PowerEdge R640) - Active
           Warranty: Expires 2025-06-15 (⚠️ 131 days remaining)
        3. ACME-HV01 (HPE ProLiant DL380) - Active
           Warranty: Expired 2025-12-01 (❌ 65 days ago)
```

---

## Repository Structure

```
msp-claude-plugins/
├── .claude-plugin/
│   └── marketplace.json          # Marketplace manifest
├── _standards/                   # Quality standards
│   ├── prd-requirements.md       # PRD checklist
│   ├── skill-quality-checklist.md
│   └── api-documentation-guide.md
├── _templates/                   # Contributor templates
│   ├── plugin-prd-template.md
│   ├── skill-template/SKILL.md
│   ├── command-template.md
│   └── llm-prompts/              # AI-assisted development
├── kaseya/
│   └── autotask/                 # ✅ Active plugin
│       ├── .claude-plugin/plugin.json
│       ├── .mcp.json
│       ├── skills/
│       │   ├── tickets/
│       │   ├── crm/
│       │   ├── projects/
│       │   ├── contracts/
│       │   ├── time-entries/
│       │   ├── api-patterns/
│       │   └── configuration-items/
│       └── commands/
│           ├── create-ticket.md
│           ├── search-tickets.md
│           └── time-entry.md
├── connectwise/
│   └── manage/                   # 📋 Planned
├── shared/
│   └── skills/
│       ├── msp-terminology/
│       └── ticket-triage/
├── CHANGELOG.md
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── LICENSE
└── README.md
```

---

## Contributing

We welcome contributions from the MSP community!

### The PRD Mandate

**All contributions require a PRD first.** This ensures clear problem definition, community input, and documentation that lives with code.

### Ways to Contribute

| Contribution | Difficulty | Impact |
|--------------|------------|--------|
| Add a new vendor plugin | 🔴 High | 🌟🌟🌟 |
| Add skill to existing plugin | 🟡 Medium | 🌟🌟 |
| Add command to existing plugin | 🟢 Low | 🌟🌟 |
| Improve documentation | 🟢 Low | 🌟 |
| Report issues | 🟢 Low | 🌟 |
| Review PRDs | 🟢 Low | 🌟🌟 |

### Quick Contribution Guide

```bash
# Fork and clone
git clone https://github.com/YOUR-USERNAME/msp-claude-plugins.git
cd msp-claude-plugins

# Create a PRD branch
git checkout -b prd/your-feature-name

# Copy the PRD template
cp _templates/plugin-prd-template.md your-prd.md

# Submit for review
git add . && git commit -m "PRD: Your feature description"
git push origin prd/your-feature-name
# Open a Pull Request
```

See our [Contributing Guide](CONTRIBUTING.md) for complete instructions.

---

## Quality Standards

All plugins must meet these requirements:

- [ ] PRD exists and is approved
- [ ] Skills follow template structure with proper frontmatter
- [ ] API examples validated against official documentation
- [ ] No hardcoded credentials (use environment variables)
- [ ] README documents all capabilities
- [ ] Changelog updated for all changes

See [Quality Standards](_standards/) for detailed checklists.

---

## Security

- **No credentials in code** - Use environment variables only
- **No customer data** - Use placeholder/example data
- **No real IDs** - Use generic IDs in examples (12345, 67890)
- **Review required** - All PRs require security review

Report security vulnerabilities via GitHub Security Advisories.

---

## Roadmap

### Current (v1.0.0)
- ✅ Autotask plugin with 7 skills, 3 commands
- ✅ Shared MSP skills
- ✅ Contribution framework

### Planned (v1.1.0)
- 📋 ConnectWise Manage plugin
- 📋 Documentation site (Astro/Starlight)
- 📋 GitHub issue templates for new provider requests

### Future
- 📋 Datto RMM plugin
- 📋 NinjaOne plugin
- 📋 HaloPSA plugin
- 📋 IT Glue plugin
- 📋 Syncro plugin

---

## Resources

### Documentation
- [Contributing Guide](CONTRIBUTING.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Changelog](CHANGELOG.md)
- [Quality Standards](_standards/)

### External Resources
- [Claude Code Documentation](https://docs.anthropic.com/claude-code)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Anthropic knowledge-work-plugins](https://github.com/anthropics/knowledge-work-plugins)

### Vendor API Documentation
- [Autotask REST API](https://ww5.autotask.net/help/DeveloperHelp/Content/APIs/REST/REST_API_Home.htm)
- [ConnectWise Manage API](https://developer.connectwise.com/Products/Manage/REST)
- [IT Glue API](https://api.itglue.com/developer/)
- [NinjaOne API](https://app.ninjarmm.com/apidocs/)
- [HaloPSA API](https://halopsa.com/apidocs/)

---

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- Inspired by [Anthropic's knowledge-work-plugins](https://github.com/anthropics/knowledge-work-plugins)
- Built for the MSP community, by the MSP community
- Special thanks to all contributors

---

<p align="center">
  <strong>Made with ❤️ for MSPs</strong>
  <br>
  <a href="CONTRIBUTING.md">Contribute</a> •
  <a href="CHANGELOG.md">Changelog</a> •
  <a href="https://github.com/OWNER/msp-claude-plugins/issues">Issues</a>
</p>
