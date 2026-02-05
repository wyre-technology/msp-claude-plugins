#!/bin/bash
# Setup script for wyre-mcp GitHub organization
#
# PREREQUISITES (Manual Steps Required):
# 1. Create the wyre-mcp organization at https://github.com/organizations/plan
# 2. Add admin:org scope: gh auth refresh -h github.com -s admin:org
#
# After completing the manual steps, run this script to set up repositories.

set -e

ORG_NAME="wyre-mcp"
GATEWAY_UPSTREAM="agentic-community/mcp-gateway-registry"

echo "🔍 Checking prerequisites..."

# Check if org exists
if ! gh api "orgs/$ORG_NAME" &>/dev/null; then
    echo "❌ Organization '$ORG_NAME' does not exist."
    echo ""
    echo "Please create it manually:"
    echo "  1. Go to https://github.com/organizations/plan"
    echo "  2. Create organization named '$ORG_NAME'"
    echo "  3. Run: gh auth refresh -h github.com -s admin:org"
    echo "  4. Re-run this script"
    exit 1
fi

echo "✅ Organization '$ORG_NAME' exists"

# Check auth scope
if ! gh api user/orgs &>/dev/null; then
    echo "❌ Missing admin:org scope. Run:"
    echo "   gh auth refresh -h github.com -s admin:org"
    exit 1
fi

echo "✅ GitHub CLI authenticated with required scopes"

echo ""
echo "📦 Creating repositories..."

# Function to create repo if it doesn't exist
create_repo() {
    local repo_name=$1
    local description=$2

    if gh repo view "$ORG_NAME/$repo_name" &>/dev/null; then
        echo "  ⏭️  $repo_name already exists"
    else
        echo "  📁 Creating $repo_name..."
        gh repo create "$ORG_NAME/$repo_name" \
            --public \
            --description "$description" \
            --license Apache-2.0
        echo "  ✅ Created $repo_name"
    fi
}

# Fork the gateway repository
echo ""
echo "🍴 Forking MCP Gateway Registry..."
if gh repo view "$ORG_NAME/mcp-gateway" &>/dev/null; then
    echo "  ⏭️  mcp-gateway already exists"
else
    gh repo fork "$GATEWAY_UPSTREAM" \
        --org "$ORG_NAME" \
        --fork-name "mcp-gateway" \
        --clone=false
    echo "  ✅ Forked to $ORG_NAME/mcp-gateway"
fi

# Create MCP server repositories
echo ""
echo "📦 Creating MCP server repositories..."

create_repo "autotask-mcp" "Autotask PSA MCP server for Claude"
create_repo "datto-rmm-mcp" "Datto RMM MCP server for Claude"
create_repo "itglue-mcp" "IT Glue MCP server for Claude"
create_repo "syncro-mcp" "Syncro MSP MCP server for Claude"
create_repo "atera-mcp" "Atera MCP server for Claude"
create_repo "superops-mcp" "SuperOps.ai MCP server for Claude"
create_repo "halopsa-mcp" "HaloPSA MCP server for Claude"

echo ""
echo "🔐 Setting up organization secrets..."
echo "  ⚠️  Manual step required: Add the following secrets in GitHub UI"
echo "     https://github.com/organizations/$ORG_NAME/settings/secrets/actions"
echo ""
echo "  Required secrets:"
echo "    - AZURE_CREDENTIALS (for Azure Container Apps deployment)"
echo "    - AZURE_SUBSCRIPTION_ID"
echo "    - AZURE_RESOURCE_GROUP"

echo ""
echo "✅ Repository setup complete!"
echo ""
echo "Next steps:"
echo "  1. Clone mcp-gateway and customize for mcp.wyre.ai"
echo "  2. Set up CI/CD workflows in each repository"
echo "  3. Configure branch protection rules"
echo ""
