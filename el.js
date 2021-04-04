var showHideMemory = {};
(function(){
    var constructor = function(selector){
        this.selector = selector;
        this.query = document.querySelectorAll(this.selector);
    };
    constructor.prototype = {
        on:function(event, fn){
            this.query.forEach((element)=>{
                element.addEventListener(event, fn);
            });
            return this;
        },
        data:function(args){
            if(typeof args === 'string'){
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
                return this.query[0].style[args];
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
            showHideMemory[this.selector] = this.css('display');
            this.css({'display':'none'});
            return this;
        },
        show:function(){
            var savedDisplayType = showHideMemory[this.selector];
            this.css({'display':((savedDisplayType != "")?savedDisplayType:"block")});
            delete showHideMemory[this.selector];
            return this;
        },
        submit:function(){
            this.query[0].submit();
            return this;
        },
        html:function(html){
            this.query.forEach((element)=>{
                element.innerHTML = html;
            });
            return this;
        },
        text:function(text){
            this.query.forEach((element)=>{
                element.innerText = text;
            });
            return this;
        },
        addClass:function(className){
            this.query.forEach((element)=>{
                element.classList.add(className);
            });
            return this;
        },
        removeClass:function(className){
            this.query.forEach((element)=>{
                element.classList.remove(className);
            });
            return this;
        },
        insert:function(position, html){
            this.query.forEach((element)=>{
                element.insertAdjacentHTML(position, html);
            });
            return this;
        },
        append:function(html){
            return this.insert("beforeend", html);
        }
    };

    var el = (selector)=>{
        return new constructor(selector);
    };
    el.ready = (fn)=>{
        if(typeof fn === 'function'){
            document.addEventListener("DOMContentLoaded", fn);
        }        
    }
    el.get = (url, fn)=>{
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = () => {
            if(xhttp.readyState == 4) fn(xhttp.response);
        }
        xhttp.open("GET", url, true);
        xhttp.send();
    }
    el.post = (url, data, fn, escape, contentType)=>{
        let ct = "application/x-www-form-urlencoded; charset=UTF-8";
        if(typeof escape === "undefined"){
            data = new URLSearchParams(data).toString();
        }
        if(typeof contentType !== "undefined"){
            ct = contentType;
        }
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = ()=>{
            if(xhttp.readyState == 4) fn(xhttp.response);
        }
        xhttp.open("POST", url, true);
        xhttp.setRequestHeader("Content-type", ct);
        xhttp.send(data);
    }
    el.cookie = (key, value, maxAge)=>{
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
    el.location = (url)=>{
        if(typeof url === 'undefined') return location.href;
        location.href = url;
    }
    el.reload = ()=>{
        location.reload();
    }
    el.urlParam = (param)=>{
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
    window.el = el;
}());