import { $, hideBlackList, enableWidgetBot, custom } from './config.js'
import { login, notyf } from './variable.js'
import { book } from './pages/book'
import { homepage } from './pages/homepage'
import { nav } from './pages/nav'
import { page } from './pages/page'
import { readingBook } from './pages/readingBook'
import { spanPage } from './pages/spanPage'
import { hideBlackListFunc, discordChatFunc, debugConsole } from './utils'

/**
 * init 初始化
 * 偵測元素是否存在。
 */
export function init() {
  // notyf css 初始化
  $('head').append('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/notyf@3.9.0/notyf.min.css">')

  // 導航欄
  if ($('nav[role="navigation"]')[0]) {
    function ready(pages = {}) {
      /**
       * 增加頁面
       * @param {string} pageName - 頁面名稱
       * @param {boolean} condition - 判斷
       * @param {funtion} func - 頁面函式
       */
      const addPage = (pageName, condition, func) => (pages[pageName] = { condition, func })

      // 增加頁面
      addPage('主頁', $('#content .index-popular')[0], homepage)
      addPage('頁面列表', $('.index-container')[0] && /net\/\?page=/.test(location.href), page)
      addPage('本本', $('#tags')[0], book)
      addPage('閱讀模式', $('#image-container')[0], readingBook)
      addPage('span 頁面', $('#content > h1 > span')[0], spanPage)

      // 循環偵測頁面
      for (let key of Object.keys(pages)) {
        debugConsole(`正在偵測頁面：${key}`)
        if (pages[key].condition) {
          // 調用頁面函數
          pages[key].func()

          break
        }
      }

      // 隱藏黑名單
      hideBlackList && login ? hideBlackListFunc() : debugConsole('隱藏黑名單 已關閉')

      // Discord 聊天室
      enableWidgetBot ? discordChatFunc(custom.discordChat) : debugConsole('Discord 聊天室 已關閉')
    }

    // 確保在執行 ready function 之前，讀取登入狀態
    try {
      nav(ready)
      notyf.success('nHentai-Enhanced 初始化成功')
    } catch (e) {
      debugConsole('初始化失敗：' + e)
      notyf.error('nHentai-Enhanced 初始化失敗：' + e)
    }
  } else {
    debugConsole('nav 初始化失敗，找不到指定的元素：nav[role="navigation"]')
    notyf.error('nHentai-Enhanced nav 初始化失敗')
  }

  // 顯示 body
  document.body.style.display = ''
}
