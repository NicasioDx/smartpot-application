import { type NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get("session_token")?.value

  // Public paths that don't require authentication
  const publicPaths = ["/", "/register"]

  const isPublicPath = publicPaths.includes(request.nextUrl.pathname)

  // Redirect to login if accessing protected route without session
  if (!sessionToken && !isPublicPath) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Redirect to dashboard if accessing login/register with session
  if (sessionToken && isPublicPath) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
