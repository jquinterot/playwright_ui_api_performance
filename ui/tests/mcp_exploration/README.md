# MCP Exploration

This folder contains tests and examples demonstrating **MCP (Model Context Protocol)** capabilities with Playwright.

## What is MCP?

MCP lets AI agents control Playwright directly. Instead of running predefined tests, an AI can:

- Navigate to any URL
- Take screenshots
- Fill forms
- Click elements
- Extract page content
- Inspect DOM

## How It Works

```
You (AI Agent) → MCP Server (Playwright) → Browser → Website
```

1. Start MCP server: `npx @playwright/mcp --browser chromium`
2. Connect AI agent to MCP server
3. AI agent sends commands like "take screenshot of example.com"

## MCP Commands Examples

Once connected, an AI agent can say:

```
"Take a screenshot of https://www.demoblaze.com"
"Check if the login button exists"
"Fill the username with 'testuser'"
"Click the first product"
"Count all links on the page"
```

## Running MCP Tests

```bash
# Start MCP server (in one terminal)
npx @playwright/mcp --browser chromium

# Run MCP exploration tests
npm run ui:mcp
```

## Test Categories

| File                       | Demonstrates                                    |
| -------------------------- | ----------------------------------------------- |
| `mcp_capabilities.spec.ts` | Basic MCP actions (screenshots, DOM inspection) |

## MCP Configuration

The project includes `mcp.json` for MCP server configuration:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp", "--browser", "chromium"]
    }
  }
}
```

## Use Cases

1. **Exploratory Testing** - AI discovers and tests features
2. **Visual Verification** - AI takes screenshots for review
3. **Data Extraction** - AI pulls structured data from pages
4. **Automated Demo** - AI walks through user flows

## Notes

- MCP server needs to be running for AI agents to connect
- Some commands may require `--allowed-hosts` for security
- Browser runs headless by default unless `--headless=false`
