'use strict'

import {
    $,
    data,
} from './config.js'

import {
    json,
} from './variable.js'

import { init } from './init'

import {
    debugConsole,
} from './utils'

// 初始化前隱藏頁面
document.body.style.display = 'none'

// 網頁讀取完畢
$(() => {
    // 獲取 JSON
    $.ajax({
        type: 'GET',
        url: data,
        cache: false,
        dataType: 'json',
        success: data => {
            debugConsole('JSON 讀取成功')
            json = data
            init()
        },
        error: () => {
            debugConsole('JSON 讀取失敗')
        }
    })
})

