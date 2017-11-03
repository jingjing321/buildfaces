$('.infinite-scroll-preloader').css("display","none");

//地理位置获取
$(".page").find("header").find(".address").html("<a href='#selectCity' onclick='getCity()'>"+remote_ip_info.city+"</a>");

$.ajax({
    url:"http://192.168.20.61:8000/manager-service/user/basic/city/list",
    type: 'post',
    async:false,
    contentType: "application/json;charset=utf-8",
    crossDomain: true,
    headers:{"authorization":sessionStorage.authorization},
    data: JSON.stringify("userId",sessionStorage.userId),
    dataType: 'json',
    success: function (data) {
        if(data.success){
            for(var i=0;i<data.data.length;i++){
                if(remote_ip_info.city==data.data[i].name){
                    $(".page header .address").attr("data-cityId",data.data[i].cityId);
                    break;
                }
            }
        }
    }
});

if(sessionStorage.authorization){
	sessionStorage.authorization="";
}
if(sessionStorage.userId){
	sessionStorage.userId=0;
}
var newsBaseUrl="http://192.168.20.61:8000/news-service";
var bidBaseUrl="http://192.168.20.61:8000/bid-service";
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

function turnTab(num){
	if(num==1){
		$.router.load("#index");
		getChannel();
		getNews();
	}
	else if(num==2){
		$.router.load("#goverment");
		getBidChannel();
	}
	else {
		$.router.load("#user");
		getUserData();
	}

}

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

function getvercode_password(){
    var button=$("#changePassword a.button").eq(0);
    button.addClass("disabled");
    var phone=$("#changePassword .list-block input").eq(0).val();
    if(!(/^1[34578]\d{9}$/.test(phone))){
        $.toast("手机号码有误，请重填");
        button.removeClass("disabled");
        return;
    };
    var a={"phone":phone,"vercodeOperation": "PASSWORD_CHANGE"};
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
                setTimeout('$("#changePassword a.button").eq(0).removeClass("disabled")',30000);
            }
        },
        error:function(error,Msgerror){
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
								$("#login a.login").attr("data-index",'true');
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
    var phone=$("#changePassword .content input").eq(0).val();
    var vercode=$("#changePassword .content input").eq(1).val();
    var password=$("#changePassword .content input").eq(2).val();
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
				$.router.back();
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
	var a={"password":password,"loginName":userName};
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
                sessionStorage.authorization=request.getResponseHeader("authorization");
				$.ajax({
                    url:baseUrl+"/user/selfInfo/get",
                    type:'post',
                    contentType:"application/json;charset=utf-8",
                    crossDomain:true,
                    headers:{authorization:request.getResponseHeader("authorization")},
                    dataType:'json',
                    success:function(info,textStatus,request){
                    	if(info.success){
                            sessionStorage.userName=info.data.userName;
                            $(".page header .user").text(info.data.userName).addClass("userAction").attr("onclick","")[0].href="#";
						}
					},
					error:function(error){

					}
				});
				// $.router.back();
				if($("#login a.login").attr("data-num")){
					turnTab($("#login a.login").attr("data-num"));
				}
				else{
					if($("#login a.login").attr("data-index")){
						turnTab(1);
					}
					else{
						$.router.back();
					}

				}
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

function toLogin()
{
    //以下为按钮点击事件的逻辑。注意这里要重新打开窗口
    //否则后面跳转到QQ登录，授权页面时会直接缩小当前浏览器的窗口，而不是打开新窗口
    var A=window.open("/oauth/index.php","TencentLogin",
        "width=450,height=320,menubar=0,scrollbars=1,resizable=1,status=1,titlebar=0,toolbar=0,location=1");
}

function goLogin(num){
	$.router.load("#login");
	$("#login a.login").attr("data-num",num);
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
				$(".page").eq(0).find("#swiper-index").find(".buttons-tab").append('<a href="" class="tab-link button swiper-slide active external" onclick="getNews(this,1)">推荐</a>');
                $(".page").eq(0).find("#swiper-index").find(".buttons-tab").find("a").last().attr("data-channelType","RECOMMEND");

                $(".page").eq(0).find("#swiper-index").find(".buttons-tab").append('<a href="" class="tab-link button swiper-slide external" onclick="getNews(this,1,\'LOCAL\','+$(".page").eq(0).find("header").find("button").attr("data-cityId")+')">本地</a>');
                $(".page").eq(0).find("#swiper-index").find(".buttons-tab").find("a").last().attr("data-channelType","LOCAL").attr("data-channel",$(".page").eq(0).find("header").find("button").attr("data-cityId"));

				for(var i=0;i<data.data.length;i++){
					if(data.data[i].channelType=="SUBJECT"){
                        $(".page").eq(0).find("#swiper-index").find(".buttons-tab").append('<a href="" class="tab-link button swiper-slide external"></a>');
                        $(".page").eq(0).find("#swiper-index").find(".buttons-tab").find("a").last().text(data.data[i].channelName);
                        $(".page").eq(0).find("#swiper-index").find(".buttons-tab").find("a").last().attr("onclick","getNews(this,1,'"+data.data[i].channelType+"',"+data.data[i].channelId+")").attr("data-channelType",data.data[i].channelType).attr("data-channel",data.data[i].channelId);
					}
				}
                $.router.load("#index");
			}
        },
        error: function (error) {

        }
    })
}
getChannel();

//无限滚动；
//加载flag
var loading = false;
// 最多可加载的页数
var maxPage = 1;
// 上次加载的页码
var lastIndex = 1;

var infiniteNum=0;
function getNews(thiz,pageNum,channelType,channelId){
	pageNum=pageNum?pageNum:1;
    var a={condition:{"channelType":"RECOMMEND"},pageNum:pageNum,pageSize:20};
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
            	if(pageNum==1){
                    $(".page").eq(0).find(".tabs").find("ul").find("li").remove();
                    if(infiniteNum>0){
                        $.attachInfiniteScroll($('.infinite-scroll'));
					}
                    infiniteNum=1;
                    $('.infinite-scroll-preloader').css("display","");
				}
				if(data.data.total==0){
                    $('.infinite-scroll-preloader').css("display","none");
				}
                maxPage=data.data.pages;
                lastIndex=data.data.pageNum+1;
                for(var i=0;i<data.data.list.length;i++){
                    $(".page").eq(0).find(".tabs").find("ul").append("<li></li>");
                    $(".page").eq(0).find(".tabs").find("ul").find("li").last().append('<a class="item-link item-content" href="#index-detail" onclick="turn('+data.data.list[i].newsId+')"></a>');
                    $(".page").eq(0).find(".tabs").find('ul').find('a').last().append('<div class="item-inner"><div class="item-title-row"><div class="item-title">'+data.data.list[i].title+'</div></div></div>');
                    if(data.data.list[i].newsTopYn){
                        $(".page").eq(0).find(".tabs").find("ul").find(".item-inner").last().append('<div class="item-content-row"><div class="sui-label">置顶</div> &nbsp;<div class="types">'+(data.data.list[i].author==undefined?"":data.data.list[i].author)+'</div><div class="time">'+data.data.list[i].ctime+'</div><div class="clearfix"></div></div>');
                    }
                    else{
                        $(".page").eq(0).find(".tabs").find("ul").find(".item-inner").last().append('<div class="item-content-row"><div class="types">'+data.data.list[i].author+'</div><div class="time">'+data.data.list[i].ctime+'</div><div class="clearfix"></div></div>');
                    }
                    if(data.data.list[i].images){
                        $(".page").eq(0).find(".tabs").find("ul").find('a').last().append('<div class="item-media"><img src="'+data.data.list[i].images+'" style="width: 5rem;"></div>');
                    }

                }
                loading=false;
            }
        },
        error:function(error){
            loading=false;
        }
    })
};
// 注册'infinite'事件处理函数

$(document).on('infinite', function(){

    // 如果正在加载，则退出
    if (loading) return;

    // 重置加载flag
    loading = true;

    if (lastIndex >maxPage) {
        // 加载完毕，则注销无限加载事件，以防不必要的加载
        $.detachInfiniteScroll($('.infinite-scroll'));
        // 删除加载提示符
        $('.infinite-scroll-preloader').css("display","none");
        return;
    }
    var ele_a=$(".page").eq(0).find("#swiper-index").find(".buttons-tab").find("a.active");
    // 添加新条目
    getNews(ele_a,lastIndex,ele_a.attr("data-channelType"),ele_a.attr("data-channel"));

    //容器发生改变,如果是js滚动，需要刷新滚动
    $.refreshScroller();
});

getNews();
// $(document).on('infinite', infiniteFun());
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
				$("#index-detail").find("header").find("h1").text((data.data.title.length>20?(data.data.title.substring(0,18)+"..."):data.data.title));
				$("#index-detail").find(".content").find(".detail-title").text(data.data.title);
				$("#index-detail").find(".content").find(".info span").eq(0).text(data.data.author);
                $("#index-detail").find(".content").find(".info span").eq(1).text(data.data.vtime);
                $("#index-detail").find(".content").find(".info span").eq(2).text(data.data.clicks+"人浏览");
				$("#index-detail .content").find(".detail-content").html(data.data.content);
                $("#index-detail .content").find(".comment .like").html('<i class="fa fa-heart-o" onclick="like('+newsId+',true)"></i>&nbsp;'+data.data.likes);
                $("#index-detail .detail-bar .fa").removeClass(".fa-star").addClass("fa-star-o").attr("onclick","favor("+newsId+",true)");
                if(sessionStorage.authorization){
					$.ajax({
                        url:newsBaseUrl+"/user/news/like/check",
                        type: 'post',
                        contentType: "application/json;charset=utf-8",
                        crossDomain: true,
                        headers:{"authorization":sessionStorage.authorization},
                        data: JSON.stringify(newsId),
                        dataType: 'json',
                        success:function (data) {
							if(data.success) {
                                if (data.data) {
                                    $("#index-detail .content").find(".comment .like .fa").removeClass("fa-heart-o").addClass("fa-heart").attr("onclick","like("+newsId+",false)");
                                }
                                else{
                                    $("#index-detail .content").find(".comment .like .fa").removeClass("fa-heart").addClass("fa-heart-o").attr("onclick","like("+newsId+",true)");
                                }
							}
							else{
                                $("#index-detail .content").find(".comment .like .fa").removeClass("fa-heart-o").addClass("fa-heart").attr("onclick","like("+newsId+",false)");
                            }
						},
						error:function(error){

						}
					});
                    $.ajax({
                        url:newsBaseUrl+"/user/news/favor/check",
                        type: 'post',
                        contentType: "application/json;charset=utf-8",
                        crossDomain: true,
                        headers: {"authorization": sessionStorage.authorization},
                        data: JSON.stringify(newsId),
                        dataType: 'json',
                        success:function (data) {
                            if(data.success){
                                if(data.data){
                                    $("#index-detail .detail-bar .fa").removeClass("fa-star-o").addClass("fa-star").attr("onclick","favor("+newsId+",false)");
                                }
                                else{
                                    $("#index-detail .detail-bar .fa").removeClass("fa-star").addClass("fa-star-o").attr("onclick","favor("+newsId+",true)");
                                }
                            }
                            else{
                                $("#index-detail .detail-bar .fa").removeClass(".fa-star").addClass("fa-star-o").attr("onclick","favor("+newsId+",true)");
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
                        ele.find("#comments_list li").last().append('<div class="com_bottom"><span class="time">'+data.data.list[i].ctime+'</span><span class="useful" onclick="checkUser('+data.data.list[i].commentId+',\''+data.data.list[i].userView.userName+'\')">回复</span></div>')
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

function like(newsId,action){
    if(sessionStorage.authorization){
    	var a={"likeYn":action,"newsId":newsId};
        $.ajax({
            url: newsBaseUrl + "/user/news/like/set",
            type: 'post',
            contentType: "application/json;charset=utf-8",
            crossDomain: true,
            headers: {"authorization": sessionStorage.authorization},
            data: JSON.stringify(a),
            dataType: 'json',
            success: function (data) {
            	if(data.success){
            	    if(action){
                        $("#index-detail .content").find(".comment .like").html('<i class="fa fa-heart" onclick="like('+newsId+',false)"></i>&nbsp;'+($("#index-detail .content").find(".comment .like").text()/1+1));
                    }
                    else{
                        $("#index-detail .content").find(".comment .like").html('<i class="fa fa-heart-o" onclick="like('+newsId+',true)"></i>&nbsp;'+($("#index-detail .content").find(".comment .like").text()/1-1));
                    }
				}
				else{
            		$.alert(data.errorMsg);
				}
			},
			error:function (error) {
                if(action){
                    $.alert("点赞失败，请重试！");
                }
				else{
                    $.alert("取消点赞失败，请重试！");
                }
            }
		})
    }
    else{
        if(confirm("还未登录，是否立即登录点赞？")){
            $.router.load("#login");
        }
    }
}

function favor(newsId,action){
    if(sessionStorage.authorization){
        var a={"favorYn":action,"newsId":newsId};
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
				    if(action){
                        $("#index-detail .detail-bar .fa").removeClass("fa-star-o").addClass("fa-star").attr("onclick","favor("+newsId+",false)");
                    }
					else{
                        $("#index-detail .detail-bar .fa").removeClass("fa-star").addClass("fa-star-o").attr("onclick","favor("+newsId+",true)");
                    }
				}
				else{
					$.alert(data.errorMsg);
				}
            },
            error:function(error){
                if(action){
                    $.alert("收藏失败，请重试！")
                }
                else{
                    $.alert("取消收藏失败，请重试！");
                }
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
		$("#index .content .buttons-tab .active").removeClass("active");
        $.showIndicator();
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
                $.hideIndicator();
			},
			error:function (error) {
                $.showIndicator()
            }
		})
	}
	else{
		if($("#index .content .buttons-tab a").hasClass("active")){
            var a=$(".page").eq(0).find("#swiper-index").find("a.active").attr("onclick");
            a=a.split("(")[1];
            a=a.split(",");
            if(a.length>1){
            	a[2]=a[2].split(")")[0];
            	getNews('$(".page").eq(0).find("#swiper-index").find("a.active")',a[1],a[2]);
            }
            else{
            	getNews('$(".page").eq(0).find("#swiper-index").find("a.active")')
            }
		}
		else{
            $("#index .content .buttons-tab a").eq(0).addClass("active");
            getNews();
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
				$(".page").find("header .user").text("登录").removeClass("userAction");
				for(var i=0;i<$(".page").find("header .user").length;i++){
                    $(".page").find("header .user").eq(i).attr("onclick","goLogin("+(i+1)+")");
				}
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

function getCity(){
	$.ajax({
		url:"http://192.168.20.61:8000/manager-service/user/basic/city/list",
        type: 'post',
        contentType: "application/json;charset=utf-8",
        crossDomain: true,
        headers: {"authorization": sessionStorage.authorization},
        dataType: 'json',
        success: function (data) {
			if(data.success){
				$("#selectCity .content .list-block").find(".list-group").remove();
				$("#selectCity .content .list-block").append("<div class='list-group'><ul><li class='list-group-title'>您当前可能在</li></ul></div>");
				$("#selectCity .content .list-block .list-group ul").append('<li><div class="item-content"><div class="item-inner"><div class="item-title back">'+remote_ip_info.city+' </div></div></div></li>');
				var cityList=["A","B","C","D","E","F","G","H","E","J","K","L","M","N","O","P","Q","R","S","T","W","V","U","X","Y","Z"];
				for(var i=0;i<cityList.length;i++){
					$("#selectCity .content .list-block").append('<div class="list-group"><ul><li class="list-group-title">'+cityList[i]+'</li></ul></div>');
				}
				for (var i=0;i<data.data.length;i++){
					if(data.data[i].name==$.trim($("#selectCity .content .list-block .list-group").eq(0).find("li").eq(1).text())){
                        $("#selectCity .content .list-block .list-group").eq(0).find("li").eq(1).find(".item-title").attr("onclick","sitCity('"+data.data[i].name+"',"+data.data[i].cityId+")");
					}
					for(var i2=0;i2<cityList.length;i2++){
						if(cityList[i2]==data.data[i].spell.substring(0,1).toLocaleUpperCase()){
							$("#selectCity .content .list-block .list-group ul").eq(i2+1).append('<li><div class="item-content"><div class="item-inner"><div class="item-title" onclick="sitCity(\''+data.data[i].name+'\','+data.data[i].cityId+')">'+data.data[i].name+'</div></div></div></li>');
							break;
						}
					}
				}
				for(var i=$("#selectCity .content .list-block .list-group").length-1;i>=0;i--){
					if($("#selectCity .content .list-block .list-group").eq(i).find("li").length<2){
						$("#selectCity .content .list-block .list-group").eq(i).remove();
					}
				}
			}
		},
		error:function(error){

		}
	})
}

function sitCity(name,id){
	$.router.back();
	$(".page header .address").html("<a href='#selectCity' onclick='getCity()'>"+name+"</a>");
	$(".page header .address").attr("data-cityId",id);
    $(".page").eq(0).find("#swiper-index").find(".buttons-tab").find("a").eq(1).attr("onclick",'getNews(this,\'LOCAL\','+id+')');
}

function sort(){
    if(sessionStorage.authorization){
        $.router.load("#column");
        $.ajax({
            url:newsBaseUrl+"/user/news/channel/list",
            type: 'post',
            contentType: "application/json;charset=utf-8",
            crossDomain: true,
            headers: {"authorization": sessionStorage.authorization},
            dataType: 'json',
            success:function(data){
                if(data.success){
                    $("#column .content ul").find("li").remove();
                    for(var i=0;i<data.data.length;i++){
                        if(data.data[i].channelType=="SUBJECT"){
                            $("#column .content ul").append("<li class='col-25' data-channelId='"+data.data[i].channelId+"' data-channelType='"+data.data[i].channelType+"'>"+data.data[i].channelName+"</li>")
                        }
                    }
                }
            },
            error:function (error) {

            }
        })
    }
    else{
        if(confirm("还未登录，是否立即登录？")){
            $.router.load("#login");

        }
    }
}

function sorting(){
	var ele=$("#column .content ul li");
	var data=[];
	for(var i=0;i<ele.length;i++){
		var a={};
		a.channelType=ele.eq(i).attr("data-channelType");
		a.channelId=ele.eq(i).attr("data-channelId");
		a.channelName=ele.eq(i).text();
		data.push(a);
	}
	$.ajax({
        url:newsBaseUrl+"/user/news/channel/sort",
        type: 'post',
        contentType: "application/json;charset=utf-8",
        crossDomain: true,
        headers: {"authorization": sessionStorage.authorization},
        data:JSON.stringify(data),
        dataType: 'json',
        success:function(data){
        	if(data.success){
        		$.alert("排序成功");
        		$.router.back();
        		getChannel();
			}
			else{
        		$.alert(data.errorMsg);
			}
		},
		error:function(error){
        	$.alert("排序失败，请重试！");
		}
	})
}

//get gov channel
function getBidChannel(){
    $.ajax({
        url: bidBaseUrl + "/user/bid/subject/list",
        type: 'post',
        contentType: "application/json;charset=utf-8",
        crossDomain: true,
        headers:{"authorization":sessionStorage.authorization},
        dataType: 'json',
        success: function (data) {
            if(data.success){
                $("#goverment").eq(0).find("#swiper-gov").find(".buttons-tab").find("a").remove();

                for(var i=0;i<data.data.length;i++){
					$("#goverment").eq(0).find("#swiper-gov").find(".buttons-tab").append('<a href="" class="tab-link button swiper-slide external"></a>');
					$("#goverment").eq(0).find("#swiper-gov").find(".buttons-tab").find("a").last().text(data.data[i].name);
					$("#goverment").eq(0).find("#swiper-gov").find(".buttons-tab").find("a").last().attr("onclick","getBid(this,"+data.data[i].bidSubjectId+")");
                }
                $("#goverment").eq(0).find("#swiper-gov").find(".buttons-tab").find("a").first().addClass("active");
                $("#goverment .content .tabs .buttons-row").find("a").remove();
                if(data.data[0].bidSubjectViews.length>0){
                	for(var i=0;i<data.data[0].bidSubjectViews.length;i++){
                        $("#goverment .content .tabs .buttons-row").append("<a class='tab-link button'>"+data.data[0].bidSubjectViews[i].name+"</a>");
                        $("#goverment .content .tabs .buttons-row").find("a").last().attr("onclick","getBidByTab(this,"+data.data[0].bidSubjectViews[i].bidSubjectId+")").attr("data-pidSubjectId",data.data[0].bidSubjectId);
					}
                    $("#goverment .content .tabs .buttons-row").find("a").first().addClass("active");
					getBidByTab($("#goverment .content .tabs .buttons-row").find("a").first(),data.data[0].bidSubjectViews[0].bidSubjectId)
				}
				else{
                	getBid($("#goverment").eq(0).find("#swiper-gov").find(".buttons-tab").find("a"),data.data.bidSubjectId);
				}
            }
        },
        error: function (error) {

        }
    })
}

//get bid data ;
function getBid(thiz,id){
	$("#goverment .content #swiper-gov .buttons-tab").find(".active").removeClass("active");
	$(thiz).addClass("active");
    $.ajax({
        url: bidBaseUrl + "/user/bid/subject/list",
        type: 'post',
        contentType: "application/json;charset=utf-8",
        crossDomain: true,
        headers: {"authorization": sessionStorage.authorization},
        dataType: 'json',
        success: function (data) {
        	if(data.success){
        		for(var i=0;i<data.data.length;i++){
        			if(data.data[i].bidSubjectId==id){
                        $("#goverment .content .tabs .buttons-row").find("a").remove();
                        if(data.data[i].bidSubjectViews.length>0){
                            for(var i2=0;i2<data.data[i].bidSubjectViews.length;i2++){
                                $("#goverment .content .tabs .buttons-row").append("<a class='tab-link button'>"+data.data[i].bidSubjectViews[i2].name+"</a>");
                                $("#goverment .content .tabs .buttons-row").find("a").last().attr("onclick","getBidByTab(this,"+data.data[i].bidSubjectViews[i2].bidSubjectId+")").attr("data-pidSubjectId",data.data[i].bidSubjectId);
                            }
                            var a={"condition":{"subjectId":data.data[i].bidSubjectViews[0].bidSubjectId},"pageNum":0,"pageSize":0};
                            getBidList(1,JSON.stringify(a),data.data[i].bidSubjectId);
                            $("#goverment .content .tabs .buttons-row").find("a").first().addClass("active");
							break;
                        }else{
                            var a={"condition":{"subjectId":data.data[i].bidSubjectId},"pageNum":0,"pageSize":0};
                            getBidList(1,JSON.stringify(a),data.data[i].bidSubjectViews);
						}
					}
				}
			}
			else{
        		$.alert(data.errorMsg);
			}
        },
		error:function (error){

		}
    })
}

function getBidByTab(thiz,id){
    $("#goverment .content .tabs .buttons-row").find(".active").removeClass("active");
    $(thiz).addClass("active");
    var a={condition:{"subjectId":id},pageNum:0,pageSize:0};
    getBidList(1,JSON.stringify(a),$(thiz).attr("data-pidSubjectId"));
}
function getBidList(pageNum,data,pidSubjectId){
    $.showPreloader();
	if(!data) {
        data =JSON.stringify({"pageNum": pageNum, "pageSize": 0}) ;
    }
    $.ajax({
        url: bidBaseUrl + "/user/bid/subject/page",
        type: 'post',
        contentType: "application/json;charset=utf-8",
        crossDomain: true,
        headers: {"authorization": sessionStorage.authorization},
        data:data,
        dataType: 'json',
        success: function (data) {
            if(data.success){
            	var ele=$("#goverment .content .list-block ul");
            	if(pageNum==1){
                    ele.find("li").remove();
                    if(data.data.total>20){
                        if(infiniteNum>0){
                            $.attachInfiniteScroll($('.infinite-scroll'));
                        }
                        infiniteNum=1;
                        $('.infinite-scroll-preloader').css("display","");
					}
					else{
                        $('.infinite-scroll-preloader').css("display","none");
					}

				}

				lastIndex=data.data.pageNum+1;
            	maxPage=data.data.pages;
                for(var i=0;i<data.data.list.length;i++){
					ele.append("<li><a class='item-link item-content' onclick='getBidDetail("+data.data.list[i].bidId+")'><div class='item-inner'></div></a></li>")
					ele.find("li .item-inner").last().append("<div class='item-title-row'><div class='item-title'>"+data.data.list[i].title+"</div></div></div>");
					if(data.data.list[i].bidTopSubjectView){
                        ele.find("li .item-inner").last().append("<div class='item-content-row'><div class='sui-label'>置顶</div> &nbsp;<div class='types'>"+(data.data.list[i].sourceSite==undefined?"":data.data.list[i].sourceSite)+"</div><div class='time'>"+data.data.list[i].ctime+"</div><div class='clearfix'></div></div>");
					}
					else{
                        ele.find("li .item-inner").last().append("<div class='item-content-row'><div class='types'>"+(data.data.list[i].sourceSite==undefined?"":data.data.list[i].sourceSite)+"</div><div class='time'>"+data.data.list[i].ctime+"</div><div class='clearfix'></div></div>");
					}
                }
                $.hidePreloader();
                // $.ajax({
                 //    url: bidBaseUrl + "/user/bid/subject/page",
                 //    type: 'post',
                 //    contentType: "application/json;charset=utf-8",
                 //    crossDomain: true,
                 //    headers: {"authorization": sessionStorage.authorization},
                 //    data:JSON.stringify({condition:{subjectId:pidSubjectId},pageNum:0,pageSize:0}),
                 //    dataType: 'json',
                 //    success: function (data) {
                 //    	if(data.success){
                 //            for(var i=0;i<data.data.list.length;i++){
                 //                ele.append("<li><a class='item-link item-content' onclick='getBidDetail("+data.data.list[i].bidId+")'><div class='item-inner'></div></a></li>")
                 //                ele.find("li .item-inner").last().append("<div class='item-title-row'><div class='item-title'>"+data.data.list[i].title+"</div></div></div>");
                 //                if(data.data.list[i].bidTopSubjectView){
                 //                    ele.find("li .item-inner").last().append("<div class='item-content-row'><div class='sui-label'>置顶</div> &nbsp;<div class='types'>"+(data.data.list[i].sourceSite==undefined?"":data.data.list[i].sourceSite)+"</div><div class='time'>"+data.data.list[i].ctime+"</div><div class='clearfix'></div></div>");
                 //                }
                 //                else{
                 //                    ele.find("li .item-inner").last().append("<div class='item-content-row'><div class='types'>"+(data.data.list[i].sourceSite==undefined?"":data.data.list[i].sourceSite)+"</div><div class='time'>"+data.data.list[i].ctime+"</div><div class='clearfix'></div></div>");
                 //                }
                 //            }
                 //            $.hidePreloader();
				// 		}
				// 		else{
                 //            $.hidePreloader();
                 //    		alert(data.errorMsg);
                //
				// 		}
				// 	},
				// 	error:function(error){
                 //        $.hidePreloader();
                 //    	alert("数据获取失败，请重试！");
				// 	}
				// })
            }
            else{
                $.hidePreloader();
                $.alert(data.errorMsg);

            }
        },
        error:function (error) {
            $.hidePreloader();
            alert("数据获取失败，请重试！");
        }
    })

}

function getBidDetail(id){
	$.ajax({
        url: bidBaseUrl + "/user/bid/get?bidId="+id,
        type: 'post',
        contentType: "application/json;charset=utf-8",
        crossDomain: true,
        headers: {"authorization": sessionStorage.authorization},
        data:id,
        dataType: 'json',
        success: function (data) {
			if(data.success){
				$.router.load("#gov-detail");
                $("#gov-detail").attr("data-bidId",data.data.bidId);
                $("#gov-detail").find("header").find("h1").text((data.data.title.length>18?(data.data.title.substring(0,16)+"..."):data.data.title));
                $("#gov-detail").find(".content").find(".detail-title").text(data.data.title);
                $("#gov-detail").find(".content").find(".info span").eq(0).text(data.data.author);
                $("#gov-detail").find(".content").find(".info span").eq(1).text(data.data.vtime);
                $("#gov-detail").find(".content").find(".info span").eq(2).text(data.data.clicks+"人浏览");
                $("#gov-detail .content").find(".detail-content").html(data.data.content);
                $.ajax({
                    url: bidBaseUrl + "/user/bid/favor/check?bidId="+id,
                    type: 'post',
                    contentType: "application/json;charset=utf-8",
                    crossDomain: true,
                    headers: {"authorization": sessionStorage.authorization},
                    data:id,
                    dataType: 'json',
                    success: function (data) {
						if(data.success){
							if(data.data){
								$("#gov-detail header .fa").removeClass("fa-star-o").addClass("fa-star").attr("onclick","favorGov(false)");
							}
							else{
                                $("#gov-detail header .fa").removeClass("fa-star").addClass("fa-star-o").attr("onclick","favorGov(true)");
							}
						}else{
							$.alert(data.errorMsg);
						}
					},
					error:function (error) {

                    }
				})
			}
			else{
				$.alert(data.errorMsg);
			}
		},
		error:function (error) {
			$.alert("获取招标资讯失败，请重试！");
        }
	})
}

function favorGov(Yn){
    if(sessionStorage.authorization){
        var a={"favorYn":Yn,"bidId": ($("#gov-detail").attr("data-bidId")/1)};
        $.ajax({
            url:bidBaseUrl+"/user/bid/favor/set?bidId="+($("#gov-detail").attr("data-bidId")/1)+"&favorYn="+Yn,
            type: 'post',
            contentType: "application/json;charset=utf-8",
            crossDomain: true,
            headers: {"authorization": sessionStorage.authorization},
            data: JSON.stringify(a),
            dataType: 'json',
            success: function (data) {
                if(data.success){
                	if(Yn){
                        $("#gov-detail header .fa").removeClass("fa-star-o").addClass("fa-star").attr("onclick","favorGov(false)");
					}
					else{
                        $("#gov-detail header .fa").removeClass("fa-star").addClass("fa-star-o").attr("onclick","favorGov(true)");
					}
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
 function searchGov(){
     if($("#goverment .search").val()){
         $("#goverment .content .buttons-tab .active").removeClass("active");
         $.showIndicator();
         var a={"keyword":$("#goverment .search").val(),"pageSize":0,"pageNum":0};
         $.ajax({
             url:bidBaseUrl+"/user/bid/search/page",
             type: 'post',
             contentType: "application/json;charset=utf-8",
             crossDomain: true,
             headers: {"authorization": sessionStorage.authorization},
             data: JSON.stringify(a),
             dataType: 'json',
             success: function (data) {
                 if(data.success){
                     $("#goverment .content .tabs .buttons-row").find("a").remove();
                     $("#goverment .tabs .list-block").find("li").remove();
                     var ele=$("#goverment .content .list-block ul");
                     for(var i=0;i<data.data.list.length;i++){
                         ele.append("<li><a class='item-link item-content' onclick='getBidDetail("+data.data.list[i].bidId+")'><div class='item-inner'></div></a></li>")
                         ele.find("li .item-inner").last().append("<div class='item-title-row'><div class='item-title'>"+data.data.list[i].title+"</div></div></div>");
                         ele.find("li .item-inner").last().append("<div class='item-content-row'><div class='types'>"+(data.data.list[i].sourceSite==undefined?"":data.data.list[i].sourceSite)+"</div><div class='time'>"+data.data.list[i].ctime+"</div><div class='clearfix'></div></div>")
                     }

                 }
                 $.hideIndicator();
             },
             error:function (error) {
                 $.showIndicator()
             }
         })
     }
     else{
         if($("#goverment .content .buttons-tab a").hasClass("active")){

         }
         else{
             $("#goverment .content .buttons-tab a").eq(0).addClass("active");
         }
         $("#goverment .content .buttons-tab a.active").trigger("click");
     }
 }
function getFavorGov() {
 	$("#user .content .buttons-tab a").eq(0).removeClass("active");
    $("#user .content .buttons-tab a").eq(1).addClass("active");
	if(sessionStorage.authorization){
        $("#user .content .nobody").css("display","none");
        $("#user .content .tabs").css("display","");
		var a={"pageNum":0,"pageSize":0};
		$.ajax({
            url:bidBaseUrl+"/user/bid/favor/page",
            type: 'post',
            contentType: "application/json;charset=utf-8",
            crossDomain: true,
            headers: {"authorization": sessionStorage.authorization},
            data: JSON.stringify(a),
            dataType: 'json',
            success: function (data) {
				if(data.success){
					$("#user #user-tab1").find("ul").remove();
					if(data.data.list.length>0){
						$("#user .content .nobody").css("display","none");
						$("#user .content .tabs").css("display","");
                        $("#user #user-tab1 .list-block").append("<ul></ul>");
                        var ele=$("#user #user-tab1 .list-block ul");
                        for(var i=0;i<data.data.list.length;i++){
                            ele.append("<li><a class='item-link item-content' onclick='getBidDetail("+data.data.list[i].bidId+")'><div class='item-inner'></div></a></li>")
                            ele.find("li .item-inner").last().append("<div class='item-title-row'><div class='item-title'>"+data.data.list[i].title+"</div></div></div>");
                            ele.find("li .item-inner").last().append("<div class='item-content-row'><div class='types'>"+(data.data.list[i].sourceSite==undefined?"":data.data.list[i].sourceSite)+"</div><div class='time'>"+data.data.list[i].ctime+"</div><div class='clearfix'></div></div>")
                        }
					}
					else{
                        $("#user .content .nobody").css("display","");
                        $("#user .content .tabs").css("display","none");
                        $("#user .content .nobody p").text("没有收藏记录，快去收藏吧！");
                        $("#user .content .nobody a").css("display","none");
					}
				}
				else{
					$.alert(data.errorMsg);
					$.router.back();
				}
			},
			error:function (error) {

            }
		})
	}else{
        $("#user .content .nobody").css("display","");
        $("#user .content .tabs").css("display","none");
        $("#user .content .nobody p").text("用户还未登录，是否立即登录查看收藏？");
        $("#user .content .nobody a").css("display","");
	}
}

function getFavorNews(){
    $("#user .content .buttons-tab a").eq(1).removeClass("active");
    $("#user .content .buttons-tab a").eq(0).addClass("active");
    if(sessionStorage.authorization){
        $("#user .content .nobody").css("display","none");
        $("#user .content .tabs").css("display","");
        var a={"pageNum":0,"pageSize":0};
        $.ajax({
            url:newsBaseUrl+"/user/news/favor/page",
            type: 'post',
            contentType: "application/json;charset=utf-8",
            crossDomain: true,
            headers: {"authorization": sessionStorage.authorization},
            data: JSON.stringify(a),
            dataType: 'json',
            success: function (data) {
                if(data.success){
                    $("#user #user-tab1").find("ul").remove();
                    if(data.data.list.length>0){
                        $("#user .content .nobody").css("display","none");
                        $("#user .content .tabs").css("display","");
                        $("#user #user-tab1 .list-block").append("<ul></ul>");
                    	var ele=$("#user #user-tab1 .list-block ul");
                        ele.find("li").remove();
                        for(var i=0;i<data.data.list.length;i++){
                            ele.append("<li></li>");
                            ele.find("li").last().append('<a class="item-link item-content" href="#index-detail" onclick="turn('+data.data.list[0].newsId+')"></a>');
                            ele.find('a').last().append('<div class="item-inner"><div class="item-title-row"><div class="item-title">'+data.data.list[i].title+'</div></div></div>');
                            ele.find(".item-inner").last().append('<div class="item-content-row"><div class="types">'+(data.data.list[i].author==undefined?"":data.data.list[i].author)+'</div><div class="time">'+data.data.list[i].ctime+'</div><div class="clearfix"></div></div>');
                            ele.find('a').last().append('<div class="item-media"><img src="'+data.data.list[i].images+'" style="width: 5rem;"></div>')
                        }
                    }
                    else{
                        $("#user .content .nobody").css("display","");
                        $("#user .content .tabs").css("display","none");
                        $("#user .content .nobody p").text("没有收藏记录，快去收藏吧！");
                        $("#user .content .nobody a").css("display","none");
                    }
                }
                else{
					$.alert(data.errorMsg);
					$.router.back();
                }
            },
            error:function (error) {
				$.alert("数据获取错误！");
				$.router.back();
            }
        })
    }else{
        $("#user .content .nobody").css("display","");
        $("#user .content .tabs").css("display","none");
        $("#user .content .nobody p").text("用户还未登录，是否立即登录查看收藏？");
        $("#user .content .nobody a").css("display","");
    }
}

function getUserData(){
	if($("#user .content .buttons-tab .active").attr("data-type")=="1"){
		getFavorNews();
	}
	else{
		getFavorGov();
	}
}

