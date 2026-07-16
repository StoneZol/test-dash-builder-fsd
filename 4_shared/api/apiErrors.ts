import type { ZodError } from 'zod';

/** Non-2xx HTTP response from {@link requestWithSchema}. */
export class ApiHttpError extends Error {
  readonly name = 'ApiHttpError';

  constructor(
    readonly status: number,
    readonly body: unknown,
    message = `Request failed with status ${status}`,
  ) {
    super(message);
  }
}

/** Response body failed Zod validation in {@link requestWithSchema}. */
export class ApiSchemaError extends Error {
  readonly name = 'ApiSchemaError';

  constructor(
    readonly zodError: ZodError,
    readonly body: unknown,
    message = 'Response body does not match expected schema',
  ) {
    super(message);
  }
}

export type ApiError = ApiHttpError | ApiSchemaError;

/** Type guard for {@link ApiHttpError}. */
export const isApiHttpError = (error: unknown): error is ApiHttpError =>
  error instanceof ApiHttpError;

/** Type guard for {@link ApiSchemaError}. */
export const isApiSchemaError = (error: unknown): error is ApiSchemaError =>
  error instanceof ApiSchemaError;
