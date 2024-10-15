async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type RequestMeta = {
  url: string;
  method: string;
  headers: Record<string, string>;
  body: unknown;
};

type ResponseMeta = {
  status: number;
  headers: Record<string, string>;
  body: unknown;
};

export class ApiClientError extends Error {
  client: ApiClient;
  request: RequestMeta;
  response: ResponseMeta;

  constructor(client: ApiClient, request: RequestMeta, response: ResponseMeta) {
    super(`${request.method} ${request.url}: error!`);

    Object.setPrototypeOf(this, new.target.prototype);

    if ('captureStackTrace' in Error) {
      Error.captureStackTrace(this, ApiClientError);
    } else {
      this.stack = new (Error as any)().stack;
    }

    this.client = client;
    this.request = request;
    this.response = response;
  }
}

type Request = {
  path: string;
  body?: unknown;
  queryString?: Record<string, string>;
  options?: RequestInit;
  retryCount?: number;
};

class ApiClient {
  baseUrl: string;
  extraQueryString: Record<string, string>;
  extraHeaders: Record<string, string>;

  constructor(
    baseUrl: string,
    extraQueryString: Record<string, string>,
    extraHeaders: Record<string, string>,
  ) {
    this.baseUrl = baseUrl;
    this.extraQueryString = extraQueryString;
    this.extraHeaders = extraHeaders;
  }

  get<ResponseType = unknown>(
    path: string,
    queryString?: Record<string, string>,
    options?: RequestInit,
  ) {
    return this.request<ResponseType>({
      path,
      queryString,
      options: { ...options, method: 'GET' },
    });
  }

  destroy<ResponseType = unknown>(
    path: string,
    queryString?: Record<string, string>,
    options?: RequestInit,
  ) {
    return this.request<ResponseType>({
      path,
      queryString,
      options: { ...options, method: 'DELETE' },
    });
  }

  post<ResponseType = unknown>(
    path: string,
    body: unknown,
    queryString?: Record<string, string>,
    options?: RequestInit,
  ) {
    return this.request<ResponseType>({
      path,
      queryString,
      body,
      options: { ...options, method: 'POST' },
    });
  }

  patch<ResponseType = unknown>(
    path: string,
    body: unknown,
    queryString?: Record<string, string>,
    options?: RequestInit,
  ) {
    return this.request<ResponseType>({
      path,
      queryString,
      body,
      options: { ...options, method: 'PATCH' },
    });
  }

  put<ResponseType = unknown>(
    path: string,
    body: unknown,
    queryString?: Record<string, string>,
    options?: RequestInit,
  ) {
    return this.request<ResponseType>({
      path,
      queryString,
      body,
      options: { ...options, method: 'PUT' },
    });
  }

  async request<ResponseType = unknown>(request: Request): Promise<ResponseType> {
    const { path, body, options, retryCount = 0, queryString } = request;

    const url = new URL(`${this.baseUrl}${path}`);

    for (const [key, value] of Object.entries({
      ...this.extraQueryString,
      ...queryString,
    })) {
      url.searchParams.set(key, value);
    }

    const reqHeadersObject: Record<string, string> = {
      accept: 'application/json',
      ...(body ? { 'content-type': 'application/json' } : {}),
      ...this.extraHeaders,
    };

    const completeOptions: RequestInit = {
      ...options,
      headers: reqHeadersObject,
      body: body ? JSON.stringify(body) : undefined,
    };

    const res = await fetch(url.toString(), completeOptions);

    if (res.status === 429) {
      const waitTime = res.headers.get('X-RateLimit-Reset')
        ? parseInt(res.headers.get('X-RateLimit-Reset') || '', 10)
        : 10;
      await wait(waitTime * retryCount * 1000);
      return this.request({ ...request, retryCount: retryCount + 1 });
    }

    if (res.status === 204) {
      return null as ResponseType;
    }

    const resHeadersObject: Record<string, string> = {};
    res.headers.forEach((value, key) => {
      resHeadersObject[key] = value;
    });

    const requestMeta: RequestMeta = {
      url: url.toString(),
      method: completeOptions.method!,
      headers: reqHeadersObject,
      body,
    };

    let responseBody: any;

    const responseMeta: ResponseMeta = {
      status: res.status,
      headers: resHeadersObject,
      body: undefined,
    };

    try {
      responseBody = await res.json();
    } catch (_e) {
      throw new ApiClientError(this, requestMeta, responseMeta);
    }

    responseMeta.body = responseBody;

    if (res.status >= 200 && res.status < 300) {
      return responseBody;
    }

    throw new ApiClientError(this, requestMeta, responseMeta);
  }
}

export default ApiClient;
