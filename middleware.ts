import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

const USER_ID_COOKIE = 'bingo_user_id'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // ユーザーIDのcookieがあるかチェック
  const existingUserId = request.cookies.get(USER_ID_COOKIE)

  // 無ければ新しいUUIDを生成して設定
  if (!existingUserId) {
    const userId = uuidv4()
    response.cookies.set(USER_ID_COOKIE, userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365, // 1年
    })
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
