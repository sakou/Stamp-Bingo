import { redirect } from 'next/navigation'
import { getCurrentAdmin } from '@/app/actions/admin/auth'
import LoginForm from '@/components/admin/LoginForm'

export const dynamic = 'force-dynamic'

export default async function AdminLoginPage() {
  // すでにログイン済みの場合はダッシュボードへ
  const admin = await getCurrentAdmin()
  if (admin) {
    redirect('/admin/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-purple-700 mb-2">管理画面</h1>
          <p className="text-gray-600">4店舗合同ビンゴスタンプラリー</p>
        </div>

        <LoginForm />

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>デフォルト管理者アカウント:</p>
          <p>Email: admin@example.com</p>
          <p>Password: admin123</p>
        </div>
      </div>
    </div>
  )
}
