#!/usr/bin/env node
/**
 * Datto RMM MCP Server
 *
 * This MCP server provides tools for interacting with Datto RMM API.
 * It accepts credentials via environment variables from the MCP Gateway.
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { DattoRmmClient } from "@asachs01/node-datto-rmm";

const server = new Server(
  {
    name: "datto-rmm-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Credential extraction from gateway headers/env
interface DattoCredentials {
  apiKey: string;
  apiSecret: string;
  platform: string;
}

function getCredentials(): DattoCredentials | null {
  const apiKey = process.env.DATTO_API_KEY || process.env.X_API_KEY;
  const apiSecret = process.env.DATTO_API_SECRET || process.env.X_API_SECRET;
  const platform = process.env.DATTO_PLATFORM || "concord-api";

  if (!apiKey || !apiSecret) {
    return null;
  }

  return { apiKey, apiSecret, platform };
}

function createClient(creds: DattoCredentials): DattoRmmClient {
  return new DattoRmmClient({
    apiKey: creds.apiKey,
    apiSecretKey: creds.apiSecret,
    apiUrl: `https://${creds.platform}.centrastage.net`,
  });
}

// Define available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "datto_list_devices",
        description: "List all devices in Datto RMM with optional filters",
        inputSchema: {
          type: "object",
          properties: {
            siteUid: {
              type: "string",
              description: "Filter by site UID",
            },
            filterType: {
              type: "string",
              description: "Filter type (e.g., 'Desktop', 'Laptop', 'Server')",
            },
            max: {
              type: "number",
              description: "Maximum number of results",
              default: 50,
            },
          },
        },
      },
      {
        name: "datto_get_device",
        description: "Get details for a specific device",
        inputSchema: {
          type: "object",
          properties: {
            deviceUid: {
              type: "string",
              description: "The device UID",
            },
          },
          required: ["deviceUid"],
        },
      },
      {
        name: "datto_list_alerts",
        description: "List open alerts",
        inputSchema: {
          type: "object",
          properties: {
            siteUid: {
              type: "string",
              description: "Filter by site UID",
            },
            max: {
              type: "number",
              description: "Maximum number of results",
              default: 50,
            },
          },
        },
      },
      {
        name: "datto_resolve_alert",
        description: "Resolve an alert",
        inputSchema: {
          type: "object",
          properties: {
            alertUid: {
              type: "string",
              description: "The alert UID to resolve",
            },
          },
          required: ["alertUid"],
        },
      },
      {
        name: "datto_list_sites",
        description: "List all sites",
        inputSchema: {
          type: "object",
          properties: {
            max: {
              type: "number",
              description: "Maximum number of results",
              default: 50,
            },
          },
        },
      },
      {
        name: "datto_get_site",
        description: "Get details for a specific site",
        inputSchema: {
          type: "object",
          properties: {
            siteUid: {
              type: "string",
              description: "The site UID",
            },
          },
          required: ["siteUid"],
        },
      },
      {
        name: "datto_run_quickjob",
        description: "Run a quick job on a device",
        inputSchema: {
          type: "object",
          properties: {
            deviceUid: {
              type: "string",
              description: "The device UID",
            },
            jobName: {
              type: "string",
              description: "Name of the quick job component",
            },
            variables: {
              type: "object",
              description: "Variables to pass to the job",
            },
          },
          required: ["deviceUid", "jobName"],
        },
      },
      {
        name: "datto_get_device_audit",
        description: "Get audit data for a device",
        inputSchema: {
          type: "object",
          properties: {
            deviceUid: {
              type: "string",
              description: "The device UID",
            },
            auditType: {
              type: "string",
              enum: ["software", "hardware", "os", "network", "disk"],
              description: "Type of audit data to retrieve",
            },
          },
          required: ["deviceUid", "auditType"],
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
          text: "Error: No API credentials provided. Please configure your Datto RMM API key and secret.",
        },
      ],
      isError: true,
    };
  }

  const client = createClient(creds);

  try {
    switch (name) {
      case "datto_list_devices": {
        const params = args as { siteUid?: string; filterType?: string; max?: number };
        const devices = await client.getDevices({
          siteUid: params.siteUid,
          filterType: params.filterType,
          max: params.max || 50,
        });
        return {
          content: [{ type: "text", text: JSON.stringify(devices, null, 2) }],
        };
      }

      case "datto_get_device": {
        const { deviceUid } = args as { deviceUid: string };
        const device = await client.getDevice(deviceUid);
        return {
          content: [{ type: "text", text: JSON.stringify(device, null, 2) }],
        };
      }

      case "datto_list_alerts": {
        const params = args as { siteUid?: string; max?: number };
        const alerts = await client.getAlerts({
          siteUid: params.siteUid,
          max: params.max || 50,
        });
        return {
          content: [{ type: "text", text: JSON.stringify(alerts, null, 2) }],
        };
      }

      case "datto_resolve_alert": {
        const { alertUid } = args as { alertUid: string };
        const result = await client.resolveAlert(alertUid);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }

      case "datto_list_sites": {
        const params = args as { max?: number };
        const sites = await client.getSites({ max: params.max || 50 });
        return {
          content: [{ type: "text", text: JSON.stringify(sites, null, 2) }],
        };
      }

      case "datto_get_site": {
        const { siteUid } = args as { siteUid: string };
        const site = await client.getSite(siteUid);
        return {
          content: [{ type: "text", text: JSON.stringify(site, null, 2) }],
        };
      }

      case "datto_run_quickjob": {
        const { deviceUid, jobName, variables } = args as {
          deviceUid: string;
          jobName: string;
          variables?: Record<string, unknown>;
        };
        const result = await client.runQuickJob(deviceUid, jobName, variables);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }

      case "datto_get_device_audit": {
        const { deviceUid, auditType } = args as { deviceUid: string; auditType: string };
        const audit = await client.getDeviceAudit(deviceUid, auditType);
        return {
          content: [{ type: "text", text: JSON.stringify(audit, null, 2) }],
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
  console.error("Datto RMM MCP server running on stdio");
}

main().catch(console.error);
