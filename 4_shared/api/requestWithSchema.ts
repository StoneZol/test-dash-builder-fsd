import { z } from 'zod';

import { ApiHttpError, ApiSchemaError } from './apiErrors';
import { makeRequest } from './makeRequest';
import { parseSchema } from './parseSchema';
import { readResponseBody } from './readResponseBody';

type RequestWithSchemaArgs<T> = {
  url: string;
  schema: z.ZodType<T>;
  options?: RequestInit;
  token?: string;
};

/**
 * Fetch → read body → fail on HTTP error → validate with Zod.
 * Primary entry point for typed API calls from entities / features.
 *
 * @throws {ApiHttpError} when `response.ok` is false
 * @throws {ApiSchemaError} when the body fails schema validation
 */
export const requestWithSchema = async <T>({
  url,
  schema,
  options,
  token,
}: RequestWithSchemaArgs<T>): Promise<T> => {
  const response = await makeRequest(url, { ...options, token });
  const body = await readResponseBody(response);

  if (!response.ok) {
    throw new ApiHttpError(response.status, body);
  }

  const parsed = parseSchema(body, schema);

  if (!parsed.success) {
    throw new ApiSchemaError(parsed.error, body);
  }

  return parsed.data;
};
