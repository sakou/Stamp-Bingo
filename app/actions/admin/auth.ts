'use server'

import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import * as bcrypt from 'bcrypt'
import { ApiResponse } from '@/types/api'

const ADMIN_SESSION_COOKIE = 'admin_session'
const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

/**
 * 管理者ログイン
 */
export async function adminLogin(
  email: string,
  password: string
): Promise<ApiResponse<{ adminId: number; name: string }>> {
  try {
    // 管理者ユーザー取得
    const admin = await prisma.adminUser.findUnique({
      where: { email },
    })

    if (!admin) {
      return {
        success: false,
        message: 'メールアドレスまたはパスワードが正しくありません',
      }
    }

    if (!admin.isActive) {
      return {
        success: false,
        message: 'このアカウントは無効化されています',
      }
    }

    // パスワード検証
    const isValidPassword = await bcrypt.compare(password, admin.passwordHash)
    if (!isValidPassword) {
      return {
        success: false,
        message: 'メールアドレスまたはパスワードが正しくありません',
      }
    }

    // 最終ログイン時刻更新
    await prisma.adminUser.update({
      where: { id: admin.id },
      data: { lastLoginAt: new Date() },
    })

    // セッションCookie設定
    const cookieStore = await cookies()
    cookieStore.set(ADMIN_SESSION_COOKIE, admin.id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_MAX_AGE,
      path: '/admin',
    })

    return {
      success: true,
      message: 'ログインしました',
      data: {
        adminId: admin.id,
        name: admin.name,
      },
    }
  } catch (error) {
    console.error('adminLogin error:', error)
    return {
      success: false,
      message: 'ログインに失敗しました',
      error: {
        code: 'SERVER_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    }
  }
}

/**
 * 管理者ログアウト
 */
export async function adminLogout(): Promise<ApiResponse> {
  try {
    const cookieStore = await cookies()
    cookieStore.delete(ADMIN_SESSION_COOKIE)

    return {
      success: true,
      message: 'ログアウトしました',
    }
  } catch (error) {
    console.error('adminLogout error:', error)
    return {
      success: false,
      message: 'ログアウトに失敗しました',
    }
  }
}

/**
 * 管理者ログアウト（フォームアクション用）
 */
export async function adminLogoutAction() {
  'use server'
  await adminLogout()
}

/**
 * 現在の管理者情報取得
 */
export async function getCurrentAdmin() {
  try {
    const cookieStore = await cookies()
    const adminId = cookieStore.get(ADMIN_SESSION_COOKIE)?.value

    if (!adminId) {
      return null
    }

    const admin = await prisma.adminUser.findUnique({
      where: { id: parseInt(adminId) },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
      },
    })

    if (!admin || !admin.isActive) {
      return null
    }

    return admin
  } catch (error) {
    console.error('getCurrentAdmin error:', error)
    return null
  }
}

/**
 * 管理者認証チェック
 */
export async function requireAdmin() {
  const admin = await getCurrentAdmin()
  if (!admin) {
    throw new Error('Unauthorized')
  }
  return admin
}
