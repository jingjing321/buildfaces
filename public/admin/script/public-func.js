function returnOption(value,text,pid){
    if(!pid){
        return "<option value='"+value+"'>"+text+"</option>"
    }
    else{
        return "<option value='"+value+"' data-pid='"+pid+"'>"+text+"</option>"
    }

}
function getlist(url,$el){
    $($el).find("option").remove();
    $.ajax({
        url:baseUrl+"/platform/basic/"+url+"/list",
        type:"post",
        async:false,
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

/*
* list获取city
* num=1,添加全部的option；
* else 没有全部的option
* */
function getCityList(num){
    if(!num){
        $("#city").find("option").remove();
        $("#city").append("<option value='' selected='true'>全部</option>");
        var province=$("#province").val();
    }
    else{
        $("#edit-city").find("option").remove();
        var province=$("#edit-province").val();
    }

    $.ajax({
        url:baseUrl+"/platform/basic/city/list",
        type:"post",
        async:false,
        contentType:"application/json;charset=utf-8",
        crossDomain:true,
        headers:{"authorization":sessionStorage.authorization},
        data:JSON.stringify(province),
        dataType:'json',
        success:function(data){
            if(data.success){
                for(var i=0;i<data.data.length;i++){
                    if(num){
                        $("#edit-city").append(returnOption(data.data[i].cityId,data.data[i].name,data.data[i].pid));
                    }
                    else{
                        $("#city").append(returnOption(data.data[i].cityId,data.data[i].name));
                    }

                }
            }
        },
        error:function(error){

        }
    })
}

function getSubjectList(url,type){
    var id=type+"SubjectId";
    var view=type+"SubjectViews";
    $.ajax({
        url:url+"/platform/subject/list",
        type:"post",
        async:false,
        contentType:"application/json;charset=utf-8",
        crossDomain:true,
        headers:{"authorization":sessionStorage.authorization},
        dataType:'json',
        success:function(data){
            if(data.success){
                $("#subject").find("option").remove();
                $("#subject").append('<option value="" selected="true">全部</option>');
                for(var i=0;i<data.data.length;i++){
                    $("#subject").append(returnOption(data.data[i][id],data.data[i].name));
                    if(data.data[i][view].length){
                        for(var i2=0;i2<data.data[i][view][i2].length;i2++){
                            $("#subject").append(returnOption(data.data[i][view][i2][id],data.data[i][view][i2].name));
                        }
                    }
                }
            }
        },
        error:function(error){

        }
    });
}
