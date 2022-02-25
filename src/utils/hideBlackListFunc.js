import { debugConsole } from './'
import { hideBlackList } from '../config'
import { login } from '../variable'

/**
 *  隱藏黑名單
 */
export function hideBlackListFunc() {
  if (hideBlackList && login) {
    debugConsole('隱藏黑名單 已開啟')
    $('.blacklisted').remove()
    return
  }

  debugConsole('隱藏黑名單 已關閉')
}
