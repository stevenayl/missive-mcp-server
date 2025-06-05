import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool
} from '@modelcontextprotocol/sdk/types.js';
import { MissiveClient, MissiveDraft } from './missive-client.js';

const API_TOKEN = process.env.MISSIVE_API_TOKEN;

if (!API_TOKEN) {
  console.error('Error: MISSIVE_API_TOKEN environment variable is required');
  process.exit(1);
}

const missiveClient = new MissiveClient(API_TOKEN);

const server = new Server(
  {
    name: 'missive-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

const tools: Tool[] = [
  {
    name: 'create_draft',
    description: 'Create a new email draft in Missive',
    inputSchema: {
      type: 'object',
      properties: {
        subject: {
          type: 'string',
          description: 'Email subject line'
        },
        body: {
          type: 'string',
          description: 'Email body content (supports HTML)'
        },
        to: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of recipient email addresses'
        },
        cc: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of CC recipient email addresses'
        },
        bcc: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of BCC recipient email addresses'
        },
        from_email: {
          type: 'string',
          description: 'Sender email address (must be authorized in Missive)'
        },
        from_name: {
          type: 'string',
          description: 'Sender name'
        },
        conversation_id: {
          type: 'string',
          description: 'ID of existing conversation to add draft to'
        },
        team_id: {
          type: 'string',
          description: 'Team ID to link the conversation to'
        }
      },
      required: ['body']
    }
  },
  {
    name: 'send_draft',
    description: 'Send an existing draft by its ID',
    inputSchema: {
      type: 'object',
      properties: {
        draft_id: {
          type: 'string',
          description: 'The ID of the draft to send'
        }
      },
      required: ['draft_id']
    }
  },
  {
    name: 'create_and_send',
    description: 'Create and immediately send an email',
    inputSchema: {
      type: 'object',
      properties: {
        subject: {
          type: 'string',
          description: 'Email subject line'
        },
        body: {
          type: 'string',
          description: 'Email body content (supports HTML)'
        },
        to: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of recipient email addresses'
        },
        cc: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of CC recipient email addresses'
        },
        bcc: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of BCC recipient email addresses'
        },
        from_email: {
          type: 'string',
          description: 'Sender email address (must be authorized in Missive)'
        },
        from_name: {
          type: 'string',
          description: 'Sender name'
        },
        conversation_id: {
          type: 'string',
          description: 'ID of existing conversation to add message to'
        },
        team_id: {
          type: 'string',
          description: 'Team ID to link the conversation to'
        }
      },
      required: ['body', 'to']
    }
  }
];

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (!args) {
    throw new Error('No arguments provided');
  }

  try {
    switch (name) {
      case 'create_draft': {
        const draft: MissiveDraft = {
          subject: args.subject as string | undefined,
          body: args.body as string,
          to: args.to as string[] | undefined,
          cc: args.cc as string[] | undefined,
          bcc: args.bcc as string[] | undefined,
          from_email: args.from_email as string | undefined,
          from_name: args.from_name as string | undefined,
          conversation_id: args.conversation_id as string | undefined,
          team_id: args.team_id as string | undefined
        };
        const result = await missiveClient.createDraft(draft);
        return {
          content: [
            {
              type: 'text',
              text: `Draft created successfully with ID: ${result.id}`
            }
          ]
        };
      }

      case 'send_draft': {
        const draftId = args.draft_id as string;
        const result = await missiveClient.sendDraft(draftId);
        return {
          content: [
            {
              type: 'text',
              text: `Draft sent successfully. Message ID: ${result.id}`
            }
          ]
        };
      }

      case 'create_and_send': {
        const draft: MissiveDraft = {
          subject: args.subject as string | undefined,
          body: args.body as string,
          to: args.to as string[] | undefined,
          cc: args.cc as string[] | undefined,
          bcc: args.bcc as string[] | undefined,
          from_email: args.from_email as string | undefined,
          from_name: args.from_name as string | undefined,
          conversation_id: args.conversation_id as string | undefined,
          team_id: args.team_id as string | undefined
        };
        const result = await missiveClient.createAndSendMessage(draft);
        return {
          content: [
            {
              type: 'text',
              text: `Message sent successfully. Message ID: ${result.id}`
            }
          ]
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
        }
      ],
      isError: true
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Missive MCP Server running...');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});