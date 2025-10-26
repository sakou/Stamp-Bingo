import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * 一時的なシードエンドポイント
 * 本番環境でシードデータを投入するための一時的なエンドポイント
 *
 * 使用方法:
 * 1. デプロイ後、ブラウザで https://your-app.vercel.app/api/seed?secret=YOUR_SECRET にアクセス
 * 2. シードデータ投入完了後、このファイルを削除してリデプロイ
 *
 * セキュリティ:
 * - 環境変数 SEED_SECRET が必要
 * - 実行後は必ずこのファイルを削除
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')

  // セキュリティチェック: 環境変数と一致する場合のみ実行
  if (!process.env.SEED_SECRET || secret !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // prisma/seed.ts の内容を実行
    const { execSync } = require('child_process')

    console.log('🌱 Starting seed process...')

    // シードスクリプトを実行
    const output = execSync('npm run prisma:seed', {
      env: {
        ...process.env,
        NODE_ENV: 'production',
      },
      encoding: 'utf-8',
    })

    console.log('✅ Seed completed:', output)

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully. Please delete this API endpoint now.',
      output,
    })
  } catch (error: any) {
    console.error('❌ Seed failed:', error)
    return NextResponse.json(
      {
        error: 'Seed failed',
        details: error.message,
        stderr: error.stderr?.toString(),
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
