import { debug } from '../config'

/**
 * debug ? console.log(string)
 * @param {string} text - 顯示的文字
 */
export function debugConsole(text) {
  debug ? console.log(text) : null
}
