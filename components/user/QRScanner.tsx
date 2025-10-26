'use client'

import { useState, useEffect, useRef } from 'react'
import { BrowserQRCodeReader } from '@zxing/library'
import { processStamp } from '@/app/actions/stamp'
import { StampResult } from '@/types/api'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'

export interface QRScannerProps {
  eventId: string
  onSuccess?: (result: StampResult) => void
}

export default function QRScanner({ eventId, onSuccess }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<StampResult | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const readerRef = useRef<BrowserQRCodeReader | null>(null)

  const startScanning = async () => {
    try {
      setError(null)

      if (!readerRef.current) {
        readerRef.current = new BrowserQRCodeReader()
      }

      const videoInputDevices = await readerRef.current.listVideoInputDevices()
      if (videoInputDevices.length === 0) {
        throw new Error('カメラが見つかりません')
      }

      // 背面カメラを優先的に選択
      const selectedDevice =
        videoInputDevices.find((device) =>
          device.label.toLowerCase().includes('back')
        ) || videoInputDevices[0]

      if (videoRef.current) {
        readerRef.current.decodeFromVideoDevice(
          selectedDevice.deviceId,
          videoRef.current,
          async (result, error) => {
            if (result && !isProcessing) {
              const qrCode = result.getText()
              await handleQRCodeDetected(qrCode)
            }
          }
        )
        setIsScanning(true)
      }
    } catch (err) {
      console.error('Camera error:', err)
      setError('カメラへのアクセスに失敗しました。ブラウザの設定を確認してください。')
    }
  }

  const stopScanning = () => {
    if (readerRef.current) {
      readerRef.current.reset()
    }
    setIsScanning(false)
  }

  const handleQRCodeDetected = async (qrCode: string) => {
    await handleManualInput(qrCode)
  }

  const handleManualInput = async (qrCode: string) => {
    setIsProcessing(true)
    setError(null)

    try {
      // QRコードのフォーマット: bingo://stamp/{eventId}/{storeCode}
      const url = new URL(qrCode)
      if (url.protocol !== 'bingo:' || !url.pathname.startsWith('//stamp/')) {
        throw new Error('無効なQRコードです')
      }

      const parts = url.pathname.split('/')
      const scannedEventId = parts[2]
      const storeCode = parts[3]

      if (scannedEventId !== eventId) {
        throw new Error('このQRコードは別のイベントのものです')
      }

      if (!['a', 'b', 'c', 'd'].includes(storeCode)) {
        throw new Error('無効な店舗コードです')
      }

      // スタンプ処理を実行
      const stampResult = await processStamp(eventId, storeCode)
      setResult(stampResult)

      if (stampResult.success) {
        stopScanning()
        onSuccess?.(stampResult)
      } else {
        setError(stampResult.message)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'QRコードの処理に失敗しました'
      setError(message)
    } finally {
      setIsProcessing(false)
    }
  }

  useEffect(() => {
    return () => {
      stopScanning()
    }
  }, [])

  return (
    <div className="space-y-4">
      {/* Camera View */}
      {isScanning && (
        <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
          <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 border-4 border-white/50 rounded-lg" />
          </div>
          <div className="absolute bottom-4 left-0 right-0 text-center">
            <p className="text-white text-sm bg-black/50 px-4 py-2 rounded-lg inline-block">
              QRコードを枠内に収めてください
            </p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Controls */}
      <div className="space-y-3">
        {!isScanning ? (
          <Button onClick={startScanning} className="w-full" size="lg">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            カメラを起動
          </Button>
        ) : (
          <Button onClick={stopScanning} variant="secondary" className="w-full" size="lg">
            スキャン停止
          </Button>
        )}

        {/* Manual Input */}
        <details className="bg-gray-50 rounded-lg p-4">
          <summary className="cursor-pointer text-sm font-medium text-gray-700">
            手動でQRコードを入力
          </summary>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              const qrCode = formData.get('qrCode') as string
              if (qrCode) {
                handleManualInput(qrCode)
              }
            }}
            className="mt-3 space-y-3"
          >
            <input
              type="text"
              name="qrCode"
              placeholder="bingo://stamp/{eventId}/{storeCode}"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={isProcessing}
            />
            <Button type="submit" isLoading={isProcessing} className="w-full">
              送信
            </Button>
          </form>
        </details>
      </div>

      {/* Success Modal */}
      <Modal
        isOpen={result?.success === true}
        onClose={() => {
          setResult(null)
          window.location.href = '/'
        }}
        title="スタンプ獲得！"
        size="md"
      >
        {result && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-lg font-semibold text-gray-900">{result.message}</p>
            </div>

            {result.progress && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">現在の進捗</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>A店: {result.progress.storeAVisits}/6</div>
                  <div>B店: {result.progress.storeBVisits}/6</div>
                  <div>C店: {result.progress.storeCVisits}/6</div>
                  <div>D店: {result.progress.storeDVisits}/6</div>
                </div>
              </div>
            )}

            {result.newLineAchievement && (
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-4 text-white">
                <h3 className="font-bold text-lg mb-2">
                  ビンゴ達成！おめでとうございます！
                </h3>
                <p className="text-sm mb-1">
                  {result.newLineAchievement.lineCount}ライン達成
                </p>
                <p className="font-bold text-lg">{result.newLineAchievement.prizeName}</p>
                <p className="text-sm mt-1">{result.newLineAchievement.prizeDescription}</p>
                {result.newLineAchievement.validUntil && (
                  <p className="text-xs mt-2">有効期限: {result.newLineAchievement.validUntil}</p>
                )}
              </div>
            )}

            <Button
              onClick={() => {
                setResult(null)
                window.location.href = '/'
              }}
              className="w-full"
            >
              ビンゴカードを見る
            </Button>
          </div>
        )}
      </Modal>
    </div>
  )
}
