const BASE_URL = "https://subpay.onrender.com";

// ─── Token Storage ────────────────────────────────────────────────────────────

export const tokenStorage = {
  getAccess: (): string | null =>
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null,
  getRefresh: (): string | null =>
    typeof window !== "undefined" ? localStorage.getItem("refresh_token") : null,
  set: (access: string, refresh: string) => {
    localStorage.setItem("access_token", access)
    localStorage.setItem("refresh_token", refresh)
    // Set the session cookie so middleware can detect auth
    document.cookie = "hubora_session=1; path=/; max-age=604800; SameSite=Lax"
  },
  clear: () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    // Clear the session cookie
    document.cookie = "hubora_session=; path=/; max-age=0"
  },
}

// ─── Error Type ───────────────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(
    public status: number,
    public detail: string,
    public raw?: unknown
  ) {
    super(detail);
    this.name = "ApiError";
  }
}

// ─── Core Fetch ───────────────────────────────────────────────────────────────

type FetchOptions = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  auth?: boolean;
  isFormData?: boolean;
};

async function apiFetch<T>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const { method = "GET", body, headers = {}, auth = true, isFormData = false } =
    options;

  const reqHeaders: Record<string, string> = { ...headers };

  if (!isFormData) {
    reqHeaders["Content-Type"] = "application/json";
  }

  if (auth) {
    const token = tokenStorage.getAccess();
    if (token) reqHeaders["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: reqHeaders,
    body: isFormData
      ? (body as FormData)
      : body !== undefined
      ? JSON.stringify(body)
      : undefined,
  });

  // 204 No Content
  if (res.status === 204) return undefined as T;

  let data: unknown;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const detail =
      (data as { detail?: string })?.detail ??
      `HTTP ${res.status}: ${res.statusText}`;
    throw new ApiError(res.status, detail, data);
  }

  return data as T;
}

// ─── HTTP Helpers ─────────────────────────────────────────────────────────────

export const api = {
  get: <T>(path: string, auth = true) =>
    apiFetch<T>(path, { method: "GET", auth }),

  post: <T>(path: string, body?: unknown, auth = true) =>
    apiFetch<T>(path, { method: "POST", body, auth }),

  put: <T>(path: string, body?: unknown, auth = true) =>
    apiFetch<T>(path, { method: "PUT", body, auth }),

  patch: <T>(path: string, body?: unknown, auth = true) =>
    apiFetch<T>(path, { method: "PATCH", body, auth }),

  delete: <T>(path: string, auth = true) =>
    apiFetch<T>(path, { method: "DELETE", auth }),

  postForm: <T>(path: string, body: FormData, auth = true) =>
    apiFetch<T>(path, {
      method: "POST",
      body,
      auth,
      isFormData: true,
    }),
};