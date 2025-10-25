import { cookies } from 'next/headers'

const USER_ID_COOKIE = 'bingo_user_id'

/**
 * ユーザーIDを取得
 * middlewareで事前に設定されているはず
 */
export async function getUserId(): Promise<string> {
  const cookieStore = await cookies()
  const userId = cookieStore.get(USER_ID_COOKIE)?.value

  if (!userId) {
    throw new Error('User ID cookie not found. Make sure middleware is running.')
  }

  return userId
}
