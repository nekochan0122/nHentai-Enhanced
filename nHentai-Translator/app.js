// ==UserScript==
// @name         nHentai 翻譯
// @namespace    https://github.com/NekoChanTaiwan
// @version      0.1
// @description  如題
// @author       NekoChan
// @match        *://nhentai.net/*
// @grant        none
// ==/UserScript==

(() => {
    'use strict'

    // 語言
    const lang = 'zh_TW',
          cdn = `//cdn.jsdelivr.net/gh/NekoChanTaiwan/Tampermonkey-Scripts@master/nHentai-Translator/lang/${lang}.json`


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
        menuLeft: '.menu.left',
        menuRight: '.menu.right',
        popularNow: '.index-popular'
    }

    // 翻譯
    function main() {
        // ========== 導航 ==========
        // 左側
        li(className.menuLeft, json.menuLeft)

        // 右側
        //  - 檢測是否有登入
        if(!/Sign in/.test(document.querySelector(`${className.menuRight} li:nth-child(1) >a`).innerHTML)) {
            document.querySelector(`${className.menuRight} li:nth-child(1) > a`).innerHTML = `<i class="fa fa-heart color-icon"></i> ${json.menuRight2.Favroites}`
            document.querySelector(`${className.menuRight} li:nth-child(3) > a`).innerHTML = `<i class="fa fa-sign-out-alt"></i> ${json.menuRight2.LogOut}`
        } else {
            li(className.menuRight, json.menuRight1)
        }

        // ========== 主頁 ==========
        document.querySelector(`#content ${className.popularNow} > h2`).innerHTML = `<i class="fa fa-fire color-icon"></i> ${json.homepage.PopularNow}`
        document.querySelector(`#content .container:nth-child(2) > h2`).innerHTML = `<i class="fa fa-box-tissue color-icon"></i> ${json.homepage.NewUploads}`
    }

    // 固定 li 修改 a 標籤
    function li (className, obj) {
        for (let i = 1; i < Object.getOwnPropertyNames(obj).length + 1; i++) {
            document.querySelector(`${className} li:nth-child(${i}) > a`).innerHTML = obj[Object.keys(obj).sort((a, b)=>a - b)[i - 1]]
        }
    }
})()