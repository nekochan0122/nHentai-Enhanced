import { $, custom } from '../config'
import { json, login } from '../variable'
import { debugConsole, translatePlus } from '../utils/'

/**
 * nav 導航
 * @param {callback} callback
 */
export function nav(callback, nav = $('nav')) {
  debugConsole('偵測到導航欄')

  // 翻譯選單
  translatePlus(['#content', 'i'], json.Menu)

  // 檢測是否有登入
  login = Object.keys(_n_app.options.user).length
  // login = false // debug
  // console.log(_n_app)

  // 通知 樣式
  $('.alert, .announcement').css({ 'max-width': '90rem', margin: '1rem auto' })

  // 搜尋欄 樣式
  $('input[type=search]').attr({ autocomplete: 'off', placeholder: '' })

  // nav 樣式
  nav.css({ position: 'sticky', top: '0', width: '100%', 'z-index': '999999' })

  // nav 滾動事件
  $(window).scroll(() => (pageYOffset > 150 ? nav.css({ position: 'fixed' }) : nav.css({ position: 'sticky' })))

  // 左側自訂選單
  customMenu(custom.menu)

  callback()

  /**
   * 左側自定選單
   * @param {array} menu - 一個包含物件選單的陣列，鍵名為連結名稱，鍵值為連結
   * @param {number} len - 該參數不必傳遞，用於變量聲明
   */
  function customMenu(menu, len = menu.length) {
    for (let i = 0; i < len; i++) {
      debugConsole(`新增自定選單：${Object.keys(menu[i])[0]} 連結：${Object.values(menu[i])[0]}`)
      $('.menu.left').prepend(
        `<li class="desktop "><a href="${Object.values(menu[i])[0]}">${Object.keys(menu[i])[0]}</a></li>`
      )
    }
  }
}
