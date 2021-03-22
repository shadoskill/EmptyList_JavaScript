var el = {
    get:function(url, callBack)
    {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = () => {
            if(xhttp.readyState == 4) callBack("Get:"+xhttp.response);
        }
        xhttp.open("GET", url, true);
        xhttp.send();
    }
};