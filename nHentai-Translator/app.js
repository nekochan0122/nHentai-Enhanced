// ==UserScript==
// @name         nHentai 翻譯
// @namespace    https://github.com/NekoChanTaiwan
// @version      0.1
// @description  如題
// @author       NekoChan
// @match        *://nhentai.net/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// ==/UserScript==

const $ = window.$

$(() => {

    // 語言
    const lang = 'zh_TW',
          cdn = `//raw.githubusercontent.com/NekoChanTaiwan/Tampermonkey-Scripts/main/nHentai-Translator/lang/${lang}.json?flush_cache=True`

    // 引入 json
    let json = null,
        request = new XMLHttpRequest()
    request.open('get', cdn)
    request.send(null)
    request.onload = () => {
        if (request.status === 200) {
            json = JSON.parse(request.responseText)
            main()
        }
    }

    // 網頁 class
    const className = {
        container: '.container',
        menuLeft: '.menu.left',
        menuRight: '.menu.right',
        popularNow: '.index-popular',
        tagsNameContainer: '.tag-container',
        buttons: '.buttons'
    }
    // 網頁 id
    const idName = {
        content: '#content',
        tagsName: '#tags',
        relatedContainer: '#related-container'
    }
    // 偵測狀態
    let status = {
        login: false
    }

    // 翻譯
    function main() {
        // ========== 導航 ==========
        if ($(className.menuLeft)[0] && $(className.menuRight)[0]) {
            console.log('偵測到導航欄')
            // 左側
            for (let i = 1; i < Object.getOwnPropertyNames(json.menuLeft).length + 1; i++) {
                $(`${className.menuLeft} li:nth-child(${i}) > a`).html(json.menuLeft[Object.keys(json.menuLeft).sort((a, b)=>a - b)[i - 1]])
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

        // 主要內容
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
                for (let i = 1, span = ''; i < Object.getOwnPropertyNames(json.book.tagsName).length + 1; i++) {
                    span = $(`${idName.tagsName} > ${className.tagsNameContainer}:nth-child(${i}) > span`)[0].outerHTML
                    $(`${idName.tagsName} > ${className.tagsNameContainer}:nth-child(${i})`).html(`${json.book.tagsName[Object.keys(json.book.tagsName).sort((a, b)=>a - b)[i - 1]]} ${span}`)
                }

                $(`${idName.relatedContainer} > h2`).html(json.book.MoreLikeThis)

                // if (!status.login) {

                // } else {

                // }
            }
        }

    }
})