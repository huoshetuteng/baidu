$ = function (el) { return document.querySelector(el); };

 // 事件绑定函数，兼容浏览器差异
function addEvent(element, event, listener) {
    if (element.addEventListener) {
        element.addEventListener(event, listener, false);
    } else if (element.attachEvent) {
        element.attachEvent("on" + event, listener);
    } else {
        element["on" + event] = listener;
    }
}
//构造函数
function Taglist(tagContent) {
    this.queue = [];
    this.render = function() {
        var str = "";
        this.queue.forEach(function (e) {
            str += ('<span>' + e + '</span>');
        });
        tagContent.innerHTML = str;
    };
}
//数组去重
Array.prototype.unique = function(){
   var res = [];
   var json = {};
   for(var i = 0; i < this.length; i++){
      if(!json[this[i]]){
         res.push(this[i]);
         json[this[i]] = 1;
     }
 }
 return res;
}

//添加事件函数
function addDeleteEvent(tagContainer){
        addEvent(tagContainer,"mouseover",function (e) {
           if(e.target&&e.target.nodeName.toUpperCase()=="SPAN"){/*判断目标事件是否为SPAN*/
                e.target.setAttribute("class","current");
                e.target.innerText = ("点击删除"+ e.target.innerText);
            }
        });
        addEvent(tagContainer,"mouseout",function (e) {
            if(e.target&&e.target.nodeName.toUpperCase()=="SPAN"){/*判断目标事件是否为SPAN*/
                e.target.removeAttribute("class");
                e.target.firstChild.deleteData(0,4);
            }
        });
        addEvent(tagContainer,"click",function (e) {
            if(e.target && e.target.nodeName.toUpperCase() == "SPAN"){
                tagContainer.removeChild(e.target);
            }
        });
}
function showTag(e){
    // var e=e||event;
　  var currKey=e.keyCode||e.which||e.charCode;
    if (currKey==13||currKey==32||currKey==188) {
        if(tagObj.queue.length>9){
            tagObj.queue.pop();
        }
        var str = inputTag.value.trim().replace(/,*，*/g,"");
        if(/^[A-Za-z0-9]+$/.test(str)){
            if(tagObj.queue.length>9){
                tagObj.queue.pop();
            }
            tagObj.queue.unshift(str);
        }
        tagObj.render();
        inputTag.value='';
    }
}
function showHobby(){
    var inputHobby = $("#inputHobby").value;
    // 字符串去空格，数组去重,开头结尾有大量空格时会有bug
    if (inputHobby.length == 0 || (/^\s+$/g).test(inputHobby) ){
        inputHobby='';
        console.log(inputHobby.length)
    }else{
        var content = spiltInput(trim(inputHobby)).unique();
        for (var i=0; i < content.length; i++) {
            hobbyObj.queue.unshift( content[i]);
        }
        if (hobbyObj.queue.length>10) {
            var j =hobbyObj.queue.length-10;
            hobbyObj.queue.splice(9,j);
        }
        hobbyObj.render();
        inputHobby='';
    }
}
function spiltInput(text) {
    var inputArray = [];
    inputArray = (text).split(/[,，;；、\s\n]+/);
    return inputArray;
}

//对textarea内的内容进行trim，否则当开头结尾有大量空格时会有bug
function trim(str) {
    var regex1 = /^\s*/;
    var regex2 = /\s*$/;
    return (str.replace(regex1, "")).replace(regex2, "");
}
var tagContent=$("#tagContent");
var hobbyContent=$("#hobbyContent");
var inputTag = $("#inputTag");
var btn_hobby = $("#btn_hobby");
//新建Taglist实例
var tagObj = new Taglist(tagContent),
    hobbyObj = new Taglist(hobbyContent);

addEvent(inputTag,"keyup",showTag);
addEvent(btn_hobby,"click",showHobby);
addDeleteEvent(tagContent);
addDeleteEvent(hobbyContent);
