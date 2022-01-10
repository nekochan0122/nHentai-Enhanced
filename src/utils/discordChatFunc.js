import { debugConsole } from './'
import { enableWidgetBot } from '../config'

/**
 * Discord 聊天室
 */
export function discordChatFunc() {
  debugConsole('Discord 聊天室 已開啟')

  function widgetBot() {
    const crateScript = document.createElement('script')
    crateScript.defer = true
    crateScript.async = true
    crateScript.src = 'https://cdn.jsdelivr.net/npm/@widgetbot/crate@3'
    crateScript.text = `
      new Crate({
          server: '',
          channel: ''
      })
      `
    document.head.appendChild(crateScript)
  }

  enableWidgetBot ? widgetBot() : null
}
