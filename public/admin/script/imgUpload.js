function imgPreview(fileDom){
	var reader = new FileReader();
	var file =fileDom.files[0];
	var imageType=/^image\//;
	if(!imageType.test(file.type)){
		alert('请选择图片！');
		return ;
	}
	reader.onload=function(e){
		var img=document.getElementById('preview');
		img.src=e.target.result;
	};
	reader.readAsDataURL(file);
}