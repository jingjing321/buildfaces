var a={"pageNum":0,"pageSize":0};
getData(a);
function getData(data){
    $.ajax({
        url:baseUrl+"/platform/manager/page",
        type:'post',
        contentType:"application/json;charset=utf-8",
        crossDomain:true,
        headers:{"authorization":sessionStorage.authorization},
        data:JSON.stringify(data),
        dataType:'json',
        success:function(data){
            $("#user-list").bootstrapTable({
                data:data.data.list,
                idField:'managerId',
                pagination:true,
                columns:[[
                    {field:'password',checkbox:true,align:'center'},
                    {field:'adDiscount',title:'广告折扣',align:"center",editable:{
                        type:"number",
                        title:"广告折扣"
                    }},
                    {field:"managerId",title:"编号",align:'center'},
                    {field:'accountName',title:'登录账户',align:'center',editable:{
                        type:"text",
                        title:"登录账户",
                        validate:function(v){
                            if(!v) return "登录账户不能为空！";
                        }
                    }},
                    {field:'name',title:'姓名',align:'center',editable: {
                            type: 'text',
                            title: '用户名',
                            validate: function (v) {
                                if (!v) return '用户名不能为空';

                            }
                        }
                    },
                    {field:'sex',title:"性别",align:'center',formatter:function(value,row,index){
                            if(!value){
                                return '男';
                            }
                            else{
                                return '女';
                            }

                    },editable:{
                        type:'select',
                        title:"性别",
                        source:[{value:"0",text:"男"},{value:"1",text:"女"}]
                    }},
                    {field:'phone',title:"手机号码",align:'center',editable:{
                        type:'text',
                        title:"手机号码",
                        validate:function(v){
                            if(!(/^1[34578]\d{9}$/.test(v))){
                                return "请填写正确的手机号！"
                            }
                        }
                    }},
                    {field:'qq',title:"QQ号码",align:'center',editable:{
                        type:'text',
                        title:"QQ号码"
                    }},
                    {field:'roleId',title:"角色",align:'center'
                    //     ,editable:{
                    //     type:"select",
                    //     title:"角色",
                    //     source:function(){
                    //         var result=[];
                    //         $.ajax({
                    //             url:baseUrl+"/platform/basic/roleType/list",
                    //             type:"post",
                    //             contentType:"application/json;charset=utf-8",
                    //             crossDomain:true,
                    //             headers:{"authorization":sessionStorage.authorization},
                    //             dataType:'json',
                    //             success:function(data){
                    //                 if(data.success){
                    //                     $.each(data.data,function(i,value){
                    //                         result.push({value:value.roleTypeId,text:value.typeName});
                    //                     })
                    //                 }
                    //             }
                    //         });
                    //         return result;
                    //     }
                    // }
                    },
                    {field:"companyId",title:"公司",align:"center"
                    //     ,editable:{
                    //     type:"select",
                    //     title:"公司",
                    //     source:function(){
                    //         var result=[];
                    //         $.ajax({
                    //             url:baseUrl+"/platform/basic/company/list",
                    //             type:"post",
                    //             async:false,
                    //             contentType:"application/json;charset=utf-8",
                    //             crossDomain:true,
                    //             headers:{"authorization":sessionStorage.authorization},
                    //             dataType:'json',
                    //             success:function(data){
                    //                 if(data.success){
                    //                     $.each(data.data,function(i,value){
                    //                         result.push({value:value.companyId,text:value.companyName});
                    //                     })
                    //                 }
                    //             }
                    //         });
                    //         return result;
                    //     }
                    // }
                    },
                    {field:"departmentId",title:"部门",align:"center"
                    //     ,editable:{
                    //     type:"select",
                    //     title:"部门",
                    //     source:function(){
                    //         var result=[];
                    //         $.ajax({
                    //             url:baseUrl+"/platform/basic/department/list",
                    //             type:"post",
                    //             contentType:"application/json;charset=utf-8",
                    //             crossDomain:true,
                    //             headers:{"authorization":sessionStorage.authorization},
                    //             dataType:'json',
                    //             success:function(data){
                    //                 if(data.success){
                    //                     $.each(data.data,function(i,value){
                    //                         result.push({value:value.departmentId,text:value.departmentName});
                    //                     })
                    //                 }
                    //             }
                    //         });
                    //         return result;
                    //     }
                    // }
                    },
                    {field:'valid',title:"有效",align:'center',formatter:function(value,row,index){
                        if(value){
                            return "<i class='icon-ok'></i>"
                        }
                        else{
                            return "<i class='icon-remove'></i>"
                        }
                    }},
                    {field:'loginCount',title:"登录次数",align:'center'},
                    {field:'ctime',title:"最后登录时间",align:'center'}
                ]],
                onEditableSave:function (field, row, oldValue, $el) {
                    $.ajax({
                        url:baseUrl+"/platform/manager/edit",
                        type:"post",
                        contentType:"application/json;charset=utf-8",
                        crossDomain:true,
                        headers:{"authorization":sessionStorage.authorization},
                        data:JSON.stringify(row),
                        dataType:'json',
                        success:function(data){
                            if(!data.success){
                                alert(data.errorMsg);
                                $el.text(oldValue);
                            }
                        },
                        error:function(error){
                            alert("信息修改失败，请重试！");
                            $el.text(oldValue);

                        }
                    })
                }
            });
            $("#user-list").bootstrapTable("uncheckAll");
        }
    })
}
 function refresh(){
     var a={"pageNum":0,"pageSize":0};
     $.ajax({
         url:baseUrl+"/platform/manager/page",
         type:'post',
         contentType:"application/json;charset=utf-8",
         crossDomain:true,
         headers:{"authorization":sessionStorage.authorization},
         data:JSON.stringify(a),
         dataType:'json',
         success:function(data){
             $("#user-list").bootstrapTable("load",data.data.list);
         }
     })
 }

 function add_user(){
     $("#add-admin")[0].reset();
     $("#add-admin #user-modal-submit")[0].value="添加用户";
     getlist("position","#positionId");
     getlist("rank","#rankId");
     getlist("company","#companyId");
     getlist("department","#departmentId");
     getlist("roleType","#roleId","typeName");
     $("#user-modal-submit").attr("onclick","new_user()");
     $('#user-add-modal').modal("show")
 }

 function new_user(){
    var a=$("#add-admin").serializeJSON();
    if(a.valid){
        a.valid=true;
    }
    for(var i=0;i<$("#add-admin").find("input").length;i++){
        if(!$("#add-admin").find("input")[i].validity.valid){
            return;
        }
    }
    $.ajax({
        url:baseUrl+"/platform/manager/add",
        type:"post",
        contentType:"application/json;charset=utf-8",
        crossDomain:true,
        headers:{"authorization":sessionStorage.authorization},
        data:JSON.stringify(a),
        dataType:'json',
        success:function(data){
            if(data.success){
                $("#add-admin")[0].reset();
                $("#user-add-modal").modal("hide");
                alert("用户添加成功！");
                refresh();
            }
            else {
                alert(data.errorMsg);
            }

        },
        error:function (error) {
            alert("用户添加失败，请重试！")
        }
    })
 }

 function reset_password(){
     var a=$("#user-list").bootstrapTable("getSelections");
     if(a.length!=1){
         alert("请选择一个用户！");
         return ;
     }
     var managerId=a[0].managerId;
     var password=prompt("请输入新密码：","");
     if(managerId&&password){
         var data={"managerId":managerId,"password":password};
         $.ajax({
             url:baseUrl+"/platform/manager/password/reset",
             type:"post",
             contentType:"application/json;charset=utf-8",
             crossDomain:true,
             headers:{"authorization":sessionStorage.authorization},
             data:JSON.stringify(data),
             dataType:'json',
             success:function(data){
                 if(data.success){
                     alert("密码重置成功！");
                 }
                 else{
                     alert(data.errorMsg);
                 }
             },
             error:function(error){
                 alert("密码重置失败，请重试！");
             }
         })
     }
     else{
         alert("请输入密码！")
     }
 }

 function edit(){
     var a=$("#user-list").bootstrapTable("getSelections");
     if(a.length!=1){
         alert("请选择一个用户！");
         return ;
     }
     var managerId=a[0].managerId;
     $.ajax({
         url:baseUrl+"/platform/manager/get",
         type:'post',
         contentType:"application/json;charset=utf-8",
         crossDomain:true,
         headers:{"authorization":sessionStorage.authorization},
         data:JSON.stringify(managerId),
         dataType:'json',
         success:function(data){
             if(data.success){
                 $("#add-admin #user-modal-submit")[0].value="修改信息";
                 $("#add-admin select").find("option").remove();
                 $("#sex").append(returnOption("0","男")+returnOption("1","女"));
                 getlist("position","#positionId");
                 getlist("rank","#rankId");
                 getlist("company","#companyId");
                 getlist("department","#departmentId");
                 getlist("roleType","#roleId","typeName");
                 for(var i=0;i<$("#add-admin").find("input").length;i++){
                     if(data.data[$("#add-admin").find("input").eq(i)[0].name]){
                         $("#add-admin").find("input").eq(i).val(data.data[$("#add-admin").find("input").eq(i)[0].name]);
                     }
                 }
                 for(var i=0;i<$("#add-admin").find("select").length;i++){
                     if(data.data[$("#add-admin").find("select").eq(i)[0].name]){
                         $("#add-admin").find("select").eq(i)[0].value=data.data[$("#add-admin").find("select").eq(i)[0].name];
                     }
                 }
                 if(data.data.valid){
                     $("#add-admin #valid")[0].checked=true;
                 }
                 $("#add-admin textarea").val(data.data.description);
                 $("#user-modal-submit").attr("onclick","edit_user("+managerId+")");
                 $('#user-add-modal').modal("show");
             }
         }
     });


 }
 function edit_user(managerId){
     var a=$("#add-admin").serializeJSON();
     if(a.valid){
         a.valid=true;
     }
     else{
         a.valid=false;
     }
     a.managerId=managerId;
     for(var i=0;i<$("#add-admin").find("input").length;i++){
         if(!$("#add-admin").find("input")[i].validity.valid){
             return;
         }
     }
     $.ajax({
         url:baseUrl+"/platform/manager/edit",
         type:"post",
         contentType:"application/json;charset=utf-8",
         crossDomain:true,
         headers:{"authorization":sessionStorage.authorization},
         data:JSON.stringify(a),
         dataType:'json',
         success:function(data){
             if(data.success){
                 $("#add-admin")[0].reset();
                 $("#user-add-modal").modal("hide");
                 alert("信息修改成功！");
                 refresh();
             }
             else {
                 alert(data.errorMsg);
             }

         },
         error:function (error) {
             alert("信息修改失败，请重试！")
         }
     })
 }
function del(){
    var a=$("#user-list").bootstrapTable("getSelections");
    if(a.length!=1){
        alert("请选择一个用户！");
        return ;
    }
    var managerId=a[0].managerId;
    $.ajax({
        url: baseUrl + "/platform/manager/delete",
        type: 'post',
        contentType: "application/json;charset=utf-8",
        crossDomain: true,
        headers: {"authorization": sessionStorage.authorization},
        data: JSON.stringify(managerId),
        dataType: 'json',
        success: function (data) {
            if(data.success){
                alert("用户删除成功！");
                refresh();
            }
            else{
                alert(data.errorMsg)
            }
        },
        error:function(error){
            alert("用户删除失败，请重试！");
        }
    })
}