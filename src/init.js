import {
    $,
    hideBlackList,
    enableWidgetBot,
    blockAds,
    custom
} from './config.js'

import { login } from './variable.js'
import { book } from './pages/book'
import { homepage } from './pages/homepage'
import { nav } from './pages/nav'
import { page } from './pages/page'
import { readingBook } from './pages/readingBook'
import { spanPage } from './pages/spanPage'

import {
    hideBlackListFunc,
    discordChatFunc,
    debugConsole,
    blockAdsFunc,
} from './utils'

/**
 * init 初始化
 * 偵測元素是否存在。
 */
export function init () {

    // 導航欄
    if ($('nav[role="navigation"]')[0]) {

        function ready (pages = {}) {

            // notyf css 初始化
            $('head').append('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/notyf@3.9.0/notyf.min.css">')

            // 增加頁面
            addPage('homepage', $('#content .index-popular')[0], homepage)
            addPage('page', $('.index-container')[0] && /net\/\?page=/.test(location.href), page)
            addPage('book', $('#tags')[0], book)
            addPage('readingBook', $('#image-container')[0], readingBook,)
            addPage('spanPage', $('#content > h1 > span')[0], spanPage)

            // 循環偵測頁面
            for (let key of Object.keys(pages)) {
                debugConsole(`正在偵測 ${key}`)
                if (pages[key].condition) {
                    pages[key].callback()
                    break
                }
            }

            /**
             * 增加頁面
             * @param {string} pageName - 頁面名稱
             * @param {boolean} condition - 判斷
             * @param {funtion} callback - 回調函式
             */
            function addPage (pageName, condition, callback) {
                pages[pageName] = { condition, callback }
            }

            // 顯示頁面
            document.body.style.display = ''

            // 隱藏黑名單
            hideBlackList && login ? hideBlackListFunc() : debugConsole('隱藏黑名單 已關閉')

            // Discord 聊天室
            enableWidgetBot ? discordChatFunc(custom.discordChat) : debugConsole('Discord 聊天室 已關閉')

            // 阻擋廣告
            blockAds ? blockAdsFunc() : debugConsole('阻擋廣告 已關閉')
        }

        // 確保在執行 ready function 之前，讀取登入狀態
        nav(ready)

    } else {
        debugConsole('初始化失敗，找不到指定的元素：nav[role="navigation"]')

        $('body').show()
    }
}