import {
    $,
} from '../config.js'

import {
    json,
    currentPageNum,
} from '../variable.js'

import {
    scrollEventAjax,
    changeNumPosition,
    debugConsole,
    $H,
    tagsTranslator,
} from '../utils'

/**
 * span 頁面
 */
export function spanPage () {
    debugConsole('偵測到 span 頁面')

    const jsonSP = json.spanPage, sort = jsonSP.sort, span = $('#content > h1 > span'), spanName = span.html()

    // 翻譯 span
    jsonSP.tags.hasOwnProperty(spanName) ? span.html(jsonSP.tags[spanName]).parent() : debugConsole('未知的 span 頁面')

    // 翻譯 標籤
    tagsTranslator($('#content > h1 > a > .name'))

    // sort (太醜了)
    $H('.sort > div:nth-child(1) > a', sort.Recent)
    $H('.sort > div:nth-child(2) > span', sort.Popular)
    $H('.sort > div:nth-child(2) > a:nth-child(2)', sort.today)
    $H('.sort > div:nth-child(2) > a:nth-child(3)', sort.week)
    $H('.sort > div:nth-child(2) > a:nth-child(4)', sort.allTime)

    changeNumPosition('span')

    // 獲取當前頁數
    const link = location.href.split('=')
    currentPageNum = link.length == 1 ? 1 : Number(link[1])

    // ajax
    scrollEventAjax('span')
}