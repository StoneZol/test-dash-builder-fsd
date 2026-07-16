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
