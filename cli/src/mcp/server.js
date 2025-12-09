#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { loadSession } from "../utils/session.js";
import fetch from "node-fetch";

// Redirect console.log to stderr (MCP uses stdout for protocol)
const originalLog = console.log;
console.log = (...args) => console.error(...args);

// Determine base URL - supports both dev and production
function getBaseUrl() {
  // Check for explicit env var first
  if (process.env.COMPOSTER_API_URL) {
    return process.env.COMPOSTER_API_URL;
  }
  // Check for dev mode
  if (process.env.COMPOSTER_DEV === "true" || process.env.NODE_ENV === "development") {
    return "http://localhost:3000/api";
  }
  // Default to production
  return "https://composter.onrender.com/api";
}

const BASE_URL = getBaseUrl();

// API request helper with JWT auth
async function apiRequest(path, options = {}) {
  const session = loadSession();
  
  if (!session?.jwt) {
    throw new Error("Not authenticated. Run 'composter login' first.");
  }

  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${session.jwt}`,
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    throw new Error("Session expired. Run 'composter login' again.");
  }

  return res;
}

// Create the MCP server with tools
function createComposterMcpServer() {
  const server = new McpServer({
    name: "Composter",
    version: "1.0.0",
  });

  // Tool: Search components
  server.tool(
    "search_components",
    "Search for React components in your Composter vault by title or category name. Returns matching components with IDs and categories.",
    {
      query: z.string().describe("Search term for component title or category name"),
    },
    async ({ query }) => {
      try {
        const res = await apiRequest(`/components/search?q=${encodeURIComponent(query)}`, { method: "GET" });
        
        if (!res.ok) {
          const error = await res.json().catch(() => ({}));
          return {
            content: [{ type: "text", text: `Error searching: ${error.message || res.statusText}` }],
          };
        }

        const data = await res.json();
        const components = data.components || [];

        if (components.length === 0) {
          return {
            content: [{ type: "text", text: "No components found matching that query." }],
          };
        }

        const formatted = components.map((c) =>
          `- **${c.title}** (Category: ${c.category?.name || "unknown"}) [ID: ${c.id}]`
        ).join("\n");

        return {
          content: [{ type: "text", text: `Found ${components.length} component(s):\n\n${formatted}` }],
        };
      } catch (err) {
        return {
          content: [{ type: "text", text: `Error: ${err.message}` }],
        };
      }
    }
  );

  // Tool: List categories
  server.tool(
    "list_categories",
    "List all categories in your Composter vault.",
    {},
    async () => {
      try {
        const res = await apiRequest("/categories");
        
        if (!res.ok) {
          const error = await res.json().catch(() => ({}));
          return {
            content: [{ type: "text", text: `Error: ${error.message || res.statusText}` }],
          };
        }

        const data = await res.json();
        const categories = data.categories || [];

        if (categories.length === 0) {
          return {
            content: [{ type: "text", text: "No categories found. Create one with 'composter mkcat <name>'." }],
          };
        }

        const formatted = categories.map((c) => `- ${c.name}`).join("\n");

        return {
          content: [{ type: "text", text: `Your categories:\n\n${formatted}` }],
        };
      } catch (err) {
        return {
          content: [{ type: "text", text: `Error: ${err.message}` }],
        };
      }
    }
  );

  // Tool: Read component
  server.tool(
    "read_component",
    "Read the full source code of a React component from your vault. Returns the code, category, dependencies, and creation date.",
    {
      category: z.string().describe("The category name the component belongs to"),
      title: z.string().describe("The title/name of the component to read"),
    },
    async ({ category, title }) => {
      try {
        const res = await apiRequest(
          `/components?category=${encodeURIComponent(category)}&title=${encodeURIComponent(title)}`
        );

        if (res.status === 404) {
          return {
            content: [{ type: "text", text: `Component "${title}" not found in category "${category}".` }],
          };
        }

        if (!res.ok) {
          const error = await res.json().catch(() => ({}));
          return {
            content: [{ type: "text", text: `Error: ${error.message || res.statusText}` }],
          };
        }

        const data = await res.json();
        const component = data.component;

        if (!component) {
          return {
            content: [{ type: "text", text: `Component "${title}" not found.` }],
          };
        }

        // Parse code - could be JSON (multi-file) or string (single file)
        let codeOutput = "";
        try {
          const files = JSON.parse(component.code);
          codeOutput = Object.entries(files)
            .map(([path, content]) => `### ${path}\n\`\`\`tsx\n${content}\n\`\`\``)
            .join("\n\n");
        } catch {
          codeOutput = `\`\`\`tsx\n${component.code}\n\`\`\``;
        }

        // Format dependencies
        let depsOutput = "";
        if (component.dependencies && Object.keys(component.dependencies).length > 0) {
          const deps = Object.entries(component.dependencies)
            .map(([pkg, ver]) => `- ${pkg}: ${ver}`)
            .join("\n");
          depsOutput = `\n\n**Dependencies:**\n${deps}`;
        }

        const output = `# ${component.title}

**Category:** ${category}
**Created:** ${new Date(component.createdAt).toLocaleDateString()}
${depsOutput}

## Source Code

${codeOutput}`;

        return {
          content: [{ type: "text", text: output }],
        };
      } catch (err) {
        return {
          content: [{ type: "text", text: `Error: ${err.message}` }],
        };
      }
    }
  );

  // Tool: List components in category
  server.tool(
    "list_components",
    "List all components in a specific category.",
    {
      category: z.string().describe("The category name to list components from"),
    },
    async ({ category }) => {
      try {
        const res = await apiRequest(`/components/list-by-category?category=${encodeURIComponent(category)}`, { method: "GET" });
        
        if (!res.ok) {
          const error = await res.json().catch(() => ({}));
          return {
            content: [{ type: "text", text: `Error: ${error.message || res.statusText}` }],
          };
        }

        const data = await res.json();
        const components = data.components || [];

        if (components.length === 0) {
          return {
            content: [{ type: "text", text: `No components found in category "${category}".` }],
          };
        }

        const formatted = components.map((c) => 
          `- **${c.title}** (created: ${new Date(c.createdAt).toLocaleDateString()})`
        ).join("\n");

        return {
          content: [{ type: "text", text: `Components in "${category}":\n\n${formatted}` }],
        };
      } catch (err) {
        return {
          content: [{ type: "text", text: `Error: ${err.message}` }],
        };
      }
    }
  );

  return server;
}

// Main entry point
async function main() {
  try {
    // Verify session exists
    const session = loadSession();
    if (!session?.jwt) {
      console.error("❌ No session found. Please run 'composter login' first.");
      process.exit(1);
    }

    console.error(`🚀 Composter MCP Server starting...`);
    console.error(`📡 API: ${BASE_URL}`);

    const server = createComposterMcpServer();
    const transport = new StdioServerTransport();
    await server.connect(transport);

    console.error("✅ Composter MCP server running on stdio");
  } catch (error) {
    console.error("❌ Fatal Error:", error.message);
    process.exit(1);
  }
}

// Run if called directly
main();

