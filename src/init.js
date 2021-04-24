import {
    $,
    hideBlackList,
    enableWidgetBot,
    blockAds,
    custom
} from './config.js'

import { login} from './variable.js'

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
        debugConsole('偵測到導航欄')

        function ready () {

            // notyf css 初始化
            $('head').append('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/notyf@3.9.0/notyf.min.css">')

            // 首頁
            if ($('#content .index-popular')[0]) {
                debugConsole('偵測到首頁')
                homepage()

            // 首頁第二頁開始的頁面列表
            } else if ($('.index-container')[0] && /net\/\?page=/.test(location.href)) {
                debugConsole('偵測到頁面列表')
                page()

            // 本本
            } else if ($('#tags')[0]) {
                debugConsole('偵測到本本')
                book()

            // 閱讀本本中
            } else if ($('#image-container')[0]) {
                debugConsole('偵測到閱讀本本中')
                readingBook()

            // span 頁面
            } else if ($('#content > h1 > span')[0]) {
                debugConsole('偵測到 span 頁面')
                spanPage()

            } else {
                debugConsole('未知頁面')

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