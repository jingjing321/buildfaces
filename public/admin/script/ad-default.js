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
                                return "<a href='#' onclick='edit("+JSON.stringify(row)+")'>编辑</a> &nbsp; <a href='#' onclick='changePrice("+JSON.stringify(row)+")'>修改价格</a>";
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

function submitBtn() {
    var form = $("form#fileupload");
    var options  = {
        url:basicBaseUrl+'/platform/upload/image/upload',
        type:'post',
        headers:{"authorization":sessionStorage.authorization},
        success:function(data)
        {
            if(data.success){
                if(data.success){
                    alert("图片上传成功！");
                    $("#imgUpload").attr("data-path",data.data);
                }
                else{
                    alert(data.data.errorMsg);
                }
            }
        }
    };
    form.ajaxSubmit(options);
    //$("#fileForm").submit();
}

function xmTanUploadImg(obj) {
    var file = obj.files[0];

    console.log(obj);console.log(file);
    console.log("file.size = " + file.size);  //file.size 单位为byte

    var reader = new FileReader();

    //读取文件过程方法
    reader.onloadstart = function (e) {
        console.log("开始读取....");
    };
    reader.onprogress = function (e) {
        console.log("正在读取中....");
    };
    reader.onabort = function (e) {
        console.log("中断读取....");
    };
    reader.onerror = function (e) {
        console.log("读取异常....");
    };
    reader.onload = function (e) {
        console.log("成功读取....");

        var img = document.getElementById("xmTanImg");
        img.src = e.target.result;
        //或者 img.src = this.result;  //e.target == this
    };

    reader.readAsDataURL(file)
}

function edit(row){
    $("#ad-edit-modal .modal-body span").eq(0).text(row.platform+"--"+row.position);
    $("#ad-edit-modal .modal-body input").eq(1).val(row.linkDefault);
    if(row.imageDefault){
        $("#imgUpload").attr("data-path",row.imageDefault);
        $("#xmTanImg")[0].src=row.imageDefault;
    }
    $("#ad-edit-modal button").last().attr("onclick","edit_sit("+JSON.stringify(row)+")");
    $("#ad-edit-modal").modal("show");
}

function edit_sit(row) {
    var data=row;
    data.imageDefault=$("#imgUpload").attr("data-path");
    data.linkDefault=$("#ad-edit-modal input").last().val();
    $.ajax({
        url:adBaseUrl+"/platform/ad/placement/defaultAd/edit",
        type: "post",
        contentType: "application/json;charset=utf-8",
        crossDomain: true,
        headers: {"authorization": sessionStorage.authorization},
        data: JSON.stringify(data),
        dataType: "json",
        success: function (data) {
            if(data.success){
                alert("修改成功！");
                getData("refresh");
                $("#ad-edit-modal").modal("hide");
            }
            else{
                alert(data.errorMsg);
            }
        },
        error:function (error) {
            alert("修改失败，请重试！");
        }
    })
}
function changePrice(row) {
    $("#ad-price-modal .modal-body .margin span").text(row.platform+"--"+row.position);
    $.ajax({
       url:adBaseUrl+"/platform/ad/placement/price/unit/list",
        type: "post",
        contentType: "application/json;charset=utf-8",
        crossDomain: true,
        headers: {"authorization": sessionStorage.authorization},
        dataType: "json",
        success: function (data) {
           if(data.success){
               $("#ad-price-modal .modal-body .margin").last().html("<b>设置价格：</b> <br>");
               for(var i=0;i<data.data.length;i++){
                   $("#ad-price-modal .modal-body .margin").last().append("<input type='number' name=''/> /"+data.data[i].unit+"<br><br>");
                   $("#ad-price-modal .modal-body .margin input").last().attr("data-id",data.data[i].adPlacementPriceUnitId).attr("data-days",data.data[i].days).attr("data-unit",data.data[i].unit);
               }
               var input=$("#ad-price-modal .modal-body .margin input");
               for(var i=0;i<row.adPlacementPriceViews.length;i++){
                   for(var i2=0;i2<input.length;i2++){
                       if(row.adPlacementPriceViews[i].adPlacementPriceUnitView.adPlacementPriceUnitId==input.eq(i2).attr("data-id")){
                           input.eq(i2).val(row.adPlacementPriceViews[i].price);
                           break;
                       }
                   }
               }
               $("#ad-price-modal button").last().attr("onclick","price_sit("+row.adPlacementId+")");
               $("#ad-price-modal").modal("show");
           }
           else {
               alert(data.errorMsg);
           }
        },
        error:function (error) {
            alert("数据获取失败，请重试！");
            return ;
        }
    });

}

function price_sit(id){
    var data={};
    data.adPlacementId=id;
    data.adPlacementPriceViews=[];
    var input=$("#ad-price-modal .modal-body input");
    for(var i=0;i<input.length;i++){
        if(input.eq(i).val()){
            var a={};
            a.adPlacementPriceView={"adPlacementPriceUnitId":input.eq(i).attr("data-id"),"days":input.eq(i).attr("data-days"),"unit":input.eq(i).attr("data-unit")};
            a.price=input.eq(i).val()/1;
            data.adPlacementPriceViews.push(a);
        }
    }
    $.ajax({
        url:adBaseUrl+"/platform/ad/placement/price/set",
        type: "post",
        contentType: "application/json;charset=utf-8",
        crossDomain: true,
        headers: {"authorization": sessionStorage.authorization},
        data: JSON.stringify(data),
        dataType: "json",
        success: function (data) {
            if(data.success){
                alert("设置成功！");
                getData("refresh");
                $("#ad-price-modal").modal("hide");
            }
            else{
                alert(data.errorMsg);
            }
        },
        error:function (error) {
            alert("修改失败，请重试！");
        }
    })
}

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