/**
 * Shared HTTP primitives for entity API modules:
 * typed fetch, Zod validation, and structured errors.
 */
export {
  ApiHttpError,
  ApiSchemaError,
  isApiHttpError,
  isApiSchemaError,
  type ApiError,
} from './apiErrors';
export { makeRequest } from './makeRequest';
export { parseSchema, type ParseSchemaResult } from './parseSchema';
export { readResponseBody } from './readResponseBody';
export { requestWithSchema } from './requestWithSchema';
