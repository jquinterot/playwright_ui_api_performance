# MCP Exploration

This folder contains tests and examples demonstrating **MCP (Model Context Protocol)** capabilities with Playwright.

## What is MCP?

MCP lets AI agents control Playwright directly via structured accessibility snapshots. Instead of running predefined tests, an AI can:

- Navigate to any URL
- Take screenshots and Aria snapshots
- Fill forms and click elements
- Extract page content and inspect DOM
- Mock network requests and routes
- Manage cookies and storage state

**Current Version:** `@playwright/mcp` 0.0.76

## How It Works

```
AI Agent (Cursor/VS Code/Claude) → MCP Server (Playwright) → Browser → Website
```

1. Start MCP server: `npm run mcp:start` (headless) or `npm run mcp:start:headed` (visible)
2. Connect AI agent to MCP server via `mcp.json`
3. AI agent sends commands like "navigate to demoblaze.com and take a snapshot"

## MCP Server Profiles

The project includes three MCP profiles in `mcp.json`:

| Profile | Command | Use Case |
|---------|---------|----------|
| **default** | `npm run mcp:start` | Headless CI/automation runs |
| **headed** | `npm run mcp:start:headed` | Local debugging and visual verification |
| **debug** | `npm run mcp:start:debug` | Full debugging with network, storage, DevTools |

## Available MCP Scripts

```bash
# Start MCP server (headless)
npm run mcp:start

# Start MCP server (headed browser)
npm run mcp:start:headed

# Start MCP server (debug mode with all capabilities)
npm run mcp:start:debug

# Start MCP as a persistent server (for CI/CD)
npm run mcp:server

# Run MCP exploration tests
npm run ui:mcp
```

## MCP Tools Available

### Core Automation
- `browser_navigate` — Navigate to URL
- `browser_click` — Click elements
- `browser_type` — Type text
- `browser_fill_form` — Fill multiple form fields
- `browser_select_option` — Select dropdown options
- `browser_drag` — Drag and drop
- `browser_drop` — Drop files or data (new in 1.60.0)
- `browser_file_upload` — Upload files
- `browser_press_key` — Press keyboard keys
- `browser_hover` — Hover over elements
- `browser_evaluate` — Evaluate JavaScript
- `browser_run_code_unsafe` — Run arbitrary Playwright code
- `browser_wait_for` — Wait for text or time
- `browser_handle_dialog` — Handle dialogs

### Inspection & Debugging
- `browser_snapshot` — Capture Aria snapshot (better than screenshots)
- `browser_take_screenshot` — Take screenshots
- `browser_console_messages` — Get console messages
- `browser_highlight` — Highlight elements with custom styles
- `browser_hide_highlight` — Remove highlights
- `browser_annotate` — Annotate page in Dashboard

### Network & Storage (opt-in via `--caps=network,storage`)
- `browser_network_requests` — List network requests
- `browser_network_request` — Get request details
- `browser_route` / `browser_unroute` — Mock network requests
- `browser_cookie_list` / `browser_cookie_get` / `browser_cookie_set` — Cookie management
- `browser_localstorage_list` / `browser_localstorage_get` / `browser_localstorage_set` — LocalStorage
- `browser_sessionstorage_list` / `browser_sessionstorage_get` / `browser_sessionstorage_set` — SessionStorage
- `browser_storage_state` / `browser_set_storage_state` — Save/restore storage state

### Tab Management
- `browser_tabs` — List, create, close, or select tabs

### Browser Configuration (opt-in via `--caps=config`)
- `browser_get_config` — Get resolved server configuration

## Professional Integration Patterns

### Pattern 1: AI-Powered Exploratory Testing

**Use Case:** Let AI agents discover and test new features before writing formal tests.

**Workflow:**
1. Start MCP server: `npm run mcp:start:headed`
2. Connect AI agent (Cursor, VS Code Copilot, Claude, etc.) to MCP server
3. AI navigates the application, identifies features, and generates test ideas
4. AI captures Aria snapshots and screenshots for documentation
5. Human reviews AI findings and formalizes them into Playwright tests

**Benefits:**
- Faster feature discovery
- AI can test edge cases humans might miss
- Generates living documentation

### Pattern 2: Self-Healing Test Maintenance

**Use Case:** When UI changes break existing tests, use MCP to diagnose and suggest fixes.

**Workflow:**
1. Run failing test with trace: `npx playwright test --trace on`
2. Open trace in Trace Viewer: `npx playwright show-report`
3. AI agent analyzes trace using MCP's `browser_snapshot` and `browser_run_code_unsafe`
4. AI suggests updated selectors or locators
5. Human approves and applies changes

**Benefits:**
- Reduces test maintenance time
- Leverages AI for DOM analysis
- Keeps tests current with minimal effort

### Pattern 3: Visual Regression & Accessibility Auditing

**Use Case:** Automated visual and accessibility checks powered by AI.

**Workflow:**
1. AI navigates pages via MCP
2. AI captures Aria snapshots (`browser_snapshot` with `boxes: true`)
3. AI compares current snapshots against baselines
4. AI flags accessibility issues (missing labels, incorrect roles)
5. AI generates reports with annotated screenshots

**Benefits:**
- Continuous accessibility monitoring
- AI can interpret ARIA semantics
- Bounding boxes help AI understand layout

### Pattern 4: Network & API Debugging

**Use Case:** Debug API failures and network issues using MCP's network capabilities.

**Workflow:**
1. Start MCP with network caps: `npm run mcp:start:debug`
2. AI agent routes API calls (`browser_route`)
3. AI inspects network requests (`browser_network_requests`)
4. AI mocks responses for edge case testing
5. AI validates response structure against schemas

**Benefits:**
- Real-time API debugging
- Mock generation for edge cases
- Network state manipulation (offline testing)

### Pattern 5: Automated Demo & Documentation Generation

**Use Case:** Generate interactive demos and documentation from tests.

**Workflow:**
1. AI executes user flows via MCP
2. AI takes screenshots at each step (`browser_take_screenshot`)
3. AI captures Aria snapshots for each page state
4. AI generates Markdown documentation with embedded screenshots
5. AI creates interactive walkthroughs

**Benefits:**
- Living documentation that stays current
- Interactive demos for stakeholders
- Reduces manual documentation effort

### Pattern 6: CI/CD Integration with MCP Server

**Use Case:** Run MCP as a persistent service for CI/CD pipelines.

**Workflow:**
1. Start MCP server as a Docker service:
   ```bash
   docker run -d -i --rm --init --pull=always \
     --entrypoint node \
     --name playwright-mcp \
     -p 8931:8931 \
     mcr.microsoft.com/playwright/mcp \
     /app/cli.js --headless --browser chromium --no-sandbox --port 8931 --host 0.0.0.0
   ```
2. CI pipeline connects to `http://localhost:8931/mcp`
3. AI agents or test orchestrators use MCP for smoke tests
4. Results captured in HAR format (Playwright 1.60.0 feature)

**Benefits:**
- Shared browser instance across CI jobs
- Docker support for consistent environments
- HAR files for post-mortem analysis

### Pattern 7: Security & Data Sanitization

**Use Case:** Prevent sensitive data leakage in AI contexts.

**Workflow:**
1. Configure MCP with secrets file:
   ```bash
   npx @playwright/mcp@latest --secrets=/path/to/.env
   ```
2. MCP redacts sensitive values from AI responses
3. AI operates on sanitized data
4. Credentials never exposed in AI context

**Benefits:**
- Prevents credential leakage
- Compliant with security policies
- Safe for production debugging

## Test Categories

| File | Demonstrates |
|------|-------------|
| `mcp_capabilities.spec.ts` | Basic MCP actions (screenshots, DOM inspection) |
| `ai_generated.spec.ts` | AI-discovered tests from MCP exploration |

## MCP Configuration

The project includes `mcp.json` at the root for MCP server configuration:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"],
      "env": {
        "PLAYWRIGHT_MCP_BROWSER": "chromium",
        "PLAYWRIGHT_MCP_HEADLESS": "true"
      }
    }
  }
}
```

## IDE Integration

### Cursor
1. Open Cursor Settings → MCP → Add new MCP Server
2. Command: `npx @playwright/mcp@latest`
3. Or use the deep link: [Install in Cursor](https://cursor.com/en/install-mcp?name=Playwright&config=eyJjb21tYW5kIjoibnB4IEBwbGF5d3JpZ2h0L21jcEBsYXRlc3QifQ==)

### VS Code + GitHub Copilot
1. Install via CLI: `code --add-mcp '{"name":"playwright","command":"npx","args":["@playwright/mcp@latest"]}'`
2. Or use the deep link: [Install in VS Code](https://insiders.vscode.dev/redirect?url=vscode%3Amcp%2Finstall%3F%257B%2522name%2522%253A%2522playwright%2522%252C%2522command%2522%253A%2522npx%2522%252C%2522args%2522%253A%255B%2522%2540playwright%252Fmcp%2540latest%2522%255D%257D)

### Claude Desktop
Follow the [MCP install guide](https://modelcontextprotocol.io/quickstart/user) and use the standard config.

## Security Notes

- MCP is **not** a security boundary
- Use `--allowed-hosts` to restrict which domains MCP can access
- Use `--secrets` to prevent sensitive data from leaking into AI context
- Use `--isolated` for temporary sessions that don't persist data
- See [MCP Security Best Practices](https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices)

## Notes

- MCP server needs to be running for AI agents to connect
- The default browser is Chromium (headless)
- Use `--headless=false` for visual debugging
- Use `--caps=network,storage,devtools` for advanced debugging
- Browser profile is persisted at `~/Library/Caches/ms-playwright/mcp-*` (macOS)
- Use `--isolated` to avoid profile conflicts between concurrent sessions
