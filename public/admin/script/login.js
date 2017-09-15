var baseUrl="http://192.168.20.61:8000/manager-service";
function login(){
	var userName=$("#userName").val();
	var password=$("#password").val();
	var a={"accountName":userName,"password":password};
	$.ajax({
		url:baseUrl+"/platform/manager/login",
		type:'post',
		contentType:"application/json;charset=utf-8",
		crossDomain:true,
		data:JSON.stringify(a),
		dataType:'json',
		success:function(data,textStatus,request){
			if(data.success){
				sessionStorage.authorization=request.getResponseHeader("authorization");
				sessionStorage.managerId=data.data;
				window.location.href="../admin";
			}
			else{
				alert(data.errorMsg);
			}
		},
		error:function(error){
			alert("登录失败，请重试！");
		}
	});
}