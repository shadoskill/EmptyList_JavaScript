var showHideMemory = {};
(function(){
    var constructor = function (selector){
        this.selector = selector;
    };
    constructor.prototype = {
        on:function(event, fn){
            const query = document.querySelectorAll(this.selector);
            query.forEach((element)=>{
                element.addEventListener(event, fn);
            });
            return this;
        },
        css:function(args){
            if(typeof args === 'string'){
                const query = document.querySelectorAll(this.selector);
                return query[0].style[args];
            }
            else if(typeof args === 'object'){
                const query = document.querySelectorAll(this.selector);
                cssArgs = Object.entries(args);
                query.forEach((element)=>{
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
    el.post = (url, data, fn, contentType)=>{
        let ct = "application/x-www-form-urlencoded; charset=UTF-8";
        if(typeof contentType !== "undefined"){
            ct = contentType;
        }
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = ()=>{
            if(xhttp.readyState == 4) fn(xhttp.response);
        }
        xhttp.open("POST", url, true);
        xhttp.setRequestHeader("Content-type", ct);
        xhttp.send(new URLSearchParams(data),toString());
    }
    window.el = el;
}());