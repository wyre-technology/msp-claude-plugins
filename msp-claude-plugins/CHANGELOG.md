# Changelog

All notable changes to the MSP Claude Plugin Marketplace will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Documentation site using Astro with Starlight theme (in progress)
- GitHub issues for additional PSA/RMM provider plugins (planned)

## [1.0.0] - 2026-02-04

### Added

#### Autotask Plugin (`kaseya/autotask/`)
- **Tickets Skill** - Comprehensive ticket management with status codes (NEW, IN_PROGRESS, COMPLETE, WAITING_CUSTOMER, WAITING_MATERIALS, ESCALATED), SLA calculations, escalation rules, and ticket metrics/KPIs
- **CRM Skill** - Company and contact management for client relationship tracking
- **Projects Skill** - Project management with phases, tasks, and resource allocation
- **Contracts Skill** - Service agreements, billing configurations, and contract lifecycle management
- **Time Entries Skill** - Time tracking with approval workflows (DRAFT, SUBMITTED, APPROVED, REJECTED), billing calculations, utilization analytics, and budget validation
- **API Patterns Skill** - Comprehensive REST API documentation covering all 14 query operators (eq, ne, gt, gte, lt, lte, contains, startsWith, endsWith, in, notIn, isNull, isNotNull, between), header-based authentication, automatic zone detection, pagination, rate limiting, and error handling
- **Configuration Items Skill** - Asset management with CI types, categories, DNS records, SSL tracking, related items, warranty tracking, and lifecycle management

#### Autotask Commands
- **create-ticket** - Create new service tickets with company lookup, duplicate detection, contract validation, and queue routing
- **search-tickets** - Search and filter tickets using comprehensive query patterns
- **time-entry** - Log time against tickets or projects with billing calculations and approval submission

#### Shared Skills (`shared/`)
- **MSP Terminology** - Vendor-agnostic MSP vocabulary and acronyms
- **Ticket Triage** - Best practices for ticket prioritization and routing

#### ConnectWise Manage Plugin (`connectwise/manage/`)
- Plugin placeholder structure with manifest and MCP configuration
- README documenting planned features

#### Marketplace Infrastructure
- Vendor-organized directory structure (`vendor/product/` pattern)
- Plugin manifest format (`.claude-plugin/plugin.json`)
- MCP server configuration (`.mcp.json`)
- Skill template with frontmatter schema
- Command template with argument definitions

#### Contribution Framework
- **CONTRIBUTING.md** - Contribution guidelines with PRD requirements
- **CODE_OF_CONDUCT.md** - Contributor Covenant code of conduct
- **LICENSE** - Apache 2.0 license
- **README.md** - Project documentation and quick start guide

#### Quality Standards (`_standards/`)
- PRD requirements checklist
- Skill quality checklist
- API documentation guide

#### Templates (`_templates/`)
- Plugin PRD template
- Skill template with example structure
- Command template
- LLM prompts for skill, command, and PRD generation

### Security
- All Autotask API patterns document secure authentication via header-based credentials (not Basic Auth)
- Rate limiting guidance to prevent API abuse
- Input validation patterns for API operations

---

## Release Notes Format

Each release entry should include:
- **Added** for new features
- **Changed** for changes in existing functionality
- **Deprecated** for soon-to-be removed features
- **Removed** for now removed features
- **Fixed** for any bug fixes
- **Security** in case of vulnerabilities

---

[Unreleased]: https://github.com/OWNER/msp-claude-plugins/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/OWNER/msp-claude-plugins/releases/tag/v1.0.0
