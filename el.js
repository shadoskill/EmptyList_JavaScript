var el = {
    get:function(url, callBack)
    {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = () => {
            if(xhttp.readyState == 4) callBack("Get:"+xhttp.response);
        }
        xhttp.open("GET", url, true);
        xhttp.send();
    },
    post:function(url, data, callBack, contentType)
    {
        let ct = "application/x-www-form-urlencoded";
        if(contentType !== "undefined"){
            ct = contentType;
        }
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = () => {
            if(xhttp.readyState == 4) callBack("Post:"+xhttp.response);
        }
        xhttp.open("POST", url, true);
        xhttp.setRequestHeader("Content-type", ct);
        xhttp.send(data);
    }
};