var alertList = {};
(function(){
    var constructor = function(selector){
        this.selector = selector;
        if(typeof this.selector === 'object'){
            this.query = [this.selector]
        }
        else if(selector.charAt(0) == "."){
            this.selector = selector.replaceAll(' ', '.');
        }        
        if(this.query === undefined) this.query = document.querySelectorAll(this.selector);
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
        toggleClass:function(class1, class2){
            this.query.forEach((element)=>{
                if(this.hasClass(class1)){
                    this.removeClass(class1);
                    this.addClass(class2);
                }
                else{
                    this.removeClass(class2);
                    this.addClass(class1);
                }
            });
            return this;
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
            if(className != ""){
                this.query.forEach((element)=>{
                    if(!this.hasClass(className)) element.classList.add(className);
                });
            }
            return this;
        },
        removeClass:function(className){
            if(className == "") return this;
            if(className == "*"){
                this.query.forEach((element)=>{
                    element.classList = [];
                });
                return this;
            }
            this.query.forEach((element)=>{
                element.classList.remove(className);
            });            
            return this;
        },
        hasClass:function(className){
            if(typeof this.query[0].classList === 'undefined') return false;
            if(this.query[0].classList === null) return false;
            if(typeof className !== 'array'){
                className = className.replaceAll('.', '').split(' ');
            }
            var result = false;
            className.forEach((name)=>{
                if(this.query[0].classList.contains(name)){
                    result = true;
                }
            });
            return result;
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
            window.addEventListener("load", fn);
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
            containerClass:"",
            sticky:false,
            ...args
        };
        if(!opt.autoHide && !opt.closeOnClick){
            opt.closeOnClick = !opt.sticky;
        }
        if(el("el-alert-container").query.length == 0){
            el("body").append("<el-alert-container class='"+opt.containerClass+"' pos='"+opt.pos+"' loc='"+opt.loc+"'></el-alert-container>");
        }
        var mTime = window.performance.now()+"";
        var elAlertID = "el-alert-"+mTime.split(".")[1];
        el("el-alert-container").append("<el-alert id='"+elAlertID+"' type='"+opt.type+"' close-on-click='"+(opt.closeOnClick?"true":"false")+"'>"+opt.msg+"</el-alert>");
        if(opt.fade){
            setTimeout(() => {
                el("#"+elAlertID).addClass("el-fade-in");
            }, 100);
        }
        else{
            el("#"+elAlertID).addClass("el-fade-none");
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
    el.imageSwap = function(percent = 5, rootMargin = '', random = false){
        percent /= 100;
        const observer = new IntersectionObserver(entries=>{
            el.each(entries, function(entry, k){
                if(entry.isIntersecting){
                    setTimeout(() => {
                        var newImg = entry.target.dataset.load;
                        var img = new Image();
                        img.onload = function(){
                            entry.target.classList.add("el-fade-out");
                            entry.target.addEventListener('transitionend', ()=>{
                                entry.target.src=newImg;
                                entry.target.classList.remove("el-fade-out");
                                entry.target.classList.add("el-fade-in");
                            });
                        };
                        img.src = newImg;                        
                    observer.unobserve(entry.target);  
                    }, el.getRandomInteger(100, 300)*random);                  
                }
            });
        },{
            threshold:percent,
            rootMargin:rootMargin
        });
        el.each(el(".el-image-swap").query, function(id, element){
            observer.observe(element);
        });       
    }
    el.objectFlip = function(obj){
        return Object.keys(obj).reduce((ret, key)=>{
            ret[obj[key]] = key;
            return ret;
        }, {});
    }
    el.objectSort = function(obj, selector){
        return obj.sort((a, b) => (a[selector] > b[selector]) ? 1 : -1);
    }
    el.gdprcheck = function(args, gdprAcceptFn){
        el.each(el("el-alert").query, function(k, element){
            if(el(element).attr("type") == "gdpr"){
                el(element).remove();
            }
        });
        var opt = {
            msg:"Accept cookies?",
            btnA:"Accept",
            btnD:"Deny",
            ...args
        };
        let acceptGDPR = localStorage.getItem("gdprcheck");
        if(acceptGDPR === null){
            el.alert({                
                msg:
                    "<button id='gdprDeny'>"+opt.btnD+"</button>"+
                    "<p>"+opt.msg+"</p>"+
                    "<button id='gdprAccept'>"+opt.btnA+"</button>",                    
                type:"gdpr",         
                closeOnClick:false,
                loc:"bottom",
                fade:false,
                sticky:true
            });
            el("#gdprAccept").click(function(){
                localStorage.setItem("gdprcheck", 1);  
                el.gdprAccept(gdprAcceptFn);
            });
            el("#gdprDeny").click(function(){
                localStorage.setItem("gdprcheck", 0);  
            });
            return;
        }
        if(Number(acceptGDPR) === 0){
            return;
        }
        if(Number(acceptGDPR) === 1){
            el.gdprAccept(gdprAcceptFn);
            return;
        }        
    }
    el.gdprAccept = function(gdprAcceptFn){
        el.each(el(".gdpr").query, function(k, element){
            let data = el(element).data("gdprswap");
            if(data !== null){
                el(element).attr("src", data);
            }
        });
        el.each(el(".gdpr-link").query, function(k, element){
            el(element).html("");
        });
        if(typeof gdprAcceptFn === 'function'){
            gdprAcceptFn();
        }
    }
    el.getRandomInteger = function(min, max){
        return Math.floor(Math.random() * (max - min) ) + min;
    }
    window.el = el;
}());