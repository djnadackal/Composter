#!/usr/bin/env node

import { Command } from "commander";
import { login } from "./commands/login.js";
import { mkcat } from "./commands/mkcat.js";
import { listCategories } from "./commands/listCat.js";
import { pushComponent } from "./commands/push.js";
import { pullComponent } from "./commands/pull.js";
import { mcpInit, mcpServe, mcpInfo } from "./commands/mcp.js";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const packageJson = require("../package.json");

const program = new Command();

program
  .name("composter")
  .description("CLI for Composter Platform")
  .version(packageJson.version);

program
  .command("login")
  .description("Log into your Composter account")
  .action(login);

program
  .command("mkcat <category-name>")
  .description("Create a new category")
  .action((categoryName) => mkcat(categoryName));

program 
  .command("ls")
  .description("List categories")
  .action(() => {
    listCategories();
  });

program
  .command("push <category-name> <component-title> <file-path>")
  .description("Push a new component")
  .action((category, title, filepath) => {
    pushComponent(category, title, filepath);
  });

program
  .command("pull <category-name> <component-title> <file-path>")
  .description("Pull a component")
  .action((category, title, filepath) => {
    pullComponent(category, title, filepath);
  });

// MCP Commands
const mcp = program
  .command("mcp")
  .description("Manage MCP (Model Context Protocol) server for AI assistants");

mcp
  .command("init")
  .description("Initialize MCP server for an AI assistant")
  .option("-c, --client <client>", "AI client to configure (claude, cursor, vscode, windsurf)", "claude")
  .option("-g, --global", "Configure globally instead of project-specific")
  .option("-d, --dev", "Use localhost:3000 backend (development mode)")
  .action((options) => {
    mcpInit(options.client, options);
  });

mcp
  .command("serve")
  .description("Start the MCP server directly (for testing)")
  .option("-d, --dev", "Use localhost:3000 backend (development mode)")
  .action((options) => {
    mcpServe(options);
  });

mcp
  .command("info")
  .description("Show MCP configuration information")
  .action(() => {
    mcpInfo();
  });

program.parse(process.argv);
