var alertList = {};
(function(){
    var constructor = function(selector){
        this.selector = selector;
        if(typeof this.selector === 'object'){
            this.selector = "#"+this.selector.id;
        }
        else if(selector.charAt(0) == "."){
            this.selector = selector.replaceAll(' ', '.');
        }        
        this.query = document.querySelectorAll(this.selector);
    };
    constructor.prototype = {
        on:function(event, fn){
            this.query.forEach((element)=>{
                element.addEventListener(event, fn);
            });
            return this;
        },
        click:function(fn){
            this.on("click", fn);
            return this;
        },
        data:function(args){
            if(typeof args === 'string'){
                if(this.query[0].hasAttribute('data-'+args) === false){
                    return null;
                }
                return this.query[0].dataset[args];
            }
            else if(typeof args === 'object'){
                const dataArgs = Object.entries(args);
                this.query.forEach((element)=>{
                    dataArgs.forEach(([key, value])=>{
                        element.dataset[key] = value;
                        if(value == null){
                            delete element.dataset[key];
                        }
                    });
                });
                return this;
            } 
        },
        css:function(args){
            if(typeof args === 'string'){
                return window.getComputedStyle(this.query[0])[args];
            }
            else if(typeof args === 'object'){
                const cssArgs = Object.entries(args);
                this.query.forEach((element)=>{
                    cssArgs.forEach(([property, value])=>{
                        element.style[property] = value;
                    });
                });
                return this;
            }            
        },
        hide:function(){
            var currentDisplay = this.css('display');
            if(currentDisplay != 'none'){
                this.data({display:currentDisplay});
                this.css({'display':'none'});
            }
            return this;
        },
        show:function(){
            var savedDisplayType = this.data('display');
            this.css({'display':((savedDisplayType != "")?savedDisplayType:"block")});
            return this;
        },
        submit:function(fn){
            if(typeof fn === "undefined"){
                this.query[0].submit();
                return this;
            }        
            return this.on("submit", fn);
        },
        html:function(html){
            if(typeof html === "undefined"){
                return this.query[0].innerHTML;
            }
            this.query.forEach((element)=>{
                element.innerHTML = html;
            });
            return this;
        },
        text:function(text){
            if(typeof text === "undefined"){
                return this.query[0].innerText;
            }
            this.query.forEach((element)=>{
                element.innerText = text;
            });
            return this;
        },
        addClass:function(className){
            this.query.forEach((element)=>{
                if(!this.hasClass(className)) element.classList.add(className);
            });
            return this;
        },
        removeClass:function(className){
            this.query.forEach((element)=>{
                element.classList.remove(className);
            });
            return this;
        },
        hasClass:function(className){
            return this.query[0].classList.contains(className);
        },
        insert:function(position, html){
            this.query.forEach((element)=>{
                element.insertAdjacentHTML(position, html);
            });
            return this;
        },
        append:function(html){
            return this.insert("beforeend", html);
        },
        remove:function(){
            this.query.forEach((element)=>{
                element.remove();
            });
            return this;
        },
        fadeIn:function(){
            this.removeClass("el-fade-out");
            this.addClass("el-fade-in");
            return this;
        },
        fadeOut:function(){
            this.removeClass("el-fade-in");
            this.addClass("el-fade-out");
            return this;
        },
        attr:function(name, value){
            if(typeof value === "undefined"){
                return this.query[0].getAttribute(name);
            }
            this.query.forEach((element)=>{
                element.setAttribute(name, value);
            });
            return this;
        },
        serialize:function(){
            return Object.fromEntries(new FormData(this.query[0]).entries());
        },
        value:function(value){
            if(typeof value === "undefined"){
                return this.query[0].value;
            }
            this.query.forEach((element)=>{
                element.value = value;
            });
        }
    };

    var el = function(selector){
        return new constructor(selector);
    };
    el.ready = function(fn){
        if(typeof fn === 'function'){
            document.addEventListener("DOMContentLoaded", fn);
        }        
    }
    el.get = function(url, fn){
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = () => {
            if(xhttp.readyState == 4) fn(xhttp.response);
        }
        xhttp.open("GET", url, true);
        xhttp.send();
    }
    el.post = function(url, data, fn, escape, contentType){
        let ct = "application/x-www-form-urlencoded; charset=UTF-8";
        if(typeof escape === "undefined"){
            data = new URLSearchParams(data).toString();
        }
        if(typeof contentType !== "undefined"){
            ct = contentType;
        }
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = ()=>{
            if(xhttp.readyState == 4){
                if(typeof fn === "function"){
                    fn(xhttp.response);
                }
            }
        }
        xhttp.open("POST", url, true);
        xhttp.setRequestHeader("Content-type", ct);
        xhttp.send(data);
    }
    el.cookie = function(key, value, maxAge){
        if(typeof value !== 'undefined'){
            document.cookie = encodeURIComponent(key)+"="+encodeURIComponent(value)+"; path=/; max-age="+(value == null?0:maxAge);
            return true;
        }
        var cookieReturn = "";
        var cookieJar = document.cookie.split('; ');
        cookieJar.forEach((cookie)=>{
            var cookieFlavor = cookie.split('=');
            if(decodeURIComponent(cookieFlavor[0]) == key){
                cookieReturn = decodeURIComponent(cookieFlavor[1]);
            }
        });
        return cookieReturn;
    }
    el.location = function(url){
        if(typeof url === 'undefined') return location.href;
        location.href = url;
    }
    el.reload = function(){
        location.reload();
    }
    el.urlParam = function(param){
        var searchParams = new URLSearchParams(location.search);
        if(typeof param === "undefined"){
            var paramObj = {};
            searchParams.forEach((value, key)=>{
                paramObj[key] = value;
            });
            return paramObj;
        }
        return searchParams.get(param);
    }
    el.alert = function(args){
        var opt = {
            msg:"This is a message!",
            type:"success",
            fade:true,
            autoHide:false,
            autoHideTime:10000,
            closeOnClick:true,
            loc:"top",
            pos:"center",
            ...args
        };
        if(!opt.autoHide && !opt.closeOnClick){
            opt.closeOnClick = true;
        }
        if(el("el-alert-container").query.length == 0){
            el("body").append("<el-alert-container pos='"+opt.pos+"' loc='"+opt.loc+"'></el-alert-container>");
        }
        var mTime = window.performance.now()+"";
        var elAlertID = "el-alert-"+mTime.split(".")[1];
        el("el-alert-container").append("<el-alert id='"+elAlertID+"' type='"+opt.type+"' close-on-click='"+(opt.closeOnClick?"true":"false")+"'>"+opt.msg+"</el-alert>");
        if(opt.fade){
            setTimeout(() => {
                el("#"+elAlertID).addClass("el-fade-in");
            }, 100);
        }
        if(opt.autoHide){
            alertList[elAlertID] = setTimeout(()=>{
                clearAlert(elAlertID);
            }, opt.autoHideTime);
        }
        el("el-alert[close-on-click='true']").on("click", function(){
            clearAlert(this.id);
        });
        el("el-alert").on("transitionend", function(){
        });
        function clearAlert(id){
            if(opt.fade){
                el("#"+id).removeClass("el-fade-in");
                el("#"+id).addClass("el-fade-out");
            }
            setTimeout(() => {
                el("body #"+id).remove();
                if(opt.autoHide){
                    clearTimeout(alertList[id]);
                    delete alertList[id];
                }
                if(el("el-alert-container").html() == ""){
                    el("el-alert-container").remove();
                }
            }, opt.fade*1000);
        }
    }
    el.each = function(args, fn){
        if(Array.isArray(args)){
            args.forEach(fn);
            return;
        }
        if(typeof args === "object"){
            for(let [k, v] of Object.entries(args)){
                fn(k, v);
            }
            return;
        }
        if(typeof args === "string"){
            for(let [k, v] of Object.entries(el(args).query)){
                fn(k, v);
            }
        }
    }
    el.getStyleVar = function(name){
        var style = getComputedStyle(document.documentElement).getPropertyValue(name);
        if(style == "") return false;
        return style.replace(/\s+/g, '');
    }
    el.setStyleVar = function(name, value){
        var style = document.documentElement.style.setProperty(name, value);
        if(typeof style === "undefined") return false;
        return true;
    }
    // el.inView = function(element, percent){
    //     let rect = element.getBoundingClientRect(), windowHeight = (window.innerHeight || document.documentElement.clientHeight);
    //     return !(Math.floor(100 - (((rect.top >= 0 ? 0 : rect.top) / +-rect.height) * 100)) < percent || Math.floor(100 - ((rect.bottom - windowHeight) / rect.height) * 100) < percent);
    // }
    // el.imageSwap = function(rate, percent){
    //     setInterval(() => {
    //         el.each(el(".el-image-swap").query, function(id, element){
    //             if(el.inView(element, percent)){
    //                 let id = element.id;
    //                 el("#"+id).fadeOut();
    //                 setTimeout(() => {
    //                     element.addEventListener("load", ()=>{
    //                         setTimeout(() => {
    //                             el("#"+id).fadeIn();
    //                         }, 500);
    //                     });
    //                     setTimeout(() => {
    //                         el("#"+id).attr("src", el("#"+id).data("load"));
    //                         el("#"+id).removeClass("el-image-swap");
    //                     }, 500);
    //                 }, 500);
                    
    //             }
    //         }); 
    //     }, rate);
    // }
    el.imageSwap = function(percent){
        percent /= 100;
        const observer = new IntersectionObserver(entries=>{
            el.each(entries, function(entry, k){
                if(entry.isIntersecting){
                    entry.target.classList.add("el-fade-out");
                    entry.target.addEventListener('transitionend', ()=>{
                        entry.target.src=entry.target.dataset.load;
                        entry.target.classList.remove("el-fade-out");
                        entry.target.classList.add("el-fade-in");
                    });
                    observer.unobserve(entry.target);                    
                }
            });
        },{threshold:percent});
        el.each(el(".el-image-swap").query, function(id, element){
            observer.observe(element);
        });       
    }
    window.el = el;
}());