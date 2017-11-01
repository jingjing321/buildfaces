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

        }
        else{
            alert(data.errorMsg);
        }
    },
    error:function (error) {
        alert("数据获取失败，请重试！");
    }
});