function GetQueryString(name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)
        return  unescape(r[2]);
    return null;
}

$(".adInfo").text(decodeURI(GetQueryString("siteId")+"--"+GetQueryString("platform")+"端--"+GetQueryString("page")+GetQueryString("position")));
var adPlacementPriceViews=JSON.parse(decodeURI(GetQueryString("adPlacementPriceViews")));
$(".adPrice").html("");
for(var i=0;i<adPlacementPriceViews.length;i++){
    $(".adPrice").append('<input type="radio" name="time" data-adPlacementPriceUnitId="'+adPlacementPriceViews[i].adPlacementPriceUnitView.adPlacementPriceUnitId+'"> 1'+adPlacementPriceViews[i].adPlacementPriceUnitView.unit+'(￥'+adPlacementPriceViews[i].price+') &nbsp;&nbsp;');
}

$.ajax({
    url: adBaseUrl + "/platform/ad/dateOccupied/list",
    type: "post",
    contentType: "application/json;charset=utf-8",
    crossDomain: true,
    headers: {"authorization": sessionStorage.authorization},
    data: JSON.stringify({"adPlacementId":GetQueryString("adPlacementId"),"siteId":1}),
    dataType: "json",
    success: function (data){
        if(data.success){
            var dataArry=[];
            if(data.data.length>0){
                for(var i=0;i<data.data.length;i++){
                    dataArry=dataArry.concat(getAll(data.data[i].dateStart.split("T")[0],data.data[i].dateEnd.split("T")[0]));
                }
            }
            $('.form_date').datetimepicker({
                language:  'zh-CN',
                weekStart: 1,
                todayBtn:  1,
                autoclose: 1,
                todayHighlight: 1,
                startView: 2,
                minView: 2,
                forceParse: 0,
                datesDisabled:dataArry
            });
        }
        else{
            alert(data.errorMsg);
            $('.form_date').datetimepicker({
                language:  'zh-CN',
                weekStart: 1,
                todayBtn:  1,
                autoclose: 1,
                todayHighlight: 1,
                startView: 2,
                minView: 2,
                forceParse: 0
            });
        }
    },
    error:function (error) {
        alert("数据获取失败，请重试！");
        $('.form_date').datetimepicker({
            language:  'zh-CN',
            weekStart: 1,
            todayBtn:  1,
            autoclose: 1,
            todayHighlight: 1,
            startView: 2,
            minView: 2,
            forceParse: 0
        });
    }
});



Date.prototype.format = function() {
    var s = '';
    var mouth = (this.getMonth() + 1)>=10?(this.getMonth() + 1):('0'+(this.getMonth() + 1));
    var day = this.getDate()>=10?this.getDate():('0'+this.getDate());
    s += this.getFullYear() + '-'; // 获取年份。
    s += mouth + "-"; // 获取月份。
    s += day; // 获取日。
    return (s); // 返回日期。
};

function getAll(begin, end) {
    var dataArray=[];
    var ab = begin.split("-");
    var ae = end.split("-");
    var db = new Date();
    db.setUTCFullYear(ab[0], ab[1] - 1, ab[2]);
    var de = new Date();
    de.setUTCFullYear(ae[0], ae[1] - 1, ae[2]);
    var unixDb = db.getTime();
    var unixDe = de.getTime();
    for (var k = unixDb; k <= unixDe;) {
        dataArray.push((new Date(parseInt(k))).format());
        k = k + 24 * 60 * 60 * 1000;
    }
    return dataArray;
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

function submit(){
    var data={"adPlacementId":GetQueryString("adPlacementId"),"adPlacementPriceUnitId":$("input[name=time]:checked").attr("data-adplacementpriceunitid"),"dateStart":$(".form-control").val(),};

    $.ajax({
        url:adBaseUrl+"/platform/ad/order/add",
        type: "post",
        contentType: "application/json;charset=utf-8",
        crossDomain: true,
        headers: {"authorization": sessionStorage.authorization},
        data: JSON.stringify({"adPlacementId":GetQueryString("adPlacementId"),"siteId":1}),
        dataType: "json",
        success: function (data){
            if(data.success){

            }
            else{
                alert(data.data.errorMsg)
            }
        },
        error:function (error) {
            alert("订单创建失败，请重试！");
        }
    })
}