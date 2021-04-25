import {
    $,
    hideBlackList,
    enableWidgetBot,
    blockAds,
    custom
} from './config.js'

import { login, notyf } from './variable.js'
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

    // notyf css 初始化
    $('head').append('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/notyf@3.9.0/notyf.min.css">')

    // 導航欄
    if ($('nav[role="navigation"]')[0]) {

        function ready (pages = {}) {

            /**
             * 增加頁面
             * @param {string} pageName - 頁面名稱
             * @param {boolean} condition - 判斷
             * @param {funtion} func - 頁面函式
             */
            const addPage = (pageName, condition, func) => pages[pageName] = { condition, func }

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
                    // 調用頁面函數
                    pages[key].func()

                    // 顯示 #content
                    $('#content').show()

                    break
                }
            }

            // 隱藏黑名單
            hideBlackList && login ? hideBlackListFunc() : debugConsole('隱藏黑名單 已關閉')

            // Discord 聊天室
            enableWidgetBot ? discordChatFunc(custom.discordChat) : debugConsole('Discord 聊天室 已關閉')

            // 阻擋廣告
            blockAds ? blockAdsFunc() : debugConsole('阻擋廣告 已關閉')
        }

        // 確保在執行 ready function 之前，讀取登入狀態
        try {
            nav(ready)
            $('nav').show()
        } catch (e){
            debugConsole('初始化失敗：' + e)
            notyf.error('nHentai-Enhanced 初始化失敗：' + e)
        }

    } else {
        debugConsole('nav 初始化失敗，找不到指定的元素：nav[role="navigation"]')
    }
}