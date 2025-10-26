import { StoreCode } from './index'

// ユーザー進捗
export interface Progress {
  storeAVisits: number
  storeBVisits: number
  storeCVisits: number
  storeDVisits: number
}

// ビンゴセル
export interface BingoCell {
  store: StoreCode | 'free'
  visit: number
  isCompleted: boolean
}

// ビンゴカード配置
export interface BingoCellLayout {
  store: StoreCode | 'free'
  visit: number
}
