//模块化
export { PageTranslator }

class PageTranslator {
    constructor() {
        this.$ = window.$ //传入jQuery
    }
    Translate(CssSelectors, toTransRules) {
        CssSelectors = this._CssNthChildLoader(CssSelectors)
        for (const CssSelector of CssSelectors) {
            for (const Single of this.$(CssSelector)) {
                const Tag = this.$(Single)
                if (Tag.text() in toTransRules) {
                    Tag.html(toTransRules[Tag.text()])
                }
            }
        }
    }
    GetTransList(CssSelectors, toTransRules, Translated = false) {
        if (Translated) {
            let NewtoTransRules = this._objectFlip(toTransRules)
            this.Translate(CssSelectors, NewtoTransRules)
        }

        CssSelectors = this._CssNthChildLoader(CssSelectors)
        let NativeTextArray = Object.assign({}, toTransRules)

        for (const CssSelector of CssSelectors) {
            for (const Single of this.$(CssSelector)) {
                if (this.$(Single).text() in toTransRules) {
                    NativeTextArray[this.$(Single).text()] = toTransRules[this.$(Single).text()]
                } else {
                    NativeTextArray[this.$(Single).text()] = ''
                }
            }
        }
        if (Translated) {
            this.Translate(CssSelectors, toTransRules)
        }

        this._copyToClipboard(JSON.stringify(NativeTextArray))
    }
    GetPageTransSelectors(IgnoreCssSelectors, NativeTextFilters, onlyVisable = true) {
        let PageTransSelectors = []
        for (const CssSelector of IgnoreCssSelectors) {
            this.$(CssSelector).remove()
        }
        const Selector = onlyVisable ? 'body *:visible' : 'body *'

        this.$(Selector).each(function () {
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
        console.log(PageTransSelectors)
        this._copyToClipboard(JSON.stringify(PageTransSelectors))
    }

    _CssNthChildLoader(CssSelectors) {
        q
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

        return NewCssSelectors.concat(this._CssNthChildProcess(TargetSelectors, RecursionCount))
    }
    _CssNthChildProcess(CssSelectors, RecursionCount) {
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
            return this._CssNthChildProcess(NewCssSelectors, RecursionCount)
        }
    }

    _copyToClipboard(s) {
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
    _objectFlip(obj) {
        //From https://stackoverflow.com/questions/23013573/swap-key-with-value-json
        return Object.keys(obj).reduce((ret, key) => {
            ret[obj[key]] = key
            return ret
        }, {})
    }
}
