getlist("province","#province");
$("#province").append("<option value='' selected='true'>全部</option>");

getSubjectList(bidBaseUrl,'bid');

getData("load");
function getData(type,data){
    if(!data){
        data={"pageNum":0,"pageSize":0};
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
        url:bidBaseUrl+"/platform/bid/page",
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
                    $("#gov-list").bootstrapTable({
                        idField:'bidId',
                        pagination:true,
                        data:a,
                        columns:[[
                            {field:'',checkbox:true,align:'center'},
                            {field:'title',title:'标题',align:"center"},
                            {field:"author",title:"发布者",align:'center'},
                            {field:'siteName',title:"站点",aign:'center'},
                            {field:'bidSubjectName',title:'所属栏目',align:'center'},
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
                            {field:'bidRecommendSubjectView',title:"推荐",align:'center',formatter:function(value,row,index){
                                var btn="";
                                if(row.bidRecommendSubjectView){
                                    btn+="<a href='#' onclick='recommend(false,"+row.bidId+")'>推荐</a>"
                                }
                                else{
                                    btn+="<a href='#' onclick='recommend(true,"+row.bidId+")'>未推荐</a>"
                                }
                                return btn;
                            }},
                            {field:'bidTopSubjectView',title:"置顶",align:'center',formatter:function(value,row,index){
                                var btn="";
                                if(row.bidTopSubjectView){
                                    btn+="<a href='#' onclick='toTop(false,"+row.bidId+")'>栏目置顶</a>"
                                }
                                else{
                                    btn+="<a href='#' onclick='toTop(true,"+row.bidId+")'>栏目未置顶</a>"
                                }
                                return btn;
                            }},
                            {field:'bidId',title:'编辑/删除',align:'center',formatter:function(value,row,index){
                                return "<a href='#' onclick='edit("+JSON.stringify(row)+")'>编辑</a> &nbsp; <a href='#' onclick='del("+row.bidId+")'>删除</a>"
                            }}
                            // {field:'',title:'推送',align:'center',formatter:function(value,row,index){
                            //     return "推送"
                            // }}
                        ]]
                    })
                }
                else{
                    $("#gov-list").bootstrapTable("load",a);
                }
            }

        }
    })
}

function verify(row){
    if(row==undefined){
        var row=$("#gov-list").bootstrapTable("getSelections");
        if(row.length!=1){
            alert("请选择一条招标信息");
        }
        else {
            row=row[0];
        }
    }
    if(row.verify){
        if(!confirm("招标信息将切换到未审核状态！")){
            return;
        }
        else{
            row.verify=false
        }
    }
    else{
        if(!confirm("招标信息将切换到已审核状态！")){
            return ;
        }
        else{
            row.verify=true;
        }
    }
    $.ajax({
        url:bidBaseUrl+"/platform/bid/verify",
        type:"post",
        contentType:"application/json;charset=utf-8",
        crossDomain:true,
        headers:{"authorization":sessionStorage.authorization},
        data:JSON.stringify({bidId:row.bidId,verify:row.verify}),
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

function recommend(action,id){
    var ids=[];
    if(!id){
        var recommendData=$("#gov-list").bootstrapTable("getSelections");
        if(recommendData.length<1){
            alert("请选择要进行操作的招标信息！");
            return;
        }
        if(!recommendData[0].bidRecommendSubjectView){
            action=true;
        }
        else{
            action=false;
        }
        for(var i=0;i<recommendData.length;i++){
            ids.push(recommendData[i].bidId);
        }
    }
    else{
        ids.push(id);
    }
    $.ajax({
        url: bidBaseUrl + "/platform/bid/recommend/subject",
        type: 'post',
        contentType: "application/json;charset=utf-8",
        crossDomain: true,
        headers: {"authorization": sessionStorage.authorization},
        data: JSON.stringify({"bidIds": ids, recommend: action}),
        dataType: 'json',
        success: function (data) {
            if(data.success){
                alert("操作成功！");
                getData("refresh");
            }
            else{
                alert(data.errorMsg);
            }
        },
        error: function (error) {
            alert("操作失败，请重试！");
        }
    })

}

function toTop(action,id){
    var ids=[];
    var data=$("#gov-list").bootstrapTable("getSelections");
    if(!id){
        if(data.length<1){
            alert("请选择至少一条招标信息");
            return;
        }
        if(data[0].bidTopSubjectView){
            action=false;
        }
        else{
            action=true;
        }
        for(var i=0;i<data.length;i++){
            ids.push(data[i].bidId);
        }
    }
    else{
        ids.push(id);
    }
    if(action){
        $("#time-modal").find("button.btn-primary").attr("onclick","top_sit("+ids+")");
        $("#time-modal").modal("show");
    }
    else{
        $.ajax({
            url:bidBaseUrl+"/platform/bid/top/subject/cancel",
            type:'post',
            contentType:"application/json;charset=utf-8",
            crossDomain:true,
            headers:{"authorization":sessionStorage.authorization},
            data:JSON.stringify(ids),
            dataType:'json',
            success:function(data){
                if(data.success){
                    alert("取消置顶成功！");
                    getData("refresh");
                }
                else{
                    alert(data.errorMsg);
                }
            },
            error:function (error) {
                alert("取消置顶失败，请重试！");
            }
        })
    }
}

function top_sit(ids){
    if(!$("#time-modal input").val()){
        alert("请输入时间！");
        return;
    }
    else{
        $.ajax({
            url:bidBaseUrl+"/platform/bid/top/subject",
            type:'post',
            contentType:"application/json;charset=utf-8",
            crossDomain:true,
            headers:{"authorization":sessionStorage.authorization},
            data:JSON.stringify({expiry: $("#time-modal input").val()+":01.000Z", bidIds:[ ids]}),
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
            error:function (error) {
                alert("置顶失败，请重试！");
            }
        })
    }
}

function del(id){
    if(!confirm("确定删除该招标信息！")){
        return;
    }
    if(!id){
        var a=$("#gov-list").bootstrapTable("getSelections");
        if(a.length!=1){
            alert("请选择一条招标信息！");
            return ;
        }
        else{
            id=a[0].bidId;
        }
    }
    $.ajax({
        url:bidBaseUrl+"/platform/bid/delete",
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
            }else{
                alert(data.errorMsg);
            }
        },
        error:function (error) {
            alert("删除失败，请重试！");
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
        a.bidSubjectId=$("#subject").val();
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
    getCityList($("#edit-province").val());
    $.ajax({
        url:bidBaseUrl+"/platform/subject/list",
        type:"post",
        contentType:"application/json;charset=utf-8",
        crossDomain: true,
        headers: {"authorization": sessionStorage.authorization},
        dataType: 'json',
        success:function(data){
            if(data.success){
                $("#edit-subject").find("option").remove();
                for(var i=0;i<data.data.length;i++) {
                    $("#edit-subject").append(returnOption(data.data[i].bidSubjectId, data.data[i].name));
                    if(i==0){
                        if(data.data[i].bidSubjectViews){
                            for(var i2=0;i2<data.data[i].bidSubjectViews.length;i2++){
                                $("#edit-subject2").append(returnOption(data.data[i].bidSubjectViews[i2].bidSubjectId,data.data[i].bidSubjectViews[i2].name,data.data[i].bidSubjectViews[i2].pid));
                            }
                        }
                    }
                }
                $("#edit-subject2").val(row.bidSubjectId);
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
                $("#edit-modal .btn-primary").attr("onclick","edit_sit("+row.bidId+")");
                $("#edit-modal").modal("show");
            }
        },
        error:function (error) {

        }
    })
}

function edit_sit(id){
    var a={};
    a.siteId=$("#edit-city").val();
    a.bidSubjectId=$("#edit-subject2").val();
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
        a.bidId=id;
    }
    $.ajax({
        url:bidBaseUrl+"/platform/bid/edit",
        type: "post",
        contentType: "application/json;charset=utf-8",
        crossDomain: true,
        headers: {"authorization": sessionStorage.authorization},
        data:JSON.stringify(a),
        dataType: 'json',
        success:function(data){
            if(data.success){
                alert("招标信息修改成功！");
                $("#edit-modal").modal("hide");
                getData("refresh");
            }
            else{
                alert(data.errorMsg);
            }
        },
        error:function (error) {
            alert("信息修改失败，请重试！");
        }
    })
}

function getSubjectModal(){
    $.ajax({
        url:bidBaseUrl+"/platform/subject/list",
        type:"post",
        async:false,
        contentType:"application/json;charset=utf-8",
        crossDomain:true,
        headers:{"authorization":sessionStorage.authorization},
        dataType:'json',
        success:function(data){
            if(data.success){
                for(var i=0;i<data.data.length;i++){
                    if(data.data[i].bidSubjectId==$("#edit-subject").val()){
                        $("#edit-subject2").find("option").remove();
                        if(data.data[i].bidSubjectViews){
                            for(var i2=0;i2<data.data[i].bidSubjectViews.length;i2++){
                                $("#edit-subject2").append(returnOption(data.data[i].bidSubjectViews[i2].bidSubjectId,data.data[i].bidSubjectViews[i2].name,data.data[i].bidSubjectViews[i2].pid));
                            }
                            break;
                        }
                    }
                }
            }
        }
    })
}