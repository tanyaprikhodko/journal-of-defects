export * from './apiInterceptor';

/**
 * Safely reads an error response body.
 * Tries to parse JSON and extract a meaningful message; falls back to raw text.
 */
export const parseErrorResponse = async (response: Response): Promise<string> => {
  const text = await response.text();
  try {
    const json = JSON.parse(text);
    return Object.values(json?.errors || {}).join(' ') || json?.message || json?.title || text || `HTTP ${response.status}`;
  } catch {
    return text || `HTTP ${response.status}`;
  }
};

export const parseJwt = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    const payload = JSON.parse(jsonPayload);
    const preparedKeys = Object.keys(payload).reduce((acc, key) => {
      const preparedKey = key.substring(key.lastIndexOf('/') + 1);
      acc[preparedKey] = payload[key];
      return acc;
    }, {} as Record<string, any>);
    return preparedKeys;
  } catch {
    return null;
  }
};