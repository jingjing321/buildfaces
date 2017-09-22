var baseUrl="http://192.168.20.61:8000/manager-service";
if(sessionStorage.accountName){
    $.ajax({
        url: baseUrl + "/platform/manager/get",
        type: 'post',
        contentType: "application/json;charset=utf-8",
        crossDomain: true,
        headers: {"authorization": sessionStorage.authorization},
        data: sessionStorage.managerId,
        dataType: 'json',
        success: function (data) {
            if (data.success) {
                $("header .user-name").text(sessionStorage.accountName)
            }
            else{
                window.location.href="login";
            }
        }
    });
}
else{
    window.location.href="login";
}

(function() {
    $(document).ready(function() {
        var body, content, nav, nav_closed_width, nav_open, nav_toggler;

        nav_toggler = $("header .toggle-nav");
        nav = $("#main-nav");
        content = $("#content");
        body = $("body");
        nav_closed_width = 50;
        nav_open = body.hasClass("main-nav-opened") || nav.width() > nav_closed_width;
        $("#main-nav .dropdown-collapse").on("click", function(e) {
            var link, list;

            e.preventDefault();
            link = $(this);
            list = link.parent().find("> ul");
            if (list.is(":visible")) {
                if (body.hasClass("main-nav-closed") && link.parents("li").length === 1) {
                    false;
                } else {
                    link.removeClass("in");
                    list.slideUp(300, function() {
                        return $(this).removeClass("in");
                    });
                }
            } else {
                link.addClass("in");
                list.slideDown(300, function() {
                    return $(this).addClass("in");
                });
            }
            return false;
        });
        nav_toggler.on("click", function() {
            if (nav_open) {
                $(document).trigger("nav-close");
            } else {
                $(document).trigger("nav-open");
            }
            return false;
        });
        $(document).bind("nav-close", function(event, params) {
            body.removeClass("main-nav-opened").addClass("main-nav-closed");
            return nav_open = false;
        });
        return $(document).bind("nav-open", function(event, params) {
            body.addClass("main-nav-opened").removeClass("main-nav-closed");
            return nav_open = true;
        });
    });

}).call(this);

function exit(){
    sessionStorage.clear();
    window.location.href="login"
}

$(".menu li").css("display","none");
for(var i=0;i<sessionStorage.module.length;i++){
    for(var i2=0;i2<$(".menu li").length;i++){
        if($(".menu li").attr("data-seq")==sessionStorage.module[i]){
            $(".menu li").css("display","");
            break;
        }
    }
}
var module_info={"index":2001,"column":2002,"comment":2003,"gov":3001,"gov-column":3002,"ad":4001,"ad-default":4002,"ad-buy":4003,"ad-sell-report":4004,"user-manage":1001,"user-character":1002,"user-authority":1003};
var moduleIds=sessionStorage.module.split(",");
var local_url=window.location.pathname.split("/");
var local_url=local_url[local_url.length-1];
if(local_url==""){local_url="index"}
var premission=false;
for (var i=0;i<moduleIds.length;i++){
    if(module_info[local_url]==moduleIds[i]){
        premission=true;break;
    }
}
if(!premission){
    alert("您没有此页的权限！");
    history.back();
}