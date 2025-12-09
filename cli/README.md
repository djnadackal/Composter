# 🌱 Composter CLI

> Your personal vault for storing, syncing, and retrieving reusable React components from the command line.

[![npm version](https://img.shields.io/npm/v/composter-cli.svg)](https://www.npmjs.com/package/composter-cli)
[![license](https://img.shields.io/npm/l/composter-cli.svg)](https://github.com/binit2-1/Composter/blob/main/LICENSE)

**Composter** is like your personal shadcn/ui — but for YOUR components. Push components from any project, pull them into new ones, and let AI assistants access your vault via MCP.

## ✨ Features

- **📤 Push** — Upload components with all their local dependencies auto-bundled
- **📥 Pull** — Download components into any project with dependency detection
- **📁 Categories** — Organize components into logical groups
- **🔗 Smart Bundling** — Automatically crawls and bundles relative imports
- **📦 Dependency Tracking** — Detects npm packages and alerts you to missing ones
- **🤖 MCP Ready** — Works with Claude, Cursor, and other AI assistants

## 📦 Installation

npm install -g composter-cli## 🚀 Quick Start

# 1. Create an account at https://composter.vercel.app

# 2. Login to your vault
composter login

# 3. Create a category
composter mkcat buttons

# 4. Push a component
composter push buttons "Animated Button" ./src/components/Button.tsx

# 5. Pull it in another project
composter pull buttons "Animated Button" ./src/components/## 📖 Commands

| Command | Description |
|---------|-------------|
| `composter login` | Authenticate with your account |
| `composter mkcat <name>` | Create a new category |
| `composter ls` | List all categories |
| `composter push <category> <title> <file>` | Push a component |
| `composter pull <category> <title> <dir>` | Pull a component |

## 🔧 Smart Bundling

When you push, the CLI automatically bundles all local imports:
