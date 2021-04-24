// jQuery 變量，防止 Tampermonkey 出現錯誤提示
export const $ = window.$,

    // 語言設定
    translater = true,
    lang = 'zh_TW',
    data = `//raw.githubusercontent.com/NekoChanTaiwan/nHentai-Enhanced/main/locales/${lang}.json?flush_cache=True`,

    // Ajax 自動翻頁
    ajaxPage = true,

    // 在新分頁中開啟本本
    newTabBook = true,

    // 隱藏黑名單
    hideBlackList = false,

    // Discord 聊天室
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
        ]
    }