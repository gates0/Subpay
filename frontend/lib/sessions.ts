/**
 * lib/session.ts
 *
 * Thin session helpers. Currently uses a plain cookie as a stand-in.
 * When your backend is ready, swap the implementations here:
 *   - setSession  → store a real JWT / server session token
 *   - clearSession → invalidate the token server-side + clear cookie
 *   - getSession  → validate the token with your auth service
 */

export const SESSION_COOKIE = "hubora_session"
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

/**
 * Call this from a Server Action or Route Handler after successful login.
 * Sets a secure, httpOnly cookie that the middleware can read.
 */
export function buildSessionCookie(token: string): string {
  const maxAge = SESSION_MAX_AGE
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : ""
  return `${SESSION_COOKIE}=${token}; Path=/; Max-Age=${maxAge}; HttpOnly; SameSite=Lax${secure}`
}

/**
 * Call this on logout to clear the session cookie.
 */
export function buildClearCookie(): string {
  return `${SESSION_COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`
}

/**
 * Stub: replace with a real token validation call when backend is ready.
 * Returns the user payload if the session is valid, null otherwise.
 */
export async function getSession(
  token: string | undefined
): Promise<{ userId: string; username: string } | null> {
  if (!token) return null
  // TODO: verify JWT / call auth service
  // For now, any non-empty token is treated as valid
  return { userId: "mock-user-id", username: "ArtByLola" }
}