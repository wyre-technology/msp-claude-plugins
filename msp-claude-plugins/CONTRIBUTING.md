# Contributing to MSP Claude Plugins

Thank you for your interest in contributing to the MSP Claude Plugins Marketplace! This document provides comprehensive guidelines for contributing plugins, skills, and commands.

## Table of Contents

- [The PRD Mandate](#the-prd-mandate)
- [Getting Started](#getting-started)
- [Development Environment Setup](#development-environment-setup)
- [Contribution Workflow](#contribution-workflow)
- [Skill Development Guide](#skill-development-guide)
- [Command Development Guide](#command-development-guide)
- [MCP Server Integration Guide](#mcp-server-integration-guide)
- [Testing Requirements](#testing-requirements)
- [Style Guide](#style-guide)
- [Pull Request Process](#pull-request-process)
- [Issue Templates](#issue-templates)
- [Getting Help](#getting-help)

---

## The PRD Mandate

**All development begins with a PRD. This is non-negotiable.**

Before any code is written, any skill is created, or any command is defined, a PRD must be:

1. **Created** using the template in `_templates/plugin-prd-template.md`
2. **Reviewed** by at least one community member
3. **Approved** via PR review process
4. **Stored** in the plugin's `prd/` directory

### Why PRDs First?

| Benefit | Description |
|---------|-------------|
| **Clear Problem Definition** | Forces articulation of what problem you're solving |
| **Community Input** | Enables feedback before development effort |
| **Living Documentation** | Creates docs that live with the code |
| **Scope Control** | Prevents scope creep and feature drift |
| **Validation** | Ensures the contribution is valuable to the community |

### PRD Requirements Checklist

Before submitting a PRD, verify these items:

- [ ] **Problem Statement** - Clearly describes the problem being solved
- [ ] **User Stories** - At least 3 concrete user stories
- [ ] **Scope** - Explicitly lists what's in scope and out of scope
- [ ] **API Research** - References official vendor API documentation
- [ ] **Technical Approach** - Describes implementation strategy
- [ ] **Success Criteria** - Defines what "done" looks like
- [ ] **Security Considerations** - Addresses credential handling
- [ ] **Testing Plan** - Describes how the contribution will be validated

See `_standards/prd-requirements.md` for detailed requirements.

---

## Getting Started

### Prerequisites

| Requirement | Description |
|-------------|-------------|
| GitHub Account | For forking and submitting PRs |
| Git | Version control |
| Text Editor | VS Code recommended with Markdown preview |
| MSP Knowledge | Understanding of PSA/RMM workflows |
| API Documentation | Access to vendor API docs you're targeting |
| (Optional) API Access | For testing against live APIs |

### Fork and Clone

```bash
# 1. Fork the repository via GitHub UI (click Fork button)

# 2. Clone your fork
git clone https://github.com/YOUR-USERNAME/msp-claude-plugins.git
cd msp-claude-plugins

# 3. Add upstream remote for syncing
git remote add upstream https://github.com/OWNER/msp-claude-plugins.git

# 4. Verify remotes
git remote -v
# origin    https://github.com/YOUR-USERNAME/msp-claude-plugins.git (fetch)
# origin    https://github.com/YOUR-USERNAME/msp-claude-plugins.git (push)
# upstream  https://github.com/OWNER/msp-claude-plugins.git (fetch)
# upstream  https://github.com/OWNER/msp-claude-plugins.git (push)
```

### Syncing Your Fork

```bash
# Before starting new work, sync with upstream
git checkout main
git fetch upstream
git merge upstream/main
git push origin main
```

---

## Development Environment Setup

### Directory Structure

```
msp-claude-plugins/
├── _standards/              # Quality standards (read first!)
├── _templates/              # Templates for all contributions
├── kaseya/                  # Kaseya vendor plugins
│   └── autotask/           # Reference implementation
├── connectwise/             # ConnectWise vendor plugins
├── shared/                  # Vendor-agnostic skills
└── docs/                    # Documentation site (when available)
```

### Recommended Tools

| Tool | Purpose | Installation |
|------|---------|--------------|
| VS Code | Editor with Markdown preview | https://code.visualstudio.com |
| Markdown All in One | VS Code extension | VS Code marketplace |
| YAML | VS Code extension for frontmatter | VS Code marketplace |
| REST Client | API testing | Thunder Client extension |
| Claude Code | Testing plugins locally | https://claude.ai/code |

### Environment Variables

When testing MCP integrations, configure these environment variables:

```bash
# Autotask
export AUTOTASK_USERNAME="your-api-user@domain.com"
export AUTOTASK_INTEGRATION_CODE="YOUR_INTEGRATION_CODE"
export AUTOTASK_SECRET="YOUR_SECRET"

# ConnectWise
export CW_COMPANY_ID="your-company"
export CW_PUBLIC_KEY="your-public-key"
export CW_PRIVATE_KEY="your-private-key"
export CW_CLIENT_ID="your-client-id"

# Never commit these values!
```

---

## Contribution Workflow

### Phase 1: PRD Creation

```bash
# 1. Create PRD branch
git checkout main && git pull upstream main
git checkout -b prd/vendor-product-component

# 2. Create PRD directory structure
mkdir -p vendor/product/prd

# 3. Copy and fill out PRD template
cp _templates/plugin-prd-template.md vendor/product/prd/component-prd.md

# 4. Commit and push
git add vendor/product/prd/
git commit -m "PRD: Add PRD for vendor/product/component"
git push origin prd/vendor-product-component

# 5. Create Pull Request with [PRD] prefix
# Title: [PRD] vendor/product/component
```

### Phase 2: Implementation (After PRD Approval)

```bash
# 1. Create feature branch from updated main
git checkout main && git pull upstream main
git checkout -b feature/vendor-product-component

# 2. Implement according to approved PRD
# - Create skill files in skills/
# - Create command files in commands/
# - Update plugin.json if needed
# - Update README.md

# 3. Commit with conventional commit format
git add .
git commit -m "feat(autotask): Add time entry skill per PRD #123"

# 4. Push and create PR
git push origin feature/vendor-product-component
# Create PR linking to approved PRD
```

### Commit Message Format

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

| Type | Use Case |
|------|----------|
| `feat` | New feature (skill, command, plugin) |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, no code change |
| `refactor` | Code restructuring |
| `test` | Adding tests |
| `chore` | Maintenance tasks |

Examples:
```
feat(autotask): Add configuration items skill
fix(autotask): Correct ticket status code values
docs(readme): Add usage examples
```

---

## Skill Development Guide

Skills provide domain knowledge that Claude can reference when helping users.

### Skill File Location

```
vendor/product/skills/skill-name/SKILL.md
```

### Skill Template Structure

```markdown
---
description: >
  Use this skill when [specific trigger conditions].
  [Additional context about what this skill covers].
triggers:
  - trigger phrase 1
  - trigger phrase 2
  - trigger phrase 3
---

# Skill Title

## Overview
[2-3 paragraphs explaining what this skill covers and why it's important]

## Key Concepts
[Tables, definitions, and core knowledge]

## Field Reference
[Complete field documentation with types and descriptions]

## Business Logic
[Workflows, validation rules, status transitions]

## API Patterns
[Concrete API examples with request/response]

## Common Workflows
[Step-by-step guides for common tasks]

## Error Handling
[Common errors and resolutions]

## Best Practices
[Numbered list of recommendations]

## Related Skills
[Links to related skills]
```

### Example: Learning from Existing Skills

Study the Autotask tickets skill as a reference:

**File:** `kaseya/autotask/skills/tickets/SKILL.md`

**Key elements to note:**

1. **Frontmatter Triggers** - Multiple relevant keywords
   ```yaml
   triggers:
     - autotask ticket
     - service ticket
     - create ticket autotask
     - ticket queue
     - ticket status
   ```

2. **Status Code Tables** - Clear reference data
   ```markdown
   | Status ID | Name | Description | Business Logic |
   |-----------|------|-------------|----------------|
   | **1** | NEW | Newly created ticket | Default for new tickets |
   ```

3. **Business Logic Code** - Practical validation examples
   ```javascript
   function validateStatusTransition(currentStatus, newStatus, ticket) {
     // Validation logic
   }
   ```

4. **API Examples** - Real request/response patterns
   ```json
   POST /v1.0/Tickets
   {
     "companyID": 12345,
     "title": "Issue description",
     "status": 1,
     "priority": 2
   }
   ```

### Skill Quality Checklist

Before submitting a skill, verify:

- [ ] Frontmatter has accurate, comprehensive triggers
- [ ] Overview explains the domain clearly
- [ ] All relevant fields are documented with types
- [ ] Status codes/enums have complete tables
- [ ] API examples use realistic (but fake) data
- [ ] No hardcoded credentials
- [ ] Business logic includes validation rules
- [ ] Error handling section is complete
- [ ] Links to related skills work

---

## Command Development Guide

Commands provide slash-command shortcuts for common operations.

### Command File Location

```
vendor/product/commands/command-name.md
```

### Command Template Structure

```markdown
---
name: command-name
description: Brief description of what this command does
arguments:
  - name: required-arg
    description: Description of this argument
    required: true
  - name: optional-arg
    description: Description of optional argument
    required: false
---

# Command Title

Brief description of the command's purpose.

## Prerequisites
- List of requirements before using this command
- API credentials configured
- Permissions needed

## Steps
1. **Step title** - Description
   - Sub-step details
   - API calls made

2. **Step title** - Description
   ```json
   // Example API request
   ```

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| arg1 | string | Yes | - | Description |
| arg2 | int | No | 10 | Description |

## Examples

### Basic Usage
```
/command-name "required value"
```

### With Options
```
/command-name "value" --option1 "something" --option2 123
```

## Output

### Success
```
✅ Operation completed
Details...
```

### Error Handling
| Error | Resolution |
|-------|------------|
| Not found | Verify ID exists |
| Unauthorized | Check credentials |

## Related Commands
- `/other-command` - Description
```

### Command Best Practices

1. **Keep names short and memorable** - `/create-ticket` not `/create-new-service-ticket`
2. **Use intuitive arguments** - First argument should be most important
3. **Provide sensible defaults** - Optional args should have good defaults
4. **Show progress** - Include output examples showing success/failure
5. **Handle errors gracefully** - Document common errors and fixes

---

## MCP Server Integration Guide

MCP (Model Context Protocol) enables direct API connectivity from Claude.

### MCP Configuration File

Create `.mcp.json` in your plugin root:

```json
{
  "mcpServers": {
    "vendor-product": {
      "command": "npx",
      "args": ["-y", "@vendor/mcp-server-product"],
      "env": {
        "API_USERNAME": "${VENDOR_USERNAME}",
        "API_KEY": "${VENDOR_API_KEY}"
      }
    }
  }
}
```

### Environment Variable References

- Use `${VARIABLE_NAME}` syntax for environment variables
- Document all required variables in README.md
- Never hardcode credentials

### Testing MCP Integration

```bash
# 1. Set environment variables
export VENDOR_USERNAME="test-user"
export VENDOR_API_KEY="test-key"

# 2. Start Claude Code with plugin
cd vendor/product
claude --plugin .

# 3. Test MCP tools
# Claude should have access to vendor API tools
```

### MCP Server Development

If creating a new MCP server:

1. Follow [MCP specification](https://modelcontextprotocol.io/)
2. Publish to npm as `@vendor/mcp-server-product`
3. Document all available tools
4. Include authentication guidance
5. Handle rate limiting appropriately

---

## Testing Requirements

### Manual Testing Checklist

| Test | Description | Required |
|------|-------------|----------|
| Skill Triggers | Verify triggers activate the skill | Yes |
| API Examples | Validate against actual API docs | Yes |
| Command Arguments | Test all argument combinations | Yes |
| Error Cases | Verify error messages are helpful | Yes |
| MCP Connection | Test MCP server connectivity | If MCP |

### Testing Against Live API

When you have API access:

```bash
# 1. Configure credentials
export VENDOR_API_KEY="your-key"

# 2. Use REST client to test examples
# Verify all API examples in skills actually work

# 3. Document any discrepancies
# Update skill if API behavior differs from docs
```

### Testing Without API Access

If you don't have API access:

1. Build from official API documentation
2. Mark contribution as "Documentation-based, untested"
3. Add note in PR requesting community testing
4. Look for community members with API access

---

## Style Guide

### Markdown Formatting

| Element | Style |
|---------|-------|
| Headers | Use ATX style (`#`, `##`, `###`) |
| Lists | Use `-` for unordered, `1.` for ordered |
| Code | Use fenced code blocks with language |
| Tables | Use pipes with header separator |
| Links | Use reference-style for repeated links |

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Skill directories | kebab-case | `time-entries/` |
| Command files | kebab-case | `create-ticket.md` |
| Plugin names | kebab-case | `autotask-psa` |
| Environment vars | SCREAMING_SNAKE_CASE | `AUTOTASK_API_KEY` |

### API Example Standards

```json
// Good - uses generic IDs and realistic structure
{
  "companyID": 12345,
  "title": "Email not working",
  "priority": 2,
  "status": 1
}

// Bad - uses real data
{
  "companyID": 987654321,  // Real ID
  "title": "Fix John's email",  // Real person
  "contactEmail": "john@realcompany.com"  // Real email
}
```

### Documentation Language

- Use active voice
- Be concise but complete
- Define acronyms on first use
- Include examples for complex concepts
- Write for MSP technicians (not developers)

---

## Pull Request Process

### PR Title Format

| Type | Format | Example |
|------|--------|---------|
| PRD | `[PRD] scope` | `[PRD] autotask/time-entries` |
| Feature | `feat(scope): description` | `feat(autotask): Add time entries skill` |
| Fix | `fix(scope): description` | `fix(autotask): Correct status codes` |
| Docs | `docs(scope): description` | `docs(readme): Add examples` |

### PR Description Template

```markdown
## Summary
Brief description of changes

## Related PRD
Link to approved PRD (for feature PRs)

## Changes
- Change 1
- Change 2

## Testing
- [ ] Tested manually
- [ ] API examples validated
- [ ] MCP integration tested (if applicable)

## Checklist
- [ ] PRD approved (for features)
- [ ] Quality checklist complete
- [ ] No credentials in code
- [ ] README updated
- [ ] CHANGELOG updated
```

### Review Process

1. **Automated Checks** - Formatting, links, structure
2. **Peer Review** - At least 1 approval required
3. **Maintainer Review** - For significant changes
4. **Community Testing** - For untested contributions

### Responding to Feedback

- Address all comments before re-requesting review
- Use "Resolve conversation" when addressed
- Ask for clarification if feedback is unclear
- Be patient - reviewers are volunteers

---

## Issue Templates

### Bug Report

When reporting bugs, include:

```markdown
**Plugin/Skill Affected:** kaseya/autotask/tickets

**Description:** Brief description of the bug

**Expected Behavior:** What should happen

**Actual Behavior:** What actually happens

**Steps to Reproduce:**
1. Step 1
2. Step 2
3. Step 3

**Environment:**
- Claude Code version:
- OS:
- API version (if known):

**Additional Context:** Screenshots, logs, etc.
```

### Feature Request

When requesting features, include:

```markdown
**Plugin/Vendor:** Which vendor/product

**Problem Statement:** What problem does this solve?

**Proposed Solution:** Your idea for the solution

**User Stories:**
- As a [role], I want to [action] so that [benefit]

**Alternatives Considered:** Other approaches you thought of

**Willingness to Contribute:**
- [ ] I would be willing to submit a PRD for this
- [ ] I would be willing to implement this
```

### New Plugin Request

When requesting a new vendor plugin:

```markdown
**Vendor:** Vendor name
**Product:** Product name

**API Documentation:** Link to official API docs

**Key Entities:** What should the plugin cover?
- Entity 1
- Entity 2

**Community Interest:** Why is this valuable?

**Willingness to Contribute:**
- [ ] I have API access for testing
- [ ] I would be willing to lead this plugin
```

---

## Getting Help

### Communication Channels

| Channel | Use Case |
|---------|----------|
| GitHub Issues | Bug reports, feature requests |
| GitHub Discussions | Questions, ideas, community chat |
| PR Comments | Code review, implementation questions |

### Getting API Access

If you need API access for testing:

1. **Vendor Partner Programs** - Many vendors have free partner/developer tiers
2. **Sandbox Environments** - Ask vendor for test environment
3. **Community Help** - Post in discussions asking for testing help
4. **Documentation-Based** - Build from docs, mark as untested

### Mentorship

New to contributing? Look for issues labeled:
- `good-first-issue` - Great starting points
- `help-wanted` - Community help needed
- `documentation` - Lower barrier to entry

---

## Code of Conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

We are committed to providing a welcoming and inclusive environment for all contributors regardless of background, identity, or experience level.

---

## Recognition

Contributors are recognized in:
- CHANGELOG.md for significant contributions
- README.md acknowledgments section
- GitHub contributor graphs

Thank you for contributing to the MSP Claude Plugins Marketplace!

---

<p align="center">
  <strong>Questions?</strong> Open an issue or start a discussion.
  <br>
  <a href="https://github.com/OWNER/msp-claude-plugins/issues">Issues</a> •
  <a href="https://github.com/OWNER/msp-claude-plugins/discussions">Discussions</a>
</p>
