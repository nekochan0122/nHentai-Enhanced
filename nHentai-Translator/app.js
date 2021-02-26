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
debug = false,

// 元素 class
className = {
    container: '.container',
    menuLeft: '.menu.left',
    menuRight: '.menu.right',
    popularNow: '.index-popular',
    tagsNameContainer: '.tag-container',
    buttons: '.buttons'
},

// 元素 id
idName = {
    content: '#content',
    tagsName: '#tags',
    relatedContainer: '#related-container'
},

// 引入 JSON 用的請求變量
request = new XMLHttpRequest()

// 預先定義變量
let json = null,
    status = {
    login: false
}

// 網頁讀取完畢
$(() => {
    // 引入 JSON
    request.open('get', data)
    request.send(null)
    request.onload = () => {
        if (request.status === 200) {
            console.log('JSON讀取成功')
            json = JSON.parse(request.responseText)

            // 導航欄
            if ($('nav[role="navigation"]')[0]) {
                console.log('偵測到導航欄')
                nav()

                // 主頁
                if ($(`${idName.content} ${className.popularNow}`)[0]) {
                    console.log('偵測到主頁')
                    homepage()

                // 本本
                } else if ($(`${idName.tagsName}`)[0]) {
                    console.log('偵測到本本')
                    book()
                }

            }

        } else {
            console.log('JSON讀取失敗')
        }
    }
})

/**
 * nav 導航
 */
function nav () {
    // 左側
    for (let i = 1; i < Object.getOwnPropertyNames(json.menuLeft).length + 1; i++) {
        $H(`${className.menuLeft} li:nth-child(${i}) > a`, json.menuLeft[Object.keys(json.menuLeft).sort((a, b)　=>　a - b)[i - 1]])
    }

    // 右側
    //  - 檢測是否有登入
    if (!/Sign in/.test($(`${className.menuRight} li:nth-child(1) >a`).html())) {
        $H(`${className.menuRight} li:nth-child(1) > a`, `<i class="fa fa-heart color-icon"></i> ${json.menuRight2.Favroites}`)
        $H(`${className.menuRight} li:nth-child(3) > a`, `<i class="fa fa-sign-out-alt"></i> ${json.menuRight2.LogOut}`)

        status.login = true // 已登入
    } else {
        $H(`${className.menuRight} li:nth-child(1) > a`, `<i class="fa fa-sign-in-alt"></i> ${json.menuRight1.SignIn}`)
        $H(`${className.menuRight} li:nth-child(2) > a`, `<i class="fa fa-edit"></i> ${json.menuRight1.Register}`)

        status.login = false // 未登入
    }
}

/**
 * homepage 主頁
 */
function homepage () {
    // 當前熱門
    $H(`${idName.content} ${className.popularNow} > h2`, `<i class="fa fa-fire color-icon"></i> ${json.homepage.PopularNow}`)

    // 最新上傳
    $H(`${idName.content} ${className.container}:nth-child(3) > h2`, `<i class="fa fa-box-tissue color-icon"></i> ${json.homepage.NewUploads}`)
}

/**
 * book 本本
 */
function book () {
    // 左側標籤列表
    for (let i = 1, span = ''; i < Object.getOwnPropertyNames(json.book.tagsName).length + 1; i++) {
        span = $(`${idName.tagsName} > ${className.tagsNameContainer}:nth-child(${i}) > span`)[0].outerHTML
        $H(`${idName.tagsName} > ${className.tagsNameContainer}:nth-child(${i})`, `${json.book.tagsName[Object.keys(json.book.tagsName).sort((a, b)=>a - b)[i - 1]]} ${span}`)
    }

    // 右側標籤列表
    tagsTranslator($("#tags > .tag-container .tags a .name"))

    // 更多類似的
    $H(`${idName.relatedContainer} > h2`, json.book.MoreLikeThis)
}

/**
 * $(selector).html(string) 語法糖
 */
function $H (selector, string) {
    $(selector).html(string)
}

/**
 * 翻譯標籤
 * @param {Object} tags jQuery DOM
 */
function tagsTranslator (tags) {
    for (let i = 0; i < tags.length; i++) {
        const tag = tags.eq(i)
        console.log(`發現標籤：${tag.html()}`)
        if (json.Tags.hasOwnProperty(tag.html())) {
            console.log(`偵測到：${tag.html()}，更改為：${json.Tags[tag.html()]}`)
            tag.html(json.Tags[tag.html()])
        }
    }
}