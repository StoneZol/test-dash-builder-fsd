type MakeRequestOptions = RequestInit & {
  /** Optional Bearer token (`Authorization` header). */
  token?: string;
};

/**
 * Thin `fetch` wrapper for shared HTTP concerns (Accept, optional auth).
 * Does not parse the body or throw on non-2xx — use {@link requestWithSchema} for that.
 */
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
