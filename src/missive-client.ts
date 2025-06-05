import axios, { AxiosInstance } from 'axios';

export interface MissiveDraft {
  subject?: string;
  body: string;
  to?: string[];
  cc?: string[];
  bcc?: string[];
  from_email?: string;
  from_name?: string;
  conversation_id?: string;
  team_id?: string;
  attachments?: Array<{
    filename: string;
    base64_data: string;
  }>;
}

export interface MissiveMessage {
  id: string;
  subject: string;
  body: string;
  from: string;
  to: string[];
  created_at: string;
  draft: boolean;
}

export class MissiveClient {
  private api: AxiosInstance;
  private apiToken: string;

  constructor(apiToken: string) {
    this.apiToken = apiToken;
    this.api = axios.create({
      baseURL: 'https://public.missiveapp.com/v1',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      }
    });
  }

  async createDraft(draft: MissiveDraft): Promise<MissiveMessage> {
    try {
      const requestBody: any = {
        drafts: {
          subject: draft.subject || '',
          body: draft.body
        }
      };

      // Add to_fields if provided
      if (draft.to && draft.to.length > 0) {
        requestBody.drafts.to_fields = draft.to.map(email => ({ address: email }));
      }

      // Add cc_fields if provided
      if (draft.cc && draft.cc.length > 0) {
        requestBody.drafts.cc_fields = draft.cc.map(email => ({ address: email }));
      }

      // Add bcc_fields if provided
      if (draft.bcc && draft.bcc.length > 0) {
        requestBody.drafts.bcc_fields = draft.bcc.map(email => ({ address: email }));
      }

      // Add from_field if provided
      if (draft.from_email) {
        requestBody.drafts.from_field = {
          address: draft.from_email,
          name: draft.from_name
        };
      }

      // Add conversation if provided
      if (draft.conversation_id) {
        requestBody.drafts.conversation = draft.conversation_id;
      }

      // Add team if provided
      if (draft.team_id) {
        requestBody.drafts.team = draft.team_id;
      }

      // Add attachments if provided
      if (draft.attachments && draft.attachments.length > 0) {
        requestBody.drafts.attachments = draft.attachments;
      }

      const response = await this.api.post('/drafts', requestBody);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to create draft: ${error.response?.data?.error?.message || error.message}`);
      }
      throw error;
    }
  }

  async sendDraft(draftId: string): Promise<MissiveMessage> {
    try {
      const response = await this.api.post(`/drafts/${draftId}/send`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to send draft: ${error.response?.data?.message || error.message}`);
      }
      throw error;
    }
  }

  async createAndSendMessage(draft: MissiveDraft): Promise<MissiveMessage> {
    try {
      const requestBody: any = {
        drafts: {
          send: true,
          subject: draft.subject || '',
          body: draft.body
        }
      };

      // Add to_fields if provided
      if (draft.to && draft.to.length > 0) {
        requestBody.drafts.to_fields = draft.to.map(email => ({ address: email }));
      }

      // Add cc_fields if provided
      if (draft.cc && draft.cc.length > 0) {
        requestBody.drafts.cc_fields = draft.cc.map(email => ({ address: email }));
      }

      // Add bcc_fields if provided
      if (draft.bcc && draft.bcc.length > 0) {
        requestBody.drafts.bcc_fields = draft.bcc.map(email => ({ address: email }));
      }

      // Add from_field if provided
      if (draft.from_email) {
        requestBody.drafts.from_field = {
          address: draft.from_email,
          name: draft.from_name
        };
      }

      // Add conversation if provided
      if (draft.conversation_id) {
        requestBody.drafts.conversation = draft.conversation_id;
      }

      // Add team if provided
      if (draft.team_id) {
        requestBody.drafts.team = draft.team_id;
      }

      // Add attachments if provided
      if (draft.attachments && draft.attachments.length > 0) {
        requestBody.drafts.attachments = draft.attachments;
      }

      const response = await this.api.post('/drafts', requestBody);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to send message: ${error.response?.data?.error?.message || error.message}`);
      }
      throw error;
    }
  }

}