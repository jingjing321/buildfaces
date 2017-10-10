
function getData(type){
    $.ajax({
        url:newsBaseUrl+"/platform/news/comment/page",
        type:"post",
        contentType:"application/json;charset=utf-8",
        crossDomain:true,
        headers:{"authorization":sessionStorage.authorization},
        data:JSON.stringify({"pageNum":0,"pageSize":0}),
        dataType:"json",
        success:function(data){
            if(data.success){
                var a=[];
                for(var i=0;i<data.data.list.length;i++){
                    data.data.list[i].userName=data.data.list[i].userView.userName;
                }
                if(type=="refresh"){
                    $("#comment-list").bootstrapTable("load",data.data.list);
                }
                else{
                    $("#comment-list").bootstrapTable({
                        idField:'commentId',
                        pagination:true,
                        data:data.data.list,
                        columns:[[
                            {field:'',checkbox:true,align:'center',align:'center'},
                            {field:'commentId',title:'序号',align:"center"},
                            {field:'content',title:'内容',align:'center'},
                            // {field:'title',title:'前台',align:'center',formatter:function(value,row,index){
                            //     return "查看"
                            // }},
                            {field:"userName",title:'用户名',align:'center'},
                            {field:'ctime',title:"时间",align:"center"},
                            {field:'verify',title:'是否通过',align:'center',formatter:function(value,row,index){
                                if(value){
                                    return "<a href='#' onclick='verify(1,"+row.commentId+")'>已审核</a>"
                                }
                                else{
                                    return "<a href='#' onclick='verify(0,"+row.commentId+")'>未审核</a>"
                                }

                            }},
                            {field:'',title:'删除',align:'center',formatter:function(value,row,index){
                                return "<a href='#' onclick='del("+row.commentId+")'>删除</a>"
                            }}
                        ]]});
                }
            }
        },
        error:function(error){

        }
    })
}
getData();

function verify(type,id){
    var a={};
    if(type){
        if(!confirm("评论将切换到未审核状态！")){
            return ;
        }
        a.verify=false;
    }
    else{
        if(!confirm("评论将切换到已审核状态！")){
            return ;
        }
        a.verify=true;
    }
    if(!id){
        var getSelect=$("#comment-list").bootstrapTable("getSelections");
        if(getSelect.length<1){
            alert("请选择至少一条评论！");
            return ;
        }
        else{
            a.ids=[];
            for(var i=0;i<getSelect.length;i++){
                a.ids.push(getSelect[i].commentId);
            }
        }
    }
    else{
        a.ids=[];
        a.ids.push(id);
    }
    $.ajax({
        url:newsBaseUrl+"/platform/news/comment/verify/set",
        type:"post",
        contentType:"application/json;charset=utf-8",
        crossDomain:true,
        headers:{"authorization":sessionStorage.authorization},
        data:JSON.stringify(a),
        dataType:'json',
        success:function (data) {
            if(data.success){
                alert("审核状态修改成功！");
                getData("refresh");
            }
            else{
                alert(data.errorMsg);
            }
        },
        error:function(error){
            alert("审核状态修改失败，请重试！");
        }
    })
}

function del(id){
    var a=[];
    if(id){
        a.push(id);
    }
    else{
        var getSelect=$("#comment-list").bootstrapTable("getSelections");
        if(getSelect.length<1){
            alert("请选择至少一条评论！");
            return ;
        }
        else{
            for(var i=0;i<getSelect.length;i++){
                a.push(getSelect[i].commentId);
            }
        }
    }
    $.ajax({
        url:newsBaseUrl+"/platform/news/comment/delete",
        type:"post",
        contentType:"application/json;charset=utf-8",
        crossDomain:true,
        headers:{"authorization":sessionStorage.authorization},
        data:JSON.stringify(a),
        dataType:'json',
        success:function(data){
            if(data.success){
                alert("删除成功！");
                getData("refresh");
            }
            else{
                alert(data.errorMsg);
            }
        },
        error:function(error){
            alert("删除失败，请重试！");
        }
    })
}