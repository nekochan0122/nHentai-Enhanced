import {
    ajaxPage,
} from '../config.js'

import {
    json,
    currentPageNum,
} from '../variable.js'

import {
    scrollEventAjax,
    galleryBlank,
    changeNumPosition,
    debugConsole,
    translatePlus,
} from '../utils'

/**
 * homepage 首頁
 */
export function homepage () {
    debugConsole('偵測到首頁')

    // 翻譯首頁容器
    translatePlus(['i', 'nav'], json.Homepage)

    // 將目前項目連結 改為新分頁開啟
    galleryBlank()

    ajaxPage ? ajaxPageFunc() : debugConsole('自動翻頁 已關閉')

    function ajaxPageFunc () {
        debugConsole('自動翻頁 已開啟')

         // 移動頁數位置
        changeNumPosition('homepage')

        // 當前頁數
        currentPageNum = 1

        scrollEventAjax('homepage')
    }
}