import { NextRequest, NextResponse } from "next/server"

/**
 * Route protection middleware.
 *
 * Auth flow:
 *   /              → redirect to /feed
 *   /feed (no session) → redirect to /auth
 *   /auth (has session) → redirect to /feed   (already logged in)
 *   all other protected routes (no session) → redirect to /auth
 *
 * "Session" is currently a simple cookie — swap `SESSION_COOKIE` for your
 * real auth token (JWT, NextAuth session, etc.) when the backend is ready.
 */

const SESSION_COOKIE = "hubora_session"

// Routes that are always public (no auth needed)
const PUBLIC_PATHS = ["/auth", "/auth/callback"]

// Routes that live inside the authenticated shell
const PROTECTED_PREFIX = ["/feed", "/explore", "/communities", "/saved", "/notifications", "/dashboard", "/hub", "/content", "/plans", "/subscribers", "/earnings"]

function isProtected(pathname: string) {
  return PROTECTED_PREFIX.some((prefix) => pathname.startsWith(prefix))
}

function isPublic(pathname: string) {
  return PUBLIC_PATHS.some((p) => pathname.startsWith(p))
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const session = request.cookies.get(SESSION_COOKIE)?.value

  // ── /auth: already logged in → go straight to feed ──
  if (isPublic(pathname)) {
    if (session) {
      return NextResponse.redirect(new URL("/feed", request.url))
    }
    return NextResponse.next()
  }

  // ── Protected routes: no session → send to auth ──
  if (isProtected(pathname)) {
    if (!session) {
      const loginUrl = new URL("/auth", request.url)
      // Preserve the originally requested path so we can redirect back after login
      loginUrl.searchParams.set("next", pathname)
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  /*
   * Match all paths except:
   *   - Next.js internals (_next/static, _next/image)
   *   - Public assets (favicon, images, etc.)
   *   - API routes (handle auth separately there)
   */
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}