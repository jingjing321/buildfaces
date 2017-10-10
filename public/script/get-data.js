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
	if(!/^[\u4e00-\u9fa5a-zA-Z0-9_-]{4,16}$/.test(userName)){
		$.toast("请填写4-16位不包含特殊字符的用户名！");
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
		success:function(info){
			if(info.success){
				if($.alert("登录成功！")){

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
				$(".page").eq(0).find("#swiper-index").find(".buttons-tab").append('<a href="#recommend" class="tab-link button swiper-slide active">推荐</a>');
                $(".page").eq(0).find("#swiper-index").find(".buttons-tab").append('<a href="#local" class="tab-link button swiper-slide">本地</a>');

				for(var i=0;i<data.data.length;i++){
					if(data.data[i].channelType=="SUBJECT"){
                        $(".page").eq(0).find("#swiper-index").find(".buttons-tab").append('<a href="" class="tab-link button swiper-slide"></a>');
                        $(".page").eq(0).find("#swiper-index").find(".buttons-tab").find("a").last().text(data.data[i].channelName);
                        $(".page").eq(0).find("#swiper-index").find(".buttons-tab").find("a").last()[0].href="#tab"+data.data[i].channelId;
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
function getNews(){
	var a={condition:{"channelType":"RECOMMEND"},pageNum:0,pageSize:0};
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
                    $(".page").eq(0).find(".tabs").find("ul").find("li").last().append('<a class="item-link item-content" href="#index-detail"></a>');
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