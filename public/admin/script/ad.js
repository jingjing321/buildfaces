
$("#ad-detail-list").bootstrapTable({
    // url:"",
    idField:'id',
    pagination:true,
    data:[
        {1:111,2:"http://baidu.com",3:'2016-1-20',4:'2016-2-20',5:'admin',6:"2000"},
        {1:111,2:"http://baidu.com",3:'2016-1-20',4:'2016-2-20',5:'admin',6:"2000"},
        {1:111,2:"http://baidu.com",3:'2016-1-20',4:'2016-2-20',5:'admin',6:"2000"},
        {1:111,2:"http://baidu.com",3:'2016-1-20',4:'2016-2-20',5:'admin',6:"2000"}
    ],
    columns:[[
        {field:'1',title:'广告图片',align:"center",formatter:function(value,row,index){
            return "<img src='../images/logo_bs.png'>"
        }},
        {field:"2",title:"链接地址",align:'center'},
        {field:'3',title:'开始时间',align:'center'},
        {field:'4',title:'结束时间',align:'center'},
        {field:'5',title:"操作者",align:'center'},
        {field:"6",title:'支付金额',align:'center',formatter:function(value,row,index){
            return value+"元"
        }}
    ]]
});
getData();
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
                    $("#ad-list").bootstrapTable({
                        // url:"",
                        idField:'adPlacementId',
                        pagination:true,
                        data:a,
                        columns:[[
                            {field:'adPlacementName',title:'广告位置',align:"center"},
                            {field:"adPlacementPriceViews",title:"价格",align:'center',formatter:function (value, row, index) {
                                var content="";
                                for(var i=0;i<value.length;i++){
                                    content+=value[i].price+"/"+value[i].adPlacementPriceUnitView.unit+"&nbsp;&nbsp;";
                                }
                                return content;
                            }},
                            {field:'imageDefault',title:'当前广告',align:'center',formatter:function(value,row,index){
                                if(value){
                                    return "<img src='"+value+"'>";
                                }
                                else{
                                    return "无图片";
                                }

                            }},
                            {field:'linkDefault',title:'链接地址',align:'center'},
                            // {field:'5',title:"到期时间",align:'center'},
                            // {field:"6",title:'已预订时间',align:'center'},
                            {field:'clicks',title:"点击数",align:'center'},
                            {field:'',title:"操作",align:'center',formatter:function(value,row,index){
                                return "<a href='#' onclick='detail("+row.adPlacementId+")'>查看详情</a> &nbsp; <a href='/admin/ad-buy?adPlacementId="+row.adPlacementId+"&platform="+encodeURI(encodeURI(row.platform))+"&page="+encodeURI(encodeURI(row.page))+"&position="+encodeURI(encodeURI(row.position))+"&siteId="+row.siteId+"&adPlacementPriceViews="+encodeURI(encodeURI(JSON.stringify(row.adPlacementPriceViews)))+"'>购买</a>";
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

function detail(id){

}

getlist("province","#province");
$("#province").append("<option value='' selected='true'>全部</option>");
function changeSelect(id){
    var data;
    if(id=="page"){
        data={"platform":$("#platform").val()};
    }
    else if(id=="position"){
        data={"platform":$("#platform").val(),"page":$("#page").val()};
    }
    $.ajax({
        url:adBaseUrl+"/platform/ad/placement/selector/"+id+"/list",
        type: "post",
        contentType: "application/json;charset=utf-8",
        crossDomain: true,
        headers: {"authorization": sessionStorage.authorization},
        data: JSON.stringify(data),
        dataType: "json",
        success: function (data) {
            if(data.success){
                $("#"+id).find("option").remove();
                $("#"+id).append(returnOption(" ","全部"));
                for(var i=0;i<data.data.length;i++){
                    $("#"+id).append(returnOption(data.data[i],data.data[i]));
                }
            }
            else{
                $("#"+id).find("option").remove();
                $("#"+id).append(returnOption(" ","全部"));
            }
        },
        error:function (error) {
            $("#"+id).find("option").remove();
            $("#"+id).append(returnOption(" ","全部"));
        }
    })
}

$.ajax({
    url:adBaseUrl+"/platform/ad/placement/selector/platform/list",
    type: "post",
    contentType: "application/json;charset=utf-8",
    crossDomain: true,
    headers: {"authorization": sessionStorage.authorization},
    dataType: "json",
    success: function (data) {
        if(data.success){
            $("#platform").find("option").remove();
            $("#platform").append(returnOption(" ","全部"));
            for(var i=0;i<data.data.length;i++){
                $("#platform").append(returnOption(data.data[i],data.data[i]));
            }
            $("#page").find("option").remove();
            $("#page").append(returnOption("","全部"));
            $("#position").find("option").remove();
            $("#position").append(returnOption("","全部"));
        }
        else{
            $("#platform").find("option").remove();
            $("#platform").append(returnOption(" ","全部"));
            $("#page").find("option").remove();
            $("#page").append(returnOption("","全部"));
            $("#position").find("option").remove();
            $("#position").append(returnOption("","全部"));
        }
    },
    error:function (error) {
        $("#"+id).find("option").remove();
        $("#"+id).append(returnOption(" ","全部"));
        $("#page").find("option").remove();
        $("#page").append(returnOption("","全部"));
        $("#position").find("option").remove();
        $("#position").append(returnOption("","全部"));
    }
});

function search(){
    var data={"condition":{"platform":$("#platform").val(),"page":$("#page").val(),"position":$("#position").val()},"pageNum":0,"pageSize":0};
    getData("refresh",data);
}

