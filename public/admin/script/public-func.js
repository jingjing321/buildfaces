function returnOption(value,text){
    return "<option value='"+value+"'>"+text+"</option>"
}
function getlist(url,$el){
    $($el).find("option").remove();
    $.ajax({
        url:baseUrl+"/platform/basic/"+url+"/list",
        type:"post",
        contentType:"application/json;charset=utf-8",
        crossDomain:true,
        headers:{"authorization":sessionStorage.authorization},
        dataType:'json',
        success:function(data){
            if(data.success){
                var key=[];
                if(data.data.length!=0){
                    for(var i in data.data[0]){
                        key.push(i);
                    };
                    for(var i=0;i<data.data.length;i++){
                        $($el).append(returnOption(data.data[i][key[0]],data.data[i][key[1]]));
                    }
                }

            }
        }
    });
}
