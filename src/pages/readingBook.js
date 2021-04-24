import {
    $,
    ajaxPage,
    ajaxChahe,
} from '../config.js'

import {
    notyf
} from '../variable.js'

import {
    debugConsole,
    $H,
} from '../utils'

/**
 * 閱讀本本中
 */
export function readingBook () {

    /onePageMode=True/.test(location.href) && ajaxPage ? ajaxPageFunc() : debugConsole('自動翻頁 已關閉')

    function ajaxPageFunc () {
        debugConsole('自動翻頁 已開啟')

        let cur = location.href.split('/'),
            curNum = Number(cur[cur.length - 2]),
            maxNum = Number($('span.num-pages').eq(1).text()),
            id = cur[cur.length - 3],
            curIdNum = 1,

            // 觀察者
            options = {
                root: null,
                rootMargin: '0px',
                threshold: [0,1.0]
            },
            callback = entries => {
                entries.forEach(entry => {
                    // 當畫面更改為其他頁數時
                    if (entry.isIntersecting) {
                        // 重新賦值當前頁數
                        curIdNum = Number($(entry.target).attr('id').replace('page', ''))
                        $H('span.current', curIdNum)
                    }
                })
            },
            observer = new IntersectionObserver(callback, options)

        // 隱藏不需要的元素
        $('nav, #messages, #image-container, .reader-bar:last, .reader-settings, .reader-pagination').hide()

        // 插入自訂版 reader-bar
        $('.reader-bar').append(`<div style="display:flex;align-self:flex-center;position:absolute;left:50%;transform:translateX(-50%)"><button class="page-number btn btn-unstyled"><span class="current">0</span><span class="divider">&nbsp;/&nbsp;</span><span class="num-pages">${maxNum}</span></button></div>`)

        // reader-bar css 及 隱藏/顯示 動畫效果
        $('.reader-bar').eq(0).css({'opacity': '0', 'position': 'fixed', 'top': '0', 'width': '100%', 'z-index': '999999'}).hover(
            function () { $(this).animate({'opacity':'1.0'}, 100) },
            function () { $(this).animate({'opacity':'0'}, 100) }
        )

        // 鍵盤事件
        $(window).keyup(event => {
            $('.reader-pagination > a').remove()

            switch (event.code) {
                case 'ArrowRight': // 下一張
                    curIdNum++
                    curIdNum <= maxNum ? scrollToPage(curIdNum) : curIdNum--
                    break

                case 'ArrowLeft': // 上一張
                    curIdNum--
                    curIdNum >= 1 ? scrollToPage(curIdNum) : curIdNum++
                    break

            }
        })

        // 開始讀取第一張
        nextImage(1)

        /**
         * 獲取下一張圖片
         * @param {number} target - 獲取的頁數
         */
        function nextImage (target) {
            if (target > maxNum) return

            $.ajax({
                type: 'GET',
                url: `/g/${id}/${target}/`,
                cache: ajaxChahe,
                dataType: 'html',
                success: data => {
                    debugConsole(`第 ${target} 張 讀取成功`)

                    let newHtml = $('<div></div>')

                    // 插入 元素
                    $('#content').append(newHtml.html(data).find('#image-container > a > img').attr('id', `page${target}`).css({'display': 'block', 'margin': '0px auto'}))

                    // 滾動至當前頁數
                    if (target == curNum) scrollToPage(curNum)

                    // 綁定目標
                    observer.observe($(`#page${target}`)[0])

                    // 讀取下一頁
                    nextImage(target + 1)

                },
                error: () => {
                    debugConsole(`第 ${target} 張 讀取失敗`)

                    notyf.dismissAll()
                    notyf.error(`第 ${target} 張 讀取失敗`)

                    // 重新讀取
                    nextImage(target)
                }
            })
        }

        /**
         * 滾動至頁數
         * @param {string} num - 元素 ID
         */
        function scrollToPage (num) {
            $('html, body').animate({
                scrollTop: $(`#page${num}`).offset().top
            }, 'fast')
        }

    }
}