/**
 * 更改 頁數選單 位置
 * @param {string} mode - 'homepage', 'page'
 */
export function changeNumPosition(mode) {
  let selector = null

  // 判斷當前模式 選擇正確的元素
  switch (mode) {
    case 'homepage':
      selector = '#content > div.container.index-container.index-popular'
      break
    case 'page':
      selector = '#content > div'
      break
    case 'span':
      selector = '.container.index-container'
  }

  $('#content > section').insertBefore(selector)

  // 移除不必要的元素
  $('#content > section > div').remove()
}
