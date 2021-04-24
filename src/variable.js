// 預先定義全局變量

export let json = null,

    // 登入狀態
    login = false,

    // 當前頁數
    currentPageNum = 0,

    // 是否正再讀取頁面
    loadingPage = false,

    // 初始化 Notyf
    notyf = new Notyf()