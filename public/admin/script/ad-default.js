function getData(type,data){
    if(!data){
        data={pageNum:0,pageSize:0};
    }
    $.ajax({
        url: adBaseUrl + "/platform/ad/placement/page",
        type: "post",
        contentType: "application/json;charset=utf-8",
        crossDomain: true,
        headers: {"authorization": sessionStorage.authorization},
        data: JSON.stringify(data),
        dataType: "json",
        success: function (data) {
            if(data.success){
                var a=[];
                a=data.data.list;
                if(type=="load"||!type){
                    $("#ad-default-list").bootstrapTable({
                        // url:"",
                        idField:'adPlacementId',
                        pagination:true,
                        data:a,
                        columns:[[
                            {field:'adPlacementName',title:'广告位置',align:"center"},
                            {field:"adPlacementPriceViews",title:"原价",align:'center',formatter:function (value, row, index) {
                                var content="";
                                for(var i=0;i<value.length;i++){
                                    content+=value[i].price+"/"+value[i].adPlacementPriceUnitView.unit+"&nbsp;&nbsp;";
                                }
                                return content;
                            }},
                            {field:'imageDefault',title:'默认广告',align:'center',formatter:function(value,row,index){
                                if(value){
                                    return "<img src='"+value+"'>";
                                }
                                else{
                                    return "无图片";
                                }

                            }},
                            {field:'linkDefault',title:'链接地址',align:'center'},
                            {field:'',title:"操作",align:'center',formatter:function(value,row,index){
                                return "<a href='#' onclick='edit("+row+")'>编辑</a> &nbsp; <a href='#' onclick='changePrice("+row+")'>修改价格</a>";
                            }}
                        ]]
                    });
                }
                else{
                    $("#ad-list").bootstrapTable("load",a)
                }

            }
            else{
                alert(data.errorMsg);
            }
        },
        error:function (error){
            alert("获取数据失败，请重试！");
        }
    })
}

function edit(row){
    $("#ad-edit-modal .modal-body span").eq(0).text(row.platform+"--"+row.position);
    $("#ad-edit-modal .modal-body input").eq(0).val(row.linkDefault);
    $("#ad-edit-modal").modal("show");
}