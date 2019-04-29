window.HttpQuest = function(){
	this.quene = [];
};
window.HttpQuest.prototype = {
	init:function(url,success,error,method){
		let Method = method.toLocaleLowerCase();
		let tagId = arguments[4]!=undefined?arguments[4]:this.getRanId();
		if(Method==="get"){
			this.get(url,success,error,() => {
				let findTag = this.quene.findIndex(item => {
					return item.id===tagId;
				})
				if(findTag>-1){
					if(this.quene[findTag].tagNum===1){
						this.quene.splice(findTag,1);
						if(this.quene.findIndex(item => {return item.tagNum===0})>-1){
							let initData = this.quene.find(item => {return item.tagNum===0})
							this.quene.splice(this.quene.findIndex(item => {return item.tagNum===0}),1)
							this.init(initData.url,initData.success,initData.error,'get',initData.id);
						}
					}else{
						this.quene[findTag].tagNum = 1;
					}
				}else{
					this.quene.push({id:tagId,tagNum:0,url:url,success:success,error:error});
				}
			});
		}
	},
	getRanId:() => {
		return (Math.round(Math.random()*100000+10000)+"").split('').map(function(item){return "abcdefghijk".split('')[parseInt(item)]}).join("");
	},
	get:function(url,success,error,...rest){
		if(rest[0]){
			rest[0]()
		}
		if(this.quene.findIndex(item => {return item.tagNum===1})>-1){
			return ;
		}
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET",decodeURI(url),true);//false代表同步  true代表异步
		xmlhttp.setRequestHeader('content-type','application/json;charset=utf-8');//发送端发送数据类型
		xmlhttp.setRequestHeader('Accept','application/json, text/javascript, */*; q=0.01');//发送端愿意接收类型
		xmlhttp.setRequestHeader('X-Requested-With','XMLHttpRequest');
		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
				var responseBody;
				if(typeof xmlhttp.responseText=='string'){
					if(xmlhttp.responseText.startsWith('[')){
						responseBody = JSON.parse(xmlhttp.responseText)
					}else if(xmlhttp.responseText.startsWith('{')){
						responseBody = JSON.parse(xmlhttp.responseText)
					}else{
						responseBody = xmlhttp.responseText
					}
				}
				if(rest[0]){
					rest[0]()
				}
				success?success(responseBody,xmlhttp.status):'';
			}else if(xmlhttp.readyState == 4 && /(404|429)/.test(xmlhttp.status)){
				if(rest[0]){
					rest[0]()
				}
				error?error(xmlhttp.responseText,xmlhttp.status):'';
			}
		};
		if(rest[0]){
			rest[0]()
		}
		xmlhttp.send(null);//访问 请求参数
	}
}


function jquery(document){//初始化jquery
	this.document = document;
}
jquery.prototype = {//jquery方法拓展
	$:function(dom){
		jquery.prototype._this = this;
		jquery.prototype.events = dom;
		jquery.prototype.element = this.document.querySelector(dom);
		jquery.prototype.elements = this.document.querySelectorAll(dom);
		return jquery.prototype;
	},
	val:function(){//获取elementvalue属性或赋值
		if(arguments[0]){
			this.element.setAttribute('value',arguments[0]);
			return this.element.getAttribute('value');
		}else{
			return this.element.getAttribute('value');
		}
	},
	html:function(){//获取elementvalue属性或赋值
		if(arguments[0]){
			this.element.innerHTML==arguments[0]
			return this.element.innerHTML;
		}else{
			return this.element.innerHTML;
		}
	},
	css:function(type){
		if(this.element.style&&arguments[1]){
			this.element.style.setProperty(type,arguments[1]);
			return this.element;
		}else{
			if(this.element.style){
				this.element.style.getPropertyValue(type)
			}else{
				
			}
			return this.element;
		}
	},
	each:function(fn){//遍历多个元素
		if(this.elements){
			this.elements.forEach(fn)
		}
	},
	append:function(){//在相应位置添加一个element
		if(arguments[0]&&typeof arguments[0]=='string'){
			let div = this._this.document.createElement('div');
			div.innerHTML = arguments[0];
			this.element.appendChild(div.childNodes[0]);
			return div.childNodes;
		}else if(arguments[0]&&typeof arguments[0]=='object'&&arguments[0].nodeType){
			this.element.appendChild(arguments[0]);
			return arguments[0];
		}
	},
	rm:function(arr,value){
		arr.map(function(item,i){
			if(item==value){
				arr.splice(i,1)
			}
		})
	},
	record:(num) => {//数据量/每页记录条数
		var str = (num+"").split('.');
		if(str[1]){
			if(parseInt(str[1])>0){
				return parseInt(str[0])+1;
			}
		}else{
			return parseInt(str[0])
		}
	},
	get:function(url,success,error){
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET",decodeURI(url),true);//false代表同步  true代表异步
		xmlhttp.setRequestHeader('content-type','application/json;charset=utf-8');//发送端发送数据类型
		xmlhttp.setRequestHeader('Accept','application/json, text/javascript, */*; q=0.01');//发送端愿意接收类型
		xmlhttp.setRequestHeader('X-Requested-With','XMLHttpRequest');
		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
				var responseBody;
				if(typeof xmlhttp.responseText=='string'){
					if(xmlhttp.responseText.startsWith('[')){
						responseBody = JSON.parse(xmlhttp.responseText)
					}else if(xmlhttp.responseText.startsWith('{')){
						responseBody = JSON.parse(xmlhttp.responseText)
					}else{
						responseBody = xmlhttp.responseText
					}
				}
				success(responseBody,xmlhttp.status);
			}else if(xmlhttp.readyState == 4 && xmlhttp.status == 404){
				error(xmlhttp.responseText,xmlhttp.status)
			}
		};
		xmlhttp.send(null);//访问 请求参数
	},
	getPromise:(url) => {
		return new Promise((success,error) => {
			var xmlhttp = new XMLHttpRequest();
			xmlhttp.open("GET",decodeURI(url),true);//false代表同步  true代表异步
			xmlhttp.setRequestHeader('content-type','application/json;charset=utf-8');//发送端发送数据类型
			xmlhttp.setRequestHeader('Accept','application/json, text/javascript, */*; q=0.01');//发送端愿意接收类型
			xmlhttp.setRequestHeader('X-Requested-With','XMLHttpRequest');
			xmlhttp.onreadystatechange = function() {
				if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
					var responseBody;
					if(typeof xmlhttp.responseText=='string'){
						if(xmlhttp.responseText.startsWith('[')){
							responseBody = JSON.parse(xmlhttp.responseText)
						}else if(xmlhttp.responseText.startsWith('{')){
							responseBody = JSON.parse(xmlhttp.responseText)
						}else{
							responseBody = xmlhttp.responseText
						}
					}
					success(responseBody,xmlhttp.status);
				}else if(xmlhttp.readyState == 4 && xmlhttp.status == 404){
					error(xmlhttp.responseText,xmlhttp.status)
				}
			};
			xmlhttp.send(null);//访问 请求参数
		})
	},
	post:function(url,data,success,error){
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("POST",decodeURI(url),true);
		xmlhttp.setRequestHeader('content-type','application/json');
		xmlhttp.setRequestHeader('Accept','application/json, text/javascript, */*; q=0.01');//发送端愿意接收类型
		xmlhttp.setRequestHeader('X-Requested-With','XMLHttpRequest');
		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
				var responseBody;
				if(typeof xmlhttp.responseText=='string'){
					if(xmlhttp.responseText.startsWith('[')){
						responseBody = JSON.parse(xmlhttp.responseText)
					}else if(xmlhttp.responseText.startsWith('{')){
						responseBody = JSON.parse(xmlhttp.responseText)
					}else{
						responseBody = xmlhttp.responseText
					}
				}
				success(responseBody,xmlhttp.status);
			}else if(xmlhttp.readyState == 4 && xmlhttp.status == 404){
				error(xmlhttp.responseText,xmlhttp.status)
			}
		};
		xmlhttp.send(((typeof data=='object')?JSON.stringify(data):data));//访问
	},
	RexExps:(rex,str) => {
	   	var reArr = rex.exec(str);
	   	var result = [];
	    while(reArr&&reg(result)){
	    	result.push(reArr);
	        reArr = rex.exec(str);
	    }
	    function reg(arr){
	    	if(arr&&typeof arr == 'object'&&arr.length&&arr.length>=2){
	    		if(arr[arr.length-1]&&arr[arr.length-2]&&arr[arr.length-1][0]==arr[arr.length-2][0]&&arr[arr.length-1].index==arr[arr.length-2].index){
	    			arr.splice(arr.length-1,1)
		    		return false
		    	}else{
		    		return true
		    	}
	    	}else{
	    		return true
	    	}
	    }
	    return result;
	},
	groupHTML(dom,reg,data){
		for(let i = 0;i<dom.children.length;i++){
			this.groupHTML(dom.children[i],reg,data)
		}
		if(dom.children.length===0){
			let regData = this.RexExps(reg,dom.innerHTML);
			if(regData.length>0){
				dom.innerHTML = dom.innerHTML.replace(reg,e=>{
					let trueData = e.replace(/{/g,"").replace(/}/g,"");
					return data[trueData]?data[trueData]:''
				})
			}
		}
	},
	formatDate:(date,fmt) => {
		var dateFormat = {
			"y+":date.getFullYear(),
			"M+":date.getMonth()+1,
			"d+":date.getDate(),
			"H+":date.getHours(),
			"m+":date.getMinutes(),
			"s+":date.getSeconds(),
			"S+":date.getMilliseconds()
		}

		for(i in dateFormat){
			if(new RegExp(i).test(fmt)){
				fmt = fmt.replace(new RegExp(i),(a,b) => {
					let resultDate = "000000"+dateFormat[i];
					resultDate = resultDate.substr(resultDate.length-a.length,resultDate.length)
					return resultDate;
				})
			}
		}
		return fmt;
	},
	extend:(...obj) => {
		let result = obj[0];
		let isResult = true;
		if(obj.length===1){

		}else{
			obj.map((item,index) => {
				if(typeof item === 'object'&&!item.length){
					if(index>0){
						for(let i in item){
							result[i] = item[i]
						}
					}
				}else{
					isResult = false;
				}
			})
		}
		if(isResult){
			return result;
		}else{
			return {};
		}
	},
	promise:(fn) => {
		return new Promise((success,error) => {
			fn();
			success();
		})
	}
}

var $ = new jquery(document).$;//init