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
    $H,
} from '../utils'

import { TranslatePlus , Translate } from '../pageTranslate.js'

/**
 * nav 導航
 * @param {callback} callback
 */
export function nav (callback) {
    debugConsole('偵測到導航欄')

    // 滾動事件
    $(window).scroll(() => {
        // Sticky Navbar
        $('nav').css({'position': 'static', 'top': '0', 'width': '100%', 'z-index': '999999'})
        if ($(window).scrollTop() === 0) {
            $('nav').css({'position': 'static'})
        }
        else if (pageYOffset >= $('nav')[0].offsetTop) {
            $('nav').css({'position': 'fixed'})
        }
    })

    // 左側


    // let time = performance.now() //1.7ms
    // for (let i = 1, len = Object.keys(json.MenuLeft).length; i <= len; i++) {
    //     $H(`.menu.left li:nth-child(${i}) > a`, json.MenuLeft[Object.keys(json.MenuLeft).sort((a, b)　=>　a - b)[i - 1]])

    //     // 隱藏 資訊
    //     i == 7 ? $(`.menu.left li:nth-child(${i})`).hide() : null
    // }
    // debugConsole(`翻译耗时：${performance.now() - time} ms.`)

    // let time = performance.now() //15ms
    
    // TranslatePlus([], json.MenuLeft)

    // debugConsole(`翻译耗时：${performance.now() - time} ms.`)

    // let time = performance.now() //3ms
    
    // Translate(['.menu.left li:nth-child(1:7) > a'], json.MenuLeft)

    // debugConsole(`翻译耗时：${performance.now() - time} ms.`)

    // 右側
    //  - 檢測是否有登入
    if (Object.keys(n.options.user).length) {
        // 最愛
        $H('.menu.right li:nth-child(1) > a', `<i class="fa fa-heart color-icon"></i> ${json.MenuRight2.Favroites}`)
        // 登出
        $H('.menu.right li:nth-child(3) > a', `<i class="fa fa-sign-out-alt"></i> ${json.MenuRight2.LogOut}`)

        login = true // 已登入

    } else {
        // 登入
        $H('.menu.right li:nth-child(1) > a', `<i class="fa fa-sign-in-alt"></i> ${json.MenuRight1.SignIn}`)
        // 註冊
        $H('.menu.right li:nth-child(2) > a', `<i class="fa fa-edit"></i> ${json.MenuRight1.Register}`)

        login = false // 未登入

    }

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