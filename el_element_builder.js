el.addButton = function(data){
    var content = "";
    var params = "";
    el.each(data, (k, v)=>{
        if(k !== "content"){
            params += `${k}='${v}'`;
        }
        else{
            content = v;
        }
    });
    var html = `<button${params}>${("content" in data?data.content:"")}</button>`;
};