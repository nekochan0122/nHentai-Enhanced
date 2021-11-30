'use strict'

import { $, data, ajaxCache } from './config.js'
import { json } from './variable.js'
import { init } from './init'
import { debugConsole } from './utils'

// 初始化前 隱藏 body
document.body.style.display = 'none'

// 網頁讀取完畢
$(() => {
  // 獲取 JSON
  const getJson = () => {
    $.ajax({
      type: 'GET',
      url: data,
      cache: ajaxCache,
      dataType: 'json',
      success: data => {
        debugConsole('JSON 讀取成功')
        json = data
        init()
      },
      error: () => {
        debugConsole('JSON 讀取失敗 3 秒後重新讀取')

        setTimeout(() => getJson(), 3000)
      },
    })
  }
  getJson()
})
