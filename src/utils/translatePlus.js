/**
 * 页面翻译威力加强版（比较慢）\
 * 使用函数在网页元素中查找翻译规则中的键，替换为翻译规则的值\
 * 流程（不准确）：文本 => CSS选择器 , CSS选择器 => 文本\
 * 也就是说是使用函数替换网页元素内容
 * @param {Array} ignoreCssSelectors - 要删除的网页内容 | 也可以说是要忽略的元素的CSS选择器数组 成员是CSS选择器
 * @param {Object} toTransRules - 翻译规则对象
 *  key - 未翻译的内容 | 也可以说是要替换的内容
 *  value - 已翻译的内容 | 也可以说是将要作为替换的内容
 */
export function translatePlus(ignoreCssSelectors, toTransRules) {
  const pageTransSelectors = getPageTransSelectors(ignoreCssSelectors, toTransRules)
  translate(pageTransSelectors, toTransRules)
}

/**
 * 页面翻译\
 * 通过CSS选择器获得元素内容作为翻译规则的键，再用键查找翻译规则对象中的值替换网页中的内容\
 * 流程（不准确）：CSS选择器 => 文本\
 * 也就是说是用CSS选择器选择网页元素内容，替换为目标值
 * @param {Array} cssSelectors - 要翻译的网页内容所对应的元素的选择器数组 成员是CSS选择器
 * @param {Object} toTransRules - 翻译规则对象
 *  Key - 未翻译的内容 | 也可以说是要替换的内容
 *  value - 已翻译的内容 | 也可以说是将要作为替换的内容
 */
function translate(cssSelectors, toTransRules) {
  cssSelectors = _cssNthChildLoader(cssSelectors)
  for (const cssSelector of cssSelectors) {
    for (const Single of $(cssSelector)) {
      const tag = $(Single)

      if (tag.html().trim() in toTransRules) {
        tag.html(toTransRules[tag.text().trim()])
      } else {
        for (const node of tag[0].childNodes) {
          if (node.nodeName == '#text' && node.nodeValue.trim() in toTransRules) {
            node.data = toTransRules[node.nodeValue.trim()]
          }
        }
      }
    }
  }
}

/**
 * 在网页中查找含有未翻译内容的元素并生成该元素的CSS选择器，保存成一个数组\
 * 流程：文本 => CSS选择器\
 * 也可以说是通过文本在网页中查找含有该页面元素内容的选择器
 * @param {Array} ignoreCssSelectors - 要删除的网页内容 | 也可以说是要忽略的元素的CSS选择器数组 成员是CSS选择器
 * @param {Object} nativeTextFilters - 要翻译的内容对象 | 也可以说是网页元素含有的内容的对象
 *  key - 未翻译的内容 | 也可以说是被选中的网页元素的内容 ！！不需要值
 * @returns {Array} 未翻译内容 通过key在网页中查找到的CSS选择器数组
 */
function getPageTransSelectors(ignoreCssSelectors = [], nativeTextFilters) {
  let bodyClone = $('body').clone()
  let pageTransSelectors = []

  // 合併固定過濾的元素
  ignoreCssSelectors = [
    ...ignoreCssSelectors,
    ...[
      'script', //如果要移除这段代码，请保留这个
      '#messages',
      '.notyf',
      '.notyf-announcer',
      '.gallery',
      '.thumbs',
      '#comment-container',
    ],
  ]

  for (const cssSelector of ignoreCssSelectors) {
    $(cssSelector, bodyClone).remove()
  }

  $('*', bodyClone).each(function () {
    let results = $('*', this)
    if (results.length == 0) {
      let text = results.prevObject.text().trim()

      if (!text) return

      text in nativeTextFilters ? pageTransSelectors.push(finder(results.prevObject[0], { root: bodyClone[0] })) : null
    } else {
      for (const element of $(this)) {
        for (const node of element.childNodes) {
          if (node.nodeName === '#text' && node.nodeValue.trim() in nativeTextFilters) {
            pageTransSelectors.push(finder(element, { root: bodyClone[0] }))
          }
        }
      }
    }
  })

  return pageTransSelectors
}

/**
 * 内部函数，用于解析新增语法 nth-child(Start:End)
 * @param {Array} cssSelectors - 一个待处理的选择器数组
 * @returns 处理完毕的选择器数组
 */
function _cssNthChildLoader(cssSelectors) {
  let targetSelectors = []
  let recursionCount = 0
  let newCssSelectors = cssSelectors.slice()
  let i = 0

  for (const CssSelector of cssSelectors) {
    let testResults = CssSelector.matchAll(/nth\-child\((\d+):(\d+)\)/g)
    testResults = Array.from(testResults)
    if (testResults.length) {
      recursionCount = recursionCount < testResults.length ? testResults.length : recursionCount

      newCssSelectors.splice(i, 1)
      i--

      targetSelectors.push(CssSelector)
    }
    i++
  }

  if (!targetSelectors.length) return cssSelectors

  return newCssSelectors.concat(_cssNthChildProcess(targetSelectors, recursionCount))
}

/**
 * 内部函数：迭代处理CSS选择器新语法
 * @param {Array} cssSelectors - 未处理完的CSS选择器数组
 * @param {Number} recursionCount - 迭代次数
 * @returns
 */
function _cssNthChildProcess(cssSelectors, recursionCount) {
  let i = 0
  let newCssSelectors = cssSelectors.slice()

  for (const CssSelector of cssSelectors) {
    let matchResults = CssSelector.matchAll(/nth\-child\((\d+):(\d+)\)/g)
    matchResults = Array.from(matchResults)
    let [Start, End] = [+matchResults[0][1], +matchResults[0][2]]
    newCssSelectors.splice(i, 1)
    i--
    for (let a = 0, max = End - Start + 1; a < max; a++) {
      newCssSelectors.push(
        matchResults[0].input.replace(`${Start}:${End}`, '' + (Start + a)) // only replace once
      )
    }
    i++
  }

  recursionCount--

  if (!recursionCount) {
    return newCssSelectors
  } else {
    return _cssNthChildProcess(newCssSelectors, recursionCount)
  }
}
