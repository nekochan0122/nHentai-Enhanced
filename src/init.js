import { $, enableWidgetBot, custom } from './config'
import { book, homepage, nav, page, readingBook, search, spanPage, favorites } from './pages'
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
    function ready() {
      let pages = {}

      /**
       * 增加頁面
       * @param {string} pageName - 頁面名稱
       * @param {boolean} condition - 判斷該頁元素是否存在
       * @param {funtion} func - 頁面回調函式
       */
      const addPage = (pageName, condition, func) => (pages[pageName] = { condition, func })

      // 增加頁面
      addPage('主頁', $('#content .index-popular')[0], homepage)
      addPage('頁面列表', $('.index-container')[0] && /net\/\?page=/.test(location.href), page)
      addPage('本本', $('#tags')[0], book)
      addPage('閱讀模式', $('#image-container')[0], readingBook)
      addPage('搜尋頁面', $('#content .fa-search')[0] && location.pathname === '/search/', search)
      addPage('最愛頁面', $('#favorites-search')[0] && location.pathname === '/favorites/', favorites)
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
      hideBlackListFunc()

      // Discord 聊天室
      enableWidgetBot ? discordChatFunc(custom.discordChat) : debugConsole('Discord 聊天室 已關閉')
    }

    // 確保在執行 ready function 之前，讀取登入狀態
    try {
      nav(ready)
      debugConsole('nHentai-Enhanced 初始化成功')
    } catch (e) {
      debugConsole('初始化失敗：' + e)
      throw e
    }
  } else {
    debugConsole('nav 初始化失敗，找不到指定的元素：nav[role="navigation"]')
    debugConsole('nHentai-Enhanced nav 初始化失敗')
  }

  // 顯示 body
  document.body.style.display = ''
}
