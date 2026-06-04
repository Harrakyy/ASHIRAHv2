import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
          })
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    },
  )

  const { data: { user } } = await supabase.auth.getUser()
  const pathname = request.nextUrl.pathname

  // Public routes that don't need protection
  const isPublicRoute = 
    pathname === '/' ||
    pathname.startsWith('/apparel') ||
    pathname.startsWith('/community') ||
    pathname.startsWith('/portfolio') ||
    pathname.startsWith('/join-marketer') ||
    pathname.startsWith('/order') ||
    pathname.startsWith('/track') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/auth/') ||
    pathname === '/login' ||
    pathname === '/signup'

  // Protect /admin/* — redirect ke login jika belum login
  if (pathname.startsWith('/admin')) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
  }

  // Jika sudah login dan akses /login atau /signup, redirect ke /admin
  if (pathname === '/login' || pathname === '/signup') {
    if (user) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin'
      return NextResponse.redirect(url)
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
