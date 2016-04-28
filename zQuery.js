//内部方法
function getEle(str,aParent){
	//把str变数组[#div1,ul,li, .box]	
	var arr=str.match(/\S+/g);
	var aParent=aParent||[document];
	var aChild=[];
	
	for(var i=0;i<arr.length;i++){
		aChild = getByStr(aParent,arr[i]);	
		aParent = aChild;
	}
	
	//丢出去的是子
	return aChild;
	
}
function getByStr(aParent,str){
	var aChild=[];
	
	//向aChild去推数据
	for(var j=0;j<aParent.length;j++){
		//#div1/ul/li/.box
		switch(str.charAt(0)){
			case '#':		//id
				var obj = document.getElementById(str.substring(1));
				obj && aChild.push(obj);
				break;
			case '.':		//class
				var aEle = getByclass(aParent[j],str.substring(1));
				for(var i=0;i<aEle.length;i++){
					aChild.push(aEle[i]);	
				}
				break;
			default:	//tagname
				//div#div1 li.box div[title=bmw] li:eq(3) li:first li:odd  li:lt(3)
				if(/\w+#\w+/.test(str)){//	div#div1
					var arr=str.split('#')//[tagname,id]
					var aEle = aParent[j].getElementsByTagName(arr[0]);
					for(var i=0;i<aEle.length;i++){
						if(aEle[i].id==arr[1]){
							aChild.push(aEle[i]);	
						}
					}
				}else if(/\w+\.\w+/.test(str)){//li.box
					var arr=str.split('.');	//[li,box]
					var aEle=aParent[j].getElementsByTagName(arr[0]);
					var re = new RegExp('\\b'+arr[1]+'\\b');
					for(var i=0;i<aEle.length;i++){
						if(re.test(aEle[i].className)){
							aChild.push(aEle[i]);
						}	
					}	
				}else if(/\w+\[\w+=\w+\]/.test(str)){//div[title=bmw]
					var arr=str.split(/\[|=|\]/)//[div,title,bmw]
					var aEle=aParent[j].getElementsByTagName(arr[0]);
					for(var i=0;i<aEle.length;i++){
						if(aEle[i].getAttribute(arr[1])==arr[2]){
							aChild.push(aEle[i]);
						}
					}
				}else if(/\w+:\w+(\(\w+\))?/.test(str)){//li:eq(3) li:first li:odd  li:lt(13)
					var arr=str.split(/:|\(|\)/)//[li,gt,3];
					var aEle=aParent[j].getElementsByTagName(arr[0]);
					if(aEle.length==0) return aChild;
					switch(arr[1]){
						case 'first':
							aChild.push(aEle[0])
							break;	
						case 'last':
							aChild.push(aEle[aEle.length-1])
							break;	
						case 'eq':
							var obj = aEle[arr[2]]
							obj&&aChild.push(obj)
							break;	
						case 'lt':
							for(var i=0;i<arr[2];i++){
								aChild.push(aEle[i]);
							}
							break;	
						case 'gt':
							for(var i=parseInt(arr[2])+1;i<aEle.length;i++){
								aChild.push(aEle[i]);
							}
							break;	
						case 'odd':
							for(var i=0;i<aEle.length;i++){
								if(i%2==1){
									aChild.push(aEle[i]);	
								}
							}
							break;	
						case 'even':
							for(var i=0;i<aEle.length;i+=2){
								aChild.push(aEle[i]);	
							}
							break;	
					}
				}else{
					var aEle = aParent[j].getElementsByTagName(str);
					for(var i=0;i<aEle.length;i++){
						aChild.push(aEle[i]);	
					}
				}
				
		}
	}
	return aChild;
}
function getByclass(oParent,sClass){
	if(oParent.getElementsByClassName){
		return oParent.getElementsByClassName(sClass);	
	}
	
	var aEle=oParent.getElementsByTagName('*');
	var result=[];
	var re = new RegExp('\\b'+sClass+'\\b');
	for(var i=0;i<aEle.length;i++){
		if(re.test(aEle[i].className)){
			result.push(aEle[i]);	
		}
	}
	return result;
}
function ready(fn){
	if(document.addEventListener){
		document.addEventListener('DOMContentLoaded',function(){
			fn && fn();	
		},false);
	}else{
		document.attachEvent('onreadystatechange',function(){
			if(document.readyState=='complete'){
				fn && fn();	
			}
		});
	}
}
function getStyle(obj,attr){
	return obj.currentStyle?obj.currentStyle[attr]:getComputedStyle(obj,false)[attr];	
}
function addEvent(obj,sEvt,fn){
	if(obj.addEventListener){
		obj.addEventListener(sEvt,function(ev){
			if(fn.call(obj,ev)==false){
				ev.cancelBubble=true;
				ev.preventDefault();//阻止默认for高	
			}
		},false);
	}else{
		obj.attachEvent('on'+sEvt,function(event){
			if(fn.call(obj,event)==false){
				event.cancelBubble=true;//阻止冒泡
				return false;//阻止默认
			}	
		});
	}
}
function ajax(options){
	options=options||{};
	options.data=options.data||{};
	options.type=options.type||'get';
	options.timeout=options.timeout||0;
	options.success=options.success||null;
	options.error=options.error||null;
	
	
	options.data.t=Math.random();
	
	//0.整理接口
	var arr=[];
	for(var key in options.data){
		arr.push(key+'='+encodeURIComponent(options.data[key]))	
	}
	var str=arr.join('&');
	
	
	//1创建ajax对象
	if(window.XMLHttpRequest){
		var oAjax=new XMLHttpRequest();	
	}else{
		var oAjax=new ActiveXObject('Microsoft.XMLHTTP');	
	}
	if(options.type=='get'){
		//2.连接
		oAjax.open('get',options.url+'?'+str,true);
		//3.请求
		oAjax.send();	
	}else{
		//2.连接
		oAjax.open('post',options.url,true);
		//oAjax.setRequestHeader('属性',值)
		oAjax.setRequestHeader('Content-Type','application/x-www-form-urlencoded');	//设定头信息
		//3.请求	
		oAjax.send(str);		//post在这里传数据
	}
	//4.接收
	oAjax.onreadystatechange=function(){
		if(oAjax.readyState==4){
			clearTimeout(timer);
			if(oAjax.status>=200&oAjax.status<300||oAjax.stauts==304){
				options.success&&options.success(oAjax.responseText);
			}else{
				options.error && options.error(oAjax);
			}
			
		}
	};
	if(options.timeout){
		var timer=setTimeout(function(){
			alert('超时了');
			oAjax.abort();	//中断加载
			
		},options.timeout);	
	}
}
function move(obj,json,opational){
	
	opational=opational||{};
	opational.duration=opational.duration||300;
	opational.complete=opational.complete||null;
	opational.easing=opational.easing||'ease-out';
	
	var start={};
	var dis={};
	for(var key in json){
		start[key]=parseFloat(getStyle(obj,key));
		dis[key]=parseFloat(json[key])-start[key];
	}
	
	var count=Math.round(opational.duration/30);
	var n=0;
	
	clearInterval(obj.timer);
	obj.timer=setInterval(function(){
		
		n++;
		
		for(var key in json){
			
			//var cur=start[key]+n*dis[key]/count;
			switch(opational.easing){
				case 'linear':
					var a=n/count;
					var cur=start[key]+dis[key]*a;
					break;	
				case 'ease-in':
					var a=n/count;
					var cur=start[key]+dis[key]*a*a*a;
					break;	
				case 'ease-out':
					var a=1-n/count;
					var cur=start[key]+dis[key]*(1-a*a*a);
					break;	
			}
		
		
			if(key=='opacity'){
				obj.style.opacity=cur;
				obj.style.filter='alpha(opacity='+cur*100+')';
			}else{
				obj.style[key]=cur+'px';
			}
		}
		
		
		if(n==count){
			clearInterval(obj.timer);
			opational.complete && opational.complete();
		}
		
	},30);	
}

//构造函数
function zQuery(args){
	this.elements=[];//存放抓取的元素
	switch(typeof args){
		case 'function':
			ready(args);
			break;	
		case 'string':
			this.elements = getEle(args);
			break;	
		case 'object':
			if('length' in args){
				for(var i=0;i<args.length;i++){
					this.elements.push(args[i]);	
				}
			}else {
				this.elements.push(args);
			}
			
			break;	
	}
}
function $(args){
	return new zQuery(args);
}

//原型方法
zQuery.prototype.css=function(attr,value){
	if(arguments.length==2){//修改
		for(var i=0;i<this.elements.length;i++){
			this.elements[i].style[attr]=value;
		}
	}else{
		if(typeof attr=='string'){//获取
			return getStyle(this.elements[0],attr);
		}else if(typeof attr=='object'){//批量修改
			for(var i=0;i<this.elements.length;i++){
				for(var key in attr){
					this.elements[i].style[key]	= attr[key];
				}
			}
		}
	}
};
zQuery.prototype.attr=function(name,value){
	if(arguments.length==2){//修改
		for(var i=0;i<this.elements.length;i++){
			this.elements[i].setAttribute(name,value);
		}
	}else{
		if(typeof name=='string'){//获取
			return this.elements[0].getAttribute(name);
		}else if(typeof name=='object'){//批量修改
			for(var i=0;i<this.elements.length;i++){
				for(var key in name){
					this.elements[i].setAttribute(key,name[key]);
				}
			}
		}
	}
};

//事件
'click|mouseover|mouseout|contextmenu'.replace(/\w+/g,function(sEvt){
	//sEvt	==	click/mouseover/mouseout	
	zQuery.prototype[sEvt]=function(fn){
		for(var i=0;i<this.elements.length;i++){
			addEvent(this.elements[i],sEvt,fn);
		}	
	};
});
zQuery.prototype.toggle=function(){
	//args   fn0 fn1 fn2 fn3
	//args[0]+()	函数下标 0 1 2 3 0 1 2 3 ..
	//args[当前函数的下标 % args.length]	+	()
	var args=arguments;
	for(var i=0;i<this.elements.length;i++){
		this.elements[i].index=0;
		addEvent(this.elements[i],'click',function(ev){
			if(args[this.index%args.length].call(this,ev)==false){
				this.index++;
				return false;	
			}else{
				this.index++;	
			}
			
		});	
	}
};
zQuery.prototype.mouseenter=function(fn){
	for(var i=0;i<this.elements.length;i++){
		addEvent(this.elements[i],'mouseover',function(ev){
			var oFrom=ev.fromElement||ev.releateTarget;
			if(oFrom && this.contains(oFrom)) return;
			fn.call(this,ev);	
		});
	}
};
zQuery.prototype.mouseleave=function(fn){
	for(var i=0;i<this.elements.length;i++){
		addEvent(this.elements[i],'mouseout',function(ev){
			var oTo=ev.toElement||ev.releateTarget;
			if(oTo && this.contains(oTo)) return;
			fn.call(this,ev);	
		});
	}
};
zQuery.prototype.hover=function(fn1,fn2){
	this.mouseenter(fn1);	
	this.mouseleave(fn2);	
};
zQuery.prototype.eq=function(index){
	return $(this.elements[index]);
}
zQuery.prototype.get=function(index){
	return this.elements[index];
}
zQuery.prototype.hide=function(){
	for(var i=0;i<this.elements.length;i++){
		this.elements[i].style.display='none';	
	}
};
zQuery.prototype.show=function(){
	for(var i=0;i<this.elements.length;i++){
		this.elements[i].style.display='inline-block';	
	}
};
zQuery.prototype.index=function(){
	//var oParent=this.elements[0].parentNode;
	var oParent=this.get(0).parentNode;
	var aChild=oParent.children;
	for(var i=0;i<aChild.length;i++){
		if(aChild[i]==this.get(0)){
			return i;
		}
	}
};
zQuery.prototype.find=function(str){
	//this.elements		父级	==	document/oDiv/aUl
	//str	子集
	return $(getEle(str,this.elements));
};
zQuery.prototype.addClass=function(sClass){
	var re = new RegExp('\\b'+sClass+'\\b');
	for(var i=0;i<this.elements.length;i++){
		if(!re.test(this.elements[i].className)){
			if(this.elements[i].className){
				this.elements[i].className=this.elements[i].className+' '+sClass;
			}else{
				this.elements[i].className=sClass;
			}
			this.elements[i].className=this.elements[i].className.replace(/^\s+|\s+$/g,'').replace(/\s+/g,' ');
		}	
	}
}
zQuery.prototype.removeClass=function(sClass){
	var re = new RegExp('\\b'+sClass+'\\b','g');
	for(var i=0;i<this.elements.length;i++){
		if(re.test(this.elements[i].className)){
			//this.elements[i].className=this.elements[i].className.replace(re,'').replace(/^\s+|\s+$/,'').replace(/\s+/g,' ');
			this.elements[i].className=this.elements[i].className.replace(re,'').replace(/^\s+|\s+$/g,'').replace(/\s+/g,' ');
		}
	}
};
zQuery.prototype.hasClass=function(sClass){
	var re = new RegExp('\\b'+sClass+'\\b','g');
	for(var i=0;i<this.elements.length;i++){
		if(re.test(this.elements[i].className)) return true;	
	}
	return false;
};
zQuery.prototype.toggleClass=function(sClass){
	for(var i=0;i<this.elements.length;i++){
		if($(this.elements[i]).hasClass(sClass)){
			$(this.elements[i]).removeClass(sClass);	
		}else{
			$(this.elements[i]).addClass(sClass);	
		}	
	}
};
zQuery.prototype.each=function(fn){
	for(var i=0;i<this.elements.length;i++){
		fn.call(this.elements[i],i,this.elements[i])	
	}
};
//插件
$.fn=zQuery.prototype;
zQuery.prototype.extend=function(json){
	for(var key in json){
		zQuery.prototype[key]=json[key];
	}	
};
$.ajax=ajax;	//ajax
//运动
zQuery.prototype.animate=function(json,optional){
	for(var i=0;i<this.elements.length;i++){
		move(this.elements[i],json,optional);
	}
};