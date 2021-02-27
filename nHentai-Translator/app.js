// ========== 開發中 ==========

// ==UserScript==
// @name         nHentai 翻譯
// @namespace    https://github.com/NekoChanTaiwan
// @version      0.1
// @description  如題
// @author       NekoChan
// @match        *://nhentai.net/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// ==/UserScript==

// jQuery 變量，防止 Tampermonkey 出現錯誤提示
const $ = window.$,

// 設定
lang = 'zh_TW',
data = `//raw.githubusercontent.com/NekoChanTaiwan/Tampermonkey-Scripts/main/nHentai-Translator/lang/${lang}.json?flush_cache=True`,
debug = true,

// 引入 JSON 用的請求變量
request = new XMLHttpRequest()

// 預先定義變量
let json = null,
    login = false

// 網頁讀取完畢
$(() => {
    // 引入 JSON
    request.open('get', data)
    request.send(null)
    request.onload = () => {
        if (request.status === 200) {
            debugConsole('JSON讀取成功')
            json = JSON.parse(request.responseText)

            init() // 初始化
        } else {
            debugConsole('JSON讀取失敗')
        }
    }
})

/**
 * init 初始化
 * 偵測元素是否存在。
 */
function init () {
    // 導航欄
    if ($('nav[role="navigation"]')[0]) {
        debugConsole('偵測到導航欄')

        function ready () {
            // 主頁
            if ($('#content .index-popular')[0]) {
                debugConsole('偵測到主頁')
                homepage()

            // 本本
            } else if ($('#tags')[0]) {
                debugConsole('偵測到本本')
                book()
            }
        }

        nav(ready)

    } else {
        debugConsole('初始化失敗，找不到指定的元素：nav[role="navigation"]')
    }
}


/**
 * nav 導航
 */
function nav (callback) {
    // 左側
    for (let i = 1; i < Object.getOwnPropertyNames(json.menuLeft).length + 1; i++) {
        $H(`.menu.left li:nth-child(${i}) > a`, json.menuLeft[Object.keys(json.menuLeft).sort((a, b)　=>　a - b)[i - 1]])
    }

    // 右側
    //  - 檢測是否有登入
    if (!/Sign in/.test($('.menu.right li:nth-child(1) >a').html())) {
        // 最愛
        $H('.menu.right li:nth-child(1) > a', `<i class="fa fa-heart color-icon"></i> ${json.menuRight2.Favroites}`)
        // 登出
        $H('.menu.right li:nth-child(3) > a', `<i class="fa fa-sign-out-alt"></i> ${json.menuRight2.LogOut}`)

        login = true // 已登入
    } else {
        // 登入
        $H('.menu.right li:nth-child(1) > a', `<i class="fa fa-sign-in-alt"></i> ${json.menuRight1.SignIn}`)
        // 註冊
        $H('.menu.right li:nth-child(2) > a', `<i class="fa fa-edit"></i> ${json.menuRight1.Register}`)

        login = false // 未登入
    }
    callback()
}

/**
 * homepage 主頁
 */
function homepage () {
    // 當前熱門
    $H('#content .index-popular > h2', `<i class="fa fa-fire color-icon"></i> ${json.homepage.PopularNow}`)

    // 最新上傳
    $H('#content .container:nth-child(3) > h2', `<i class="fa fa-box-tissue color-icon"></i> ${json.homepage.NewUploads}`)
}

/**
 * book 本本
 */
function book () {
    // 左側標籤列表
    for (let i = 1, span = ''; i < Object.getOwnPropertyNames(json.book.tagsName).length + 1; i++) {
        span = $(`#tags > .tag-container:nth-child(${i}) > span`)[0].outerHTML
        $H(`#tags > .tag-container:nth-child(${i})`, `${json.book.tagsName[Object.keys(json.book.tagsName).sort((a, b)=>a - b)[i - 1]]} ${span}`)
    }

    // 右側標籤列表
    tagsTranslator($("#tags > .tag-container .tags a .name"))

    // 偵測頁數 & 按紐
    const page = $('.thumb-container').length
    debugConsole(`目前頁數：${page}`)
    if (page > 75) {
        debugConsole(`頁數：${page}，確定大於 75 `)

        // 顯示更多
        $H('#show-more-images-button', `<i class="fa fa-eye"></i> &nbsp; <span class="text">${json.book.ShowMoreImagesButton}</span>`)

        // 顯示全部
        $H('#show-all-images-button', `<i class="fa fa-eye"></i> &nbsp; <span class="text">${json.book.ShowAllImagesButton}</span>`)
    }

    // 更多類似的
    $H('#related-container > h2', json.book.MoreLikeThis)

    // 留言
    $H('#comment-post-container > h3', `<i class="fa fa-comments color-icon"></i> ${json.book.PostAComment}`)
    if (login) {
        // 如果你詢問是否有翻譯，你將會死亡。
        $('#comment_form > textarea').attr('placeholder',`${json.book.CommentFormPlaceHolder}`)
        // 發送
        $H('#comment_form > div > button', `<i class="fa fa-comment"></i> ${json.book.Comment}`)
    } else {}
}


/**
 * $(selector).html(string) 語法糖
 */
function $H (selector, string) {
    $(selector)[0] ? $(selector).html(string) : debugConsole(`翻譯失敗，選擇器：${selector}`)
}

/**
 * debug ? console.log(string) 語法糖
 * @param {*} string 要顯示的提示
 */
function debugConsole (string) {
    debug ? console.log(string) : null
}

/**
 * 翻譯標籤
 * @param {Object} tags jQuery DOM
 */
function tagsTranslator (tags) {
    for (let i = 0; i < tags.length; i++) {
        const tag = tags.eq(i)
        debugConsole(`發現標籤：${tag.html()}`)
        if (json.Tags.hasOwnProperty(tag.html())) {
            debugConsole(`偵測到：${tag.html()}，更改為：${json.Tags[tag.html()]}`)
            tag.html(json.Tags[tag.html()])
        }
    }
}