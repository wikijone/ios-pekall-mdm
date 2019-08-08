/*! jQuery-banner V1.2 beta | (c) 2016-2025  jQuery plug-in | lzmoop 2016-7 */
jQuery.fn.banner=function(a,b,c){
	var banner=jQuery(this),	//将执行对象存入变量
	imgBox=banner.children().first(), //将图片盒子存入变量
	img=imgBox.children();  //将图片存入变量
	defaults={
		len:0,	//图片总数
		btnW:0,	//焦点按钮盒子宽度
		imgW:0,	//图片宽度
		imgH:0,	//图片高度
		addmethods:function(){ //给执行对象添加基本样式
			this.imgW=banner.width();  //获取执行对象的宽度并赋值给imgW
			this.imgH=banner.height();	//获取执行对象的高度并赋值给imgH
			this.len=imgBox.children().length;  //获取图片张数并赋值给len
			banner.hide().css('position','relative');  //隐藏执行对象并设置相对定位
			imgBox.css('position','absolute').addClass('jquery-bannerImg').children().css('position','absolute').addClass('jquery-bannerImg-images');   //设置图片盒子及图片基本样式
		},
		addwidget:function(){ //添加左右控件
			var widget="<ul class='jquery-bannerBtn'><li class='jquery-bannerBtn-left'>&lt;</li><li class='jquery-bannerBtn-right'>&gt;</li></ul>";
			banner.append(widget);
		},
		addBtn:function(){  //添加焦点按钮
			var pointBox=jQuery("<ul class='jquery-bannerPoint'></ul>");
			banner.append(pointBox.get(0));
			point="<li class='jquery-bannerPoint-point'></li>";
			for(var i=0;i<this.len;i++){
				pointBox.append(point);
				this.btnW+=pointBox.find('li').eq(i).outerWidth(true)  //累加获取焦点按钮盒子宽度
			}
		},
		layout:function(){
			var pointBox=banner.find('ul').last(); //将焦点盒子保存在变量中
			pointBox.css('width',this.btnW).find('li').eq(0).addClass('jquery-bannerPoint-hover');  //赋予焦点盒子宽度并设置第一个焦点选中样式
			imgBox.children().css('zIndex',0).eq(0).css('zIndex',30); //初始化图片盒子内所有元素的zindex
			imgBox.nextAll().css('zIndex',50);  //设置焦点按钮和左右控件盒子的zindex
			banner.show();
		},
		init:function(){  //初始化布局
			this.addmethods();
			this.addwidget();
			this.addBtn();
			this.layout();
		}
	}

	var methods={ //轮播功能
		effect:null,  //轮播效果:left,right,top,down,fade,cut
		interval:null, //轮播间隔时间
		duration:null,  //轮播持续时间:数字或(fast,median,slow)
		auto:null,  //是否自动播放: true或false
		cycle:null, //是否循环播放：true或false
		time:null,  //保存计时器
		cPoint:0,  //当前焦点位置
		sPoint:0,  //点击焦点位置
		flag:true, //防止叠加的标记
		imgHide:{zIndex:0},
		imgShow:{zIndex:30},
		changeFlag:function(){// 防叠加标记函数
			methods.flag=true
		},
		btnChange:function(direction){//当前位置
			if (direction=='left'||direction=='up'||direction=='fade'||direction=='cut') {
				methods.sPoint>defaults.len-2&&(methods.sPoint=-1);
			}else{
				methods.sPoint<0&&(methods.sPoint=defaults.len-1);
			}
		},
		indexChange:function(direction){//下一个位置
			if (direction=='left'||direction=='up'||direction=='fade'||direction=='cut') {
				methods.sPoint<defaults.len-2?methods.sPoint++:methods.sPoint=-1;
			}else{
				(methods.sPoint>0&&methods.sPoint<=defaults.len-1)?methods.sPoint--:methods.sPoint=defaults.len-1;
			}
		},
		effectParam:function(direction){
			var param=[] //建立数组存放动画方法
			if (direction=='left'||direction=='fade'||direction=='cut'){// 当参数为left fade cut时的运动方式
				param.push(methods.sPoint+1); //获取操作对象的位置
				param.push({left:defaults.imgW}); //向右执行的动画
				param.push({left:-defaults.imgW}); //向左执行的动画
				param.push({left:0}) //水平位置动画初始化
			}else if(direction=='right'){ //当参数为right时的运动方式
				param.push(methods.sPoint-1);//获取操作对象的位置
				param.push({left:-defaults.imgW});//向左执行的动画
				param.push({left:defaults.imgW})//向右执行的动画
				param.push({left:0}) //水平位置动画初始化
			}else if(direction=='up'){ //当参数为up时的运动方式
				param.push(methods.sPoint+1);//获取操作对象的位置
				param.push({top:defaults.imgH})//向下执行的动画
				param.push({top:-defaults.imgH})//向上执行的动画
				param.push({top:0}) //垂直方向动画初始化
			}else if(direction=='down'){ //当参数为down时的运动方式
				param.push(methods.sPoint-1);//获取操作对象的位置
				param.push({top:-defaults.imgH}) //向上执行的动画
				param.push({top:defaults.imgH}) //向下执行的动画
				param.push({top:0}) //垂直方向动画初始化
			}
			return param;//返回数组
		},	
		effectAll:function(direction){//主函数方法
			methods.btnChange(direction);
			var pointBox=banner.find('ul').last().find('li');//找到焦点按钮盒子中的li保存在变量中
			var param=methods.effectParam(direction);//将获取的动画参数存入变量中
			pointBox.removeClass('jquery-bannerPoint-hover');//移出所有的获得焦点样式
			pointBox.eq(param[0]).addClass('jquery-bannerPoint-hover');//给当前焦点按钮添加焦点样式
			if (methods.effect=='fade') {  //当效果为fade时调用fade方法
				img.css('zIndex',0);  //设置所有img的zIndex为0
				img.eq(methods.sPoint).css('zIndex',30) //设置当前的img的zIndex为30
				img.eq(param[0]).css({zIndex:35,display:'none'}).fadeIn(methods.duration) //设置下一张图片的zindex为35并淡入
			}else if(methods.effect=='cut'){  //当效果为cut时调用cut方法
				img.css('zIndex',0);   //设置所有img的zIndex为0
				img.eq(param[0]).css('zIndex',30)  //设置下一张的img的zIndex为30以显示
			}else{
				img.css(param[3]);  //将所有的img的left值或top值设置为0
				img.css(methods.imgHide) //初始化所有的图片样式
				img.eq(methods.sPoint).css(methods.imgShow) //设置当前图片的样式
				img.eq(param[0]).css(param[1]) //设置下一张图片的样式
				img.eq(param[0]).css(methods.imgShow) //设置下一张图片的样式
				img.eq(methods.sPoint).animate(param[2],methods.duration); //设置当前图片的动画效果
				img.eq(param[0]).animate(param[3],methods.duration); //设置下一张图片的动画效果
			}
			methods.indexChange(direction) //更改当前图片的下标
		},
		pointParam:function(direction){ 
			var param=[] //设置存放点击焦点按钮时的动画效果
			if (direction=='left'||direction=='fade'||direction=='cut'||direction=='right') {//设置左右移动效果的参数
				param.push({left:defaults.imgW}); 
				param.push({left:-defaults.imgW}); 
				param.push({left:0})
			}else if(direction=='up'||direction=='down'){//设置上下移动效果的参数
				param.push({top:defaults.imgH})
				param.push({top:-defaults.imgH})
				param.push({top:0})
			}
			return param;
		},
		pointChange:function(direction){ //点击焦点按钮进行图片切换的效果
			methods.sPoint<0&&(methods.sPoint=defaults.len-1); //初始化当前下标
			var pointBox=banner.find('ul').last().find('li'); //获取焦点按钮
			pointBox.removeClass('jquery-bannerPoint-hover'); //移出所有焦点按钮的选中样式
			pointBox.eq(methods.cPoint).addClass('jquery-bannerPoint-hover') //赋予被点击了的焦点按钮选中样式
			img.css('zIndex',0); //初始化图片样式 
			img.eq(methods.sPoint).css('zIndex',30); //设置当前图片的样式
			var param=methods.pointParam(direction); //获取动画参数
			img.css(param[2]); 
			if (methods.effect=='fade') { //设置fade效果
				img.eq(methods.cPoint).css({zIndex:35,display:'none'}).fadeIn(methods.duration)
			}else if(methods.effect=='cut'){//设置cut效果
				img.eq(methods.cPoint).css('zIndex',35) 
			}else{ 
				if (methods.cPoint>methods.sPoint) { //当选中按钮比当前按钮的下标大时执行右移或下移效果
					img.eq(methods.cPoint).css('zIndex',30);
					img.eq(methods.cPoint).css(param[0]);
					img.eq(methods.sPoint).animate(param[1],methods.duration);
					img.eq(methods.cPoint).animate(param[2],methods.duration)
				}else if(methods.cPoint<methods.sPoint){ //当选中按钮比当前按钮的下标小时执行左移或上移效果
					img.eq(methods.cPoint).css('zIndex',30);
					img.eq(methods.cPoint).css(param[1]);
					img.eq(methods.sPoint).animate(param[0],methods.duration);
					img.eq(methods.cPoint).animate(param[2],methods.duration)
				}
			}
			methods.sPoint=methods.cPoint;
		},
		clickPoint:function(){ //点击焦点按钮进行图片切换
			banner.find('ul').last().find('li').on('click', function() {
				methods.effect==null&&(methods.effect='left'); 
				if (methods.flag) {
					methods.cPoint=jQuery(this).index(); //记录当前焦点位置
					methods.pointChange(methods.effect);  //调用焦点改变函数
					methods.flag=false; //设置按钮不可操作
					setTimeout(methods.changeFlag,methods.duration) //动画执行完成后设置按钮可操作
				}	
			})
		},
		click:function(){  //点击左右控件按钮进行图片切换
			if (methods.effect=='up'||methods.effect=='down') { //判断当前用户使用的轮播效果
				var direction1='down';
				var direction2='up';
			}else{
				var direction1='right';
				var direction2='left';
			}
			banner.find('ul').last().prev().find('li').eq(0).on('click', function() {
				if (methods.flag&&((methods.cycle==null||methods.cycle)||(!methods.cycle&&methods.sPoint!=0))) {//判断是否可执行
					methods.cPoint=methods.sPoint;
					methods.effectAll(direction1);  //调用图片切换效果函数
					methods.flag=false;
					setTimeout(methods.changeFlag,methods.duration)
				}
			})
			banner.find('ul').last().prev().find('li').eq(1).on('click', function() {
				if (methods.flag&&((methods.cycle==null||methods.cycle)||(!methods.cycle&&methods.sPoint<defaults.len-1&&methods.sPoint!=-1))) {//判断是否可执行
					methods.cPoint=methods.sPoint;
					methods.effectAll(direction2);  //调用图片切换效果函数
					methods.flag=false;
					setTimeout(methods.changeFlag,methods.duration)
				}
			})
		},
		autoPlay:function(){  //自动播放设置
			methods.effect==null&&(methods.effect='left'); 
			methods.effectAll(methods.effect);
		},
		pause:function(){  //鼠标移入暂停，移出播放函数
			banner.on('mouseover', function() {
				clearInterval(methods.time);
				methods.time=null
			})
			banner.on('mouseout', function() {
				(typeof (methods.auto)!='boolean'&&methods.auto!=null)&&jQuery.error('自动播放参数设置错误');  //参数auto不合法
				(methods.auto||methods.auto==null)&&(methods.time=setInterval(methods.autoPlay,methods.interval))
			});
			(typeof (methods.auto)!='boolean'&&methods.auto!=null)&&jQuery.error('自动播放参数设置错误');  //参数auto不合法
			(methods.auto||methods.auto==null)&&(methods.time=setInterval(methods.autoPlay,methods.interval))
		},
		initParam:function(){  //初始化各项参数
			if(typeof(a)=='object'){  //若参数a为对象，则将对象中各个参数初始化
				methods.effect=a.effect;
				methods.interval=a.interval;
				methods.duration=a.duration;
				methods.auto=a.auto;
				methods.cycle=a.cycle;
			}else{  //若参数a不为对象，则将参数赋值给相关变量
				methods.effect=a;
				methods.interval=b;
				methods.duration=c
			}
			!isNaN(methods.effect)&&(methods.effect=null,methods.interval=a,methods.duration=b); //判断effect是否填写合法
			(methods.effect=='fast'||methods.effect=='medium'||methods.effect=='slow')&&(methods.effect=null,methods.interval=a,methods.duration=methods.interval); //判断effect是否合法
			methods.interval=='fast'&&(methods.interval=1500,methods.duration=300);  //将指定字符转为速度参数
			methods.interval=='medium'&&(methods.interval=3000,methods.duration=600); //同上
			methods.interval=='slow'&&(methods.interval=6000,methods.duration=1200); //同上
			methods.interval==null&&(methods.interval=3000,methods.duration=600);  //设置默认参数
			methods.duration==null&&(methods.duration=600);  //设置默认参数
			(methods.duration>methods.interval)&&jQuery.error('参数错误 动画间隔小于动画速度'); //参数不合法判断
			(isNaN(methods.interval)||isNaN(methods.duration))&&jQuery.error('参数设置错误 非有效值')  //同上
		},
		init:function(){
			methods.initParam();
			methods.pause();
			methods.click();
			methods.clickPoint();
		}
	}
	defaults.init();
	methods.init();
}
