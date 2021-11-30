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

(()=>{"use strict";const e=window.$,t=!1,n=[{英文:"/language/english/"},{日文:"/language/japanese/"},{中文:"/language/chinese/"}];let a=null,o=!1,s=0,i=!1,r=new Notyf;function c(e,t){$(e)[0]&&$(e).html(t)}function l(e){let t=null;switch(e){case"homepage":t="#content > div.container.index-container.index-popular";break;case"page":t="#content > div";break;case"span":t=".container.index-container"}$("#content > section").insertBefore(t),$("#content > section > div").remove()}function d(){$(".gallery > a").attr("target","_blank")}function h(){o&&$(".blacklisted").remove()}function p(e){$(window).scroll((()=>{$(window).scrollTop()+$(window).height()>.75*$(document).height()&&!1===i&&function(e,n=null){switch(s++,e){case"homepage":n=".index-container:nth-child(4)";break;case"page":case"span":n=".index-container"}i=!0,$.ajax({type:"GET",url:`${location.href}/?page=${s}`,cache:t,dataType:"html",success:e=>{let t=$("<div></div>");$(n).append(t.html(e.replaceAll("data-src","src")).find(".gallery")),d(),o&&_n_app.install_blacklisting(),h(),i=!1},error:()=>{notyf.dismissAll(),notyf.error(`第${s}頁 讀取失敗`),s--,i=!1}})}(e)}))}function f(e,t=e.length){for(let n=0;n<t;n++){const t=e.eq(n),o=t.html();a.Tags.hasOwnProperty(o)&&(a.Tags[o],t.html(a.Tags[o]).parent().attr("title",o))}}function u(e){const t=a.Book.Time,n=["years","year","months","month","weeks","days","day","hours","hour","minutes","minute","seconds","second","ago"];for(let a=0,o=n.length;a<o;a++)e=e.replace(n[a],t[n[a]]);return e}function g(e,t){const n=function(e=[],t){let n=$("body").clone(),a=[];e=[...e,"script","#messages",".notyf",".notyf-announcer",".gallery",".thumbs","#comment-container"];for(const t of e)$(t,n).remove();return $("*",n).each((function(){let e=$("*",this);if(0==e.length){let o=e.prevObject.text().trim();if(!o)return;o in t&&a.push(finder(e.prevObject[0],{root:n[0]}))}else for(const e of $(this))for(const o of e.childNodes)"#text"===o.nodeName&&o.nodeValue.trim()in t&&a.push(finder(e,{root:n[0]}))})),a}(e,t);!function(e,t){e=function(e){let t=[],n=0,a=e.slice(),o=0;for(const s of e){let e=s.matchAll(/nth\-child\((\d+):(\d+)\)/g);e=Array.from(e),e.length&&(n=n<e.length?e.length:n,a.splice(o,1),o--,t.push(s)),o++}return t.length?a.concat(m(t,n)):e}(e);for(const n of e)for(const e of $(n)){const n=$(e);if(n.html().trim()in t)n.html(t[n.text().trim()]);else for(const e of n[0].childNodes)"#text"==e.nodeName&&e.nodeValue.trim()in t&&(e.data=t[e.nodeValue.trim()])}}(n,t)}function m(e,t){let n=0,a=e.slice();for(const t of e){let e=t.matchAll(/nth\-child\((\d+):(\d+)\)/g);e=Array.from(e);let[o,s]=[+e[0][1],+e[0][2]];a.splice(n,1),n--;for(let t=0,n=s-o+1;t<n;t++)a.push(e[0].input.replace(`${o}:${s}`,""+(o+t)));n++}return--t?m(a,t):a}function b(){e(".alert, .announcement").remove();const n=e("#gallery_id").hide().text().replace("#","");e(e(`<h3 class="title"><span class="before">神的語言：</span><a id="book_id" class="god" data-clipboard-text="${n}" href="javascript:;">${n}</a></h3>`)).insertAfter("#gallery_id");const s=new ClipboardJS(".god");s.on("success",(e=>{e.action,e.text,e.trigger,r.dismissAll(),r.success("複製成功"),e.clearSelection()})),s.on("error",(e=>{e.action,e.trigger,r.dismissAll(),r.error("復製失敗")}));for(let t=1,n=Object.keys(a.Book.TagsName).length,o="";t<=n;t++)o=e(`#tags > .tag-container:nth-child(${t}) > span`)[0].outerHTML,c(`#tags > .tag-container:nth-child(${t})`,`${a.Book.TagsName[Object.keys(a.Book.TagsName).sort(((e,t)=>e-t))[t-1]]} ${o}`);f(e("#tags > .tag-container .tags a .name")),e("#download").hide(),e("#info > .buttons").prepend(`<a href="/g/${n}/1/?onePageMode=True" class="btn btn-primary"><i class="fas fa-book-open"></i> ${a.Book.Btns.Read}</a>`);let i=2===e("#info .title").length?`${e("#info .title:nth-child(1) > .pretty").text()}`:3===e("#info .title").length?`${e("#info .title:nth-child(2) > .pretty").text()}`:null,l=3===e("#info .title").length?`${e("#info .title:nth-child(1) > .pretty").text()}`:null,h="",p=0,m=i.split(" "),b=1===m.length?m.length:m.length-1,y=["Ch.","Ep.","第","話","券","前篇","中篇","後篇","+","-","#"],$=[" ","「","」"];for(let e=0;e<b;e++)h+=`${m[e]}+`;!function n(o,s=!0){function i(e,t=""){for(let n=0,a=e.length;n<a;n++)o=o.replaceAll(e[n],t)}3!=p&&(p++,s&&(o=o.replace(/[0-9]+/g,""),i(y),i($,"+")),e.ajax({type:"GET",url:`/search/?q=${o}`,cache:t,dataType:"html",success:t=>{let s=e("<div></div>"),i=Number(s.html(t).find("#content > h1").text().replace("results","")),r=/69696969/.test(t.replace(l,"69696969"));if(i>0&&r)c(o,i);else switch(p){case 1:3===e("#info .title").length?n(l,i):n(h,!1);break;case 2:i>0&&r?c(o,i):n(h,!1);break;case 3:c(o,i)}function c(t,n,o=a.Book.Btns){const s=0===n?o.Nothing:o.SerachRelatedBook;e("#serachRelatedBookBtn").css("cursor","pointer").attr("href",`/search/?q=${t}`).html(`<i class="fas fa-search"></i> ${s} (<span>${n}</span>)`)}},error:()=>{}}))}(i),e("#info > .buttons").append(`<a id="serachRelatedBookBtn" class="btn btn-secondary" href="javascript:;" style="cursor: wait;"><i class="fas fa-search"></i> ${a.Book.Btns.Searching}</a>`),d(),o?e("#comment_form > textarea").attr("placeholder",`${a.Book.CommentFormPlaceHolder}`):c("#comment-post-container > div > p",`<a class="login-comment" href="/login/">${a.Book.NoLogin.Login}</a> ${a.Book.NoLogin.Or} <a class="login-comment" href="/register/">${a.Book.NoLogin.Register}</a> ${a.Book.NoLogin.ToPostAComment}`),g(["i","nav"],a.NewBook),c("time",u(e("time").html())),e("time").bind("DOMNodeInserted",(function(){let e=u(this.innerHTML);this.innerHTML!==e&&(this.innerHTML=e,this.innerHTML)}))}function y(){g(["i","nav"],a.Homepage),d(),l("homepage"),s=1,p("homepage")}function k(){$(".alert, .announcement").remove(),d(),l("page"),s=Number(location.href.split("=")[1]),p("page")}function v(){e(".alert, .announcement").remove(),/onePageMode=True/.test(location.href)&&function(){let n=location.href.split("/"),a=Number(n[n.length-2]),o=Number(e("span.num-pages").eq(1).text()),s=n[n.length-3],i=1,l=new IntersectionObserver((t=>{t.forEach((t=>{t.isIntersecting&&(i=Number(e(t.target).attr("id").replace("page","")),c("span.current",i))}))}),{root:null,rootMargin:"0px",threshold:[0,1]});function d(t){e("html, body").animate({scrollTop:e(`#page${t}`).offset().top},"fast")}e("nav, #messages, #image-container, .reader-bar:last, .reader-settings, .reader-pagination").hide(),e(".reader-bar").append(`<div style="display:flex;align-self:flex-center;position:absolute;left:50%;transform:translateX(-50%)"><button class="page-number btn btn-unstyled"><span class="current">0</span><span class="divider">&nbsp;/&nbsp;</span><span class="num-pages">${o}</span></button></div>`),e(".reader-bar").eq(0).css({opacity:"0",position:"fixed",top:"0",width:"100%","z-index":"999999"}).hover((function(){e(this).animate({opacity:"1.0"},100)}),(function(){e(this).animate({opacity:"0"},100)})),e(window).keyup((t=>{switch(e(".reader-pagination > a").remove(),t.code){case"ArrowRight":i++,i<=o?d(i):i--;break;case"ArrowLeft":i--,i>=1?d(i):i++}})),function n(i){i>o?r.success("全部讀取完畢"):e.ajax({type:"GET",url:`/g/${s}/${i}/`,cache:t,dataType:"html",success:t=>{let o=e("<div></div>");e("#content").append(o.html(t).find("#image-container > a > img").attr("id",`page${i}`).css({display:"block",margin:"0px auto"})),i==a&&d(a),l.observe(e(`#page${i}`)[0]),n(i+1)},error:()=>{r.dismissAll(),r.error(`第 ${i} 張 讀取失敗`),n(i)}})}(1)}()}function w(){}function x(){e(".alert, .announcement").remove(),g(["nav"],a.NewSpanPage),f(e("#content > h1 > a > .name")),l("span"),s=1==location.href.split("=").length?1:Number(link[1]),p("span")}document.body.style.display="none",e((()=>{const s=()=>{e.ajax({type:"GET",url:"//raw.githubusercontent.com/NekoChanTaiwan/nHentai-Enhanced/main/locales/zh_TW.json?flush_cache=True",cache:t,dataType:"json",success:t=>{a=t,function(){if(e("head").append('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/notyf@3.9.0/notyf.min.css">'),e('nav[role="navigation"]')[0]){function t(){let t={};const n=(e,n,a)=>t[e]={condition:n,func:a};n("主頁",e("#content .index-popular")[0],y),n("頁面列表",e(".index-container")[0]&&/net\/\?page=/.test(location.href),k),n("本本",e("#tags")[0],b),n("閱讀模式",e("#image-container")[0],v),n("搜尋頁面",e("#content .fa-search")[0],w),n("span 頁面",e("#content > h1 > span")[0],x);for(let e of Object.keys(t))if(t[e].condition){t[e].func();break}h(),function(){const e=document.createElement("script");e.defer=!0,e.async=!0,e.src="https://cdn.jsdelivr.net/npm/@widgetbot/crate@3",e.text="\n      new Crate({\n          server: '914714807519825940',\n          channel: '914864192115335188'\n      })\n      ",document.head.appendChild(e)}()}try{!function(t,s=e("nav")){g(["#content","i"],a.Menu),o=Object.keys(_n_app.options.user).length,e(".alert, .announcement").css({"max-width":"90rem",margin:"1rem auto"}),e("input[type=search]").attr({autocomplete:"off",placeholder:""}),s.css({position:"sticky",top:"0",width:"100%","z-index":"999999"}),e(window).scroll((()=>pageYOffset>150?s.css({position:"fixed"}):s.css({position:"sticky"}))),function(t,n=t.length){for(let a=0;a<n;a++)Object.keys(t[a])[0],Object.values(t[a])[0],e(".menu.left").prepend(`<li class="desktop "><a href="${Object.values(t[a])[0]}">${Object.keys(t[a])[0]}</a></li>`)}(n),e(".menu.right").prepend('\n    <li class="desktop "><a target="_blank" href="https://github.com/NekoChanTaiwan/nHentai-downloader/releases/latest"><i class="fas fa-download"></i> &nbsp nHentai-downloader</a></li>\n    <li class="desktop "><a target="_blank" href="https://nekochantaiwan.github.io/HMX-11/"><i class="fab fa-discord"></i> &nbsp  HMX-11</a></li>'),t()}(t),r.success("nHentai-Enhanced 初始化成功")}catch(e){r.error("nHentai-Enhanced 初始化失敗："+e)}}else r.error("nHentai-Enhanced nav 初始化失敗");document.body.style.display=""}()},error:()=>{setTimeout((()=>s()),3e3)}})};s()}))})();