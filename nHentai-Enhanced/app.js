// ========== 開發中 ==========

// ==UserScript==
// @name         nHentai Enhanced
// @namespace    https://github.com/NekoChanTaiwan
// @version      0.1
// @description  nHentai Enhanced
// @author       NekoChan
// @match        *://nhentai.net/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @grant none
// ==/UserScript==

// ========= 協助名單 =========
//            Horis
//     redblaze - 標籤爬蟲
// ===========================

'use strict'

// TODO: [優化] 更多頁面 支援 Ajax 讀取，和 更多頁面 支援 頁數選單移至上方

// jQuery 變量，防止 Tampermonkey 出現錯誤提示
const $ = window.$,

    // 語言設定
    translater = true,
    lang = 'zh_TW',
    data = `//raw.githubusercontent.com/NekoChanTaiwan/Tampermonkey-Scripts/main/nHentai-Enhanced/lang/${lang}.json?flush_cache=True`,

    // Ajax 自動翻頁
    ajaxPage = true,

    // 隱藏黑名單
    hideBlackList = false,

    // Discord 聊天室
    // discordChat = true,
    enableTitanEmbeds = false,
    enableWidgetBot = false,

    // 阻擋廣告
    blockAds = true,

    // 開發模式
    debug = true,

    custom = {
        // 選單 - 鍵名：名稱, 鍵值：連結
        menu: [
            { 中文: '/language/chinese/' },
            { 日文: '/language/japanese/' },
            { 英文: '/language/english/' },
            { 裏番: 'https://hanime1.me/' },
        ],

        // TitanEmbeds：https://titanembeds.com/
        discordChat: {
            url: 'https://titanembeds.com/embed/817948191122653195',
            lang: 'zh_Hant_TW',
            theme: 'DiscordDark',
            scrollbartheme: 'dark-3',
            other: 'defaultchannel=817948191856394242&userscalable=false'
        },
    }

// 預先定義變量
let json = null,
    login = false,
    currentPageNum = 0,
    loadingPage = false

// 初始化前隱藏頁面
$('body').hide()

// 網頁讀取完畢
$(() => {
    // 引入 JSON
    $.ajax({
        type: "GET",
        url: data,
        cache: false,
        dataType: "json",
        success: data => {
            debugConsole('JSON 獲取成功')
            json = data
            init()
        },
        error: () => {
            debugConsole('JSON 獲取失敗')
        }
    })

})

/**
 * init 初始化
 * 偵測元素是否存在。
 */
function init () {
    // 網頁名稱
    // $('title').text('nHentai Enhanced')

    // 導航欄
    if ($('nav[role="navigation"]')[0]) {
        debugConsole('偵測到導航欄')

        function ready () {
            // 首頁
            if ($('#content .index-popular')[0]) {
                debugConsole('偵測到首頁')
                homepage()

            // 第二頁開始的頁面列表
            } else if ($('.index-container')[0] && /\?page=/.test(window.location.href)) {
                debugConsole('偵測到頁面列表')
                page()

            // 本本
            } else if ($('#tags')[0]) {
                debugConsole('偵測到本本')
                book()

            // 閱讀本本中
            } else if ($('#image-container')[0]) {
                debugConsole('偵測到閱讀本本中')
                readingBook()

            } else {
                debugConsole('未知頁面')

            }

            // TODO: 黑名單不應該完全隱藏，游標移動至元素上時移除黑名單 class，顯示封面。
            // TODO: 對於直接點進黑名單的本本頁面，應該出現提示標註該本含有哪些黑名單標籤，且頁面不顯示。
            // 隱藏黑名單
            hideBlackList ? hideBlackListFunc() : debugConsole('隱藏黑名單 已關閉')

            // Discord 聊天室
            // discordChat ? discordChatFunc(custom.discordChat) : debugConsole('Discord 聊天室 已關閉')
            enableTitanEmbeds || enableWidgetBot ? discordChatFunc(custom.discordChat) : debugConsole('Discord 聊天室 已關閉')

            // 阻擋廣告
            blockAds ? blockAdsFunc() : debugConsole('阻擋廣告 已關閉')

            // 顯示頁面
            $('body').show()

            // 重置滾動條位置，防止觸發 Ajax 自動翻頁
            // window.scrollTo({
            //     top: 0,
            //     behavior: 'instant'
            // })
        }

        // 確保在執行 ready function 之前，獲取登入狀態
        nav(ready)

    } else {
        debugConsole('初始化失敗，找不到指定的元素：nav[role="navigation"]')

        $('body').show()
    }
}


/**
 * nav 導航
 * @param {callback} callback
 */
function nav (callback) {

    // 滾動事件
    $(window).scroll(() => {
        // Sticky Navbar
        $('nav').css({'position': 'static', 'top': '0', 'width': '100%', 'z-index': '999999'})
        if ($(window).scrollTop() === 0) {
            $('nav').css({'position': 'static'})
        }
        else if (window.pageYOffset >= $('nav')[0].offsetTop) {
            $('nav').css({'position': 'fixed'})
        }
    })

    // 左側
    for (let i = 1; i < Object.getOwnPropertyNames(json.MenuLeft).length + 1; i++) {
        $H(`.menu.left li:nth-child(${i}) > a`, json.MenuLeft[Object.keys(json.MenuLeft).sort((a, b)　=>　a - b)[i - 1]])

        // 隱藏 資訊
        if (i === 7) $(`.menu.left li:nth-child(${i})`).hide()
    }

    // 右側
    //  - 檢測是否有登入
    if (!/Sign in/.test($('.menu.right li:nth-child(1) >a').html())) {
        // 最愛
        $H('.menu.right li:nth-child(1) > a', `<i class="fa fa-heart color-icon"></i> ${json.MenuRight2.Favroites}`)
        // 登出
        $H('.menu.right li:nth-child(3) > a', `<i class="fa fa-sign-out-alt"></i> ${json.MenuRight2.LogOut}`)

        login = true // 已登入

    } else {
        // 登入
        $H('.menu.right li:nth-child(1) > a', `<i class="fa fa-sign-in-alt"></i> ${json.MenuRight1.SignIn}`)
        // 註冊
        $H('.menu.right li:nth-child(2) > a', `<i class="fa fa-edit"></i> ${json.MenuRight1.Register}`)

        login = false // 未登入

    }

    $('.menu.right').prepend(`<li class="desktop "><a href="https://discord.gg/ekbWahg52h"><i class="fab fa-discord"></i> &nbsp Discord - nHentai-Enhanced</a></li>`)

    callback()
    customMenu(custom.menu)
}

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
 * homepage 首頁
 */
function homepage () {
    // 當前熱門
    $H('#content .index-popular > h2', `<i class="fa fa-fire color-icon"></i> ${json.Homepage.PopularNow}`)

    // 最新上傳
    $H('#content .container:nth-child(3) > h2', `<i class="fa fa-box-tissue color-icon"></i> ${json.Homepage.NewUploads}`)

    // 將目前項目連結 改為新分頁開啟
    galleryBlank()

    // 移動頁數位置
    changeNumPosition('homepage')

    ajaxPage ? ajaxPageEvent() : debugConsole('自動翻頁 已關閉')

    function ajaxPageEvent () {
        debugConsole('自動翻頁 已開啟')

        // 當前頁數
        currentPageNum = 1

        // 滾動事件
        $(window).scroll(() => {
            // 滾動條到 75% 觸發 ajaxNextPage
            if ($(window).scrollTop() + $(window).height() > $(document).height() * 0.75 && loadingPage === false) {
                ajaxNextPage('homepage')
            }
        })
    }

    // $('.blacklisted').hover(
    //     function () {
    //         $(this).removeClass('blacklisted')
    //     },
    //     function () {
    //         $(this).addClass('blacklisted')
    //     }
    // )
}

/**
 * page 頁面列表
 */
function page () {
    // 將目前項目連結 改為新分頁開啟
    galleryBlank()

    // 移動頁數位置
    changeNumPosition('page')

    ajaxPage ? ajaxPageEvent() : debugConsole('自動翻頁 已關閉')

    function ajaxPageEvent () {
        debugConsole('自動翻頁 已開啟')

        // 當前頁數
        currentPageNum = window.location.href.replace('https://nhentai.net/?page=', '')

        // 滾動事件
        $(window).scroll(() => {

            // 滾動條到 75% 觸發 ajaxNextPage
            if ($(window).scrollTop() + $(window).height() > $(document).height() * 0.75 && loadingPage === false) {
                ajaxNextPage('page')
            }
        })
    }
}

/**
 * book 本本
 */
function book () {
    const book_id = $('#gallery_id').hide().text().replace('#', '')

    // 神的語言
    $($(`<h3 class="title"><span class="before">神的語言：</span><a id="book_id" href="javascript:;">${book_id}</a></h3>`)).insertAfter('#gallery_id')

    // 左側標籤列表
    for (let i = 1, span = ''; i < Object.getOwnPropertyNames(json.Book.TagsName).length + 1; i++) {
        span = $(`#tags > .tag-container:nth-child(${i}) > span`)[0].outerHTML
        $H(`#tags > .tag-container:nth-child(${i})`, `${json.Book.TagsName[Object.keys(json.Book.TagsName).sort((a, b)=>a - b)[i - 1]]} ${span}`)
    }

    // 右側標籤列表
    tagsTranslator($("#tags > .tag-container .tags a .name"))

    // 標籤下方按紐區
    // TODO: Favorite

    // 按鈕 - 下載
    // $H('#download', `<i class="fa fa-download"></i> ${json.Book.Btns.BTdownload}`)
    $('#download').hide()

    // 新增按鈕 - 開始閱讀
    $('#info > .buttons').prepend(`<a href="/g/${book_id}/1/" class="btn btn-primary"><i class="fas fa-book-open"></i> ${json.Book.Btns.Read}</a>`)

    // 新增按鈕 - 搜尋相關本本
    let searchText1 = $('#info .title').length === 2 ? `${$('#info .title:nth-child(1) > .pretty').text()}` :
                     $('#info .title').length === 3 ? `${$('#info .title:nth-child(2) > .pretty').text()}` : null,
        searchText2 = $('#info .title').length === 3 ? `${$('#info .title:nth-child(1) > .pretty').text()}` : null,
        searchText3 = '',
        serachTimes = 0,

        sT1Array = searchText1.split(' '),
        sT1Length = sT1Array.length === 1 ? sT1Array.length : sT1Array.length - 1

    for (let i = 0; i < sT1Length; i++) {
        searchText3 += `${sT1Array[i]}+`
    }


    // 移除文字
    remove = ['Ch.', 'Ep.', '第', '話', '券', '前篇', '中篇', '後篇', '+', '-']
    // 替換文字
    filter = [' ', '「', '」'],

    // 獲取搜尋結果數量並修改，第一次搜尋 searchText1
    search(searchText1)

    /**
     * 搜尋相關本本
     * @param {string} searchText - 要搜尋的字符串
     * @param {boolean} fix - 格式化文字
     */
    function search (searchText, fix = true) {
        if (serachTimes == 3) return

        // 搜尋次數
        serachTimes++

        // 格式化文字
        if (fix) {
            // 移除數字
            searchText = searchText.replace(/[0-9]+/g, '')

            // 移除文字
            forLoop(remove)

            // 替換文字
            forLoop(filter, '+')
        }

        /**
         * for 循環 replaceAll 迴圈
         * @param {array} target - 搜尋字串
         * @param {string} replace - 取代內容
         */
        function forLoop (target, replace = '') {
            for (let i = 0, len = target.length; i < len; i++) {
                searchText = searchText.replaceAll(target[i], replace)
            }
        }

        $.ajax({
            type: "GET",
            url: `/search/?q=${searchText}`,
            cache: true,
            dataType: "html",
            success: data => {
                debugConsole(`搜尋 ${searchText} 獲取成功`)

                // console.log(data)

                let newHtml = $('<div></div>'),

                    // 獲取搜尋結果數量
                    resultNum = newHtml.html(data).find('#content > h1').text().replace('results', ''),

                    // 搜尋結果是否含有 searchText2
                    perfect = /pBTJud4CQuaD6wNA/.test(data.replace(searchText2, 'pBTJud4CQuaD6wNA'))

                debugConsole(`搜尋 結果數量：${resultNum}`)

                if (resultNum > 0 && perfect) {
                    debugConsole('完美搜尋結果')
                    appendButton(searchText)

                } else if (serachTimes < 2) {
                    if ($('#info .title').length === 3) {
                        search(searchText2)

                    } else {
                        debugConsole('跳過搜尋 searchText2 ，搜尋 searchText3')
                        search(searchText3, false)

                    }

                } else if (serachTimes == 2) {
                    if (resultNum > 0 && perfect) {
                        debugConsole('完美搜尋結果')
                        appendButton(searchText)

                    } else {
                        search(searchText3, false)

                    }

                } else if (serachTimes == 3) {
                    debugConsole('勉強搜尋結果')
                    appendButton(searchText)

                }

                function appendButton (searchText) {
                    $('#info > .buttons').append(`<a href="/search/?q=${searchText}" class="btn btn-secondary"><i class="fas fa-search"></i> ${json.Book.Btns.SerachRelatedBook} (<span>${resultNum.replaceAll(' ', '')}</span>)</a>`)
                }

            },
            error: () => {
                debugConsole(`搜尋 ${searchText} 獲取失敗`)
            }
        })
    }

    // 偵測頁數 & 按紐
    const page = $('.thumb-container').length
    if (page > 75) {
        debugConsole(`總共頁數：：${page}，確定大於 75 `)

        // 顯示更多
        $H('#show-more-images-button', `<i class="fa fa-eye"></i> &nbsp; <span class="text">${json.Book.ShowMoreImagesButton}</span>`)

        // 顯示全部
        $H('#show-all-images-button', `<i class="fa fa-eye"></i> &nbsp; <span class="text">${json.Book.ShowAllImagesButton}</span>`)
    }

    // 更多類似的
    $H('#related-container > h2', json.Book.MoreLikeThis)

    // 將目前項目連結 改為新分頁開啟
    galleryBlank()

    // 留言
    $H('#comment-post-container > h3', `<i class="fa fa-comments color-icon"></i> ${json.Book.PostAComment}`)
    if (login) {
        // 如果你詢問是否有翻譯，你將會死亡。
        $('#comment_form > textarea').attr('placeholder',`${json.Book.CommentFormPlaceHolder}`)
        // 發送
        $H('#comment_form > div > button', `<i class="fa fa-comment"></i> ${json.Book.Comment}`)
    } else {
        // 登入 或 註冊 和其他基友一起討論。
        $H('#comment-post-container > div > p', `<a class="login-comment" href="/login/">${json.Book.NoLogin.Login}</a> ${json.Book.NoLogin.Or} <a class="login-comment" href="/register/">${json.Book.NoLogin.Register}</a> ${json.Book.NoLogin.ToPostAComment}`)
    }

    // 時間
    $H('time', timeTranslator($('time').html()))
    $("time").bind('DOMNodeInserted', function() {
        let time = timeTranslator(this.innerHTML)
        if (this.innerHTML !== time) {
            this.innerHTML = time
            debugConsole(`偵測到時間發生變化：${this.innerHTML}`)
        }
    })
}

/**
 * 閱讀本本中
 */
function readingBook () {
    const imageContainer = $('#image-container')

    let cur = window.location.href.split('/'),
        curNum = cur[cur.length - 2],
        maxNum = $('span.num-pages').html(),
        id = cur[cur.length - 3]

    $('#image-container > a').remove()
    $('.reader-bar').remove()

    if (imageContainer.hasClass('fit-both')) {
        imageContainer.removeClass('fit-both')
        imageContainer.addClass('fit-horizontal')
    }

    nextImage(1)

    function nextImage (target) {
        if (target > maxNum) return

        $.ajax({
            type: "GET",
            url: `/g/${id}/${target}/`,
            cache: true,
            dataType: "html",
            success: data => {
                debugConsole(`第 ${target} 獲取成功`)

                // console.log(data)

                let newHtml = $('<div></div>')

                // 插入 元素
                $('#image-container').append(newHtml.html(data).find('#image-container > a > img').attr('id', `page${target}`).css({'display': 'block', 'margin-left': 'auto', 'margin-right': 'auto'}))

                // 滾動至當前頁數
                if (target == curNum) {
                    $('html, body').animate({
                        scrollTop: $(`#page${curNum}`).offset().top
                    }, 300)
                }

                // 讀取下一頁
                nextImage(+target + 1)

            },
            error: () => {
                debugConsole(`第 ${target} 獲取失敗`)
            }
        })
    }

}

/**
 * Ajax 獲取下一頁資料 並插入至容器
 * @param {string} mode - "homepage", "page"
 */
function ajaxNextPage (mode) {
    currentPageNum++

    // 判斷當前模式 選擇正確的元素
    const selector = mode === 'homepage' ? '#content > div:nth-child(3)' :
                     mode === 'page' ? '.index-container' : null

    loadingPage = true

    debugConsole(`第${currentPageNum}頁 獲取中`)
    $.ajax({
        type: "GET",
        url: `/?page=${currentPageNum}`,
        cache: true,
        dataType: "html",
        success: data => {
            debugConsole(`第${currentPageNum}頁 獲取成功`)

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
            const t = window.n.options.blacklisted_tags
            for (let e = t.map((t => {
                return ".tag-".concat(t, ',.gallery[data-tags~="').concat(t, '"]')
            })).join(","), n = document.querySelectorAll(e), r = 0; r < n.length; r++) n[r].classList.add("blacklisted")

            // 隱藏黑名單
            hideBlackList ? hideBlackListFunc() : debugConsole('隱藏黑名單 已關閉')

            loadingPage = false
        },
        error: () => {
            debugConsole(`第${currentPageNum}頁 獲取失敗`)

            loadingPage = false
        }
    })
}

/**
 * 將目前項目連結 改為新分頁開啟
 */
function galleryBlank () {
    $('.gallery > a').attr('target', '_blank')
}

/**
 * 更改 頁數選單 位置
 * @param {string} mode - "homepage", "page"
 */
function changeNumPosition (mode) {

    // 判斷當前模式 選擇正確的元素
    const selector = mode === "homepage" ? '#content > div.container.index-container.index-popular' :
                     mode === "page" ? '#content > div' : null

    $('#content > section').insertBefore(selector)

    // 移除不必要的元素
    $('#content > section > div').remove()
}

/**
 *  隱藏黑名單
 */
function hideBlackListFunc () {
    if (login) {
        debugConsole('隱藏黑名單 已開啟')

        $('.blacklisted').remove()
    } else {
        debugConsole('用戶未登入 隱藏黑名單 已關閉')
    }
}

/**
 * 獲取用戶名
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

    function titanEmbeds () {
        // 提示圖標 #discordChatIcon
        $('body').append(`
            <div id="discordChatIcon" style="position:fixed;left:20px;bottom:0.5%;z-index:99999;">
                <a href="javascript:;">
                    <img src="https://raw.githubusercontent.com/NekoChanTaiwan/Tampermonkey-Scripts/main/nHentai-Enhanced/img/discordChatIcon.png"
                        height="${window.innerHeight / 15}">
                </a>
            </div>`)

        // 主要聊天室元素 #discordChat
        $('body').append(`
            <div id="discordChat" style="position:fixed;left:20px;bottom:8%;z-index:99999;">
                <iframe src="${DC.url}?lang=${DC.lang}&theme=${DC.theme}&scrollbartheme=${DC.scrollbartheme}&username=${getUserName()}&${DC.other}"
                        height="${window.innerHeight / 1.3}"
                        width="${window.innerWidth / 5}"
                        frameborder="0">
                </iframe>
            </div>`)

        // 默認隱藏聊天室
        $('#discordChat').hide()

        // 圖標事件
        $('#discordChatIcon').click(() => {
            $('#discordChat').toggle('fast')
        })
    }

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

    enableTitanEmbeds ? titanEmbeds() : null
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

    $('.advertisement').remove()
}

/**
 * 翻譯標籤
 * @param {object} tags - jQuery DOM
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