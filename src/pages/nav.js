import {
    $,
    custom
} from '../config.js'

import {
    json,
    login,
} from '../variable.js'

import {
    debugConsole,
    translatePlus,
} from '../utils'

/**
 * nav 導航
 * @param {callback} callback
 */
export function nav (callback, nav = $('nav')) {
    debugConsole('偵測到導航欄')

    // nav 樣式
    nav.css({'position': 'sticky', 'top': '0', 'width': '100%', 'z-index': '999999'})

    // 滾動事件
    $(window).scroll(() => pageYOffset > 150 ? nav.css({'position': 'fixed'}) : nav.css({'position': 'sticky'}))

    // 翻譯選單
    translatePlus(['#content', 'i'], json.Menu)

    // 檢測是否有登入
    login = Object.keys(n.options.user).length

    // 右側自訂選單
    $('.menu.right').prepend(`
    <li class="desktop "><a target="_blank" href="https://github.com/NekoChanTaiwan/nHentai-downloader/releases/latest"><i class="fas fa-download"></i> &nbsp nHentai-downloader</a></li>
    <li class="desktop "><a target="_blank" href="https://discord.gg/ekbWahg52h"><i class="fab fa-discord"></i> &nbsp Discord - nHentai-Enhanced</a></li>`)

    $('input[type=search]').attr({'autocomplete': 'off', 'placeholder': ''})

    customMenu(custom.menu)
    callback()

    /**
     * 自定選單
     * @param {array} menu - 一個包含物件選單的陣列，鍵名為連結名稱，鍵值為連結
     * @param {number} len - 該參數不必傳遞，用於變量聲明
     */
    function customMenu (menu, len = menu.length) {
        for (let i = 0; i < len; i++) {
            debugConsole(`新增自定選單：${Object.keys(menu[i])[0]} 連結：${Object.values(menu[i])[0]}`)
            $('.menu.left').append(`<li class="desktop "><a href="${Object.values(menu[i])[0]}">${Object.keys(menu[i])[0]}</a></li>`)
        }
    }
}