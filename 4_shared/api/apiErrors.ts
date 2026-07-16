import type { ZodError } from 'zod';

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

export const isApiHttpError = (error: unknown): error is ApiHttpError =>
  error instanceof ApiHttpError;

export const isApiSchemaError = (error: unknown): error is ApiSchemaError =>
  error instanceof ApiSchemaError;
