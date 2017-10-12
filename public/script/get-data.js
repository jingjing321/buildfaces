//地理位置获取
$(".page").eq(0).find("header").find("button").text(remote_ip_info.city);

$.ajax({
    url:"http://192.168.20.61:8000/manager-service/user/basic/city/list",
    type: 'post',
    contentType: "application/json;charset=utf-8",
    crossDomain: true,
    headers:{"authorization":sessionStorage.authorization},
    data: JSON.stringify("userId",sessionStorage.userId),
    dataType: 'json',
    success: function (data) {
        if(data.success){
            for(var i=0;i<data.data.length;i++){
                if(remote_ip_info.city==data.data[i].name){
                    $(".page").eq(0).find("header").find("button").attr("data-cityId",data.data[i].cityId);
                    break;
                }
            }
        }
    }
})

if(sessionStorage.authorization){
	sessionStorage.authorization="";
}
if(sessionStorage.userId){
	sessionStorage.userId=0;
}
var newsBaseUrl="http://192.168.20.61:8000/news-service";
// var a={"phone":"18705837429","vercodeOperation":"REGISTER"}
// $.ajax({
// 	url:'http://192.168.20.61:8000/user-service/user/vercode/send',
// 	type:'post',
// 	contentType:"application/json;charset=utf-8",
// 	crossDomain:true,
// 	data:JSON.stringify(a),
// 	dataType:'json',
// 	success:function(info){
// 		console.log(info)
// 	},
// 	error:function(error,Msgerror){
// 		console.log(Msgerror)
// 	}
// })
var baseUrl="http://192.168.20.61:8000/user-service";
function getvercode(){
	var button=$("#register a.button").eq(0);
	button.addClass("disabled");
	var phone=$("#register .list-block input").eq(1).val();
	if(!(/^1[34578]\d{9}$/.test(phone))){ 
        $.toast("手机号码有误，请重填"); 
        button.removeClass("disabled"); 
        return; 
    };
	$.ajax({
		url:baseUrl+"/user/phone/check",
		type:'post',
		contentType:"application/json;charset=utf-8",
		crossDomain:true,
		data:phone,
		success:function(info){
			if(!info.data){
				$.toast("该手机号已注册，请直接登录！");
				button.removeClass("disabled");
			}
			else{
				var a={"phone":phone,"vercodeOperation":"REGISTER"}
				$.ajax({
					url:baseUrl+'/user/vercode/send',
					type:'post',
					contentType:"application/json;charset=utf-8",
					crossDomain:true,
					data:JSON.stringify(a),
					dataType:'json',
					success:function(info){
						if(!info.success){
							$.toast("验证码获取失败，请重试！");
							button.removeClass("disabled");
						}
						else{
							$.toast("已发送验证码，请查收！")
							setTimeout('$("#register a.button").eq(0).removeClass("disabled")',30000);	
						}
					},
					error:function(error,Msgerror){
						$.toast("验证码获取失败，请重试！");
						button.removeClass("disabled");
					}
				})
			}

		},
		error:function(error){
			$.toast("验证码获取失败，请重试！");
			button.removeClass("disabled");
		}
	})
}

function register(thiz){
	$(thiz).addClass("disabled");
	var userName=$("#register .content input").eq(0).val();
	var phone=$("#register .content input").eq(1).val();
	var vercode=$("#register .content input").eq(2).val();
	var password=$("#register .content input").eq(3).val();
	var password2=$("#register .content input").eq(4).val();
	if(userName==""){
		$.toast("请填写用户名！");
		$(thiz).removeClass("disabled");
		return;
	}
	if(!/^[\u4e00-\u9fa5a-zA-Z0-9_-]{1,16}$/.test(userName)){
		$.toast("请填写1-16位不包含特殊字符的用户名！");
		$(thiz).removeClass("disabled");
		return;
	}
	if(phone==""){
		$.toast("请填写手机号码！");
		$(thiz).removeClass("disabled");
		return;
	}
	if(vercode==""){
		$.toast("请填写验证码！");
		$(thiz).removeClass("disabled");
		return;
	}
	if(password==""||password2==""){
		$.toast("请填写密码！");
		$(thiz).removeClass("disabled");
		return;
	}
	if(password2!=password){
		$.toast("两次密码填写不一致！")
		$(thiz).removeClass("disabled");
		return;
	}
	if(!/^[a-zA-Z0-9_-]{4,16}$/.test(password)){
		$.toast("请填写4-16位不包含特殊字符的密码！")
		$(thiz).removeClass("disabled");
		return;
	}
	$.ajax({
		url:baseUrl+"/user/name/check",
		type:'post',
		contentType:"application/json;charset=utf-8",
		crossDomain:true,
		data:userName,
		dataType:'json',
		success:function(info){
			if(info.data){
				var a={"password":password,"phone":phone,"userName":userName,"vercode":vercode};
				$.ajax({
					url:baseUrl+"/user/register",
					type:'post',
					contentType:"application/json;charset=utf-8",
					crossDomain:true,
					data:JSON.stringify(a),
					dataType:'json',
					success:function(info){
						if(info.success){
							if($.alert("注册成功！")){
								$("#register .content a.button").eq(1).removeClass("disabled");
								$.router.load("#login");
							}
						}
						else{
							$.alert(info.errorMsg);
							$("#register .content a.button").eq(1).removeClass("disabled");
						}
					},
					error:function(error){
						$.alert("注册失败，请重试！");
						$("#register .content a.button").eq(1).removeClass("disabled");
					}
				})
			}
			else{
				$.toast("该用户名已被占用！");
				$("#register .content a.button").eq(1).removeClass("disabled");
				return;
			}
		}

	})

}

function changePassword() {
    var phone=$("#changePassword .content input").eq(1).val();
    var vercode=$("#changePassword .content input").eq(2).val();
    var password=$("#changePassword .content input").eq(3).val();
    if(phone==""){
        $.toast("请填写手机号码！");
        return;
    }
    if(vercode==""){
        $.toast("请填写验证码！");
        return;
    }
    if(password==""){
        $.toast("请填写密码！");
        return;
    }
    var a={"phone":phone,"vercode":vercode,"password":password};
    $.ajax({
        url:baseUrl+"/user/password/change",
        type:'post',
        contentType:"application/json;charset=utf-8",
        crossDomain:true,
        data:JSON.stringify(a),
        dataType:'json',
        success:function(info){
			if(info.success){
				$.alert("密码修改成功！");
			}
			else{
				$.alert(info.errorMsg);
			}
		},
		error:function (error) {
			$.alert("密码修改失败，请重试！");
        }
	})

}

/*
*登录
*/
function login(){
	var userName=$("#login .content input").eq(0).val();
	var password=$("#login .content input").eq(1).val();
	var a={"password":password,"userName":userName};
	$.ajax({
		url:baseUrl+"/user/login",
		type:'post',
		contentType:"application/json;charset=utf-8",
		crossDomain:true,
		data:JSON.stringify(a),
		dataType:'json',
		success:function(info,textStatus,request){
			if(info.success){
				$.alert("登录成功！");
				sessionStorage.userName=$("#login .content input").eq(0).val();
				$(".page").eq(0).find("header a").text($("#login .content input").eq(0).val()).addClass("userAction")[0].href="#"
				sessionStorage.authorization=request.getResponseHeader("authorization");
				$.router.back();

			}
			else{
				$.alert(info.errorMsg);
			}
		},
		error:function(error){
			$.alert("登录失败，请重试！")
		}
	})
			
					
}


//获取频道
function getChannel(){
    $.ajax({
        url: newsBaseUrl + "/user/news/channel/list",
        type: 'post',
        contentType: "application/json;charset=utf-8",
        crossDomain: true,
        headers:{"authorization":sessionStorage.authorization},
        data: JSON.stringify("userId",sessionStorage.userId),
        dataType: 'json',
        success: function (data) {
			if(data.success){
				$(".page").eq(0).find("#swiper-index").find(".buttons-tab").find("a").remove();
				$(".page").eq(0).find("#swiper-index").find(".buttons-tab").append('<a href="" class="tab-link button swiper-slide active external" onclick="getNews(this)">推荐</a>');
                $(".page").eq(0).find("#swiper-index").find(".buttons-tab").append('<a href="" class="tab-link button swiper-slide external" onclick="getNews(this,\'LOCAL\','+$(".page").eq(0).find("header").find("button").attr("data-cityId")+')">本地</a>');

				for(var i=0;i<data.data.length;i++){
					if(data.data[i].channelType=="SUBJECT"){
                        $(".page").eq(0).find("#swiper-index").find(".buttons-tab").append('<a href="" class="tab-link button swiper-slide external"></a>');
                        $(".page").eq(0).find("#swiper-index").find(".buttons-tab").find("a").last().text(data.data[i].channelName);
                        $(".page").eq(0).find("#swiper-index").find(".buttons-tab").find("a").last().attr("onclick","getNews(this,'"+data.data[i].channelType+"',"+data.data[i].channelId+")");
					}
				}
			}
        },
        error: function (error) {

        }
    })
}
getChannel();
getNews();
function getNews(thiz,channelType,channelId){
	var a={condition:{"channelType":"RECOMMEND"},pageNum:0,pageSize:0};
	if(channelType){
		a.condition.channelType=channelType;
	}
	if(channelId){
		a.condition.channelId=channelId
	}
	if(thiz){
        $(".page").eq(0).find("#swiper-index").find(".buttons-tab").find("a").removeClass("active");
        $(thiz).addClass("active");
	}
	$.ajax({
        url: newsBaseUrl + "/user/news/channel/page",
        type: 'post',
        contentType: "application/json;charset=utf-8",
        crossDomain: true,
        headers:{"authorization":sessionStorage.authorization},
        data: JSON.stringify(a),
        dataType: 'json',
		success:function(data){
			if(data.success){
				$(".page").eq(0).find(".tabs").find("ul").find("li").remove();
				for(var i=0;i<data.data.list.length;i++){
                    $(".page").eq(0).find(".tabs").find("ul").append("<li></li>");
                    $(".page").eq(0).find(".tabs").find("ul").find("li").last().append('<a class="item-link item-content" href="#index-detail" onclick="turn('+data.data.list[0].newsId+')"></a>');
                    $(".page").eq(0).find(".tabs").find('ul').find('a').last().append('<div class="item-inner"><div class="item-title-row"><div class="item-title">'+data.data.list[i].title+'</div></div></div>');
					$(".page").eq(0).find(".tabs").find("ul").find(".item-inner").last().append('<div class="item-content-row"><div class="types">'+data.data.list[i].author+'</div><div class="time">'+data.data.list[i].ctime+'</div><div class="clearfix"></div></div>');
					$(".page").eq(0).find(".tabs").find("ul").find('a').last().append('<div class="item-media"><img src="'+data.data.list[i].images+'" style="width: 5rem;"></div>')

				}
			}
		},
		error:function(error){

		}
	})
}

function turn(newsId) {
	$.ajax({
		url:newsBaseUrl+"/user/news/get",
        type: 'post',
        contentType: "application/json;charset=utf-8",
        crossDomain: true,
        data: JSON.stringify(newsId),
        dataType: 'json',
		success:function (data) {
			if(data.success){
				$("#index-detail").attr("data-newsId",data.data.newsId);
				$("#index-detail").find("header").find("h1").text(data.data.title);
				$("#index-detail").find(".content").find(".detail-title").text(data.data.title);
				$("#index-detail").find(".content").find(".info span").eq(0).text(data.data.author);
                $("#index-detail").find(".content").find(".info span").eq(1).text(data.data.vtime);
                $("#index-detail").find(".content").find(".info span").eq(2).text(data.data.clicks+"人浏览");
				$("#index-detail .content").find(".detail-content").html(data.data.content);
				$("#index-detail .content").find(".comment .like").html('<i class="fa fa-heart-o" onclick="like('+data.data.newsId+')"></i>&nbsp;'+data.data.likes);
				$("#index-detail .detail-bar .fa-star-o").attr("onclick","favor("+data.data.newsId+")");
				if(sessionStorage.authorization){
					$.ajax({
                        url:newsBaseUrl+"/user/news/like/check",
                        type: 'post',
                        contentType: "application/json;charset=utf-8",
                        crossDomain: true,
                        header:{"authorization":sessionStorage.authorization},
                        data: JSON.stringify(newsId),
                        dataType: 'json',
                        success:function (data) {
							if(data.success){
                                $("#index-detail .content").find(".comment .like").css("color","#f6383a");
							}
						},
						error:function(error){

						}
					})
                    $.ajax({
                        url:newsBaseUrl+"/user/news/favor/check",
                        type: 'post',
                        contentType: "application/json;charset=utf-8",
                        crossDomain: true,
                        header:{"authorization":sessionStorage.authorization},
                        data: JSON.stringify(newsId),
                        dataType: 'json',
                        success:function (data) {
                            if(data.success){
                                $("#index-detail .detail-bar .fa-star-o").css("color","#ff9200");
                            }
                        },
                        error:function(error){

                        }
                    })
				}
				getcomment(data.data.newsId);
			}
        },
		error:function(error){

		}
	})
}
function getcomment(newsId){
	var ele=$("#index-detail .content");
	var a={"condition":{"newsId":newsId},"pageNum":0,"pageSize":0};
    $.ajax({
        url: newsBaseUrl + "/user/news/comment/page",
        type: 'post',
        contentType: "application/json;charset=utf-8",
        crossDomain: true,
        headers: {"authorization": sessionStorage.authorization},
        data: JSON.stringify(a),
        dataType: 'json',
        success: function (data) {
			if(data.success){
                ele.find(".comment span").eq(0).text("评论("+data.data.list.length+")");
                ele.find("#comments_list").html("");
				if(data.data.list.length){
					for(var i=0;i<data.data.list.length;i++){
                        ele.find("#comments_list").append('<li class="comments"></li>');
                        ele.find("#comments_list li").last().append('<div class="com_top"><span class="photo"><img src="'+data.data.list[i].userView.photo+'"></span><span class="name">'+data.data.list[i].userView.userName+'</span></div>');
                        ele.find("#comments_list li").last().append('<div class="com_content">'+data.data.list[i].content+'</div>');
                        ele.find("#comments_list li").last().append('<div class="com_bottom"><span class="time">'+data.data.list[i].ctime+'</span><span class="useful" onclick="checkUser('+data.data.list[i].commentId+','+data.data.list[i].userView.userName+')">回复</span></div>')
					}

				}
			}
        },
        error: function (error) {

        }
    })
}

function checkUser(commentId,userName){
	if(sessionStorage.authorization){
		$.popup(".popup-comment");
		if(commentId){
			$(".popup-comment a").attr("data-commentId",commentId);
			if(userName){
				$(".popup-comment textarea").val("@"+userName);
			}
		}
		else{
			$(".popup-comment a").removeAttr("data-commentId");
			$(".popup-comment textarea").val("");
		}
		$(".popup-comment textarea").focus();
	}
	else{
		if(confirm("还未登录，是否立即登录评论？")){
			$.router.load("#login");
		}
	}
}

function sit_comment(){
	if($(".popup-comment textarea").val()){
		var a={"content":$(".popup-comment textarea").val(),"newsId":$("#index-detail").attr("data-newsId")};
		if($(".popup-comment a").attr("data-commentId")){
			a.replyCommentId=$(".popup-comment a").attr("data-commentId");
		}
		$.ajax({
            url: newsBaseUrl + "/user/news/comment/add",
            type: 'post',
            contentType: "application/json;charset=utf-8",
            crossDomain: true,
            headers: {"authorization": sessionStorage.authorization},
            data: JSON.stringify(a),
            dataType: 'json',
            success: function (data) {
				if(data.success){
					$.alert("评论提交成功，请等待管理员审核");
					$.closeModal(".popup-comment");
				}
				else{
					$.alert(data.errorMsg);
				}
			},
			error:function(error){
				$.alert("评论提交失败，请重试！");
			}
		})
	}
	else{
		$.alert("请输入评论内容！");
	}
}

function like(newsId){
    if(sessionStorage.authorization){
    	var a={"likeYn":true,"newsId":newsId};
        $.ajax({
            url: newsBaseUrl + "/user/news/comment/add",
            type: 'post',
            contentType: "application/json;charset=utf-8",
            crossDomain: true,
            headers: {"authorization": sessionStorage.authorization},
            data: JSON.stringify(a),
            dataType: 'json',
            success: function (data) {
            	if(data.success){
                    $("#index-detail .content").find(".comment .like").css("color","#f6383a");
                    $("#index-detail .content").find(".comment .like").html('<i class="fa fa-heart-o" onclick=""></i>&nbsp;'+($("#index-detail .content").find(".comment .like").text()/1+1));
				}
				else{
            		$.alert(data.errorMsg);
				}
			},
			error:function (error) {
				$.alert("点赞失败，请重试！");
            }
		})
    }
    else{
        if(confirm("还未登录，是否立即登录评论？")){
            $.router.load("#login");
        }
    }
}

function favor(newsId){
    if(sessionStorage.authorization){
        var a={"favorYn":true,"newsId":newsId};
        $.ajax({
            url:newsBaseUrl+"/user/news/favor/set",
            type: 'post',
            contentType: "application/json;charset=utf-8",
            crossDomain: true,
            headers: {"authorization": sessionStorage.authorization},
            data: JSON.stringify(a),
            dataType: 'json',
            success: function (data) {
				if(data.success){
					$("#index-detail .detail-bar .fa-star-o").css("color","#ff9200");
				}
				else{
					$.alert(data.errorMsg);
				}
            },
            error:function(error){
                $.alert("收藏失败，请重试！")
            }
        })
    }
    else{
        if(confirm("还未登录，是否立即登录收藏？")){
            $.router.load("#login");
        }
    }

}

function searchNews(){
	if($(".page #search").val()){
		var a={"keyword":$(".page #search").val(),"pageSize":0,"pageNum":0};
		$.ajax({
			url:newsBaseUrl+"/user/news/search/page",
            type: 'post',
            contentType: "application/json;charset=utf-8",
            crossDomain: true,
            headers: {"authorization": sessionStorage.authorization},
            data: JSON.stringify(a),
            dataType: 'json',
            success: function (data) {
				if(data.success){
                    $(".page").eq(0).find(".tabs").find("ul").find("li").remove();
                    for(var i=0;i<data.data.list.length;i++){
                        $(".page").eq(0).find(".tabs").find("ul").append("<li></li>");
                        $(".page").eq(0).find(".tabs").find("ul").find("li").last().append('<a class="item-link item-content" href="#index-detail" onclick="turn('+data.data.list[0].newsId+')"></a>');
                        $(".page").eq(0).find(".tabs").find('ul').find('a').last().append('<div class="item-inner"><div class="item-title-row"><div class="item-title">'+data.data.list[i].title+'</div></div></div>');
                        $(".page").eq(0).find(".tabs").find("ul").find(".item-inner").last().append('<div class="item-content-row"><div class="types">'+data.data.list[i].author+'</div><div class="time">'+data.data.list[i].ctime+'</div><div class="clearfix"></div></div>');
                        $(".page").eq(0).find(".tabs").find("ul").find('a').last().append('<div class="item-media"><img src="'+data.data.list[i].images+'" style="width: 5rem;"></div>')

                    }
				}
			},
			error:function (error) {

            }
		})
	}
	else{
		getNews()
		var a=$(".page").eq(0).find("#swiper-index").find("a.active").attr("onclick");
		a=a.split("(")[1];
		a=a.split(",")
		if(a.length>1){
			a[2]=a[2].split(")")[0];
			getNews('$(".page").eq(0).find("#swiper-index").find("a.active")',a[1],a[2]);
		}
		else{
			getNews('$(".page").eq(0).find("#swiper-index").find("a.active")')
		}

	}
}

$(document).on('click','.userAction', function () {
    var buttons1 = [
        {
            text: '请选择',
            label: true
        },
        {
            text: '修改密码',
            bold: true,
            color: 'danger',
            onClick: function() {
				$.router.load("#changePassword");
            }
        },
        {
            text: '退出登录',
            onClick: function() {
				sessionStorage.userName="";
				sessionStorage.authorization="";
				$(".page").eq(0).find("header a").text("登录").removeClass("userAction")[0].href="#login";
				$.alert("成功退出登录！");
            }
        }
    ];
    var buttons2 = [
        {
            text: '取消',
            bg: 'danger'
        }
    ];
    var groups = [buttons1, buttons2];
    $.actions(groups);
});