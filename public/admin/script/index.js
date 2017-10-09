getlist("province","#province");
$("#province").append("<option value='' selected='true'>全部</option>");
function getCityIndex(num){

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
$.ajax({
    url:newsBaseUrl+"/platform/subject/list",
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
                $("#subject").append(returnOption(data.data[i].newsSubjectId,data.data[i].name));
                if(data.data[i].newsSubjectView){
                    for(var i2=0;i2<data.data[i].newsSubjectViews[i2].length;i2++){
                        $("#subject").append(returnOption(data.data[i].newsSubjectViews[i2].newsSubjectId,data.data[i].newsSubjectViews[i2].name));
                    }
                }
            }
        }
    },
    error:function(error){

    }
});
getData("load");
function getData(type,data){
    if(!data){
        data={pageNum:0,pageSize:0}
    }
    if($(".link.active").attr("data-type")=="verify"){
        if(data.condition){
            data.condition[$(".link.active").attr("data-type")]=true;
        }
        else{
            data.condition={};
            data.condition[$(".link.active").attr("data-type")]=true;
        }

    }
    else if($(".link.active").attr("data-type")){
        if(data.condition){
            data.condition[$(".link.active").attr("data-type")]="";
        }
        else{
            data.condition={};
            data.condition[$(".link.active").attr("data-type")]="";
        }
    }

    $.ajax({
        url:newsBaseUrl+"/platform/news/page",
        type:"post",
        contentType:"application/json;charset=utf-8",
        crossDomain:true,
        headers:{"authorization":sessionStorage.authorization},
        data:JSON.stringify(data),
        dataType:"json",
        success:function(data){
            if(data.success){
                var a=[];
                a=data.data.list;
                if(type=="load"){
                    $("#news-list").bootstrapTable({
                        idField:'newsId',
                        pagination:true,
                        data:a,
                        columns:[[
                            {field:'',checkbox:true,align:'center'},
                            {field:'title',title:'标题',align:"center"},
                            {field:"author",title:"发布者",align:'center'},
                            {field:'siteName',title:"站点",aign:'center'},
                            {field:'newsSubjectName',title:'所属栏目',align:'center'},
                            {field:'clicks',title:'点击数',align:'center'},
                            {field:'ctime',title:"发布日期",align:'center'},
                            {field:"verify",title:'审核状态',align:'center',formatter:function(value,row,index){
                                if(value){
                                    return "<a href='#' onclick='verify("+JSON.stringify(row)+")'>已审核</a>"
                                }
                                else{
                                    return "<a href='#' onclick='verify("+JSON.stringify(row)+")'>未审核</a>"
                                }
                            }},
                            {field:'newsRecommendPicView',title:"推荐",align:'center',formatter:function(value,row,index){
                                var btn="";
                                if(row.newsRecommendPicView){
                                    btn+="<a href='#' onclick='recommend_table("+row.newsId+",\"pic\",false)'>图说推荐</a>"
                                }
                                else{
                                    btn+="<a href='#' onclick='recommend_table("+row.newsId+",\"pic\",true)'>图说未推荐</a>"
                                }
                                if(row.newsRecommendSubjectView){
                                    btn+="<br><a href='#' onclick='recommend_table("+row.newsId+",\"subject\",false)'>栏目推荐</a>"
                                }
                                else{
                                    btn+="<br><a href='#' onclick='recommend_table("+row.newsId+",\"subject\",true)'>栏目未推荐</a>"
                                }
                                if(row.newsRecommendView){
                                    btn+="<br><a href='#' onclick='recommend_table("+row.newsId+",\"news\",false)'>头条推荐</a>"
                                }
                                else{
                                    btn+="<br><a href='#' onclick='recommend_table("+row.newsId+",\"news\",true)'>头条未推荐</a>"
                                }
                                return btn;
                            }},
                            {field:'newsTopSubjectView',title:"置顶",align:'center',formatter:function(value,row,index){
                                var btn="";
                                if(row.newsTopSubjectView){
                                    btn+="<a href='#' onclick='top_table("+row.newsId+",\"subject\",1)'>栏目置顶</a>"
                                }
                                else{
                                    btn+="<a href='#' onclick='top_table("+row.newsId+",\"subject\",0)'>栏目未置顶</a>"
                                }
                                if(row.newsTopView){
                                    btn+="<br><a href='#' onclick='top_table("+row.newsId+",\"news\",1)'>头条置顶</a>"
                                }
                                else{
                                    btn+="<br><a href='#' onclick='top_table("+row.newsId+",\"news\",0)'>头条未置顶</a>"
                                }
                                return btn;
                            }},
                            {field:'newsId',title:'编辑/删除',align:'center',formatter:function(value,row,index){
                                return "<a href='#' onclick='edit("+JSON.stringify(row)+")'>编辑</a> &nbsp; <a href='#' onclick='del("+row.newsId+")'>删除</a>"
                            }}
                            // {field:'',title:'推送',align:'center',formatter:function(value,row,index){
                            //     return "推送"
                            // }}
                        ]]
                    })
                }
                else{
                    $("#news-list").bootstrapTable("load",a);
                }
            }

        }
    })
}
function verify(row){
    if(row==undefined){
        var row=$("#news-list").bootstrapTable("getSelections");
        if(row.length!=1){
            alert("请选择一条新闻");
        }
        else {
            row=row[0];
        }
    }
    if(row.verify){
        if(!confirm("头条将切换到未审核状态！")){
            return;
        }
        else{
            row.verify=false
        }
    }
    else{
        if(!confirm("头条将切换到已审核状态！")){
            return ;
        }
        else{
            row.verify=true;
        }
    }
    $.ajax({
        url:newsBaseUrl+"/platform/news/verify",
        type:"post",
        contentType:"application/json;charset=utf-8",
        crossDomain:true,
        headers:{"authorization":sessionStorage.authorization},
        data:JSON.stringify({newsId:row.newsId,verify:row.verify}),
        dataType:'json',
        success:function(data){
            if(data.success){
                alert("修改成功！");
                var parameter={pageNum:0,pageSize:0};
                getData("refresh",parameter);
            }
            else{
                alert(data.errorMsg);
            }
        },
        error:function(error){
            alert("修改失败，请重试！");
        }
    })

}
function recommend(row){
    var ids=[];
    if(!row){
        var recommendData=$("#news-list").bootstrapTable("getSelections");
        if(recommendData.length<1){
            alert("请选择要进行操作的新闻！");
            return;
        }
        for(var i=0;i<recommendData.length;i++){
            ids.push(recommendData[i].newsId);
        }
    }
    else{
        ids.push(row.newsId);
    }

    $("#recommend-modal #recomm_btn").attr("onclick","recomment_sit('"+ids.join("-")+"')");
    $("#recommend-modal").modal("show");

}
function recomment_sit(ids){
    ids=ids.split("-");
    var a=$(".recommend").serializeJSON();
    if(a.news){
        a.news=true;
    }
    else{
        a.news=false;
    }
    if(a.pic){
        a.pic=true;
    }
    else{
        a.pic=false;
    }
    if(a.subject){
        a.subject=true;
    }
    else{
        a.subject=false;
    }
    $.ajax({
        url:newsBaseUrl+"/platform/news/recommend/news",
        type:'post',
        contentType:"application/json;charset=utf-8",
        crossDomain:true,
        headers:{"authorization":sessionStorage.authorization},
        data:JSON.stringify({"newsIds":ids,recommend:a.news}),
        dataType:'json',
        success:function(data){
            if(data.success){
                $.ajax({
                    url:newsBaseUrl+"/platform/news/recommend/pic",
                    type:'post',
                    contentType:"application/json;charset=utf-8",
                    crossDomain:true,
                    headers:{"authorization":sessionStorage.authorization},
                    data:JSON.stringify({"newsIds":ids,recommend:a.pic}),
                    dataType:'json',
                    success:function(data) {
                        if (data.success) {
                            $.ajax({
                                url:newsBaseUrl+"/platform/news/recommend/subject",
                                type:'post',
                                contentType:"application/json;charset=utf-8",
                                crossDomain:true,
                                headers:{"authorization":sessionStorage.authorization},
                                data:JSON.stringify({"newsIds":ids,recommend:a.subject}),
                                dataType:'json',
                                success:function(data) {
                                    if (data.success) {
                                        alert("修改成功！");
                                        var parameter={pageNum:0,pageSize:0};
                                        getData("refresh",parameter);
                                        $("#recommend-modal").modal("hide");
                                    }
                                    else{
                                        alert(data.errorMsg)
                                    }
                                },
                                error:function(error){
                                    alert("修改失败，请重试！");
                                }
                            })
                        }
                        else{
                            alert(data.errorMsg)
                        }
                    },
                    error:function(error){
                        alert("修改失败，请重试！");
                    }
                })
            }
            else{
                alert(data.errorMsg);
            }
        },
        error:function(error){
            alert("修改失败，请重试！");
        }
    })
}

function recommend_table(id,type,act){
    $.ajax({
        url:newsBaseUrl+"/platform/news/recommend/"+type,
        type:'post',
        contentType:"application/json;charset=utf-8",
        crossDomain:true,
        headers:{"authorization":sessionStorage.authorization},
        data:JSON.stringify({newsIds:[id],recommend:act}),
        dataType:'json',
        success:function(data){
            if(data.success){
                alert("修改成功！");
                getData("refresh");
            }
            else{
                alert(data.errorMsg);
            }
        },
        error:function(error){
            alert("修改失败，请重试！");
        }
    })
}
function toTop(){
    var ids=[];
    var data=$("#news-list").bootstrapTable("getSelections");
    if(data.length<1){
        alert("请选择至少一条新闻！");
        return;
    }
    for(var i=0;i<data.length;i++){
        ids.push(data[i].newsId);
    }
    $("#top_btn").attr("onclick","top_sit('"+ids.join("-")+"')");
    $("#top-modal").modal("show");

}
function top_sit(ids){
    ids=ids.split("-");
    var a=$(".top").serializeJSON();
    if(a.news){
        if(!a.news_time){
            return;
        }
    }
    if(a.subject){
        if(!a.subject){
            return;
        }
    }
    if(a.news){
        $.ajax({
            url:newsBaseUrl+"/platform/news/top/news",
            type:'post',
            contentType:"application/json;charset=utf-8",
            crossDomain:true,
            headers:{"authorization":sessionStorage.authorization},
            data:JSON.stringify({expiry:a.news_time+":01.000Z",newsIds:ids}),
            dataType:'json',
            success:function(data){
                if(data.success){
                    if(a.subject){
                        $.ajax({
                            url: newsBaseUrl + "/platform/news/top/subject",
                            type: 'post',
                            contentType: "application/json;charset=utf-8",
                            crossDomain: true,
                            headers: {"authorization": sessionStorage.authorization},
                            data: JSON.stringify({expiry: a.subject_time+":01.000Z", newsIds: ids}),
                            dataType: 'json',
                            success: function (data) {
                                if (data.success) {
                                    alert("置顶成功！");
                                    $("#top-modal").modal("hide");
                                    getData("refresh");
                                }
                                else{
                                    alert(data.errorMsg);
                                }
                            },
                            error:function(error){
                                alert("置顶失败，请重试！");
                            }
                        })
                    }
                    else{
                        alert("置顶成功！");
                        $("#top-modal").modal("hide");
                        getData("refresh");
                    }
                }
                else{
                    alert(data.errorMsg);
                }
            },
            error:function(error){
                alert("置顶失败，请重试！");
            }
        })
    }
    else if(a.subject){
        $.ajax({
            url: newsBaseUrl + "/platform/news/top/subject",
            type: 'post',
            contentType: "application/json;charset=utf-8",
            crossDomain: true,
            headers: {"authorization": sessionStorage.authorization},
            data: JSON.stringify({expiry: a.subject_time+":01.000Z", newsIds: ids}),
            dataType: 'json',
            success: function (data) {
                if (data.success) {
                    alert("置顶成功！");
                    $("#top-modal").modal("hide");
                    getData("refresh");
                }
                else{
                    alert(data.errorMsg);
                }
            },
            error:function(error){
                alert("置顶失败，请重试！");
            }
        })
    }
    else{
        $("#top-modal").modal("hide");
    }

}
function turn(type){
    if($(".top input[name='"+type+"']")[0].checked){
        $(".top input[name='"+type+"_time']").removeAttr("disabled");

    }
    else{
        $(".top input[name='"+type+"_time']").attr("disabled",'true').val("");
    }
}
function top_table(id,type,act){
    if(!act){
        $("#time-modal .btn-primary").attr("onclick","top_table_sit("+id+",'"+type+"')");
        $("#time-modal").modal("show");
    }
    else{
        if(confirm("确认取消置顶？")){
            $.ajax({
                url:newsBaseUrl+"/platform/news/top/"+type+"/cancel",
                type:'post',
                contentType:"application/json;charset=utf-8",
                crossDomain:true,
                headers:{"authorization":sessionStorage.authorization},
                data:JSON.stringify([id]),
                dataType:'json',
                success:function(data){
                    if(data.success){
                        alert("取消置顶成功！");
                        getData("refresh");
                    }
                    else{
                        alert(data.errorMsg)
                    }
                },
                error:function(error){
                    alert("取消置顶失败，请重试！");
                }
            })
        }
    }
}
function top_table_sit(id,type){
    if(!$("#time-modal input").val()){
        alert("请输入时间！");
        return;
    }
    else{
        $.ajax({
            url:newsBaseUrl+"/platform/news/top/"+type,
            type:'post',
            contentType:"application/json;charset=utf-8",
            crossDomain:true,
            headers:{"authorization":sessionStorage.authorization},
            data:JSON.stringify({expiry: $("#time-modal input").val()+":01.000Z", newsIds:[ id]}),
            dataType:'json',
            success:function(data){
                if(data.success){
                    alert("置顶成功！");
                    $("#time-modal").modal("hide");
                    getData("refresh");
                }
                else{
                    alert(data.errorMsg);
                }
            },
            error:function(error){
                alert("置顶失败，请重试！");
            }
        })

    }
}
function del(id){
    if(!confirm("确认删除新闻？")){
        return;
    }
    if(!id){
        var a=$("news-list").bootstrapTable("getSelections");
        if(a.length!=1){
            alert("请选择一条新闻！");
            return ;
        }
        id=a[0].newsId;
    }

    $.ajax({
        url:newsBaseUrl+"/platform/news/delete",
        type:'post',
        contentType:"application/json;charset=utf-8",
        crossDomain:true,
        headers:{"authorization":sessionStorage.authorization},
        data:JSON.stringify(id),
        dataType:'json',
        success:function (data) {
            if(data.success){
                alert("删除成功！");
                getData('refresh');
            }
        }
    })
}

function search(){
    var a={};
    // if($("#province").val()){
    //     a.provinceId=$("#province").val();
    // }
    if($("#city").val()){
        a.siteId=$("#city").val();
    }
    if($("#subject").val()){
        a.newsSubjectId=$("#subject").val();
    }
    if($("#keywords").val()){
        a.keywords=$("#keywords").val();
    }
    var a={condition:a,pageNum:0,pageSize:0};
    getData("refresh",a);

}

function edit(row){
    $("#edit-modal").find("input").val("");
    getlist("province","#edit-province");
    getCityIndex(1);
    $.ajax({
        url:newsBaseUrl+"/platform/subject/list",
        type: "post",
        contentType: "application/json;charset=utf-8",
        crossDomain: true,
        headers: {"authorization": sessionStorage.authorization},
        dataType: 'json',
        success:function(data){
            if(data.success){
                $("#edit-subject").find("option").remove();
                for(var i=0;i<data.data.length;i++) {
                    $("#edit-subject").append(returnOption(data.data[i].newsSubjectId, data.data[i].name));
                    if(i==0){
                        if(data.data[i].newsSubjectViews){
                            for(var i2=0;i2<data.data[i].newsSubjectViews.length;i2++){
                                $("#edit-subject2").append(returnOption(data.data[i].newsSubjectViews[i2].newsSubjectId,data.data[i].newsSubjectViews[i2].name,data.data[i].newsSubjectViews[i2].pid));
                            }
                        }
                    }
                }
                if(row){
                    $("#edit-subject2").val(row.newsSubjectId);
                    for(var i=0;i<$("#edit-subject2").find("option").length;i++){
                        if($("#edit-subject2").find("option").eq(i).selected){
                            $("$edit-subject").val($("#edit-subject2").find("option").eq(i).attr("data-pid"));
                            break;
                        }
                    }
                    $("#edit-city").val(row.siteId);
                    for(var i=0;i<$("#edit-city").find("option").length;i++){
                        if($("#edit-city").find("option").selected){
                            $("#edit-province").val($("#edit-city").find("option").eq(i).attr("data-pid"));
                        }
                    }
                    $("#edit-title").val(row.title);
                    $("#edit-sourceSite").val(row.sourceSite);
                    $("#edit-keywords").val(row.keywords);
                    CKEDITOR.instances.editor.setData(row.content);
                    $("#edit-modal .btn-primary").attr("onclick","edit_sit("+row.newsId+")");
                }
                else{
                    $("#edit-modal .btn-primary").attr("onclick","edit_sit()");
                }
                $("#edit-modal").modal("show");
            }
        }
    })
}
function edit_sit(id){
    var url="/platform/news/add";
    var a={};
    a.siteId=$("#edit-city").val();
    a.newsSubjectId=$("#edit-subject2").val();
    if($("#edit-title").val()){
        a.title=$("#edit-title").val();
    }
    else{
        alert("请输入标题！");
        return;
    }
    if($("#edit-sourceSite").val()){
        a.sourceSite=$("#edit-sourceSite").val();
    }
    if($("#edit-keywords").val()){
        a.keywords=$("#edit-keywords").val();
    }
    if(CKEDITOR.instances.editor.getData()){
        a.content=CKEDITOR.instances.editor.getData();
    }
    else{
        alert("请输入新闻内容！");
        return ;
    }
    if(id){
        a.newsId=id;
        url="/platform/news/edit"
    }
    $.ajax({
        url:newsBaseUrl+url,
        type: "post",
        contentType: "application/json;charset=utf-8",
        crossDomain: true,
        headers: {"authorization": sessionStorage.authorization},
        data:JSON.stringify(a),
        dataType: 'json',
        success:function(data){
            if(data.success){
                if(id){
                    alert("新闻修改成功！");
                }
                else{
                    alert("新闻添加成功！");
                }
                $("#edit-modal").modal("hide");
                getData("refresh");
            }
            else{
                alert(data.errorMsg)
            }
        },
        error:function(error){
            alert("添加失败，请重试！");
        }
    })
}

function getSubjectIndex(){
    $.ajax({
        url:newsBaseUrl+"/platform/subject/list",
        type:"post",
        async:false,
        contentType:"application/json;charset=utf-8",
        crossDomain:true,
        headers:{"authorization":sessionStorage.authorization},
        dataType:'json',
        success:function(data){
            if(data.success){
                for(var i=0;i<data.data.length;i++){
                    if(data.data.newsSubjectId==$("#edit-subject").val()){
                        if(data.data[i].newsSubjectViews){
                            for(var i2=0;i2<data.data[i].newsSubjectViews.length;i2++){
                                $("#edit-subject2").append(returnOption(data.data[i].newsSubjectViews[i2].newsSubjectId,data.data[i].newsSubjectViews[i2].name,data.data[i].newsSubjectViews[i2].pid));
                            }
                        }
                    }
                }
            }
        }
    })
}

function turn_type(thiz){
    $(".link").removeClass("active");
    $(thiz).addClass("active");
    getData("refresh")
}
