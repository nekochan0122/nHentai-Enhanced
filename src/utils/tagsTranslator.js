import { debugConsole } from './'
import { json } from '../variable'

/**
 * 翻譯標籤
 * @param {object} tags - jQuery DOM .name
 */
export function tagsTranslator(tags, len = tags.length) {
  for (let i = 0; i < len; i++) {
    const tagE = tags.eq(i),
      tagName = tagE.html()
    // debugConsole(`發現標籤：${tagName}`)

    if (json.Tags.hasOwnProperty(tagName)) {
      debugConsole(`偵測到：${tagName}，更改為：${json.Tags[tagName]}`)

      tagE.html(json.Tags[tagName]).parent().attr('title', tagName)
    }
  }
}
