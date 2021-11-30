import { debugConsole } from './'
import { enableWidgetBot } from '../config'

/**
 * Discord 聊天室
 */
export function discordChatFunc() {
  debugConsole('Discord 聊天室 已開啟')

  // WidgetBot V2 注：該版本許多問題，讀取非常慢。等待 V3釋出後在考慮使用
  function widgetBot() {
    const crateScript = document.createElement('script')
    crateScript.defer = true
    crateScript.async = true
    crateScript.src = 'https://cdn.jsdelivr.net/npm/@widgetbot/crate@3'
    crateScript.text = `
      new Crate({
          server: '914714807519825940',
          channel: '914864192115335188'
      })
      `
    document.head.appendChild(crateScript)
  }

  enableWidgetBot ? widgetBot() : null
}
