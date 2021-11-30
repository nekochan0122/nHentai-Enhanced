import { newTabBook } from '../config'

/**
 * 將列表中的本本 改為新分頁開啟
 */
export function galleryBlank() {
  newTabBook ? $('.gallery > a').attr('target', '_blank') : null
}
