
function _MBEH(option = {}){
    this.el = this.$(option.el||'body');
    this._reg = /(?={).+?(?<=})/g;
    this._$$ = (str) => new RegExp('(?=<'+str+').+?(?<=\/'+str+'>)','g');
    this.allPath = this.extend({contentParams:this},option.allPath);
    this.__$ = [];
    //this.init(this); //已废弃
    this.allPath = this.initAllData(this.allPath)
    this.sortHTML(this.el,this._reg);
    return this.allPath;
}
_MBEH.prototype = {
    dateFormat:(date,fmt) => { //author: meizz
        var o = {
          "M+" : date.getMonth()+1,                 //月份
          "d+" : date.getDate(),                    //日
          "h+" : date.getHours(),                   //小时
          "m+" : date.getMinutes(),                 //分
          "s+" : date.getSeconds(),                 //秒
          "q+" : Math.floor((date.getMonth()+3)/3), //季度
          "S"  : date.getMilliseconds()             //毫秒
        };
        if(/(y+)/.test(fmt))
          fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));   
        for(var k in o)
          if(new RegExp("("+ k +")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length===1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        return fmt;
    },
    /**
        扩展函数
    */
    extend:function(...obj){
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
    /**
        正则匹配
    */
    RexExps:function(rex,str){
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
    /**
        格式化替换
    */
    sortHTML:function(dom,reg){
        let dataForm = this.allPath;
        for(let i = 0;i<dom.children.length;i++){
            this.sortHTML(dom.children[i],reg,dataForm)
            let finds = dom.children[i].getAttributeNames().filter(item => {return item.indexOf('b-')>-1})
            if(finds.length>0){
                this.forEachAll(dom.children[i],finds,'attr')
            }
        }
        if(dom.children.length===0){
            let finds = dom.getAttributeNames().filter(item => {return (item.indexOf('b-')>-1)})
            if(finds.length>0){
                this.forEachAll(dom,finds,'attr')
            }
            let regData = this.RexExps(reg,dom.innerHTML);
            if(regData.length>0){
                dom.innerHTML = this.changeHTML(dom,reg,dataForm);
            }
        }
    },
    changeHTML:function(dom,reg,dataForm){
        return dom.innerHTML.replace(reg,e => {
            let trueData = e.replace(/{/g,"").replace(/}/g,"");
            this.forEachAll(dom,[trueData],'inner');
            return dataForm[trueData]?dataForm[trueData]:''
        })
    },
    $:function(dom){
        if(document.querySelector){
            if(document.querySelectorAll(dom).length>1){
                return document.querySelectorAll(dom)
            }else{
                return document.querySelector(dom)
            }
        }else{
            if(dom.indexOf('#')==0){
                return document.getElementById(dom.replace('#',''))
            }else if(dom.indexOf('.')==0){
                return document.getElementsByClassName(dom.replace('.',''))
            }else{
                return document.getElementsByTagName(dom)
            }
        }
    },
    forEachAll:function(Docu,Attri,tag){
        for(let i in Attri){
            let thisAttriDom = Docu.getAttribute(Attri[i]);
            if(tag==='inner'){//替换内容区
                this.__$.push({data:Docu,el:Attri[i],inner:Docu.innerHTML})
            }else if(tag==='attr'){//绑定内容区
                if(Attri[i]==='b-model'){
                    let attVal = Docu.getAttribute('b-model');
                    Docu.removeAttribute('b-model')
                    this.__$.push({data:Docu,el:attVal,inner:''})
                    Docu.value = this.allPath[attVal];
                    Docu.addEventListener('input',(key) => {
                        this.data_change(attVal,Docu.value?Docu.value:'')
                    })
                }else if(Attri[i]==='b-click'){
                    let attVal = Docu.getAttribute('b-click');
                    Docu.removeAttribute('b-click')
                    Docu.addEventListener('click',e => {
                        this.allPath[attVal]?this.allPath[attVal](e):''
                    })
                }
            }
        }
    },
    data_change:function(datatype,data){
        var _this = this;
        this.allPath[datatype] = data;
        for(let i in this.__$){
            if(this.__$[i].inner!==''){
                if(this.__$[i].el == datatype){
                    this.__$[i].data.innerHTML = data;
                }
                if(this.__$[i].el.indexOf(datatype)>-1){
                    this.__$[i].data.innerHTML = this.__$[i].inner.replace(_this._reg,(con,type)=>{
                        let trueData = con.replace(/{/g,"").replace(/}/g,"");
                        return _this.allPath[trueData]?_this.allPath[trueData]:""
                    })
                }
            }
        }
    },
    value_change:function(datatype,data){
        var _this = this;
        this.allPath[datatype] = data;
        for(let i in this.__$){
            if(this.__$[i].inner === ''){
                if(datatype===this.__$[i].el){
                    this.__$[i].data.value = data;
                 }
            }
        }
    }
}
_MBEH.prototype.initAllData = function(obj){
    return new Proxy(obj, {
        get: function (obj, prop, value) {
            return obj[prop];
        },
        set: (obj, prop, value) => {
            if (obj[prop] != value) {
                obj[prop] = value;
                this.value_change(prop,value)
                this.data_change(prop,value);
            }
            return true;
        }
    });
}

/*_MBEH.prototype.init = function(obj){//初始化模板对象    已废弃
    Object.keys(obj.allPath).forEach(key=>{
        let value = obj.allPath[key];
        Object.defineProperty(obj.allPath,key,{ //要在其上定义属性的对象  //要定义或修改的属性的名称
            configurable:true,//定义可删除对象
            enumerable:true,//定义可遍历
            get(){//重写get方法 即获取值
                return value;
            },
            set(newVal){//修改值的时候
                if(value !== newVal){
                    value = newVal;
                    obj.value_change(key,newVal)
                    obj.data_change(key,newVal);
                }
            }
        })
    });
}*/