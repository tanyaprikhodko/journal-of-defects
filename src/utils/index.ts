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