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
        xhttp.send(data);
    }
    window.el = el;
}());