const BASE_URL = "https://subpay.onrender.com";

// ─── Token Storage ────────────────────────────────────────────────────────────

const INVALID_TOKEN_VALUES = new Set(["", "null", "undefined"]);

export const tokenStorage = {
  getAccess: (): string | null => {
    if (typeof window === "undefined") return null;
    const t = localStorage.getItem("access_token");
    return t && !INVALID_TOKEN_VALUES.has(t) ? t : null;
  },
  getRefresh: (): string | null => {
    if (typeof window === "undefined") return null;
    const t = localStorage.getItem("refresh_token");
    return t && !INVALID_TOKEN_VALUES.has(t) ? t : null;
  },
  set: (access: string, refresh?: string | null) => {
    localStorage.setItem("access_token", access);
    if (refresh && !INVALID_TOKEN_VALUES.has(refresh)) {
      localStorage.setItem("refresh_token", refresh);
    }
    document.cookie = `hubora_session=${access}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
  },
  clear: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("hubora_me");
    document.cookie = "hubora_session=; path=/; max-age=0; SameSite=Lax";
  },
};

// ─── Error Type ───────────────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(
    public status: number,
    public detail: string,
    public raw?: unknown,
  ) {
    super(detail);
    this.name = "ApiError";
  }
}

// ─── Token Refresh ────────────────────────────────────────────────────────────

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

async function tryRefreshToken(): Promise<string | null> {
  const refresh = tokenStorage.getRefresh();
  if (!refresh) return null;

  if (isRefreshing) return refreshPromise;

  isRefreshing = true;
  refreshPromise = (async () => {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const res = await fetch(`${BASE_URL}/api/v1/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh_token: refresh }),
        });
        if (res.ok) {
          const data = await res.json();
          tokenStorage.set(data.access_token, data.refresh_token ?? refresh);
          return data.access_token as string;
        }
        // 4xx means the token is genuinely invalid — no point retrying
        if (res.status < 500) return null;
      } catch {
        // network error — fall through to retry
      }
      if (attempt === 0) await new Promise(r => setTimeout(r, 1500));
    }
    return null;
  })().finally(() => {
    isRefreshing = false;
    refreshPromise = null;
  });

  return refreshPromise;
}

function redirectToAuth() {
  tokenStorage.clear();
  if (typeof window !== "undefined") {
    window.location.href = `/auth?next=${encodeURIComponent(window.location.pathname)}`;
  }
}

// ─── Core Fetch ───────────────────────────────────────────────────────────────

type FetchOptions = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  auth?: boolean;
  isFormData?: boolean;
  _isRetry?: boolean; // internal — prevent infinite refresh loop
};

async function apiFetch<T>(
  path: string,
  options: FetchOptions = {},
): Promise<T> {
  const {
    method = "GET",
    body,
    headers = {},
    auth = true,
    isFormData = false,
    _isRetry = false,
  } = options;

  const reqHeaders: Record<string, string> = { ...headers };

  if (!isFormData) reqHeaders["Content-Type"] = "application/json";

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

  // 401 — try refresh once, then redirect
  if (res.status === 401 && auth && !_isRetry) {
    const newToken = await tryRefreshToken();
    if (newToken) {
      return apiFetch<T>(path, { ...options, _isRetry: true });
    }
    redirectToAuth();
    return undefined as T;
  }

  if (res.status === 401 && _isRetry) {
    redirectToAuth();
    return undefined as T;
  }

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
    apiFetch<T>(path, { method: "POST", body, auth, isFormData: true }),
};
