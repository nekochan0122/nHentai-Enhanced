// ==UserScript==
// @name         Chrome
// @namespace    https://github.com/NekoChanTaiwan
// @version      0.1
// @description  寫好玩的
// @author       NekoChan
// @match        *://*/*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// ==/UserScript==

const $ = window.$

$(document.head).append('<link rel="preconnect" href="https://fonts.gstatic.com">', '<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300&family=Noto+Sans+TC:wght@300&display=swap" rel="stylesheet">')
$(document.body).attr('style', "font-family: 'Noto Sans TC','Noto Sans SC' !important")

$(() => {})