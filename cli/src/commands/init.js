import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function initVscode() {
  const cwd = process.cwd();
  const vscodeDir = path.join(cwd, ".vscode");
  const mcpConfigPath = path.join(vscodeDir, "mcp.json");

  // Find the globally installed composter-cli MCP server
  // When installed globally, the MCP server is in: 
  // /usr/local/lib/node_modules/composter-cli/mcp/src/server.js
  const globalMcpServerPath = path.join(
    path.dirname(path.dirname(path.dirname(__dirname))), 
    "mcp",
    "src", 
    "server.js"
  );

  const mcpConfig = {
    servers: {
      "composter-mcp": {
        type: "stdio",
        command: "node",
        args: [globalMcpServerPath],
      }
    },
    inputs: []
  };

  // Create .vscode directory if it doesn't exist
  if (!fs.existsSync(vscodeDir)) {
    fs.mkdirSync(vscodeDir, { recursive: true });
    console.log("✓ Created .vscode directory");
  }

  // Write mcp.json
  fs.writeFileSync(mcpConfigPath, JSON.stringify(mcpConfig, null, 2));
  console.log("✓ Created .vscode/mcp.json");
  console.log("\n📝 MCP Server configured for this project!");
  console.log("🔄 Reload VS Code window to activate the MCP server");
  console.log("   Press: Ctrl+Shift+P → 'Developer: Reload Window'");
}
