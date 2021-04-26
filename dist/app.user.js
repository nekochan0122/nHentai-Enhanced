// ==UserScript==
// @name       nHentai-Enhanced
// @version    0.0.1
// @author     NekoChan
// @homepage   https://github.com/NekoChanTaiwan/nHentai-Enhanced
// @supportURL https://github.com/NekoChanTaiwan/nHentai-Enhanced/issues
// @match      https://nhentai.net/*
// @namespace  https://github.com/NekoChanTaiwan
// @license    MIT
// @grant      none
// @require    https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @require    https://cdn.jsdelivr.net/npm/clipboard@2.0.8/dist/clipboard.min.js
// @require    https://cdn.jsdelivr.net/npm/notyf@3.9.0/notyf.min.js
// @require    https://cdn.jsdelivr.net/gh/821938089/finder@2.0.0.1/finder.js
// ==/UserScript==

(()=>{"use strict";const e=window.$,t=!1,a=[{中文:"/language/chinese/"},{日文:"/language/japanese/"},{英文:"/language/english/"}];let o=null,s=!1,i=0,r=!1,c=new Notyf;function l(a){e(window).scroll((()=>{e(window).scrollTop()+e(window).height()>.75*e(document).height()&&!1===r&&function(a,o=null){switch(i++,a){case"homepage":o=".index-container:nth-child(4)";break;case"page":case"span":o=".index-container"}r=!0,d(`第${i}頁 讀取中`),e.ajax({type:"GET",url:`${location.href}/?page=${i}`,cache:t,dataType:"html",success:t=>{d(`第${i}頁 讀取成功`);let a=e("<div></div>");e(o).append(a.html(t.replaceAll("data-src","src")).find(".gallery")),h(),s&&n.install_blacklisting(),d("隱藏黑名單 已關閉"),r=!1},error:()=>{d(`第${i}頁 讀取失敗`),c.dismissAll(),c.error(`第${i}頁 讀取失敗`),i--,r=!1}})}(a)}))}function h(){e(".gallery > a").attr("target","_blank")}function p(t,n){switch(t){case"homepage":n=".index-container.index-popular";break;case"page":n="#content > div";break;case"span":n=".container.index-container"}e("#content > section").insertBefore(n),e("#content > section > div").remove()}function d(e){console.log(e)}function f(t,n){e(t)[0]?e(t).html(n):d(`修改 HTML 失敗，選擇器：${t}`)}function g(e,t=e.length){for(let n=0;n<t;n++){const t=e.eq(n),a=t.html();o.Tags.hasOwnProperty(a)&&(d(`偵測到：${a}，更改為：${o.Tags[a]}`),t.html(o.Tags[a]).parent().attr("title",a))}}function u(e){const t=o.Book.Time,n=["years","year","months","month","weeks","days","day","hours","hour","minutes","minute","seconds","second","ago"];for(let a=0,o=n.length;a<o;a++)e=e.replace(n[a],t[n[a]]);return e}function m(t,n){!function(t,n){t=function(e){let t=[],n=0,a=e.slice(),o=0;for(const s of e){let e=s.matchAll(/nth\-child\((\d+):(\d+)\)/g);e=Array.from(e),e.length&&(n<e.length&&(n=e.length),a.splice(o,1),o--,t.push(s)),o++}return t.length?a.concat(b(t,n)):e}(t);for(const a of t)for(const t of e(a)){const a=e(t);a.text().trim()in n&&a.html(n[a.text().trim()])}}(function(t=[],n){let a=e("body").clone(),o=[];d("自動獲取 CSS 過濾的元素："+(t=[...t,"#messages",".notyf",".notyf-announcer",".gallery",".thumbs","#comment-container"]));for(const n of t)e(n,a).remove();return e("*",a).each((function(){if(0==e("*",this).length){const e=this.textContent?.trim();if(!e)return;e in n&&o.push(finder(this))}})),o}(t,n),n)}function b(e,t){let n=0,a=e.slice();for(const t of e){let e=t.matchAll(/nth\-child\((\d+):(\d+)\)/g);e=Array.from(e);let[o,s]=[+e[0][1],+e[0][2]];a.splice(n,1),n--;for(let t=0;t<s-o+1;t++)a.push(e[0].input.replace(`${o}:${s}`,""+(o+t)));n++}return--t?b(a,t):a}function $(){d("偵測到本本");const n=e("#gallery_id").hide().text().replace("#","");e(e(`<h3 class="title"><span class="before">神的語言：</span><a id="book_id" class="god" data-clipboard-text="${n}" href="javascript:;">${n}</a></h3>`)).insertAfter("#gallery_id");const a=new ClipboardJS(".god");a.on("success",(e=>{d(`操作：${e.action}, 文字：${e.text}, 觸發：${e.trigger}`),c.dismissAll(),c.success("複製成功"),e.clearSelection()})),a.on("error",(e=>{d(`操作：${e.action}, 觸發：${e.trigger}`),c.dismissAll(),c.error("復製失敗")}));for(let t=1,n=Object.keys(o.Book.TagsName).length,a="";t<=n;t++)a=e(`#tags > .tag-container:nth-child(${t}) > span`)[0].outerHTML,f(`#tags > .tag-container:nth-child(${t})`,`${o.Book.TagsName[Object.keys(o.Book.TagsName).sort(((e,t)=>e-t))[t-1]]} ${a}`);g(e("#tags > .tag-container .tags a .name")),e("#download").hide(),e("#info > .buttons").prepend(`<a href="/g/${n}/1/?onePageMode=True" class="btn btn-primary"><i class="fas fa-book-open"></i> ${o.Book.Btns.Read}</a>`);let i=2===e("#info .title").length?`${e("#info .title:nth-child(1) > .pretty").text()}`:3===e("#info .title").length?`${e("#info .title:nth-child(2) > .pretty").text()}`:null,r=3===e("#info .title").length?`${e("#info .title:nth-child(1) > .pretty").text()}`:null,l="",p=0,b=i.split(" "),$=1===b.length?b.length:b.length-1,y=["Ch.","Ep.","第","話","券","前篇","中篇","後篇","+","-","#"],k=[" ","「","」"];for(let e=0;e<$;e++)l+=`${b[e]}+`;!function n(a,s=!0){function i(e,t=""){for(let n=0,o=e.length;n<o;n++)a=a.replaceAll(e[n],t)}3!=p&&(p++,s&&(a=a.replace(/[0-9]+/g,""),i(y),i(k,"+")),e.ajax({type:"GET",url:`/search/?q=${a}`,cache:t,dataType:"html",success:t=>{d(`搜尋 ${a} 讀取成功`);let s=e("<div></div>"),i=Number(s.html(t).find("#content > h1").text().replace("results","")),c=/69696969/.test(t.replace(r,"69696969"));if(d(`搜尋 結果數量：${i}`),i>0&&c)d("完美搜尋結果"),h(a,i);else switch(p){case 1:3===e("#info .title").length?n(r,i):(d("跳過搜尋 searchText2 ，搜尋 searchText3"),n(l,!1));break;case 2:i>0&&c?(d("完美搜尋結果"),h(a,i)):n(l,!1);break;case 3:d("勉強搜尋結果"),h(a,i)}function h(t,n,a=o.Book.Btns){const s=0===n?a.Nothing:a.SerachRelatedBook;e("#serachRelatedBookBtn").css("cursor","pointer").attr("href",`/search/?q=${t}`).html(`<i class="fas fa-search"></i> ${s} (<span>${n}</span>)`)}},error:()=>{d(`搜尋 ${a} 讀取失敗`)}}))}(i),e("#info > .buttons").append(`<a id="serachRelatedBookBtn" class="btn btn-secondary" href="javascript:;" style="cursor: wait;"><i class="fas fa-search"></i> ${o.Book.Btns.Searching}</a>`),e(".thumb-container").length>75&&(f("#show-more-images-button",`<i class="fa fa-eye"></i> &nbsp; <span class="text">${o.Book.ShowMoreImagesButton}</span>`),f("#show-all-images-button",`<i class="fa fa-eye"></i> &nbsp; <span class="text">${o.Book.ShowAllImagesButton}</span>`)),h(),s?e("#comment_form > textarea").attr("placeholder",`${o.Book.CommentFormPlaceHolder}`):f("#comment-post-container > div > p",`<a class="login-comment" href="/login/">${o.Book.NoLogin.Login}</a> ${o.Book.NoLogin.Or} <a class="login-comment" href="/register/">${o.Book.NoLogin.Register}</a> ${o.Book.NoLogin.ToPostAComment}`),m(["i","nav"],o.NewBook),f("time",u(e("time").html())),e("time").bind("DOMNodeInserted",(function(){let e=u(this.innerHTML);this.innerHTML!==e&&(this.innerHTML=e,d(`偵測到時間發生變化：${this.innerHTML}`))}))}function y(){d("偵測到首頁"),m(["i","nav"],o.Homepage),h(),d("自動翻頁 已開啟"),p("homepage"),i=1,l("homepage")}function k(){d("偵測到頁面列表"),h(),d("自動翻頁 已開啟"),p("page"),i=Number(location.href.split("=")[1]),l("page")}function w(){d("偵測到閱讀本本中"),/onePageMode=True/.test(location.href)?function(){d("自動翻頁 已開啟");let n=location.href.split("/"),a=Number(n[n.length-2]),o=Number(e("span.num-pages").eq(1).text()),s=n[n.length-3],i=1,r=new IntersectionObserver((t=>{t.forEach((t=>{t.isIntersecting&&(i=Number(e(t.target).attr("id").replace("page","")),f("span.current",i))}))}),{root:null,rootMargin:"0px",threshold:[0,1]});function l(t){e("html, body").animate({scrollTop:e(`#page${t}`).offset().top},"fast")}e("nav, #messages, #image-container, .reader-bar:last, .reader-settings, .reader-pagination").hide(),e(".reader-bar").append(`<div style="display:flex;align-self:flex-center;position:absolute;left:50%;transform:translateX(-50%)"><button class="page-number btn btn-unstyled"><span class="current">0</span><span class="divider">&nbsp;/&nbsp;</span><span class="num-pages">${o}</span></button></div>`),e(".reader-bar").eq(0).css({opacity:"0",position:"fixed",top:"0",width:"100%","z-index":"999999"}).hover((function(){e(this).animate({opacity:"1.0"},100)}),(function(){e(this).animate({opacity:"0"},100)})),e(window).keyup((t=>{switch(e(".reader-pagination > a").remove(),t.code){case"ArrowRight":i++,i<=o?l(i):i--;break;case"ArrowLeft":i--,i>=1?l(i):i++}})),function n(i){i>o?c.success("全部讀取完畢"):e.ajax({type:"GET",url:`/g/${s}/${i}/`,cache:t,dataType:"html",success:t=>{d(`第 ${i} 張 讀取成功`);let o=e("<div></div>");e("#content").append(o.html(t).find("#image-container > a > img").attr("id",`page${i}`).css({display:"block",margin:"0px auto"})),i==a&&l(a),r.observe(e(`#page${i}`)[0]),n(i+1)},error:()=>{d(`第 ${i} 張 讀取失敗`),c.dismissAll(),c.error(`第 ${i} 張 讀取失敗`),n(i)}})}(1)}():d("自動翻頁 已關閉")}function v(){d("偵測到 span 頁面"),m(["nav"],o.NewSpanPage),g(e("#content > h1 > a > .name")),p("span"),i=1==location.href.split("=").length?1:Number(link[1]),l("span")}e("nav, #content").hide(),e((()=>{const i=()=>{e.ajax({type:"GET",url:"//raw.githubusercontent.com/NekoChanTaiwan/nHentai-Enhanced/main/locales/zh_TW.json?flush_cache=True",cache:t,dataType:"json",success:t=>{d("JSON 讀取成功"),o=t,function(){if(e("head").append('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/notyf@3.9.0/notyf.min.css">'),e('nav[role="navigation"]')[0])try{!function(t,i=e("nav")){d("偵測到導航欄"),i.css({position:"sticky",top:"0",width:"100%","z-index":"999999"}),e(window).scroll((()=>pageYOffset>150?i.css({position:"fixed"}):i.css({position:"sticky"}))),m(["#content","i"],o.Menu),s=Object.keys(n.options.user).length,e(".menu.right").prepend('\n    <li class="desktop "><a target="_blank" href="https://github.com/NekoChanTaiwan/nHentai-downloader/releases/latest"><i class="fas fa-download"></i> &nbsp nHentai-downloader</a></li>\n    <li class="desktop "><a target="_blank" href="https://discord.gg/ekbWahg52h"><i class="fab fa-discord"></i> &nbsp Discord - nHentai-Enhanced</a></li>'),e("input[type=search]").attr({autocomplete:"off",placeholder:""}),function(t,n=t.length){for(let a=0;a<n;a++)d(`新增自定選單：${Object.keys(t[a])[0]} 連結：${Object.values(t[a])[0]}`),e(".menu.left").append(`<li class="desktop "><a href="${Object.values(t[a])[0]}">${Object.keys(t[a])[0]}</a></li>`)}(a),t()}((function(t={}){const a=(e,n,a)=>t[e]={condition:n,func:a};a("主頁",e("#content .index-popular")[0],y),a("頁面列表",e(".index-container")[0]&&/net\/\?page=/.test(location.href),k),a("本本",e("#tags")[0],$),a("閱讀模式",e("#image-container")[0],w),a("span 頁面",e("#content > h1 > span")[0],v);for(let e of Object.keys(t))if(d(`正在偵測頁面：${e}`),t[e].condition){t[e].func();break}e("#content").show(),d("隱藏黑名單 已關閉"),d("Discord 聊天室 已關閉"),d("阻擋廣告 已開啟"),e(".advertisement").hide(),n.ads=null})),e("nav").show()}catch(e){d("初始化失敗："+e),c.error("nHentai-Enhanced 初始化失敗："+e)}else d('nav 初始化失敗，找不到指定的元素：nav[role="navigation"]'),e("nav, #content").show()}()},error:()=>{d("JSON 讀取失敗 3 秒後重新讀取"),setTimeout((()=>i()),3e3)}})};i()}))})();