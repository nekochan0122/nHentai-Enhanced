import {
    $,
    custom
} from '../config.js'

import {
    json,
    login,
} from '../variable.js'

import {
    customMenu,
    $H,
} from '../utils'

/**
 * nav 導航
 * @param {callback} callback
 */
export function nav (callback) {

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
    for (let i = 1, len = Object.keys(json.MenuLeft).length; i <= len; i++) {
        $H(`.menu.left li:nth-child(${i}) > a`, json.MenuLeft[Object.keys(json.MenuLeft).sort((a, b)　=>　a - b)[i - 1]])

        // 隱藏 資訊
        i == 7 ? $(`.menu.left li:nth-child(${i})`).hide() : null
    }

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

    callback()
    customMenu(custom.menu)
}