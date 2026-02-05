# Hosted MCP Servers PRD

> Version: 1.1.0
> Created: 2026-02-05
> Updated: 2026-02-05
> Status: Draft - Awaiting Review

## Overview

This PRD defines the architecture and implementation plan for hosted MCP servers that enable Claude Desktop (and Claude Code) users to connect to MSP tools via OAuth, matching the experience of Anthropic's first-party integrations (Slack, Atlassian, Notion).

### Current State

- **autotask-mcp**: Local MCP server exists, requires API keys in config
- **Other vendors**: No MCP servers, commands use curl with env vars
- **User experience**: Copy/paste API credentials into settings.json

### Target State

- Unified MCP Gateway at `mcp.wyre.ai` with path-based routing per vendor
- OAuth authentication flow - users click "Connect" and authorize via browser
- No local API key management required
- Works seamlessly with Claude Desktop and Claude Code

---

## Architecture

### High-Level Flow

```
┌─────────────────┐     ┌──────────────────────┐     ┌─────────────────┐
│  Claude Desktop │────▶│    MCP Gateway       │────▶│  Vendor APIs    │
│  or Claude Code │     │  (mcp.wyre.ai)       │     │  (Autotask,     │
└─────────────────┘     │                      │     │   Datto, etc.)  │
        │               │  - OAuth 2.1 + PKCE  │     └─────────────────┘
        │               │  - Credential store  │
        │               │  - Vendor handlers   │
        └──────────────▶└──────────────────────┘
           (browser)             │
                                 ▼
                        ┌──────────────────────┐
                        │  Credential Entry UI │
                        │  (user enters API    │
                        │   keys one time)     │
                        └──────────────────────┘
```

### MCP Server Types by Auth Pattern

| Vendor | Auth Type | OAuth Support | Implementation Complexity |
|--------|-----------|---------------|---------------------------|
| Autotask | API Key + Secret | No native OAuth | Medium - proxy with stored creds |
| Datto RMM | API Key + Secret | No native OAuth | Medium - proxy with stored creds |
| IT Glue | API Key | No native OAuth | Low - proxy with stored creds |
| Syncro | API Key | No native OAuth | Low - proxy with stored creds |
| Atera | API Key | No native OAuth | Low - proxy with stored creds |
| SuperOps | Bearer Token | No native OAuth | Low - proxy with stored creds |
| HaloPSA | OAuth 2.0 | **Yes** | Low - native OAuth passthrough |
| ConnectWise PSA | API Key + Client ID | No native OAuth | Medium - proxy with stored creds |
| ConnectWise Automate | Token-based | No native OAuth | Medium - proxy with stored creds |

### The OAuth Challenge

Most MSP vendors don't support OAuth - they use API keys. Our hosted MCP servers must:

1. **Implement our own OAuth layer** - Users authenticate with our service
2. **Securely store vendor credentials** - Encrypted at rest, per-user
3. **Proxy requests** - MCP server uses stored credentials to call vendor APIs

```
User ──OAuth──▶ Our Auth ──stores──▶ User's API Keys ──▶ Vendor API
```

---

## MCP Gateway Architecture (Recommended)

### Why a Gateway?

Instead of deploying individual MCP servers per vendor, a **unified MCP Gateway** provides:

1. **Single entry point** - One URL, one auth flow, multiple vendors
2. **Simplified infrastructure** - One deployment, not 9+ separate services
3. **Centralized auth** - OAuth 2.1 with PKCE handled once at gateway level
4. **Session-aware routing** - Requests routed to correct vendor based on user context
5. **Easier credential management** - Per-tenant encrypted storage in one place

### Gateway Architecture

```
┌─────────────────┐     ┌──────────────────────────────────────────────────┐
│  Claude Desktop │     │              MCP Gateway                          │
│  or Claude Code │────▶│  https://mcp.wyre.ai                   │
└─────────────────┘     │                                                  │
        │               │  ┌─────────────────────────────────────────────┐ │
        │               │  │           OAuth 2.1 + PKCE Layer            │ │
        │               │  │  - User authentication                      │ │
        │               │  │  - Session management                       │ │
        │               │  │  - Token refresh                            │ │
        └───────────────│  └─────────────────────────────────────────────┘ │
           (browser)    │                      │                            │
                        │                      ▼                            │
                        │  ┌─────────────────────────────────────────────┐ │
                        │  │         Credential Store (Encrypted)        │ │
                        │  │  - Per-user vendor API keys                 │ │
                        │  │  - AES-256 encryption at rest               │ │
                        │  │  - Tenant isolation                         │ │
                        │  └─────────────────────────────────────────────┘ │
                        │                      │                            │
                        │  ┌───────┬───────┬───────┬───────┬───────────┐  │
                        │  │ Auto- │ Datto │  IT   │ Halo  │   ...     │  │
                        │  │ task  │  RMM  │ Glue  │  PSA  │           │  │
                        │  │Handler│Handler│Handler│Handler│           │  │
                        │  └───┬───┴───┬───┴───┬───┴───┬───┴───────────┘  │
                        └──────│───────│───────│───────│──────────────────┘
                               ▼       ▼       ▼       ▼
                        ┌──────────┐ ┌──────────┐ ┌──────────┐
                        │ Autotask │ │ Datto    │ │ IT Glue  │  ...
                        │   API    │ │   API    │ │   API    │
                        └──────────┘ └──────────┘ └──────────┘
```

### Existing Gateway Solutions Evaluated

| Solution | Type | Auth | Pros | Cons |
|----------|------|------|------|------|
| **Microsoft MCP Gateway** | Kubernetes-native | Azure Entra ID | Enterprise-ready, SSO | Azure lock-in, complex |
| **Docker MCP Gateway** | Open-source | Configurable | Simple orchestration | No built-in auth |
| **MetaMCP** | Aggregator | None | Combines multiple servers | Docker-only, no auth layer |
| **MCPHub** | Unified hub | Basic | Vendor-agnostic | Early stage, limited docs |

### Recommendation: Custom Gateway

Build a custom MCP Gateway because:

1. **None support our auth pattern** - We need to store vendor API keys, not federate OAuth
2. **MCP SDK is TypeScript** - Easy to build unified routing layer
3. **Full control** - No dependency on third-party gateway lifecycle
4. **MSP-specific features** - Multi-tenant credential storage, audit logging

### Gateway Endpoint Format

Single gateway with path-based routing:
```
https://mcp.wyre.ai/v1/autotask
https://mcp.wyre.ai/v1/datto-rmm
https://mcp.wyre.ai/v1/itglue
https://mcp.wyre.ai/v1/halopsa
https://mcp.wyre.ai/v1/syncro
https://mcp.wyre.ai/v1/atera
https://mcp.wyre.ai/v1/superops
https://mcp.wyre.ai/v1/connectwise-psa
https://mcp.wyre.ai/v1/connectwise-automate
```

### OAuth 2.1 with PKCE

Per MCP spec update (June 2025), use OAuth 2.1 with PKCE:

```
┌──────────────┐                              ┌───────────────────┐
│ Claude Client│                              │   MCP Gateway     │
└──────┬───────┘                              └─────────┬─────────┘
       │                                                │
       │  1. GET /v1/datto-rmm (no token)              │
       │───────────────────────────────────────────────▶│
       │                                                │
       │  2. 401 + WWW-Authenticate: Bearer            │
       │◀───────────────────────────────────────────────│
       │                                                │
       │  3. GET /oauth/authorize?                     │
       │     client_id=claude&                         │
       │     code_challenge=xxx&                       │
       │     redirect_uri=...                          │
       │───────────────────────────────────────────────▶│
       │                                                │
       │  4. Redirect to credential entry page         │
       │◀───────────────────────────────────────────────│
       │                                                │
       │  5. User enters vendor API credentials        │
       │                                                │
       │  6. Redirect back with auth code              │
       │◀───────────────────────────────────────────────│
       │                                                │
       │  7. POST /oauth/token                         │
       │     code=xxx&code_verifier=yyy                │
       │───────────────────────────────────────────────▶│
       │                                                │
       │  8. Access token + refresh token              │
       │◀───────────────────────────────────────────────│
       │                                                │
       │  9. GET /v1/datto-rmm (with token)            │
       │───────────────────────────────────────────────▶│
       │                                                │
       │  10. MCP tool results                         │
       │◀───────────────────────────────────────────────│
```

### Session-Aware Stateful Routing

Gateway maintains session state to:
- Map user sessions to stored credentials
- Route requests to correct vendor handler
- Handle credential refresh/rotation
- Track usage for rate limiting

```typescript
interface GatewaySession {
  userId: string;
  connectedVendors: {
    [vendor: string]: {
      credentialId: string;  // Reference to encrypted cred
      lastUsed: Date;
      tokenExpiry?: Date;
    }
  };
  sessionExpiry: Date;
}
```

---

## Implementation Priority

### Phase 1: Kaseya Stack (Validated Vendors)

Priority order based on:
- Autotask MCP already exists (adapt to hosted)
- Datto RMM and IT Glue complete the Kaseya trifecta
- These are "validated" plugins with production testing

| Priority | Vendor | Effort | Notes |
|----------|--------|--------|-------|
| P0 | **Datto RMM** | Medium | Most requested RMM, critical for Kaseya users |
| P0 | **IT Glue** | Low | Documentation platform, simple API key auth |
| P1 | **Autotask** | Low | Adapt existing autotask-mcp to hosted model |

### Phase 2: Community Vendors

| Priority | Vendor | Effort | Notes |
|----------|--------|--------|-------|
| P1 | HaloPSA | Low | Native OAuth - cleanest implementation |
| P2 | Syncro | Low | Simple API key |
| P2 | Atera | Low | Simple API key |
| P2 | SuperOps | Low | Bearer token |
| P2 | ConnectWise PSA | Medium | Multiple auth components |
| P3 | ConnectWise Automate | Medium | Token-based, complex |

---

## Technical Specifications

### Infrastructure Requirements (Gateway Model)

```
┌─────────────────────────────────────────────────────────────────┐
│                     Cloud Infrastructure                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    MCP Gateway Service                     │  │
│  │                                                            │  │
│  │  ┌──────────────────────────────────────────────────────┐ │  │
│  │  │              OAuth 2.1 + PKCE Provider               │ │  │
│  │  │  - Authorization endpoint                            │ │  │
│  │  │  - Token endpoint                                    │ │  │
│  │  │  - PKCE code challenge verification                  │ │  │
│  │  └──────────────────────────────────────────────────────┘ │  │
│  │                           │                                │  │
│  │  ┌──────────────────────────────────────────────────────┐ │  │
│  │  │              Session Manager                         │ │  │
│  │  │  - User session state                                │ │  │
│  │  │  - Connected vendors tracking                        │ │  │
│  │  │  - Rate limiting per user                            │ │  │
│  │  └──────────────────────────────────────────────────────┘ │  │
│  │                           │                                │  │
│  │  ┌──────────────────────────────────────────────────────┐ │  │
│  │  │              Vendor Handler Router                   │ │  │
│  │  │  /v1/autotask  → AutotaskHandler                     │ │  │
│  │  │  /v1/datto-rmm → DattoRMMHandler                     │ │  │
│  │  │  /v1/itglue    → ITGlueHandler                       │ │  │
│  │  │  /v1/halopsa   → HaloPSAHandler                      │ │  │
│  │  │  /v1/syncro    → SyncroHandler                       │ │  │
│  │  │  /v1/atera     → AteraHandler                        │ │  │
│  │  │  ...                                                 │ │  │
│  │  └──────────────────────────────────────────────────────┘ │  │
│  │                                                            │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              ▼                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              Secure Credential Store                       │  │
│  │  - Per-user encrypted API keys (AES-256)                  │  │
│  │  - Per-tenant isolation                                   │  │
│  │  - Audit logging (all credential access)                  │  │
│  │  - Automatic key rotation support                         │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Technology Stack (Recommended)

| Component | Technology | Rationale |
|-----------|------------|-----------|
| MCP Gateway | Node.js/TypeScript | MCP SDK is TypeScript-native |
| Auth Layer | OAuth 2.1 + PKCE | MCP spec compliant (June 2025) |
| Credential Store | AWS Secrets Manager or Vault | Enterprise-grade encryption |
| Hosting | **Option A**: AWS Lambda + API Gateway | Serverless, scales to zero |
| | **Option B**: Fly.io or Railway | Simpler deployment, lower ops burden |
| | **Option C**: Kubernetes (EKS/GKE) | Enterprise, multi-region |
| Database | PostgreSQL (Supabase or RDS) | Sessions, audit logs, user metadata |
| Cache | Redis (Upstash or ElastiCache) | Session state, rate limiting |

### Gateway Endpoint Format (Recommended)

Single domain with versioned path routing:
```
https://mcp.wyre.ai/v1/autotask
https://mcp.wyre.ai/v1/datto-rmm
https://mcp.wyre.ai/v1/itglue
https://mcp.wyre.ai/v1/halopsa
https://mcp.wyre.ai/v1/syncro
https://mcp.wyre.ai/v1/atera
https://mcp.wyre.ai/v1/superops
https://mcp.wyre.ai/v1/connectwise-psa
https://mcp.wyre.ai/v1/connectwise-automate
```

OAuth endpoints:
```
https://mcp.wyre.ai/oauth/authorize
https://mcp.wyre.ai/oauth/token
https://mcp.wyre.ai/oauth/revoke
```

User management:
```
https://mcp.wyre.ai/settings          # Manage connected vendors
https://mcp.wyre.ai/settings/vendors  # List connected vendors
https://mcp.wyre.ai/settings/revoke   # Revoke vendor access
```

---

## User Experience

### First-Time Connection (Claude Desktop)

1. User installs MSP plugin
2. Plugin's `.mcp.json` references hosted server:
   ```json
   {
     "mcpServers": {
       "datto-rmm": {
         "type": "http",
         "url": "https://mcp.wyre.ai/datto-rmm/mcp"
       }
     }
   }
   ```
3. Claude Desktop detects unauthenticated state
4. User clicks "Connect Datto RMM"
5. Browser opens → Our OAuth login page
6. User enters their Datto RMM API credentials (one time)
7. Credentials stored securely, session established
8. Claude Desktop now has access to Datto RMM tools

### Subsequent Usage

- Session persists (refresh tokens)
- No re-authentication required
- User can revoke access via settings page

### Credential Entry Page (Our OAuth Flow)

Since vendors don't have OAuth, we provide a secure credential entry page:

```
┌─────────────────────────────────────────────┐
│         Connect Datto RMM                   │
├─────────────────────────────────────────────┤
│                                             │
│  API Key:     [____________________]        │
│  API Secret:  [____________________]        │
│  Platform:    [concord-api ▼      ]         │
│                                             │
│  Your credentials are encrypted and stored  │
│  securely. We never see your raw keys.      │
│                                             │
│  [Get API Keys from Datto]  [Connect]       │
│                                             │
└─────────────────────────────────────────────┘
```

---

## Security Considerations

### Credential Storage

- **Encryption**: AES-256 at rest, TLS 1.3 in transit
- **Key derivation**: Per-user encryption keys derived from master key
- **No plaintext**: Credentials never stored unencrypted
- **Audit logging**: All access logged with timestamps

### Tenant Isolation

- Each user's credentials isolated
- No cross-user data access
- Rate limiting per user

### Compliance

- SOC 2 Type II considerations
- GDPR data residency options (EU hosting)
- Right to deletion (user can remove all stored credentials)

### Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Credential breach | Encryption + HSM key management |
| API key rotation | Users can update credentials anytime |
| Service outage | Fallback to local MCP server mode |
| Vendor API changes | Versioned MCP servers, graceful degradation |

---

## Datto RMM MCP Server Specification

### Tools to Implement

Based on Datto RMM API capabilities:

| Tool | Description | API Endpoint |
|------|-------------|--------------|
| `datto_list_devices` | List devices with filters | GET /api/v2/account/devices |
| `datto_get_device` | Get device details | GET /api/v2/device/{uid} |
| `datto_list_alerts` | List open alerts | GET /api/v2/account/alerts |
| `datto_resolve_alert` | Resolve an alert | POST /api/v2/alert/{uid}/resolve |
| `datto_list_sites` | List all sites | GET /api/v2/account/sites |
| `datto_get_site` | Get site details | GET /api/v2/site/{uid} |
| `datto_run_quickjob` | Execute a quick job | POST /api/v2/device/{uid}/quickjob |
| `datto_get_audit` | Get device audit data | GET /api/v2/device/{uid}/audit/{type} |

### Authentication

```
Base URL: https://{platform}-api.centrastage.net
Headers:
  Authorization: Bearer {api_key}:{api_secret}
```

---

## IT Glue MCP Server Specification

### Tools to Implement

| Tool | Description | API Endpoint |
|------|-------------|--------------|
| `itglue_search_organizations` | Search organizations | GET /organizations |
| `itglue_get_organization` | Get org details | GET /organizations/{id} |
| `itglue_search_configurations` | Search assets | GET /configurations |
| `itglue_get_configuration` | Get asset details | GET /configurations/{id} |
| `itglue_search_passwords` | Search passwords | GET /passwords |
| `itglue_get_password` | Get password (with audit) | GET /passwords/{id} |
| `itglue_search_documents` | Search documents | GET /documents |
| `itglue_search_flexible_assets` | Search flexible assets | GET /flexible_assets |

### Authentication

```
Base URL: https://api.itglue.com
Headers:
  x-api-key: {api_key}
```

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Connection success rate | > 95% |
| Auth flow completion | < 60 seconds |
| API latency overhead | < 100ms added |
| Credential storage security | Zero breaches |
| User adoption | 50% of plugin users connect within 30 days |

---

## Implementation Phases

### Phase 0: MCP Gateway Foundation (Weeks 1-3)
- [ ] Set up cloud infrastructure (hosting provider selection)
- [ ] Implement MCP Gateway core with path-based routing
- [ ] Build OAuth 2.1 + PKCE authorization server
- [ ] Implement secure credential store (encrypted at rest)
- [ ] Create credential entry UI (web pages for API key input)
- [ ] Build session manager with Redis backing
- [ ] Set up audit logging and monitoring
- [ ] Deploy gateway shell to production (no vendor handlers yet)

### Phase 1: Datto RMM Handler (Week 4)
- [ ] Implement DattoRMMHandler in gateway
- [ ] Add all Datto RMM tools (list_devices, get_device, list_alerts, etc.)
- [ ] Create Datto RMM credential entry page
- [ ] Integration testing with real Datto API
- [ ] Update plugin `.mcp.json` to use gateway URL

### Phase 2: IT Glue Handler (Week 5)
- [ ] Implement ITGlueHandler in gateway
- [ ] Add all IT Glue tools (search_organizations, get_password, etc.)
- [ ] Create IT Glue credential entry page
- [ ] Integration testing with real IT Glue API
- [ ] Update plugin `.mcp.json` to use gateway URL

### Phase 3: Autotask Handler (Week 6)
- [ ] Port existing autotask-mcp logic to AutotaskHandler
- [ ] Migrate tools to gateway format
- [ ] Create Autotask credential entry page
- [ ] Migration guide for existing local MCP users
- [ ] Update plugin `.mcp.json` to use gateway URL

### Phase 4: Community Vendor Handlers (Weeks 7-10)
- [ ] HaloPSAHandler (native OAuth passthrough - cleanest)
- [ ] SyncroHandler (API key)
- [ ] AteraHandler (API key)
- [ ] SuperOpsHandler (Bearer token + GraphQL)
- [ ] ConnectWisePSAHandler (API key + Client ID)
- [ ] ConnectWiseAutomateHandler (Token-based)

### Phase 5: Production Hardening (Week 11+)
- [ ] Multi-region deployment for latency
- [ ] Enhanced monitoring and alerting
- [ ] Rate limiting per user/vendor
- [ ] Self-service credential rotation
- [ ] SOC 2 compliance documentation

---

## Open Questions

1. ~~**Domain**~~ → **Resolved: `mcp.wyre.ai`**
2. **Pricing**: Free tier? Per-user? Per-organization?
3. **Self-hosting option**: Provide Docker images for on-prem deployment?
4. **Local fallback**: Keep local MCP server option for air-gapped environments?
5. **Multi-tenant**: Support MSP managing multiple client credentials?
6. **Hosting provider**: AWS (Lambda + API Gateway) vs Fly.io vs Railway vs Kubernetes?
7. **Gateway vs Individual Servers**: Gateway recommended (see analysis above), but should we support both deployment models?

## Architecture Decision: Gateway vs Individual Servers

| Aspect | Individual Servers | Unified Gateway (Recommended) |
|--------|-------------------|------------------------------|
| Deployment complexity | 9+ separate deployments | Single deployment |
| Auth implementation | Per-server OAuth | Centralized OAuth once |
| Credential storage | Per-server stores | Unified credential store |
| Monitoring | Multiple dashboards | Single observability stack |
| Latency | Direct to vendor | +10-20ms routing overhead |
| Scaling | Scale each independently | Scale gateway horizontally |
| Cost | Higher (multiple services) | Lower (single service) |
| Maintenance | Higher (9+ codebases) | Lower (one codebase, handlers) |

**Recommendation**: Start with unified gateway. Individual servers remain an option for vendors requiring special handling or for self-hosted deployments.

---

## Dependencies

- MCP SDK (TypeScript)
- Existing node libraries: node-datto-rmm, node-it-glue (if usable)
- Cloud infrastructure account
- Domain and SSL certificates
- OAuth provider setup

---

## References

### MCP Protocol & SDK
- [MCP SDK Documentation](https://modelcontextprotocol.io/)
- [MCP OAuth 2.1 Specification (June 2025)](https://spec.modelcontextprotocol.io/specification/2025-03-26/basic/authentication/)
- [Anthropic knowledge-work-plugins](https://github.com/anthropics/knowledge-work-plugins)

### Gateway Solutions Evaluated
- [Microsoft MCP Gateway](https://github.com/microsoft/mcp-gateway) - Kubernetes-native, Azure Entra ID
- [Docker MCP Gateway](https://github.com/docker/mcp-gateway) - Open-source orchestration
- [MetaMCP](https://github.com/nicholaslee119/metamcp) - Multi-server aggregator
- [MCPHub](https://github.com/ravitemer/mcphub.nvim) - Unified hub pattern

### Vendor API Documentation
- [Datto RMM API Docs](https://rmm.datto.com/help/en/Content/2SETUP/APIv2.htm)
- [IT Glue API Docs](https://api.itglue.com/developer/)
- [Autotask REST API Docs](https://ww5.autotask.net/help/DeveloperHelp/Content/APIs/REST/REST_API_Home.htm)
- [HaloPSA API Docs](https://halopsa.com/apidoc/)
- [Syncro API Docs](https://api-docs.syncromsp.com/)
- [Atera API Docs](https://app.atera.com/apidocs/)
- [SuperOps GraphQL API](https://developers.superops.ai/)
- [ConnectWise Manage API](https://developer.connectwise.com/Products/Manage/REST)
