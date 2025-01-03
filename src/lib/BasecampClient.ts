import { BASECAMP_ACCESS_TOKEN_PROVIDER_URL } from 'astro:env/server';
import ApiClient, { type Request } from './ApiClient';

export class BasecampClient extends ApiClient {
  private accessToken: string | undefined;

  constructor(accountId: number) {
    // Initialize with base URL and empty extra params - we'll add auth header dynamically
    super(
      `https://3.basecampapi.com/${accountId}`,
      {},
      {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'User-Agent':
          'Partner Program: Request for Review (https://launchpad.37signals.com/integrations/14091)',
      },
    );
  }

  async fetchCards(bucketId: number, listId: number) {
    return this.get(`/buckets/${bucketId}/card_tables/lists/${listId}/cards.json`);
  }

  async createTodoListGroup(bucketId: number, todoListId: number, body: { name: string }) {
    return this.post(`/buckets/${bucketId}/todolists/${todoListId}/groups.json`, body);
  }

  async createTodo(
    bucketId: number,
    todoListId: number,
    body: {
      content: string;
      description?: string;
      assignee_ids?: number[];
      completion_subscriber_ids?: number[];
      notify?: boolean;
      due_on?: string;
      starts_on?: string;
    },
  ) {
    return this.post(`/buckets/${bucketId}/todolists/${todoListId}/todos.json`, body);
  }

  async createCard(
    bucketId: number,
    listId: number,
    params: {
      title: string;
      content?: string;
      due_on?: string;
      notify?: boolean;
    },
  ) {
    return this.post(`/buckets/${bucketId}/card_tables/lists/${listId}/cards.json`, params);
  }

  async updateCard(
    bucketId: number,
    cardId: string,
    params: {
      title?: string;
      content?: string;
      due_on?: string;
      assignee_ids?: number[];
    },
  ) {
    return this.put(`/buckets/${bucketId}/card_tables/cards/${cardId}.json`, params);
  }

  async request<ResponseType = unknown>(request: Request): Promise<ResponseType> {
    // Get and set the authorization header before each request
    const accessToken = await this.getBasecampAccessToken();
    this.extraHeaders = {
      ...this.extraHeaders,
      Authorization: `Bearer ${accessToken}`,
    };

    return super.request(request);
  }

  private async getBasecampAccessToken() {
    if (this.accessToken) {
      return this.accessToken;
    }

    const response = await fetch(BASECAMP_ACCESS_TOKEN_PROVIDER_URL, { method: 'POST' });

    const responseBody = await response.json();
    const { access_token: accessToken } = responseBody;

    if (!accessToken) {
      throw new Error(`Unable to get accessToken: ${JSON.stringify(responseBody)}`);
    }

    this.accessToken = accessToken;
    return this.accessToken;
  }
}
