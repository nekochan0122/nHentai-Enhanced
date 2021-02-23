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

    // ========== 語言 ==========

    const lang = 'zh_TW',
          cdn = `//cdn.jsdelivr.net/gh/NekoChanTaiwan/Tampermonkey-Scripts@master/nHentai-Translator/lang/${lang}.json`

    document.write(`<script type="text/javascript" src=${cdn}>`) // 引入 json

    // ========== class ==========

    const className = {
        menuLeft: '.menu.left',
        menuRight: '.menu.right'
    }

    // ========== 導航 ==========
    // 左側
    li(className.menuLeft, lang.menuLeft)

    // 右側
    //  - 檢測是否有登入
    if(!/Sign in/.test(document.querySelector(`${className.menuRight} li:nth-child(1) >a`).innerHTML)) {
        document.querySelector(`${className.menuRight} li:nth-child(1) > a`).innerHTML = lang.menuRight2.Favroites
        document.querySelector(`${className.menuRight} li:nth-child(3) > a`).innerHTML = lang.menuRight2.LogOut
    } else {
        li(className.menuRight, lang.menuRight1)
    }

    // ========== 函式 ==========
    // 固定 li 修改 a 標籤
    function li (className, obj) {
        for (let i = 1; i < Object.getOwnPropertyNames(obj).length + 1; i++) {
            document.querySelector(`${className} li:nth-child(${i}) > a`).innerHTML = obj[Object.keys(obj).sort((a, b)=>a - b)[i - 1]]
        }
    }
})()