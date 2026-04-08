const API_BASE = import.meta.env.VITE_API_URL ?? "";

export function getApiKey(): string | null {
  return sessionStorage.getItem("api_key");
}

export function setApiKey(key: string) {
  sessionStorage.setItem("api_key", key);
}

export function clearApiKey() {
  sessionStorage.removeItem("api_key");
}

export class AuthError extends Error {
  constructor() {
    super("Unauthorized");
    this.name = "AuthError";
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const apiKey = getApiKey();
  if (!apiKey) throw new AuthError();

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
      ...options.headers,
    },
  });

  if (res.status === 401) {
    clearApiKey();
    throw new AuthError();
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || `API error: ${res.status}`);
  }

  return res.json();
}
