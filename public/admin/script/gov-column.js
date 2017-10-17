getData();
function getData(type){
    $.ajax({
        url:bidBaseUrl+"/platform/subject/list",
        type:"post",
        contentType:"application/json;charset=utf-8",
        crossDomain:true,
        headers:{"authorization":sessionStorage.authorization},
        dataType:"json",
        success:function (data) {
            if(data.success){
                var a=[];
                $(".pid-column").find("option").remove();
                $(".pid-column-modal").find("option").remove();
                $(".pid-column-modal").append(returnOption(0,"顶级分类"));
                $(".pid-column").append(returnOption(0,"顶级分类"));
                for(var i=0;i<data.data.length;i++){
                    $(".pid-column").append(returnOption(data.data[i].bidSubjectId,data.data[i].name));
                    $(".pid-column-modal").append(returnOption(data.data[i].bidSubjectId,data.data[i].name));
                    a.push({"bidSubjectId":data.data[i].bidSubjectId,"pid":data.data[i].pid,"name":data.data[i].name,"sequence":data.data[i].sequence});
                    if(data.data[i].bidSubjectViews.length){
                        for(var i2=0;i2<data.data[i].bidSubjectViews.length;i2++){
                            a.push({"bidSubjectId":data.data[i].bidSubjectViews[i2].bidSubjectId,"pid":data.data[i].bidSubjectViews[i2].pid,"name":data.data[i].bidSubjectViews[i2].name,"sequence":data.data[i].bidSubjectViews[i2].sequence});
                        }
                    }
                }
                if(type=="refresh"){
                    $("#column-list").bootstrapTable("load",a);
                }
                else{
                    $("#column-list").bootstrapTable({
                        // url:"",
                        idField:'bidSubjectId',
                        pagination:true,
                        data:a,
                        columns:[[
                            {field:'pid',title:'FID'},
                            {field:'name',title:'栏目名称',formatter:function(value,row,index){
                                if(row.pid==0){
                                    return "["+value+"]";
                                }
                                else{
                                    return '|----'+value;
                                }
                            }},
                            {field:"sequence",title:'排序'},
                            {field:'',title:"操作",formatter:function(value,row,index){
                                return "<a href='#' onclick='edit("+JSON.stringify(row)+")'>编辑</a> &nbsp;&nbsp; <a href='#' onclick='del("+row.bidSubjectId+")'>删除</a>"
                            }}
                        ]]});
                }
            }
        }
    });
}

function add(){
    if(!$(".column-name").val()){
        alert("请输入要创建的栏目名称！");
        return;
    }
    else{
        var a={"name":$(".column-name").val(),"pid":$(".pid-column").val()};
        $.ajax({
            url:bidBaseUrl+"/platform/subject/add",
            type:"post",
            contentType:"application/json;charset=utf-8",
            crossDomain:true,
            headers:{"authorization":sessionStorage.authorization},
            data:JSON.stringify(a),
            dataType:"json",
            success:function(data){
                if(data.success){
                    alert("添加成功！");
                    getData("refresh");
                }
                else{
                    alert(data.errorMsg);
                }
            },
            error:function(data){
                alert("添加失败，请重试！");
            }
        })
    }
}

function del(id){
    if(confirm("确认删除该栏目？")){
        $.ajax({
            url:bidBaseUrl+"/platform/subject/delete",
            type:"post",
            contentType:"application/json;charset=utf-8",
            crossDomain:true,
            headers:{"authorization":sessionStorage.authorization},
            data:JSON.stringify({"bidSubjectId":id}),
            dataType:"json",
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

}

function edit(row){
    $(".pid-column-modal").val(row.pid);
    $(".column-name-modal").val(row.name);
    $(".column-sequence-modal").val(row.sequence);
    $("#edit-modal").modal("show");
    $("#edit-save").attr("onclick","editSave("+row.bidSubjectId+")");
}
function editSave(id){
    if(!$(".column-name-modal").val()){
        alert("请输入栏目名！");
        return ;
    }
    else{
        $.ajax({
            url:bidBaseUrl+"/platform/subject/edit",
            type:"post",
            contentType:"application/json;charset=utf-8",
            crossDomain:true,
            headers:{"authorization":sessionStorage.authorization},
            data:JSON.stringify({"name":$(".column-name-modal").val(),"bidSubjectId":id,"pid":$(".pid-column-modal").val(),"sequence":$(".column-sequence-modal").val()}),
            dataType:"json",
            success:function(data){
                if(data.success){
                    alert("修改成功！");
                    getData("refresh");
                    $("#edit-modal").modal("hide");
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
}