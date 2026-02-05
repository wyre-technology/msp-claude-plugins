# MSP Claude Plugins - Project Configuration

## Project Overview
Community-driven Claude Code plugins for Managed Service Providers (MSPs).

## Learnings - 2026-02-04

### Astro Starlight GitHub Pages Configuration
When deploying Astro/Starlight to GitHub Pages at a subpath (e.g., `user.github.io/repo`), you must set both `site` and `base` in `astro.config.mjs`, and all internal links must include the base path prefix (e.g., `/msp-claude-plugins/getting-started/`).

### GitHub Pages Workflow Enablement via API
To enable GitHub Pages with workflow-based builds: `gh api repos/OWNER/REPO/pages -X POST -f build_type=workflow`. The PUT endpoint returns 404 if pages aren't already configured - use POST first to create.

### Parallel File Creator Agents for Documentation
When creating many documentation files (e.g., 20+ pages for a docs site), use multiple Task agents with `subagent_type=file-creator` in parallel, grouping files by logical section (getting-started, reference, commands, etc.) for efficient generation.

### Claude Code Marketplace Manifest Structure
The marketplace requires `.claude-plugin/marketplace.json` with `$schema`, `name`, `owner`, and `plugins` array. Each plugin entry needs `name`, `source` (relative path like `./kaseya/autotask`), and `description`. Users install via `/plugin marketplace add owner/repo`.

### Starlight Valid Icon Names
Starlight uses a specific icon set. Use `seti:folder` for folder icons (not `folder`). Common valid icons: `open-book`, `rocket`, `setting`, `add-document`, `github`. Invalid icons render as colored squares.

### GitHub Actions Workflow Location for Monorepos
When the git repo root differs from the docs directory (e.g., repo at `/mspMarketPlace/` but docs at `/mspMarketPlace/msp-claude-plugins/docs/`), the `.github/workflows/` must be at the repo root, and workflow paths must reference the full path (e.g., `msp-claude-plugins/docs/`).

### Claude Code Plugin Architecture: Skills vs MCP
Plugins have value without MCP servers - skills provide domain knowledge, commands provide prompt templates. MCP servers require implementing the MCP protocol; client libraries (like node-syncro) are NOT MCP servers and cannot be invoked via `npx` in .mcp.json. Only include .mcp.json when an actual MCP server package exists.

### Plugin.json Valid Schema Fields
Valid fields: `name`, `version`, `description`, `author`, `homepage`, `repository`, `license`, `mcpServers`, `hooks`. Don't use custom fields like `vendor`, `product`, `api_version`, `requires_api_key`. Document auth requirements in README instead.

### ESLint varsIgnorePattern for Underscore Variables
`argsIgnorePattern: "^_"` only applies to function arguments, not destructured variables. To ignore underscore-prefixed variables in destructuring, add `varsIgnorePattern: "^_"`. Full config: `["error", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }]`.

### Marketplace-First README Pattern
Following anthropics/knowledge-work-plugins, lead with one-command marketplace install (`/plugin marketplace add owner/repo`), then clean plugin table, then progressive disclosure. Dramatically shorter and more effective than detailed technical READMEs.

### Custom Astro vs Starlight Trade-off
Custom Astro sites require manually building navigation, search (Pagefind), dark mode, and code copy. Worth it when PRD specifies exact design system (colors, typography) that Starlight can't match.

### Marketplace.json Plugin Entries
Each plugin needs `name` (for `--plugin` flag), `source` (relative path like `./kaseya/autotask`), `description`, `version`, `category`, and `tags`. The `source` path must start with `./`.

## Learnings - 2026-02-05

### Claude Code Plugin Authentication Pattern
Plugins should use `~/.claude/settings.json` with an `env` section for credentials (encrypted in macOS Keychain), not raw shell env vars. Project-specific secrets go in `.claude/settings.local.json` (gitignored). MCP servers access credentials via `${VAR}` syntax in `.mcp.json`. Precedence: managed → CLI → local → project → user.

### Validation Status Badges for Plugin Quality
Use status badges (✅ Validated, 🧪 Community) rather than disclaimer paragraphs to set expectations. Brief footnote: "Validated = tested against production APIs. Community = follows patterns, may need adjustments." No hedging or apologies.
