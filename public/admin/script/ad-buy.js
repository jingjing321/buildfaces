function GetQueryString(name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)
        return  unescape(r[2]);
    return null;
}

$.ajax({
    url: adBaseUrl + "/platform/ad/dateOccupied/list",
    type: "post",
    contentType: "application/json;charset=utf-8",
    crossDomain: true,
    headers: {"authorization": sessionStorage.authorization},
    data: JSON.stringify({"adPlacementId":GetQueryString("adPlacementId"),"siteId":GetQueryString("siteId")}),
    dataType: "json",
    success: function (data) {
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