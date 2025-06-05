# Missive MCP Server

An MCP (Model Context Protocol) server for integrating with Missive App to create and send email drafts.

## Features

- Create email drafts
- Send existing drafts
- Create and send emails in one operation
- List all drafts
- Get draft details
- Delete drafts

## Installation

```bash
npm install
npm run build
```

## Configuration

Set your Missive API token as an environment variable:

```bash
export MISSIVE_API_TOKEN="your-api-token-here"
```

## Usage with Claude Desktop

Add the following to your Claude Desktop configuration (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "missive": {
      "command": "node",
      "args": ["/path/to/missive-mcp-server/dist/index.js"],
      "env": {
        "MISSIVE_API_TOKEN": "your-api-token-here"
      }
    }
  }
}
```

## Available Tools

### create_draft
Create a new email draft in Missive.

Parameters:
- `subject` (optional): Email subject line
- `body` (required): Email body content (supports HTML)
- `to` (optional): Array of recipient email addresses
- `cc` (optional): Array of CC recipient email addresses
- `bcc` (optional): Array of BCC recipient email addresses
- `from_email` (optional): Sender email address (must be authorized in Missive)
- `from_name` (optional): Sender name
- `conversation_id` (optional): ID of existing conversation to add draft to
- `team_id` (optional): Team ID to link the conversation to

### send_draft
Send an existing draft by its ID.

Parameters:
- `draft_id` (required): The ID of the draft to send

### create_and_send
Create and immediately send an email.

Parameters:
- `subject` (optional): Email subject line
- `body` (required): Email body content (supports HTML)
- `to` (required): Array of recipient email addresses
- `cc` (optional): Array of CC recipient email addresses
- `bcc` (optional): Array of BCC recipient email addresses
- `from_email` (optional): Sender email address (must be authorized in Missive)
- `from_name` (optional): Sender name
- `conversation_id` (optional): ID of existing conversation to add message to
- `team_id` (optional): Team ID to link the conversation to

## Usage with N8N

To use this MCP server with N8N:

1. Clone and set up the server:
```bash
git clone https://github.com/stevenayl/missive-mcp-server.git
cd missive-mcp-server
npm install
npm run build
```

2. Set your Missive API token:
```bash
export MISSIVE_API_TOKEN="your-missive-api-token-here"
```

3. Run the HTTP server:
```bash
npm run http
# Or for production: npm run http:prod
```

4. In N8N MCP Client node:
   - **SSE Endpoint**: `http://localhost:3000/sse`
   - **Authentication**: Bearer Auth
   - **Credential for Bearer Auth**: Leave empty (the API token is handled server-side)
   - **Tools to Include**: All

5. The AI Agent can now use the Missive tools without needing the API token directly.

## Development

```bash
# Run in development mode
npm run dev

# Run HTTP server in development
npm run http

# Build for production
npm run build

# Start production server
npm start

# Start HTTP production server
npm run http:prod
```

## License

MIT