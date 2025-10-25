import { cookies } from 'next/headers'
import { v4 as uuidv4 } from 'uuid'

const USER_ID_COOKIE = 'bingo_user_id'

/**
 * ユーザーIDを取得または生成
 */
export async function getUserId(): Promise<string> {
  const cookieStore = await cookies()
  const existingUserId = cookieStore.get(USER_ID_COOKIE)?.value

  if (existingUserId) {
    return existingUserId
  }

  // 新規ユーザーID生成
  const userId = uuidv4()
  cookieStore.set(USER_ID_COOKIE, userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365, // 1年
  })

  return userId
}
