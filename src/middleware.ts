import { NextRequest, NextResponse } from 'next/server'

const PROTECTED_PREFIXES = [
  '/dashboard',
  '/products',
  '/movements',
  '/suppliers',
  '/reports',
  '/settings',
]

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))

  if (isProtected) {
    const hasSession = req.cookies
      .getAll()
      .some((c) => c.name.startsWith('sb-') && c.name.endsWith('-auth-token'))

    if (!hasSession) {
      const loginUrl = new URL('/auth/login', req.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/products/:path*', '/movements/:path*', '/suppliers/:path*', '/reports/:path*', '/settings/:path*'],
}
