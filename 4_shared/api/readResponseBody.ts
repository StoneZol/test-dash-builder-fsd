/**
 * Reads a `Response` body as JSON when possible, otherwise raw text / `null`.
 * Empty bodies become `null`; invalid JSON falls back to the trimmed string.
 */
export const readResponseBody = async (response: Response): Promise<unknown> => {
  if (response.body === null) {
    return null;
  }

  const text = await response.text();
  const trimmed = text.trim();

  if (!trimmed) {
    return null;
  }

  try {
    return JSON.parse(trimmed) as unknown;
  } catch {
    return trimmed;
  }
};
