#!/usr/bin/env node
/**
 * {{VENDOR_NAME}} MCP Server
 *
 * This MCP server provides tools for interacting with {{VENDOR_NAME}} API.
 * It accepts credentials via HTTP headers from the MCP Gateway.
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// Import the vendor client library
// import { {{VendorClient}} } from "@asachs01/node-{{vendor}}";

const server = new Server(
  {
    name: "{{vendor}}-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Credential extraction from gateway headers
interface GatewayCredentials {
  apiKey?: string;
  apiSecret?: string;
}

function getCredentialsFromEnv(): GatewayCredentials {
  // The MCP Gateway injects credentials via environment variables
  // that are set from the X-API-Key and X-API-Secret headers
  return {
    apiKey: process.env.VENDOR_API_KEY || process.env.X_API_KEY,
    apiSecret: process.env.VENDOR_API_SECRET || process.env.X_API_SECRET,
  };
}

// Define available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      // TODO: Add vendor-specific tools
      {
        name: "{{vendor}}_health_check",
        description: "Check connectivity to {{VENDOR_NAME}} API",
        inputSchema: {
          type: "object",
          properties: {},
          required: [],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const credentials = getCredentialsFromEnv();

  if (!credentials.apiKey) {
    return {
      content: [
        {
          type: "text",
          text: "Error: No API credentials provided. Please configure your {{VENDOR_NAME}} API key.",
        },
      ],
      isError: true,
    };
  }

  switch (name) {
    case "{{vendor}}_health_check": {
      // TODO: Implement actual health check using vendor client
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ status: "ok", message: "{{VENDOR_NAME}} API is reachable" }),
          },
        ],
      };
    }

    default:
      return {
        content: [
          {
            type: "text",
            text: `Unknown tool: ${name}`,
          },
        ],
        isError: true,
      };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("{{VENDOR_NAME}} MCP server running on stdio");
}

main().catch(console.error);
