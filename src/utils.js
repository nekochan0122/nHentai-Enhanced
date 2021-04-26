import {
    $,
    ajaxChahe,
    newTabBook,
    hideBlackList,
    enableWidgetBot,
    debug,
} from './config.js'
// import { TranslatePlus } from './pageTranslate.js'

import {
    json,
    login,
    currentPageNum,
    loadingPage,
    notyf
} from './variable.js'

export {
    scrollEventAjax,
    ajaxNextPage,
    galleryBlank,
    changeNumPosition,
    hideBlackListFunc,
    discordChatFunc,
    debugConsole,
    $H,
    blockAdsFunc,
    tagsTranslator,
    timeTranslator
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
        cache: ajaxChahe,
        dataType: 'html',
        success: data => {
            debugConsole(`第${currentPageNum}頁 讀取成功`)

            // 創建元素
            let newHtml = $('<div></div>')

            // 格式化 HTML字符串，插入元素
            $(selector).append(newHtml.html(data.replaceAll('data-src', 'src')).find('.gallery'))

            // 將目前項目連結 改為新分頁開啟
            galleryBlank()

            // 處理 黑名單
            login ? n.install_blacklisting() : null

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
function tagsTranslator(tags, len = tags.length) {
    for (let i = 0; i < len; i++) {
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

// =========================================================================================================

/**
 * 页面翻译威力加强版（比较慢）\
 * 使用函数在网页元素中查找翻译规则中的键，替换为翻译规则的值\
 * 流程（不准确）：文本 => CSS选择器 , CSS选择器 => 文本\
 * 也就是说是使用函数替换网页元素内容
 * @param {Array} IgnoreCssSelectors - 要删除的网页内容 | 也可以说是要忽略的元素的CSS选择器数组 成员是CSS选择器
 * @param {Object} toTransRules - 翻译规则对象
 *  key - 未翻译的内容 | 也可以说是要替换的内容
 *  value - 已翻译的内容 | 也可以说是将要作为替换的内容
 */
function TranslatePlus(IgnoreCssSelectors, toTransRules) {
    const PageTransSelectors = GetPageTransSelectors(IgnoreCssSelectors, toTransRules);
    Translate(PageTransSelectors, toTransRules);
}

/**
 * 页面翻译\
 * 通过CSS选择器获得元素内容作为翻译规则的键，再用键查找翻译规则对象中的值替换网页中的内容\
 * 流程（不准确）：CSS选择器 => 文本\
 * 也就是说是用CSS选择器选择网页元素内容，替换为目标值
 * @param {Array} CssSelectors - 要翻译的网页内容所对应的元素的选择器数组 成员是CSS选择器
 * @param {Object} toTransRules - 翻译规则对象
 *  ey - 未翻译的内容 | 也可以说是要替换的内容
 *  value - 已翻译的内容 | 也可以说是将要作为替换的内容
 */
 function Translate(CssSelectors, toTransRules) {
    CssSelectors = _CssNthChildLoader(CssSelectors);
    for (const CssSelector of CssSelectors) {
        for (const Single of $(CssSelector)) {
            const Tag = $(Single);
            if (Tag.text().trim() in toTransRules) {
                Tag.html(toTransRules[Tag.text().trim()]);
            }
        }
    }
}

/**
 * 在网页中查找含有未翻译内容的元素并生成该元素的CSS选择器，保存成一个数组\
 * 流程：文本 => CSS选择器\
 * 也可以说是通过文本在网页中查找含有该页面元素内容的选择器
 * @param {Array} IgnoreCssSelectors - 要删除的网页内容 | 也可以说是要忽略的元素的CSS选择器数组 成员是CSS选择器
 * @param {Object} NativeTextFilters - 要翻译的内容对象 | 也可以说是网页元素含有的内容的对象
 *  key - 未翻译的内容 | 也可以说是被选中的网页元素的内容 ！！不需要值
 * @returns {Array} 未翻译内容 通过key在网页中查找到的CSS选择器数组
 */
function GetPageTransSelectors(IgnoreCssSelectors = [], NativeTextFilters) {
    let BodyClone = $('body').clone();
    let PageTransSelectors = [];
    for (const CssSelector of IgnoreCssSelectors) {
        $(CssSelector, BodyClone).remove();
    }

    $('*', BodyClone).each(function () {
        let Results = $('*', this);

        if (Results.length == 0) {
            const Text = this.textContent?.trim();

            if (!Text) {
                return;
            }

            if (Text in NativeTextFilters) {
                PageTransSelectors.push(finder(this));
            }
        }
    });
    return PageTransSelectors;
}

/**
 * 内部函数，用于解析新增语法 nth-child(Start:End)
 * @param {Array} CssSelectors - 一个待处理的选择器数组
 * @returns 处理完毕的选择器数组
 */
function _CssNthChildLoader(CssSelectors) {
    let TargetSelectors = [];
    let RecursionCount = 0;
    let NewCssSelectors = CssSelectors.slice();
    let i = 0;
    for (const CssSelector of CssSelectors) {
        let TestResults = CssSelector.matchAll(/nth\-child\((\d+):(\d+)\)/g);
        TestResults = Array.from(TestResults);
        if (TestResults.length) {
            if (RecursionCount < TestResults.length) {
                RecursionCount = TestResults.length;
            }
            NewCssSelectors.splice(i, 1);
            i--;

            TargetSelectors.push(CssSelector);
        }
        i++;
    }

    if (!TargetSelectors.length) {
        return CssSelectors;
    }

    return NewCssSelectors.concat(_CssNthChildProcess(TargetSelectors, RecursionCount));
}

/**
 * 内部函数：迭代处理CSS选择器新语法
 * @param {Array} CssSelectors - 未处理完的CSS选择器数组
 * @param {Number} RecursionCount - 迭代次数
 * @returns
 */
function _CssNthChildProcess(CssSelectors, RecursionCount) {
    let i = 0;
    let NewCssSelectors = CssSelectors.slice();
    for (const CssSelector of CssSelectors) {
        let MatchResults = CssSelector.matchAll(/nth\-child\((\d+):(\d+)\)/g);
        MatchResults = Array.from(MatchResults);
        let [Start, End] = [+MatchResults[0][1], +MatchResults[0][2]];
        NewCssSelectors.splice(i, 1);
        i--;
        for (let a = 0; a < End - Start + 1; a++) {
            NewCssSelectors.push(
                MatchResults[0].input.replace(`${Start}:${End}`, '' + (Start + a)) // only replace once
            );
        }
        i++;
    }
    RecursionCount--;
    if (!RecursionCount) {
        return NewCssSelectors;
    } else {
        return _CssNthChildProcess(NewCssSelectors, RecursionCount);
    }
}

// =========================================================================================================
