import fs from "fs";
import path from "path";
import os from "os";
import { loadSession } from "../utils/session.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get the path to the MCP server script
function getMcpServerPath() {
  return path.resolve(__dirname, "../mcp/server.js");
}

// Client configuration templates
const CLIENT_CONFIGS = {
  claude: {
    name: "Claude Desktop",
    configPath: () => {
      if (process.platform === "darwin") {
        return path.join(os.homedir(), "Library", "Application Support", "Claude", "claude_desktop_config.json");
      } else if (process.platform === "win32") {
        return path.join(process.env.APPDATA, "Claude", "claude_desktop_config.json");
      } else {
        return path.join(os.homedir(), ".config", "claude", "claude_desktop_config.json");
      }
    },
    generateConfig: (serverPath, cwd) => ({
      mcpServers: {
        composter: {
          command: "node",
          args: [serverPath],
          cwd: cwd,
        },
      },
    }),
  },
  cursor: {
    name: "Cursor",
    configPath: () => {
      return path.join(process.cwd(), ".cursor", "mcp.json");
    },
    generateConfig: (serverPath, cwd) => ({
      composter: {
        command: "node",
        args: [serverPath],
        cwd: cwd,
      },
    }),
  },
  vscode: {
    name: "VS Code (Copilot)",
    configPath: () => {
      return path.join(process.cwd(), ".vscode", "mcp.json");
    },
    generateConfig: (serverPath, cwd) => ({
      servers: {
        composter: {
          command: "node",
          args: [serverPath],
          cwd: cwd,
        },
      },
    }),
  },
  windsurf: {
    name: "Windsurf",
    configPath: () => {
      return path.join(os.homedir(), ".codeium", "windsurf", "mcp_config.json");
    },
    generateConfig: (serverPath, cwd) => ({
      mcpServers: {
        composter: {
          command: "node",
          args: [serverPath],
          cwd: cwd,
        },
      },
    }),
  },
};

// Initialize MCP for a specific client
export async function mcpInit(client, options = {}) {
  // Validate client
  const clientConfig = CLIENT_CONFIGS[client?.toLowerCase()];
  if (!clientConfig) {
    console.log(`❌ Unknown client: ${client}`);
    console.log(`\nSupported clients:`);
    Object.entries(CLIENT_CONFIGS).forEach(([key, val]) => {
      console.log(`  - ${key} (${val.name})`);
    });
    return;
  }

  // Check if user is logged in
  const session = loadSession();
  if (!session?.jwt) {
    console.log("❌ You must be logged in first. Run: composter login");
    return;
  }

  const serverPath = getMcpServerPath();
  const cwd = options.global ? path.dirname(serverPath) : process.cwd();
  const configPath = clientConfig.configPath();
  const configDir = path.dirname(configPath);

  console.log(`\n🔧 Setting up Composter MCP for ${clientConfig.name}...\n`);

  // Generate the config snippet
  const newConfig = clientConfig.generateConfig(serverPath, cwd);

  // Check if config file exists
  let existingConfig = {};
  if (fs.existsSync(configPath)) {
    try {
      existingConfig = JSON.parse(fs.readFileSync(configPath, "utf-8"));
      console.log(`📄 Found existing config at: ${configPath}`);
    } catch {
      console.log(`⚠️  Existing config is invalid, will create new one.`);
    }
  }

  // Merge configs
  let mergedConfig;
  if (client === "claude" || client === "windsurf") {
    mergedConfig = {
      ...existingConfig,
      mcpServers: {
        ...existingConfig.mcpServers,
        ...newConfig.mcpServers,
      },
    };
  } else if (client === "vscode") {
    mergedConfig = {
      ...existingConfig,
      servers: {
        ...existingConfig.servers,
        ...newConfig.servers,
      },
    };
  } else {
    // Cursor - direct merge
    mergedConfig = {
      ...existingConfig,
      ...newConfig,
    };
  }

  // Create directory if needed
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
    console.log(`📁 Created directory: ${configDir}`);
  }

  // Write config
  fs.writeFileSync(configPath, JSON.stringify(mergedConfig, null, 2), "utf-8");
  console.log(`✅ Config written to: ${configPath}`);

  // Print success message
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║                    🎉 MCP Setup Complete!                      ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║  Composter MCP server has been configured for ${clientConfig.name.padEnd(14)}  ║
║                                                                ║
║  Next steps:                                                   ║
║  1. Restart ${clientConfig.name.padEnd(50)} ║
║  2. Look for "Composter" in your MCP tools                     ║
║                                                                ║
║  Available tools:                                              ║
║  • search_components - Search your component vault             ║
║  • list_categories   - List all your categories                ║
║  • list_components   - List components in a category           ║
║  • read_component    - Read full source code                   ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
`);

  // Dev mode hint
  if (options.dev) {
    console.log(`\n💡 Dev mode: Set COMPOSTER_DEV=true to use localhost:3000`);
  }
}

// Serve MCP server directly (for testing)
export async function mcpServe(options = {}) {
  const session = loadSession();
  if (!session?.jwt) {
    console.log("❌ You must be logged in first. Run: composter login");
    return;
  }

  console.log("🚀 Starting Composter MCP server...");
  console.log("   Press Ctrl+C to stop\n");

  // Set dev mode if requested
  if (options.dev) {
    process.env.COMPOSTER_DEV = "true";
    console.log("📡 Dev mode: Using localhost:3000");
  }

  // Dynamic import and run the server
  const serverPath = getMcpServerPath();
  await import(serverPath);
}

// Show MCP configuration info
export function mcpInfo() {
  const serverPath = getMcpServerPath();
  const session = loadSession();

  console.log(`
╔════════════════════════════════════════════════════════════════╗
║                  Composter MCP Information                     ║
╠════════════════════════════════════════════════════════════════╣

  Server path:  ${serverPath}
  Logged in:    ${session?.jwt ? "✅ Yes" : "❌ No (run 'composter login')"}
  
  Manual configuration:
  
  {
    "composter": {
      "command": "node",
      "args": ["${serverPath}"]
    }
  }

  Environment variables:
  • COMPOSTER_DEV=true     - Use localhost:3000 backend
  • COMPOSTER_API_URL=...  - Custom API URL

╚════════════════════════════════════════════════════════════════╝
`);
}

