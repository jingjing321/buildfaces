// 首页栏目滑动
var mySwiper=new Swiper("#swiper-index",{
	slidesPerView: 5,
	freeMode : true,
})

// 首页栏目排序
var byId = function (id) { return document.getElementById(id); },

	loadScripts = function (desc, callback) {
		var deps = [], key, idx = 0;

		for (key in desc) {
			deps.push(key);
		}

		(function _next() {
			var pid,
				name = deps[idx],
				script = document.createElement('script');

				script.type = 'text/javascript';
				script.src = desc[deps[idx]];

				pid = setInterval(function () {
					if (window[name]) {
						clearTimeout(pid);

						deps[idx++] = window[name];

						if (deps[idx]) {
							_next();
						} else {
							callback.apply(null, deps);
						}
					}
				}, 30);

				document.getElementsByTagName('head')[0].appendChild(script);
			})()
		},

		console = window.console;


	if (!console.log) {
		console.log = function () {
			alert([].join.apply(arguments, ' '));
		};
	}
Sortable.create(byId('bar'), {
	group: "words",
	animation: 150,
	onAdd: function (evt){ console.log('onAdd.bar:', evt.item); },
	onUpdate: function (evt){ console.log('onUpdate.bar:', evt.item); },
	onRemove: function (evt){ console.log('onRemove.bar:', evt.item); },
	onStart:function(evt){ console.log('onStart.foo:', evt.item);},
	onEnd: function(evt){ console.log('onEnd.foo:', evt.item);}
	});

// 政府招标栏目滑动
var mySwiper2=new Swiper("#swiper-gov",{
	slidesPerView: 5,
	freeMode : true
});

//地理位置获取
$.getScript('http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js',function(){
	$(".page").eq(0).find("header").find("button").text(remote_ip_info.city);
});