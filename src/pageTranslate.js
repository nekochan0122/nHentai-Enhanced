//模块化
export { TranslatePlus }

/**
 * 页面翻译\
 * 通过CSS选择器获得元素内容作为翻译规则的键，再用键查找翻译规则对象中的值替换网页中的内容\
 * 流程（不准确）：CSS选择器 => 文本\
 * 也就是说是用CSS选择器选择网页元素内容，替换为目标值
 * @param {Array} CssSelectors - 要翻译的网页内容所对应的元素的选择器数组 成员是CSS选择器
 * @param {Object} toTransRules - 翻译规则对象
 * @param {Object} key - 未翻译的内容 也可以说是选择器再网页上选到的文本内容
 * @param {Object} value - 已翻译的内容 也可以说是将要作为替换的文本
 */
 function Translate(CssSelectors, toTransRules) {
    CssSelectors = _CssNthChildLoader(CssSelectors)
    for (const CssSelector of CssSelectors) {
        for (const Single of $(CssSelector)) {
            const Tag = $(Single)
            if (Tag.text().trim() in toTransRules) {
                Tag.html(toTransRules[Tag.text().trim()])
            }
        }
    }
}
/**
 * 页面翻译威力加强版（比较慢）\
 * 使用函数在网页元素中查找翻译规则中的键，替换为翻译规则的值\
 * 流程（不准确）：文本 => CSS选择器 , CSS选择器 => 文本
 * @param也就是说是使用函数替换网页元素内容
 * @param {Array} IgnoreCssSelectors - 要删除的网页内容 | 也可以说是要忽略的元素的CSS选择器数组 成员是CSS选择器
 * @param {Object} toTransRules - 翻译规则对象
 * @param {Object} key - 未翻译的内容 | 也可以说是要替换的内容
 * @param {Object} value - 已翻译的内容 | 也可以说是将要作为替换的内容
 */
function TranslatePlus(IgnoreCssSelectors, toTransRules) {
    const PageTransSelectors = GetPageTransSelectors(IgnoreCssSelectors, toTransRules)
    Translate(PageTransSelectors, toTransRules)
}
/**
 * 调试函数：用于获取CssSelectors选中的所有网页元素内容，这将作为翻的译规则对象中键\
 * 流程：CSS选择器 => 文本\
 * 也就是说是使用CSS选择器查找网页元素内容，并且进行收集进而得到一个对象\
 * ！！注意：函数执行完成后结果将会在剪贴板中写入
 * @param {Array} CssSelectors - 要翻译的网页元素内容的选择器数组 成员是CSS选择器
 * @param {Object} toTransRules - 翻译规则对象 （选填） 填了将会合并原有规则
 * @param {Object} key - 未翻译的内容 | 也可以说是选择器在网页上选到的文本内容
 * @param {Object} value - 已翻译的内容 | 也可以说是将要作为替换的文本
 * @param {Boolean} Translated - 网页是否已经翻译 参数填true将会使用翻译规则对象先进行反向翻译再获取翻译规则列表再翻译回去
 */
function GetTransList(CssSelectors, toTransRules, Translated = false) {
    if (Translated) {
        let NewtoTransRules = _objectFlip(toTransRules)
        Translate(CssSelectors, NewtoTransRules)
    }

    CssSelectors = _CssNthChildLoader(CssSelectors)
    let NativeTextArray = Object.assign({}, toTransRules)

    for (const CssSelector of CssSelectors) {
        for (const Single of $(CssSelector)) {
            if ($(Single).text().trim() in toTransRules) {
                NativeTextArray[$(Single).text().trim()] = toTransRules[$(Single).text().trim()]
            } else {
                NativeTextArray[$(Single).text().trim()] = ''
            }
        }
    }
    if (Translated) {
        Translate(CssSelectors, toTransRules)
    }

    _copyToClipboard(JSON.stringify(NativeTextArray))
}
/**
 * 在网页中查找含有未翻译内容的元素并生成该元素的CSS选择器，保存成一个数组\
 * 流程：文本 => CSS选择器\
 * 也可以说是通过文本在网页中查找含有该页面元素内容的选择器
 * @param {Array} IgnoreCssSelectors - 要删除的网页内容 | 也可以说是要忽略的元素的CSS选择器数组 成员是CSS选择器
 * @param {Object} NativeTextFilters - 要翻译的内容对象 | 也可以说是网页元素含有的内容的对象
 * @param {Object} key - 未翻译的内容 | 也可以说是被选中的网页元素的内容 ！！不需要值
 * @returns {Array} 未翻译内容 通过key在网页中查找到的CSS选择器数组
 */
function GetPageTransSelectors(IgnoreCssSelectors = [], NativeTextFilters) {
    let BodyClone = $('body').clone()
    let PageTransSelectors = []
    for (const CssSelector of IgnoreCssSelectors) {
        $(CssSelector, BodyClone).remove()
    }

    $('*', BodyClone).each(function () {
        let Results = $('*', this)
        if (Results.length == 1) {
            const Text = Results.eq(0).text().trim()

            if (!Text) {
                return
            }

            if (Text in NativeTextFilters) {
                PageTransSelectors.push(window.finder(Results[0]))
            }
        }
    })
    return PageTransSelectors
}
/**
 * 内部函数，用于解析新增语法 nth-child(Start:End)
 * @param {Array} CssSelectors - 一个待处理的选择器数组
 * @returns 处理完毕的选择器数组
 */
function _CssNthChildLoader(CssSelectors) {
    let TargetSelectors = []
    let RecursionCount = 0
    let NewCssSelectors = CssSelectors.slice()
    let i = 0
    for (const CssSelector of CssSelectors) {
        let TestResults = CssSelector.matchAll(/nth\-child\((\d+):(\d+)\)/g)
        TestResults = Array.from(TestResults)
        if (TestResults.length) {
            if (RecursionCount < TestResults.length) {
                RecursionCount = TestResults.length
            }
            NewCssSelectors.splice(i, 1)
            i--

            TargetSelectors.push(CssSelector)
        }
        i++
    }

    if (!TargetSelectors.length) {
        return CssSelectors
    }

    return NewCssSelectors.concat(_CssNthChildProcess(TargetSelectors, RecursionCount))
}
/**
 * 内部函数：迭代处理CSS选择器新语法
 * @param {Array} CssSelectors - 未处理完的CSS选择器数组
 * @param {Number} RecursionCount - 迭代次数
 * @returns
 */
function _CssNthChildProcess(CssSelectors, RecursionCount) {
    let i = 0
    let NewCssSelectors = CssSelectors.slice()
    for (const CssSelector of CssSelectors) {
        let MatchResults = CssSelector.matchAll(/nth\-child\((\d+):(\d+)\)/g)
        MatchResults = Array.from(MatchResults)
        let [Start, End] = [+MatchResults[0][1], +MatchResults[0][2]]
        NewCssSelectors.splice(i, 1)
        i--
        for (let a = 0; a < End - Start + 1; a++) {
            NewCssSelectors.push(
                MatchResults[0].input.replace(`${Start}:${End}`, '' + (Start + a)) // only replace once
            )
        }
        i++
    }
    RecursionCount--
    if (!RecursionCount) {
        return NewCssSelectors
    } else {
        return _CssNthChildProcess(NewCssSelectors, RecursionCount)
    }
}
/**
 * 向剪贴板写入内容
 * @param {String} s - 要复制到剪贴板的内容
 */
function _copyToClipboard(s) {
    //From https://zhidao.baidu.com/question/1610338565580504947.html
    if (window.clipboardData) {
        window.clipboardData.setData('text', s)
    } else {
        ;(function (s) {
            document.oncopy = function (e) {
                e.clipboardData.setData('text', s)
                e.preventDefault()
                document.oncopy = null
            }
        })(s)
        document.execCommand('Copy')
    }
}
/**
 * 键值交换函数
 * @param {*} obj - 一个要交换键值的对象
 * @returns - 交换键值后的对象
 */
function _objectFlip(obj) {
    //From https://stackoverflow.com/questions/23013573/swap-key-with-value-json
    return Object.keys(obj).reduce((ret, key) => {
        ret[obj[key]] = key
        return ret
    }, {})
}
