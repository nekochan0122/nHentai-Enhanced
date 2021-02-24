// 開發中

// ==UserScript==
// @name         nHentai 翻譯
// @namespace    https://github.com/NekoChanTaiwan
// @version      0.1
// @description  如題
// @author       NekoChan
// @match        *://nhentai.net/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// ==/UserScript==

// 定義 jQuery 變量，防止 Tampermonkey 出現錯誤提示
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

// 引入 json 用的請求變量
request = new XMLHttpRequest()

// 預先定義變量
let json = null,
    status = {
    login: false
}

$(() => {
    // 引入 json
    request.open('get', data)
    request.send(null)
    request.onload = () => {
        if (request.status === 200) {
            json = JSON.parse(request.responseText)
            nav()
        }
    }
})

/**
 * nav 導航區
 */
function nav() {
    // ========== 導航 ==========
    if ($(className.menuLeft)[0] && $(className.menuRight)[0]) {
        console.log('偵測到導航欄')
        // 左側
        for (let i = 1; i < Object.getOwnPropertyNames(json.menuLeft).length + 1; i++) {
            $(`${className.menuLeft} li:nth-child(${i}) > a`).html(json.menuLeft[Object.keys(json.menuLeft).sort((a, b)　=>　a - b)[i - 1]])
        }

        // 右側
        //  - 檢測是否有登入
        if(!/Sign in/.test($(`${className.menuRight} li:nth-child(1) >a`).html())) {
            $(`${className.menuRight} li:nth-child(1) > a`).html(`<i class="fa fa-heart color-icon"></i> ${json.menuRight2.Favroites}`)
            $(`${className.menuRight} li:nth-child(3) > a`).html(`<i class="fa fa-sign-out-alt"></i> ${json.menuRight2.LogOut}`)
            status.login = true
            content()
        } else {
            $(`${className.menuRight} li:nth-child(1) > a`).html(`<i class="fa fa-sign-in-alt"></i> ${json.menuRight1.SignIn}`)
            $(`${className.menuRight} li:nth-child(2) > a`).html(`<i class="fa fa-edit"></i> ${json.menuRight1.Register}`)
            status.login = false
            content()
        }
    }
}

/**
 * content 內容區
 */
function content() {
    // ========== 主頁 ==========
    if ($(`${idName.content} ${className.popularNow}`)[0]) {
        console.log('偵測到主頁')
        $(`${idName.content} ${className.popularNow} > h2`).html(`<i class="fa fa-fire color-icon"></i> ${json.homepage.PopularNow}`)
        $(`${idName.content} ${className.container}:nth-child(3) > h2`).html(`<i class="fa fa-box-tissue color-icon"></i> ${json.homepage.NewUploads}`)
    }

    // ========== 本本頁面 ==========
    if ($(`${idName.tagsName}`)[0]) {
        console.log('偵測到本本')

        // 左側標籤名稱
        for (let i = 1, span = ''; i < Object.getOwnPropertyNames(json.book.tagsName).length + 1; i++) {
            span = $(`${idName.tagsName} > ${className.tagsNameContainer}:nth-child(${i}) > span`)[0].outerHTML
            $(`${idName.tagsName} > ${className.tagsNameContainer}:nth-child(${i})`).html(`${json.book.tagsName[Object.keys(json.book.tagsName).sort((a, b)=>a - b)[i - 1]]} ${span}`)
        }

        // 右側標籤列表
        tagsTranslator($("#tags > .tag-container .tags a .name"))

        // 更多類似的
        $(`${idName.relatedContainer} > h2`).html(json.book.MoreLikeThis)


        // if (!status.login) {
        // } else {
        // }
    }
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