# MSP Claude Plugins

> One command to supercharge Claude Code for MSP workflows.

```
/plugin marketplace add wyre-technology/msp-claude-plugins
```

Then restart Claude Code. That's it.

---

## What you get

Nine vendor-specific plugins with domain knowledge for PSA, RMM, and documentation tools:

| Plugin | Description |
|--------|-------------|
| **Autotask** | Kaseya Autotask PSA - tickets, CRM, projects, contracts, billing |
| **Datto RMM** | Datto remote monitoring - devices, alerts, jobs, patches |
| **IT Glue** | IT documentation - organizations, assets, passwords, flexible assets |
| **Syncro** | All-in-one PSA/RMM - tickets, customers, assets, invoicing |
| **Atera** | RMM/PSA platform - tickets, agents, customers, alerts, SNMP/HTTP monitors |
| **SuperOps.ai** | Modern PSA/RMM with GraphQL - tickets, assets, clients, runbooks |
| **HaloPSA** | Enterprise PSA with OAuth - tickets, clients, assets, contracts |
| **ConnectWise PSA** | Industry-leading PSA - tickets, companies, contacts, projects, time |
| **ConnectWise Automate** | Enterprise RMM - computers, clients, scripts, monitors, alerts |

Plus shared skills for MSP terminology and ticket triage best practices.

---

## How it works

Plugins are just markdown files. They provide:

- **Skills** — Domain knowledge Claude references when helping you (API patterns, field mappings, rate limits)
- **Commands** — Slash commands like `/create-ticket` and `/search-tickets`

When you ask "create a high priority ticket for Acme Corp", Claude knows:
- Which API endpoint to call
- What priority values mean (varies by vendor!)
- How to authenticate
- Rate limit boundaries

---

## Individual plugins

Want just one vendor? Install individually:

```
/plugin marketplace add wyre-technology/msp-claude-plugins --plugin autotask
/plugin marketplace add wyre-technology/msp-claude-plugins --plugin syncro
/plugin marketplace add wyre-technology/msp-claude-plugins --plugin halopsa
```

---

## Configuration

Each plugin uses environment variables for authentication. See the plugin's README:

- [Autotask](msp-claude-plugins/kaseya/autotask/README.md) — API key + integration code
- [Datto RMM](msp-claude-plugins/kaseya/datto-rmm/README.md) — API key header
- [IT Glue](msp-claude-plugins/kaseya/it-glue/README.md) — API key header
- [Syncro](msp-claude-plugins/syncro/syncro-msp/README.md) — API key query param
- [Atera](msp-claude-plugins/atera/atera/README.md) — X-API-KEY header
- [SuperOps.ai](msp-claude-plugins/superops/superops-ai/README.md) — Bearer token
- [HaloPSA](msp-claude-plugins/halopsa/halopsa/README.md) — OAuth 2.0 client credentials
- [ConnectWise PSA](msp-claude-plugins/connectwise/manage/README.md) — Public/private key + client ID
- [ConnectWise Automate](msp-claude-plugins/connectwise/automate/README.md) — Integrator credentials

---

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md).

**All contributions require a PRD first** — this ensures clear problem definition and documentation that lives with code.

---

## License

Apache 2.0 — see [LICENSE](LICENSE).

---

Built by MSPs, for MSPs.
