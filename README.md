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

## Development

```bash
# Run in development mode
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## License

MIT