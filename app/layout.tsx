import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '4店舗合同 ビンゴスタンプラリー',
  description: '4店舗を巡って豪華景品をゲット！',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
