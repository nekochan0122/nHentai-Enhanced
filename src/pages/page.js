import {
    ajaxPage,
} from '../config.js'

import {
    currentPageNum,
} from '../variable.js'

import {
    scrollEventAjax,
    galleryBlank,
    changeNumPosition,
    debugConsole,
} from '../utils'

/**
 * page 頁面列表
 */
export function page () {
    debugConsole('偵測到頁面列表')

    // 將目前項目連結 改為新分頁開啟
    galleryBlank()

    ajaxPage ? ajaxPageFunc() : debugConsole('自動翻頁 已關閉')

    function ajaxPageFunc () {
        debugConsole('自動翻頁 已開啟')

        // 移動頁數位置
        changeNumPosition('page')

        // 當前頁數
        currentPageNum = Number(location.href.split('=')[1])

        scrollEventAjax('page')
    }
}