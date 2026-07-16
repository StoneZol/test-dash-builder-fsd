type MakeRequestOptions = RequestInit & {
  token?: string;
};

export const makeRequest = async (
  url: string,
  options: MakeRequestOptions = {},
): Promise<Response> => {
  const { token, headers, ...restOptions } = options;

  const requestHeaders = new Headers(headers);

  if (token) {
    requestHeaders.set('Authorization', `Bearer ${token}`);
  }

  if (!requestHeaders.has('Accept')) {
    requestHeaders.set('Accept', 'application/json');
  }

  return fetch(url, {
    ...restOptions,
    headers: requestHeaders,
  });
};
