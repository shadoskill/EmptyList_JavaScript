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
    post:function(url, data, callBack)
    {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = () => {
            if(xhttp.readyState == 4) callBack("Post:"+xhttp.response);
        }
        xhttp.open("POST", url, true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send(data);
    }
};