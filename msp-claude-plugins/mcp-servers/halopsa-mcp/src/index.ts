#!/usr/bin/env node
/**
 * HaloPSA MCP Server
 *
 * This MCP server provides tools for interacting with HaloPSA API.
 * It accepts OAuth 2.0 credentials via environment variables from the MCP Gateway.
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { HaloPsaClient } from "@asachs01/node-halopsa";

const server = new Server(
  {
    name: "halopsa-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Credential extraction from gateway headers/env
interface HaloPsaCredentials {
  clientId: string;
  clientSecret: string;
  tenant?: string;
  baseUrl?: string;
}

function getCredentials(): HaloPsaCredentials | null {
  const clientId = process.env.HALOPSA_CLIENT_ID || process.env.X_CLIENT_ID;
  const clientSecret = process.env.HALOPSA_CLIENT_SECRET || process.env.X_CLIENT_SECRET;
  const tenant = process.env.HALOPSA_TENANT || process.env.X_TENANT;
  const baseUrl = process.env.HALOPSA_BASE_URL || process.env.X_BASE_URL;

  if (!clientId || !clientSecret) {
    return null;
  }

  if (!tenant && !baseUrl) {
    return null;
  }

  return { clientId, clientSecret, tenant, baseUrl };
}

function createClient(creds: HaloPsaCredentials): HaloPsaClient {
  return new HaloPsaClient({
    clientId: creds.clientId,
    clientSecret: creds.clientSecret,
    tenant: creds.tenant,
    baseUrl: creds.baseUrl,
  });
}

// Define available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      // Ticket tools
      {
        name: "halopsa_list_tickets",
        description: "List tickets with optional filters",
        inputSchema: {
          type: "object",
          properties: {
            client_id: {
              type: "number",
              description: "Filter by client ID",
            },
            site_id: {
              type: "number",
              description: "Filter by site ID",
            },
            agent_id: {
              type: "number",
              description: "Filter by assigned agent ID",
            },
            status_id: {
              type: "number",
              description: "Filter by status ID",
            },
            priority_id: {
              type: "number",
              description: "Filter by priority ID",
            },
            tickettype_id: {
              type: "number",
              description: "Filter by ticket type ID",
            },
            open_only: {
              type: "boolean",
              description: "Show only open tickets",
            },
            closed_only: {
              type: "boolean",
              description: "Show only closed tickets",
            },
            pageSize: {
              type: "number",
              description: "Number of results per page (default: 50)",
              default: 50,
            },
            pageNo: {
              type: "number",
              description: "Page number (default: 1)",
              default: 1,
            },
          },
        },
      },
      {
        name: "halopsa_get_ticket",
        description: "Get details for a specific ticket",
        inputSchema: {
          type: "object",
          properties: {
            id: {
              type: "number",
              description: "The ticket ID",
            },
          },
          required: ["id"],
        },
      },
      {
        name: "halopsa_create_ticket",
        description: "Create a new ticket",
        inputSchema: {
          type: "object",
          properties: {
            summary: {
              type: "string",
              description: "Ticket summary/title",
            },
            details: {
              type: "string",
              description: "Ticket description/details",
            },
            client_id: {
              type: "number",
              description: "Client ID",
            },
            tickettype_id: {
              type: "number",
              description: "Ticket type ID",
            },
            site_id: {
              type: "number",
              description: "Site ID",
            },
            user_id: {
              type: "number",
              description: "User/contact ID",
            },
            agent_id: {
              type: "number",
              description: "Assigned agent ID",
            },
            team_id: {
              type: "number",
              description: "Team ID",
            },
            status_id: {
              type: "number",
              description: "Status ID",
            },
            priority_id: {
              type: "number",
              description: "Priority ID",
            },
            category_1: {
              type: "string",
              description: "Category level 1",
            },
          },
          required: ["summary", "client_id", "tickettype_id"],
        },
      },
      {
        name: "halopsa_update_ticket",
        description: "Update an existing ticket",
        inputSchema: {
          type: "object",
          properties: {
            id: {
              type: "number",
              description: "The ticket ID to update",
            },
            summary: {
              type: "string",
              description: "Ticket summary/title",
            },
            details: {
              type: "string",
              description: "Ticket description/details",
            },
            agent_id: {
              type: "number",
              description: "Assigned agent ID",
            },
            team_id: {
              type: "number",
              description: "Team ID",
            },
            status_id: {
              type: "number",
              description: "Status ID",
            },
            priority_id: {
              type: "number",
              description: "Priority ID",
            },
            category_1: {
              type: "string",
              description: "Category level 1",
            },
          },
          required: ["id"],
        },
      },
      {
        name: "halopsa_add_ticket_action",
        description: "Add an action/note to a ticket",
        inputSchema: {
          type: "object",
          properties: {
            ticket_id: {
              type: "number",
              description: "The ticket ID",
            },
            note: {
              type: "string",
              description: "The action note/comment",
            },
            outcome: {
              type: "string",
              description: "Outcome description",
            },
            timetaken: {
              type: "number",
              description: "Time taken in minutes",
            },
            hiddenfromuser: {
              type: "boolean",
              description: "Hide from end user (internal note)",
            },
          },
          required: ["ticket_id", "note"],
        },
      },
      // Client tools
      {
        name: "halopsa_list_clients",
        description: "List clients/customers with optional filters",
        inputSchema: {
          type: "object",
          properties: {
            inactive: {
              type: "boolean",
              description: "Show inactive clients",
            },
            toplevel_id: {
              type: "number",
              description: "Filter by top-level client ID",
            },
            pageSize: {
              type: "number",
              description: "Number of results per page (default: 50)",
              default: 50,
            },
            pageNo: {
              type: "number",
              description: "Page number (default: 1)",
              default: 1,
            },
          },
        },
      },
      {
        name: "halopsa_get_client",
        description: "Get details for a specific client",
        inputSchema: {
          type: "object",
          properties: {
            id: {
              type: "number",
              description: "The client ID",
            },
          },
          required: ["id"],
        },
      },
      {
        name: "halopsa_create_client",
        description: "Create a new client",
        inputSchema: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Client name",
            },
            website: {
              type: "string",
              description: "Client website URL",
            },
            phonenumber: {
              type: "string",
              description: "Client phone number",
            },
            email: {
              type: "string",
              description: "Client email address",
            },
            notes: {
              type: "string",
              description: "Notes about the client",
            },
          },
          required: ["name"],
        },
      },
      // Asset tools
      {
        name: "halopsa_list_assets",
        description: "List assets/configuration items with optional filters",
        inputSchema: {
          type: "object",
          properties: {
            client_id: {
              type: "number",
              description: "Filter by client ID",
            },
            site_id: {
              type: "number",
              description: "Filter by site ID",
            },
            assettype_id: {
              type: "number",
              description: "Filter by asset type ID",
            },
            inactive: {
              type: "boolean",
              description: "Show inactive assets",
            },
            pageSize: {
              type: "number",
              description: "Number of results per page (default: 50)",
              default: 50,
            },
            pageNo: {
              type: "number",
              description: "Page number (default: 1)",
              default: 1,
            },
          },
        },
      },
      {
        name: "halopsa_get_asset",
        description: "Get details for a specific asset",
        inputSchema: {
          type: "object",
          properties: {
            id: {
              type: "number",
              description: "The asset ID",
            },
          },
          required: ["id"],
        },
      },
      {
        name: "halopsa_create_asset",
        description: "Create a new asset",
        inputSchema: {
          type: "object",
          properties: {
            assettype_id: {
              type: "number",
              description: "Asset type ID",
            },
            client_id: {
              type: "number",
              description: "Client ID",
            },
            site_id: {
              type: "number",
              description: "Site ID",
            },
            inventory_number: {
              type: "string",
              description: "Inventory number",
            },
            key_field: {
              type: "string",
              description: "Primary key field (e.g., hostname, serial)",
            },
            notes: {
              type: "string",
              description: "Notes about the asset",
            },
          },
          required: ["assettype_id", "client_id"],
        },
      },
      // Agent/User tools
      {
        name: "halopsa_list_agents",
        description: "List agents/technicians",
        inputSchema: {
          type: "object",
          properties: {
            team_id: {
              type: "number",
              description: "Filter by team ID",
            },
            inactive: {
              type: "boolean",
              description: "Show inactive agents",
            },
            pageSize: {
              type: "number",
              description: "Number of results per page (default: 50)",
              default: 50,
            },
            pageNo: {
              type: "number",
              description: "Page number (default: 1)",
              default: 1,
            },
          },
        },
      },
      {
        name: "halopsa_get_agent",
        description: "Get details for a specific agent",
        inputSchema: {
          type: "object",
          properties: {
            id: {
              type: "number",
              description: "The agent ID",
            },
          },
          required: ["id"],
        },
      },
      // Site tools
      {
        name: "halopsa_list_sites",
        description: "List sites",
        inputSchema: {
          type: "object",
          properties: {
            client_id: {
              type: "number",
              description: "Filter by client ID",
            },
            inactive: {
              type: "boolean",
              description: "Show inactive sites",
            },
            pageSize: {
              type: "number",
              description: "Number of results per page (default: 50)",
              default: 50,
            },
            pageNo: {
              type: "number",
              description: "Page number (default: 1)",
              default: 1,
            },
          },
        },
      },
      {
        name: "halopsa_get_site",
        description: "Get details for a specific site",
        inputSchema: {
          type: "object",
          properties: {
            id: {
              type: "number",
              description: "The site ID",
            },
          },
          required: ["id"],
        },
      },
      // Reference data tools
      {
        name: "halopsa_list_ticket_types",
        description: "List available ticket types",
        inputSchema: {
          type: "object",
          properties: {
            pageSize: {
              type: "number",
              description: "Number of results per page (default: 50)",
              default: 50,
            },
          },
        },
      },
      {
        name: "halopsa_list_statuses",
        description: "List available ticket statuses",
        inputSchema: {
          type: "object",
          properties: {
            pageSize: {
              type: "number",
              description: "Number of results per page (default: 50)",
              default: 50,
            },
          },
        },
      },
      {
        name: "halopsa_list_priorities",
        description: "List available priorities",
        inputSchema: {
          type: "object",
          properties: {
            pageSize: {
              type: "number",
              description: "Number of results per page (default: 50)",
              default: 50,
            },
          },
        },
      },
      {
        name: "halopsa_list_teams",
        description: "List teams",
        inputSchema: {
          type: "object",
          properties: {
            pageSize: {
              type: "number",
              description: "Number of results per page (default: 50)",
              default: 50,
            },
          },
        },
      },
      {
        name: "halopsa_list_asset_types",
        description: "List available asset types",
        inputSchema: {
          type: "object",
          properties: {
            pageSize: {
              type: "number",
              description: "Number of results per page (default: 50)",
              default: 50,
            },
          },
        },
      },
      // Search tool
      {
        name: "halopsa_search",
        description: "Search across HaloPSA entities",
        inputSchema: {
          type: "object",
          properties: {
            entity: {
              type: "string",
              enum: ["tickets", "clients", "assets", "agents", "sites"],
              description: "Entity type to search",
            },
            search: {
              type: "string",
              description: "Search query",
            },
            pageSize: {
              type: "number",
              description: "Number of results per page (default: 50)",
              default: 50,
            },
          },
          required: ["entity", "search"],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const creds = getCredentials();

  if (!creds) {
    return {
      content: [
        {
          type: "text",
          text: "Error: No OAuth credentials provided. Please configure your HaloPSA client ID, client secret, and tenant.",
        },
      ],
      isError: true,
    };
  }

  const client = createClient(creds);

  try {
    switch (name) {
      // Ticket operations
      case "halopsa_list_tickets": {
        const params = args as {
          client_id?: number;
          site_id?: number;
          agent_id?: number;
          status_id?: number;
          priority_id?: number;
          tickettype_id?: number;
          open_only?: boolean;
          closed_only?: boolean;
          pageSize?: number;
          pageNo?: number;
        };
        const result = await client.tickets.list(params);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }

      case "halopsa_get_ticket": {
        const { id } = args as { id: number };
        const ticket = await client.tickets.get(id);
        return {
          content: [{ type: "text", text: JSON.stringify(ticket, null, 2) }],
        };
      }

      case "halopsa_create_ticket": {
        const params = args as {
          summary: string;
          details?: string;
          client_id: number;
          tickettype_id: number;
          site_id?: number;
          user_id?: number;
          agent_id?: number;
          team_id?: number;
          status_id?: number;
          priority_id?: number;
          category_1?: string;
        };
        const ticket = await client.tickets.create(params);
        return {
          content: [{ type: "text", text: JSON.stringify(ticket, null, 2) }],
        };
      }

      case "halopsa_update_ticket": {
        const { id, ...updateData } = args as {
          id: number;
          summary?: string;
          details?: string;
          agent_id?: number;
          team_id?: number;
          status_id?: number;
          priority_id?: number;
          category_1?: string;
        };
        const ticket = await client.tickets.update(id, updateData);
        return {
          content: [{ type: "text", text: JSON.stringify(ticket, null, 2) }],
        };
      }

      case "halopsa_add_ticket_action": {
        const { ticket_id, ...actionData } = args as {
          ticket_id: number;
          note: string;
          outcome?: string;
          timetaken?: number;
          hiddenfromuser?: boolean;
        };
        const action = await client.tickets.addAction(ticket_id, actionData);
        return {
          content: [{ type: "text", text: JSON.stringify(action, null, 2) }],
        };
      }

      // Client operations
      case "halopsa_list_clients": {
        const params = args as {
          inactive?: boolean;
          toplevel_id?: number;
          pageSize?: number;
          pageNo?: number;
        };
        const result = await client.clients.list(params);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }

      case "halopsa_get_client": {
        const { id } = args as { id: number };
        const clientData = await client.clients.get(id);
        return {
          content: [{ type: "text", text: JSON.stringify(clientData, null, 2) }],
        };
      }

      case "halopsa_create_client": {
        const params = args as {
          name: string;
          website?: string;
          phonenumber?: string;
          email?: string;
          notes?: string;
        };
        const clientData = await client.clients.create(params);
        return {
          content: [{ type: "text", text: JSON.stringify(clientData, null, 2) }],
        };
      }

      // Asset operations
      case "halopsa_list_assets": {
        const params = args as {
          client_id?: number;
          site_id?: number;
          assettype_id?: number;
          inactive?: boolean;
          pageSize?: number;
          pageNo?: number;
        };
        const result = await client.assets.list(params);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }

      case "halopsa_get_asset": {
        const { id } = args as { id: number };
        const asset = await client.assets.get(id);
        return {
          content: [{ type: "text", text: JSON.stringify(asset, null, 2) }],
        };
      }

      case "halopsa_create_asset": {
        const params = args as {
          assettype_id: number;
          client_id: number;
          site_id?: number;
          inventory_number?: string;
          key_field?: string;
          notes?: string;
        };
        const asset = await client.assets.create(params);
        return {
          content: [{ type: "text", text: JSON.stringify(asset, null, 2) }],
        };
      }

      // Agent operations
      case "halopsa_list_agents": {
        const params = args as {
          team_id?: number;
          inactive?: boolean;
          pageSize?: number;
          pageNo?: number;
        };
        const result = await client.agents.list(params);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }

      case "halopsa_get_agent": {
        const { id } = args as { id: number };
        const agent = await client.agents.get(id);
        return {
          content: [{ type: "text", text: JSON.stringify(agent, null, 2) }],
        };
      }

      // Site operations
      case "halopsa_list_sites": {
        const params = args as {
          client_id?: number;
          inactive?: boolean;
          pageSize?: number;
          pageNo?: number;
        };
        const result = await client.sites.list(params);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }

      case "halopsa_get_site": {
        const { id } = args as { id: number };
        const site = await client.sites.get(id);
        return {
          content: [{ type: "text", text: JSON.stringify(site, null, 2) }],
        };
      }

      // Reference data operations
      case "halopsa_list_ticket_types": {
        const params = args as { pageSize?: number };
        const result = await client.ticketTypes.list(params);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }

      case "halopsa_list_statuses": {
        const params = args as { pageSize?: number };
        const result = await client.statuses.list(params);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }

      case "halopsa_list_priorities": {
        const params = args as { pageSize?: number };
        const result = await client.priorities.list(params);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }

      case "halopsa_list_teams": {
        const params = args as { pageSize?: number };
        const result = await client.teams.list(params);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }

      case "halopsa_list_asset_types": {
        const params = args as { pageSize?: number };
        const result = await client.assetTypes.list(params);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }

      // Search operation
      case "halopsa_search": {
        const { entity, search, pageSize } = args as {
          entity: "tickets" | "clients" | "assets" | "agents" | "sites";
          search: string;
          pageSize?: number;
        };

        let result;
        const searchParams = { search, pageSize: pageSize || 50 };

        switch (entity) {
          case "tickets":
            result = await client.tickets.list(searchParams);
            break;
          case "clients":
            result = await client.clients.list(searchParams);
            break;
          case "assets":
            result = await client.assets.list(searchParams);
            break;
          case "agents":
            result = await client.agents.list(searchParams);
            break;
          case "sites":
            result = await client.sites.list(searchParams);
            break;
          default:
            return {
              content: [{ type: "text", text: `Unknown entity type: ${entity}` }],
              isError: true,
            };
        }

        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }

      default:
        return {
          content: [{ type: "text", text: `Unknown tool: ${name}` }],
          isError: true,
        };
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    // Provide more helpful error messages for common OAuth errors
    if (message.includes("401") || message.includes("Unauthorized")) {
      return {
        content: [
          {
            type: "text",
            text: `Authentication error: ${message}\n\nPlease verify your HaloPSA OAuth credentials (client ID and secret) are correct.`,
          },
        ],
        isError: true,
      };
    }

    if (message.includes("403") || message.includes("Forbidden")) {
      return {
        content: [
          {
            type: "text",
            text: `Authorization error: ${message}\n\nYour OAuth application may not have the required permissions/scopes for this operation.`,
          },
        ],
        isError: true,
      };
    }

    if (message.includes("429") || message.includes("Rate limit")) {
      return {
        content: [
          {
            type: "text",
            text: `Rate limit exceeded: ${message}\n\nHaloPSA allows 500 requests per 3 minutes. Please wait and try again.`,
          },
        ],
        isError: true,
      };
    }

    return {
      content: [{ type: "text", text: `Error: ${message}` }],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("HaloPSA MCP server running on stdio");
}

main().catch(console.error);
