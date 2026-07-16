import { z } from 'zod';

export type ParseSchemaResult<T> =
  | { success: true; data: T }
  | { success: false; error: z.ZodError };

export const parseSchema = <T>(
  value: unknown,
  schema: z.ZodType<T>,
): ParseSchemaResult<T> => {
  const result = schema.safeParse(value);

  if (result.success) {
    return { success: true, data: result.data };
  }

  return { success: false, error: result.error };
};
