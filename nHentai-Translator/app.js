// ==UserScript==
// @name         nHentai 翻譯
// @namespace    https://github.com/NekoChanTaiwan
// @version      0.1
// @description  如題
// @author       NekoChan
// @match        *://nhentai.net/*
// ==/UserScript==

(() => {
    'use strict'

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
        tagsName: '#tags'
    }
    // 偵測狀態
    let status = {
        login: false
    }

    // 翻譯
    function main() {
        // ========== 導航 ==========
        if (document.querySelector(className.menuLeft) && document.querySelector(className.menuRight)) {
            // 左側
            li(className.menuLeft, json.menuLeft)

            // 右側
            //  - 檢測是否有登入
            if(!/Sign in/.test(document.querySelector(`${className.menuRight} li:nth-child(1) >a`).innerHTML)) {
                document.querySelector(`${className.menuRight} li:nth-child(1) > a`).innerHTML = `<i class="fa fa-heart color-icon"></i> ${json.menuRight2.Favroites}`
                document.querySelector(`${className.menuRight} li:nth-child(3) > a`).innerHTML = `<i class="fa fa-sign-out-alt"></i> ${json.menuRight2.LogOut}`
                status.login = true
                content()
            } else {
                document.querySelector(`${className.menuRight} li:nth-child(1) > a`).innerHTML = `<i class="fa fa-sign-in-alt"></i> ${json.menuRight1.SignIn}`
                document.querySelector(`${className.menuRight} li:nth-child(2) > a`).innerHTML = `<i class="fa fa-edit"></i> ${json.menuRight1.Register}`
                status.login = false
                content()
            }
        }

        // 主要內容
        function content() {
            // ========== 主頁 ==========
            if (document.querySelector(`${idName.content} ${className.popularNow}`) && document.querySelector(`${idName.content} ${className.container}`)) {
                document.querySelector(`${idName.content} ${className.popularNow} > h2`).innerHTML = `<i class="fa fa-fire color-icon"></i> ${json.homepage.PopularNow}`
                document.querySelector(`${idName.content} ${className.container}:nth-child(3) > h2`).innerHTML = `<i class="fa fa-box-tissue color-icon"></i> ${json.homepage.NewUploads}`
            }

            // ========== 本本頁面 ==========
            if (document.querySelector(`${idName.tagsName}`)) {
                for (let i = 1, span = ''; i < Object.getOwnPropertyNames(json.book.tagsName).length + 1; i++) {
                    span = document.querySelector(`${idName.tagsName} > ${className.tagsNameContainer}:nth-child(${i}) > span`).outerHTML
                    document.querySelector(`${idName.tagsName} > ${className.tagsNameContainer}:nth-child(${i})`).innerHTML = `${json.book.tagsName[Object.keys(json.book.tagsName).sort((a, b)=>a - b)[i - 1]]} ${span}`
                }

                if (!status.login) {
                    let span = document.querySelector(`${className.buttons} > a:nth-child(1) > span > span`).outerHTML
                    document.querySelector(`${className.buttons} > a:nth-child(1)`).innerHTML = `<i class="fas fa-heart"></i> <span>${json.book.buttons.Favroites}${span}</span><div class="top">${json.book.buttons1.top}<i></i></div>`
                }
            }
        }

    }

    // 固定 li 修改 a 標籤
    function li (className, obj) {
        for (let i = 1; i < Object.getOwnPropertyNames(obj).length + 1; i++) {
            document.querySelector(`${className} li:nth-child(${i}) > a`).innerHTML = obj[Object.keys(obj).sort((a, b)=>a - b)[i - 1]]
        }
    }
})()