import { debugConsole, galleryBlank, hideBlackListFunc } from './'
import { ajaxCache, hideBlackList } from '../config'
import { loadingPage, currentPageNum, login } from '../variable'

/**
 * 觸發 ajaxNextPage 的滾動事件
 * @param {string} mode - 'homepage', 'page', 'span'
 */
export function scrollEventAjax(mode) {
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
function ajaxNextPage(mode, selector = null) {
  currentPageNum++

  // 判斷當前模式 選擇正確的元素
  switch (mode) {
    case 'homepage':
      selector = '.index-container:nth-child(4)'
      break
    case 'page':
    case 'span':
      selector = '.index-container'
      break
  }

  loadingPage = true

  debugConsole(`第${currentPageNum}頁 讀取中`)

  $.ajax({
    type: 'GET',
    url: `${location.href}/?page=${currentPageNum}`,
    cache: ajaxCache,
    dataType: 'html',
    success: data => {
      debugConsole(`第${currentPageNum}頁 讀取成功`)

      // 創建元素
      let newHtml = $('<div></div>')

      // 格式化 HTML字符串，插入元素
      $(selector).append(newHtml.html(data.replaceAll('data-src', 'src')).find('.gallery'))

      // 將目前項目連結 改為新分頁開啟
      galleryBlank()

      // 處理 黑名單 class
      login ? _n_app.install_blacklisting() : null

      // 隱藏黑名單
      hideBlackListFunc()

      loadingPage = false
    },
    error: () => {
      debugConsole(`第${currentPageNum}頁 讀取失敗`)

      notyf.dismissAll()
      notyf.error(`第${currentPageNum}頁 讀取失敗`)

      currentPageNum--

      loadingPage = false
    },
  })
}
