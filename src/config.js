// jQuery 變量，防止 Tampermonkey 出現錯誤提示
export const $ = window.$,
  // 語言設定
  translater = true,
  lang = 'zh_TW',
  data = `//raw.githubusercontent.com/NekoChanTaiwan/nHentai-Enhanced/main/locales/${lang}.json?flush_cache=True`,
  // Ajax 快取控制
  ajaxCache = false,
  // Ajax 自動翻頁
  ajaxPage = true,
  // 在新分頁中開啟本本
  newTabBook = true,
  // 隱藏黑名單
  hideBlackList = true,
  // Discord 聊天室
  enableWidgetBot = false,
  // 選單 - 名稱: '連結'
  custom = {
    menu: [{ 英文: '/language/english/' }, { 日文: '/language/japanese/' }, { 中文: '/language/chinese/' }],
  },
  // 開發模式
  debug = false
