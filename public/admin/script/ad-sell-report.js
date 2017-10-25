getData();
function getData(type,data){
    if(!data){
        data={pageNum:0,pageSize:0};
    }
    $.ajax({
        url: adBaseUrl + "/platform/ad/statistics/collect/page",
        type: "post",
        contentType: "application/json;charset=utf-8",
        crossDomain: true,
        headers: {"authorization": sessionStorage.authorization},
        data: JSON.stringify(data),
        dataType: "json",
        success: function (data) {
            if (data.success) {
                var a = [];
                a = data.data.list;
                if (type == "load" || !type) {
                    $("#sell-report-list").bootstrapTable({
                        // url:"",
                        idField:'id',
                        pagination:true,
                        data:a,
                        columns:[[
                            {field:'year',title:'时间段',align:"center",formatter:function(value,row,index){
                                return value+"年"+row.month+"月";
                            }},
                            {field:"sitName",title:"城市站点",align:'center'},
                            {field:'platform',title:'终端',align:'center'},
                            {field:'managerId',title:'管理员账号',align:'center'},
                            {field:'amount',title:"销售总额",align:'center'},
                            {field:'',title:"详情",align:'center',formatter:function(value,row,index){
                                return "<a href='#' onclick='getDetail("+row+")'>详情记录</a>"
                            }}
                        ]]
                    });
                }
                else{
                    $("#sell-report-list").bootstrapTable("load",a);
                }
            }
            else{
                alert(data.errorMsg)
            }
        },
        error:function (error) {
            alert("获取数据失败，请重试！");
        }
    })
}

function getDetail(row){
    var data={pageSize:0,pageNum:0};
    data.condition={siteId:row.siteId,managerId:row.managerId,year:row.year,month:row.month,platform:row.platform};
    $.ajax({
        url:adBaseUrl+"/platform/ad/statistics/order/page",
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
                $("#sell-detail-list").bootstrapTable("load",a);
                $("#sell-detail-modal .description").text("已选时间段："+row.year+"年"+row.month+"月 "+"&nbsp;&nbsp;"+"已选城市站点："+row.siteName+"&nbsp;&nbsp;"+"已选管理员账号："+row.managerId);
                $("#sell-detail-modal").modal("show");
            }
            else{
                alert(data.errorMsg);
            }
        },
        error:function (error) {
            alert("数据获取失败，请重试！");
        }
    })
}
$("#sell-detail-list").bootstrapTable({
    // url:"",
    idField:'id',
    pagination:true,
    data:[],
    columns:[[
        {field:'adPlacementName',title:'广告位',align:"center"},
        {field:"dataStart",title:"购买时间段",align:'center',formatter:function (value, row, index) {
            return row.dataStart+"-"+row.dataEnd;
        }},
        {field:'siteName',title:'城市站点',align:'center'},
        {field:'platform',title:'终端',align:'center'},
        {field:'managerId',title:"管理员账号",align:'center'},
        {field:'totalPrice',title:"金额",align:'center'}
    ]]
});