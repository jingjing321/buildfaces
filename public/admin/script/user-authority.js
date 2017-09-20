var setting = {
    view: {
        showIcon: false,
        showLine:false
    },
    data: {
        simpleData: {
            enable: true
        }
    },
    callback:{
        onClick:function(event,treeId,treeNode){
            getRole(treeNode.id);
        }
    }
};

 function showIconForTree(treeId, treeNode) {
    return !treeNode.isParent;
};

 function getCompany(){
     var zNodes=[];
     $.ajax({
         url: baseUrl + "/platform/basic/company/list",
         type: "post",
         contentType: "application/json;charset=utf-8",
         crossDomain: true,
         headers: {"authorization": sessionStorage.authorization},
         dataType: 'json',
         success: function (data) {
             if (data.success) {
                 for (var i = 0; i < data.data.length; i++) {
                     var a = {"id": data.data[i].companyId, "name": data.data[i].companyName, "pId": 0};
                     zNodes.push(a);
                 };
                 $.fn.zTree.init($("#company-list"), setting, zNodes);
             }
         }
     });
 }

 getCompany();
var setting3 = {
    view: {
        showIcon: false,
        showLine:false
    },
    data: {
        simpleData: {
            enable: true
        }
    },
    callback:{
        onClick:function(event,treeId,treeNode){
            query(treeNode.id,treeNode.name);
        }
    }
};

function getRole(a){
    if(!a){
        a={'pageName':0,"pageSize":0}
    }
    else{
        a={'pageName':0,"pageSize":0,"condition":{"companyId":a}};
    }
    var zNodes=[];
    $.ajax({
        url: baseUrl + "/platform/manager/role/page",
        type: "post",
        contentType: "application/json;charset=utf-8",
        crossDomain: true,
        headers: {"authorization": sessionStorage.authorization},
        data:JSON.stringify(a),
        dataType: 'json',
        success: function (data) {
            if (data.success) {
                for (var i = 0; i < data.data.list.length; i++) {
                    var a = {"id": data.data.list[i].roleId, "name": data.data.list[i].name, "pId": 0};
                    zNodes.push(a);
                };
                $.fn.zTree.init($("#role-list"), setting3, zNodes);
            }
        }
    });
}
getRole();

// var zTreeNodes;
// var setting2 = {
//     view: {
//         showLine: false,
//         showIcon: false,
//         addDiyDom: addDiyDom
//     },
//     data: {
//         simpleData: {
//             enable: true
//         }
//     },
//     check:{
//         enable:true
//     }
// };
// /**
// * 自定义DOM节点
// */
// function addDiyDom(treeId, treeNode) {
//     var spaceWidth = 15;
//     var liObj = $("#" + treeNode.tId);
//     var aObj = $("#" + treeNode.tId + "_a");
//     var switchObj = $("#" + treeNode.tId + "_switch");
//     var icoObj = $("#" + treeNode.tId + "_ico");
//     var spanObj = $("#" + treeNode.tId + "_span");
//     aObj.attr('title', '');
//     aObj.append('<div class="diy swich"></div>');
//     var div = $(liObj).find('div').eq(0);
//     switchObj.remove();
//     spanObj.remove();
//     icoObj.remove();
//     div.append(switchObj);
//     div.append(spanObj);
//     var spaceStr = "<span style='height:1px;display: inline-block;width:" + (spaceWidth * treeNode.level) + "px'></span>";
//     switchObj.before(spaceStr);
//     var editStr = '';
//     editStr += '<div class="diy">' + (treeNode.CONTACT_USER == null ? '&nbsp;' : treeNode.CONTACT_USER) + '</div>';
//     var corpCat = '<div title="' + treeNode.CORP_CAT + '">' + treeNode.CORP_CAT + '</div>';
//     editStr += '<div class="diy">' + (treeNode.CORP_CAT == '-' ? '&nbsp;' : corpCat ) + '</div>';
//     editStr += '<div class="diy">' + (treeNode.CONTACT_PHONE == null ? '&nbsp;' : treeNode.CONTACT_PHONE ) + '</div>';
//     editStr += '<div class="diy">' +"&nbsp;"+ '</div>';
//     aObj.append(editStr);
// }
// /**
//  * 查询数据
// */
// function query() {
//     var data = [{"CONTACT_USER":"张三","CONTACT_PHONE":"18888888888","addFlag":true,"ORG_ID":1,"id":"o1","pId":"onull","open":true,"name":"单位1","modFlag":true,"CORP_CAT":"港口-天然液化气,港口-液化石油气","TYPE":"org","delFlag":true},
//     {"CONTACT_USER":null,"SECTOR_NAME":"部门1","addFlag":true,"CONTACT_PHONE":null,"SECTOR_ID":1,"ORG_ID":1,"id":"s1","pId":"o1","name":"部门1","modFlag":true,"PARENT_ID":null,"CORP_CAT":"港口-天然液化气","TYPE":"sector","delFlag":true},
//     {"CONTACT_USER":null,"SECTOR_NAME":"部门12","addFlag":true,"CONTACT_PHONE":"0","SECTOR_ID":2,"ORG_ID":1,"id":"s2","pId":"s1","name":"部门12","modFlag":true,"PARENT_ID":1,"CORP_CAT":"港口-集装箱","TYPE":"sector","delFlag":true},
//     {"CONTACT_USER":null,"SECTOR_NAME":"部门13","addFlag":true,"CONTACT_PHONE":"0","SECTOR_ID":3,"ORG_ID":1,"id":"s3","pId":"s1","name":"部门13","modFlag":true,"PARENT_ID":1,"CORP_CAT":"港口-集装箱","TYPE":"sector","delFlag":true},
//     {"CONTACT_USER":null,"SECTOR_NAME":"部门24","addFlag":true,"CONTACT_PHONE":"0","SECTOR_ID":4,"ORG_ID":1,"id":"s4","pId":"s2","name":"部门24","modFlag":true,"PARENT_ID":2,"CORP_CAT":"港口-集装箱","TYPE":"sector","delFlag":true},
//     {"CONTACT_USER":null,"SECTOR_NAME":"部门35","addFlag":true,"CONTACT_PHONE":"0","SECTOR_ID":5,"ORG_ID":1,"id":"s5","pId":"s3","name":"部门35","modFlag":true,"PARENT_ID":3,"CORP_CAT":"港口-集装箱","TYPE":"sector","delFlag":true},
//     {"CONTACT_USER":null,"SECTOR_NAME":"部门22","addFlag":true,"CONTACT_PHONE":"0","SECTOR_ID":8,"ORG_ID":1,"id":"s8","pId":"s2","name":"部门22","modFlag":true,"PARENT_ID":2,"CORP_CAT":"-","TYPE":"sector","delFlag":true},
//     {"CONTACT_USER":null,"SECTOR_NAME":"部门23","addFlag":true,"CONTACT_PHONE":"0","SECTOR_ID":9,"ORG_ID":1,"id":"s9","pId":"s2","name":"部门23","modFlag":true,"PARENT_ID":2,"CORP_CAT":"-","TYPE":"sector","delFlag":true},
//     {"CONTACT_USER":"打撒","SECTOR_NAME":"不爱的是分散","addFlag":true,"CONTACT_PHONE":"1231231","SECTOR_ID":21,"ORG_ID":1,"id":"s21","pId":"o1","name":"不爱的是分散","modFlag":true,"PARENT_ID":null,"CORP_CAT":"港口-天然液化气","TYPE":"sector","delFlag":true},
//     {"CONTACT_USER":"111","SECTOR_NAME":"test","addFlag":true,"CONTACT_PHONE":"222","SECTOR_ID":29,"ORG_ID":1,"id":"s29","pId":"s2","name":"test","modFlag":true,"PARENT_ID":2,"CORP_CAT":"港口-集装箱","TYPE":"sector","delFlag":true},
//     {"CONTACT_USER":null,"SECTOR_NAME":"22","addFlag":true,"CONTACT_PHONE":null,"SECTOR_ID":38,"ORG_ID":1,"id":"s38","pId":"o1","name":"22","modFlag":true,"PARENT_ID":null,"CORP_CAT":"-","TYPE":"sector","delFlag":true},
//     {"CONTACT_USER":null,"SECTOR_NAME":"部门9","addFlag":true,"CONTACT_PHONE":null,"SECTOR_ID":61,"ORG_ID":1,"id":"s61","pId":"o1","name":"部门9","modFlag":true,"PARENT_ID":null,"CORP_CAT":"港口-天然液化气","TYPE":"sector","delFlag":true},
//     {"CONTACT_USER":"sara","SECTOR_NAME":"流星雨","addFlag":true,"CONTACT_PHONE":"11111111111","SECTOR_ID":141,"ORG_ID":1,"id":"s141","pId":"s1","name":"流星雨","modFlag":true,"PARENT_ID":1,"CORP_CAT":"-","TYPE":"sector","delFlag":true},
//     {"CONTACT_USER":"流星","SECTOR_NAME":"1级部门","addFlag":true,"CONTACT_PHONE":"11111111111","SECTOR_ID":142,"ORG_ID":1,"id":"s142","pId":"o1","name":"1级部门","modFlag":true,"PARENT_ID":null,"CORP_CAT":"港口-天然液化气","TYPE":"sector","delFlag":true},
//     {"CONTACT_USER":"11","SECTOR_NAME":"11","addFlag":true,"CONTACT_PHONE":"11111111111","SECTOR_ID":145,"ORG_ID":1,"id":"s145","pId":"s1","name":"11","modFlag":true,"PARENT_ID":1,"CORP_CAT":"港口-集装箱","TYPE":"sector","delFlag":true},
//     {"CONTACT_USER":"ff","SECTOR_NAME":"fff","addFlag":true,"CONTACT_PHONE":"11","SECTOR_ID":146,"ORG_ID":1,"id":"s146","pId":"s1","name":"fff","modFlag":true,"PARENT_ID":1,"CORP_CAT":"港口-油码头","TYPE":"sector","delFlag":true},
//     {"CONTACT_USER":"1","SECTOR_NAME":"1","addFlag":true,"CONTACT_PHONE":"1","SECTOR_ID":161,"ORG_ID":1,"id":"s161","pId":"o1","name":"1","modFlag":true,"PARENT_ID":null,"CORP_CAT":"港口-天然液化气","TYPE":"sector","delFlag":true}];
//     //初始化列表
//     zTreeNodes = data;
//     //初始化树
//     $.fn.zTree.init($("#dataTree"), setting2, zTreeNodes);
//     //添加表头
//     var li_head = ' <li class="head"><a><div class="diy">模块(菜单)名称</div><div class="diy">模块编码</div><div class="diy">模块分类</div>' +
//         '<div class="diy">排序</div><div class="diy">说明</div></a></li>';
//     var rows = $("#dataTree").find('li');
//     if (rows.length > 0) {
//         rows.eq(0).before(li_head)
//     } else {
//         $("#dataTree").append(li_head);
//         $("#dataTree").append('<li ><div style="text-align: center;line-height: 30px;" >无符合条件数据</div></li>')
//     }
// }
//
// $(function () {
//     //初始化数据
//     query();
// })



var zTreeNodes;
var setting2 = {
    view: {
        showLine: false,
        showIcon: false,
        addDiyDom: addDiyDom
    },
    data: {
        simpleData: {
            enable: true
        }
    },
    check:{
        enable:true,
        chkboxType: { "Y": "ps", "N": "ps" }
    },
    expendAll:true
};
/**
* 自定义DOM节点
*/
function addDiyDom(treeId, treeNode) {
    var aObj = $("#" + treeNode.tId + "_a");
    if ($("#diyBtn_"+treeNode.id).length>0) return;
    if(treeNode.permission){
        var editStr = "<span class='permission'>&nbsp;&nbsp;已授权</span>";
    }
    else{
        var editStr = "<span class='permission'>&nbsp;&nbsp;未授权</span>";
    }
    aObj.append(editStr);
}

function query(roleId,roleName) {
    if(!roleId){
        roleId=1;
    }
    if(!roleName){
        roleName="超级管理员";
    }
    var data=[];
    $.ajax({
        url:baseUrl+"/platform/basic/module/struct/get",
        type:'post',
        contentType:"application/json;charset=utf-8",
        crossDomain:true,
        headers:{"authorization":sessionStorage.authorization},
        dataType:'json',
        success:function(msg){
            if(msg.success){
                for(var i1=0;i1<msg.data.length;i1++){
                    var a={"id":msg.data[i1].moduleId,"name":msg.data[i1].name,"pId":msg.data[i1].pid,"permission":false,"open":true};
                    data.push(a);
                    for(var i2=0;i2<msg.data[i1].moduleViews.length;i2++){
                        var a={"id":msg.data[i1].moduleViews[i2].moduleId,"name":msg.data[i1].moduleViews[i2].name,"pId":msg.data[i1].moduleViews[i2].pid,"permission":false};
                        data.push(a);
                    }
                }
                $.ajax({
                    url:baseUrl+"/platform/manager/role/module/get",
                    type:'post',
                    contentType:"application/json;charset=utf-8",
                    crossDomain:true,
                    headers:{"authorization":sessionStorage.authorization},
                    data:JSON.stringify(roleId),
                    dataType:'json',
                    success:function(msg){
                        if(msg.success){
                            for(var i=0;i<msg.data.moduleIds.length;i++){
                                for(var i2=0;i2<data.length;i2++){
                                    if(data[i2].id==msg.data.moduleIds[i]){
                                        data[i2].permission=true;
                                        data[i2].checked=true;
                                        break;
                                    }
                                }
                            }
                            $("#roleName").text("当前角色为："+roleName);
                            $("#roleName").attr("data-role-name",roleName);
                            $("#roleName").attr("data-role-id",roleId);
                            //初始化列表
                            zTreeNodes = data;
                            //初始化树
                            $.fn.zTree.init($("#dataTree"), setting2, zTreeNodes);
                        }
                        else{
                            alert(msg.errorMsg);
                        }
                    }

                })
            }
            else{
                alert("msg.errorMsg");
                return;
            }
        }
    });

}

$(function () {
    //初始化数据
    query();
});

function setModule(){
    var treeObj = $.fn.zTree.getZTreeObj("dataTree");
    var nodes = treeObj.getCheckedNodes(true);
    var moduleIds=[];
    for(var i=0;i<nodes.length;i++){
        moduleIds.push(nodes[i].id);
    }
    var data={"moduleIds":moduleIds,"roleId":$("#roleName").attr("data-role-id")};
    $.ajax({
        url:baseUrl+"/platform/manager/role/module/set",
        type:'post',
        contentType:"application/json;charset=utf-8",
        crossDomain:true,
        headers:{"authorization":sessionStorage.authorization},
        data:JSON.stringify(data),
        dataType:'json',
        success:function (msg) {
            if(msg.success){
                alert("授权成功!");
            }
            else{
                alert(msg.errorMsg);
            }
        },
        error:function(error){
            alert("授权失败，请重试！");
        }
    })
}
function reset(){
    query($("#roleName").attr("data-role-id"),$("#roleName").attr("data-role-name"));
}
function ref(){
    getCompany();
    getRole();
    query();
}