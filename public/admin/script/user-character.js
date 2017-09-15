var a={"pageNum":0,"pageSize":0};
getData(a);
function getData(data){
    $.ajax({
        url:baseUrl+"/platform/manager/role/page",
        type:'post',
        contentType:"application/json;charset=utf-8",
        crossDomain:true,
        headers:{"authorization":sessionStorage.authorization},
        data:JSON.stringify(data),
        dataType:'json',
        success:function(data){
            if(data.success){
                $("#user-character-list").bootstrapTable({
                    idField:'roleId',
                    pagination:true,
                    data:data.data.list,
                    columns:[[
                        {field:'',checkbox:true,align:'center'},
                        {field:'roleId',title:'角色编号',align:"center"},
                        {field:"name",title:"角色名称",align:'center'},
                        {field:'roleTypeId',title:'角色分类',align:'center'},
                        {field:'valid',title:'有效',align:'center',formatter:function(value,row,index){
                            if(value){
                                return '<i class="icon-ok"></i>'
                            }
                            else{
                                return '<i class="icon-remove"></i>'
                            }
                        }},
                        {field:'modifiable',title:"允许编辑",align:'center',formatter:function(value,row,index){
                            if(value){
                                return '<i class="icon-ok"></i>'
                            }
                            else{
                                return '<i class="icon-remove"></i>'
                            }
                        }},
                        // {field:'5',title:"允许删除",align:'center',formatter:function(value,row,index){
                        //     if(value){
                        //         return '<i class="icon-ok"></i>'
                        //     }
                        //     else{
                        //         return '<i class="icon-remove"></i>'
                        //     }
                        // }},
                        {field:'description',title:"描述",align:'center'}
                    ]]
                });
            }
            else{
                alert(data.errorMsg);
            }
        }
    })
}

var setting = {
    view: {
        showIcon: false
    },
    data: {
        simpleData: {
            enable: true
        }
    }
};

var zNodes =[
    { id:1, pId:0, name:"中建兴业", open:true},
    { id:11, pId:1, name:"绍兴分公司"},
    { id:12, pId:1, name:"上海分公司"},
    { id:13, pId:1, name:"温州分公司"},
    { id:14, pId:1, name:"重庆分公司"}
];

 function showIconForTree(treeId, treeNode) {
    return !treeNode.isParent;
};

$(document).ready(function(){
    $.fn.zTree.init($("#treeDemo"), setting, zNodes);
});

function refresh(){
    var a={'pageName':0,"pageSize":0};
    $.ajax({
        url:baseUrl+"/platform/manager/role/page",
        type:'post',
        contentType:"application/json;charset=utf-8",
        crossDomain:true,
        headers:{"authorization":sessionStorage.authorization},
        data:JSON.stringify(data),
        dataType:'json',
        success:function(data){
            if(data.success){
                $("#user-character-list").bootstrapTable("load",data.data.list)
            }
            else{
                alert(data.errorMsg);
            }
        },
        error:function(error){
            alert("加载失败，请重试");
        }
    })
}
function add(){
    $("#add-role")[0].reset();
    $("#add-role #role-modal-submit")[0].value="添加角色";
    getlist("roleType","#roleType");
    $("#add-role #role-modal-submit").attr("onclick","new_role()");
    $("#character-add-modal").modal("show");
}
function new_role(){
    var a=$("#add-role").serializeJSON();
    if(!a.valid){
        a.valid=false;
    }
    if(!a.modifiable){
        a.modifiable=false;
    }
    for(var i=0;i<$("#add-role").find("input").length;i++){
        if(!$("#add-role").find("input")[i].validity.valid){
            return;
        }
    }
    $.ajax({
        url:baseUrl+"/platform/manager/role/add",
        type:"post",
        contentType:"application/json;charset=utf-8",
        crossDomain:true,
        headers:{"authorization":sessionStorage.authorization},
        data:JSON.stringify(a),
        dataType:'json',
        success:function(data){
            if(data.success){
                $("#character-add-modal").modal("hide");
                alert("角色添加成功！");
                refresh();
            }
            else{
                alert(data.errorMsg);
            }
        },
        error:function(error){
            alert("角色添加失败，请重试！");
        }
    })
}
function edit(){
    $("user-character-list").bootstrapTable('getSelections');
    if(a.length!=1){
        alert("请选择一个用户！");
        return;
    }
    for(var i=0;i<$("#add-role").find("input").length;i++){
        if(data.data[$("#add-role").find("input").eq(i)[0].name]){
            $("#add-role").find("input").eq(i).val(a[0][$("#add-role").find("input").eq(i)[0].name]);
        }
    }
    for(var i=0;i<$("#add-role").find("select").length;i++){
        if(data.data[$("#add-role").find("select").eq(i)[0].name]){
            $("#add-role").find("select").eq(i)[0].value=a[0][$("#add-role").find("select").eq(i)[0].name];
        }
    }

}
