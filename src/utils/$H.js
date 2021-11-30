import { debugConsole } from './'

/**
 * $(selector).html(string)
 * @param {string} selector - 選擇器
 * @param {string} text - 更改的內容
 */
export function $H(selector, text) {
  $(selector)[0] ? $(selector).html(text) : debugConsole(`修改 HTML 失敗，選擇器：${selector}`)
}
