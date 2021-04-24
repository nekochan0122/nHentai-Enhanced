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
    $H,
} from '../utils'

/**
 * homepage 首頁
 */
export function homepage () {
    // 當前熱門
    $H('#content .index-popular > h2', `<i class="fa fa-fire color-icon"></i> ${json.Homepage.PopularNow}`)

    // 最新上傳
    $H('#content .container:nth-child(3) > h2', `<i class="fa fa-box-tissue color-icon"></i> ${json.Homepage.NewUploads}`)

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