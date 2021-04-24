import {
    $,
    newTabBook,
    hideBlackList,
    enableWidgetBot,
    debug,
} from './config.js'

import {
    json,
    login,
    currentPageNum,
    loadingPage,
    notyf
} from './variable.js'

/**
 * 自定選單
 * @param {array} menu
 */
function customMenu (menu) {
    for (let i = 0; i < menu.length; i++) {
        debugConsole(`新增自定選單：${Object.keys(menu[i])[0]} 連結：${Object.values(menu[i])[0]}`)
        $('.menu.left').append(`<li class="desktop "><a href="${Object.values(menu[i])[0]}">${Object.keys(menu[i])[0]}</a></li>`)
    }
}

/**
 * 觸發 ajaxNextPage 的滾動事件
 * @param {string} mode - 'homepage', 'page', 'span'
 */
function scrollEventAjax (mode) {
    // 滾動事件
    $(window).scroll(() => {
        // 滾動條到 75% 觸發 ajaxNextPage
        if ($(window).scrollTop() + $(window).height() > $(document).height() * 0.75 && loadingPage === false) {
            ajaxNextPage(mode)
        }
    })
}

/**
 * Ajax 獲取下一頁資料 並插入至容器
 * @param {string} mode - 'homepage', 'page', 'span'
 * @param {string} selector - 該參數不用傳遞（純粹想少寫一行變量聲明）
 */
function ajaxNextPage (mode, selector = null) {
    currentPageNum++

    // 判斷當前模式 選擇正確的元素
    switch (mode) {
        case 'homepage' :
            selector = '.index-container:nth-child(4)'
            break
        case 'page' :
        case 'span' :
            selector = '.index-container'
            break
    }

    loadingPage = true

    debugConsole(`第${currentPageNum}頁 讀取中`)

    $.ajax({
        type: 'GET',
        url: `${location.href}/?page=${currentPageNum}`,
        cache: true,
        dataType: 'html',
        success: data => {
            debugConsole(`第${currentPageNum}頁 讀取成功`)

            // 創建元素
            let newHtml = $('<div></div>')
            // 格式化 HTML字符串 成 DOM 註：取代 data-src 成 src，解決 lazyload 問題
            newHtml.html(data.replaceAll('data-src', 'src'))
            // 插入 元素
            $(selector).append(newHtml.find('.gallery'))

            // 將目前項目連結 改為新分頁開啟
            galleryBlank()

            // 黑名單 class 加 blacklisted
            // Code from：https://static.nhentai.net/js/scripts.8d76ecfad261.js
            if (login) {
                const t = n.options.blacklisted_tags
                for (let e = t.map((t => {
                    return '.tag-'.concat(t, ',.gallery[data-tags~="').concat(t, '"]')
                })).join(','), n = document.querySelectorAll(e), r = 0; r < n.length; r++) n[r].classList.add('blacklisted')
            }

            // 隱藏黑名單
            hideBlackList && login ? hideBlackListFunc() : debugConsole('隱藏黑名單 已關閉')

            loadingPage = false
        },
        error: () => {
            debugConsole(`第${currentPageNum}頁 讀取失敗`)

            notyf.dismissAll()
            notyf.error(`第${currentPageNum}頁 讀取失敗`)

            currentPageNum--

            loadingPage = false
        }
    })
}

/**
 * 將列表中的本本 改為新分頁開啟
 */
function galleryBlank () {
    newTabBook ? $('.gallery > a').attr('target', '_blank') : null
}

/**
 * 更改 頁數選單 位置
 * @param {string} mode - 'homepage', 'page'
 * @param {string} selector - 該參數不用傳遞（純粹想少寫一行變量聲明）
 */
function changeNumPosition (mode, selector) {

    // 判斷當前模式 選擇正確的元素
    switch (mode) {
        case 'homepage' :
            selector = '.index-container.index-popular'
            break
        case 'page' :
            selector = '#content > div'
            break
        case 'span' :
            selector = '.container.index-container'
    }

    $('#content > section').insertBefore(selector)

    // 移除不必要的元素
    $('#content > section > div').remove()
}

/**
 *  隱藏黑名單
 */
function hideBlackListFunc () {
    debugConsole('隱藏黑名單 已開啟')

    $('.blacklisted').remove()
}

/**
 * 讀取用戶名
 * @returns 已登入用戶名，若未登入返回空字符串
 */
function getUserName () {
    return login ? $('.menu.right li:nth-child(3) a').contents().filter(function () {return this.nodeType == Node.TEXT_NODE}).text().trim() : ''
}

/**
 * Discord 聊天室
 */
function discordChatFunc (DC) {
    debugConsole('Discord 聊天室 已開啟')

    // WidgetBot V2 注：該版本許多問題，讀取非常慢。等待 V3釋出後在考慮使用
    function widgetBot () {
        const crateScript = document.createElement('script')
        crateScript.defer = true
        crateScript.async = true
        crateScript.src = 'https://cdn.jsdelivr.net/npm/@widgetbot/crate@3'
        crateScript.text = `
            new Crate({
                server: '817948191122653195',
                channel: '817948191856394242'
            })
            `
        document.head.appendChild(crateScript)
    }

    enableWidgetBot ? widgetBot() : null
}

/**
 * debug ? console.log(string)
 * @param {string} text - 顯示的文字
 */
function debugConsole (text) {
    debug ? console.log(text) : null
}

/**
 * $(selector).html(string)
 * @param {string} selector - 選擇器
 * @param {string} text - 更改的內容
 */
function $H (selector, text) {
    $(selector)[0] ? $(selector).html(text) : debugConsole(`修改 HTML 失敗，選擇器：${selector}`)
}

/**
 * 阻擋廣告
 */
function blockAdsFunc () {
    debugConsole('阻擋廣告 已開啟')

    $('.advertisement').hide()

    n.ads = null
}

/**
 * 翻譯標籤
 * @param {object} tags - jQuery DOM .name
 */
function tagsTranslator (tags) {
    for (let i = 0; i < tags.length; i++) {
        const tagE = tags.eq(i), tagName = tagE.html()
        // debugConsole(`發現標籤：${tagName}`)

        if (json.Tags.hasOwnProperty(tagName)) {
            debugConsole(`偵測到：${tagName}，更改為：${json.Tags[tagName]}`)

            tagE.html(json.Tags[tagName]).parent().attr('title', tagName)
        }
    }
}

/**
 * 翻譯時間
 * @param {string} time - 時間字符串
 */
function timeTranslator (time) {
    const jsonTime = json.Book.Time,
          engTime = ['years', 'year', 'months', 'month', 'weeks', 'days', 'day', 'hours', 'hour', 'minutes', 'minute', 'seconds', 'second', 'ago']

    for (let i = 0, max = engTime.length; i < max; i++) {
        time = time.replace(engTime[i], jsonTime[engTime[i]])
    }

    return time
}

export {
    customMenu,
    scrollEventAjax,
    ajaxNextPage,
    galleryBlank,
    changeNumPosition,
    hideBlackListFunc,
    getUserName,
    discordChatFunc,
    debugConsole,
    $H,
    blockAdsFunc,
    tagsTranslator,
    timeTranslator
}