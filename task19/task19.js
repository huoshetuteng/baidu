// $ = function (el) { return document.querySelector(el); };
// var data = [];

// function render(){
// 	$('.text-area').innrtHTML = data.map(function(d) { return "<div>" + d + "</div>"; })
// 	.join('');
// }
// function deal(func, succ) {
// 	var args = [].slice.call(arguments, 2);
// 	return function(e) {
// 		try {
// 			var arg = args.map(function(item) {
// 				return typeof item === "function" ? item(e) : item;
// 			});
// 			var result = func.apply(data, arg);
// 			if (succ!= null){
// 				succ(result);
// 			}
// 		} catch (ex) {
// 			alert(ex.message);
// 		}
// 		render();
// 	};
// }
// function getInputValue(){
// 	var numStr = $('input').value.trim();
// 	if(!validate(numStr))  throw new Error('input error');

// }

// function getClickIndex(e) {
// 	var node = e.target;
// 	return [].indexOf.call(node.parentNode.children, node);
// }

// function validate(str){
// 	return /^\d+$/.test(str);
// }
// $('#left-in').onclick = deal([].unshift, null, getInputValue);
// $('#right-in').onclick = deal([].push, null, getInputValue);
// $('#left-out').onclick = deal([].shift, window.alert);
// $('#right-out').onclick = deal([].pop, window.alert);
// $('.text-area').onclick = deal([].splice, null, getClickIndex,1);

 //事件绑定函数，兼容浏览器差异
 function addEvent(element, event, listener) {
  if (element.addEventListener) {
    element.addEventListener(event, listener, false);
} else if (element.attachEvent) {
    element.attachEvent("on" + event, listener);
} else {
    element["on" + event] = listener;
}
}
window.onload=function () {
  var buttonList = document.getElementsByTagName("button");
  var result = document.getElementById("result");
  var queue = {
    str: [],
    leftPush:function (num) {
        this.str.unshift(num);
        this.paint();
    },
    rightPush:function (num) {
        this.str.push(num);
        this.paint();
    },
    leftPop:function () {
        if(!this.isEmpty()){
            this.str.shift();
            this.paint();
        }else{
            alert("The queue is already empty!");
        }
    },
    rightPop:function () {
        if(!this.isEmpty()){
            this.str.pop();
            this.paint();
        }else{
            alert("The queue is already empty!");
        }
    },
    isEmpty:function () {
        return (this.str.length ===0);
    },
    paint:function () {
        var str1 = "";
        this.str.forEach(function(item,index,array){
            str1 += ('<div style="height:' + parseInt(item)+'px" ></div>');
            console.log(str1);
        });
        result.innerHTML = str1;
        this.deleteItem();
    },
    validate:function (input) {
        var r = /^-?\d+$/;
        return r.test(input);
    }
};

addEvent(buttonList[0],"click",function(){
    var input = document.getElementById("input").value;
    if(queue.validate(input)){
        queue.leftPush(input);
    }else{
        alert("Please enter an interger!");
    }

});
addEvent(buttonList[1],"click",function(){
    var input = document.getElementById("input").value;
    if(queue.validate(input)){
        queue.rightPush(input);
    }else{
        alert("Please enter an interger!");
    }
});
addEvent(buttonList[2],"click",function(){
    queue.leftPop();
});
addEvent(buttonList[3],"click",function(){
    queue.rightPop();
});
};
//考虑到下一个任务有排序,则使用数组存放数据,使用字符串刷新的方式更新数据
    var data=[];//定义存放数据的数组
    // var str="";//定义更新UL的字符串
    var container=document.getElementById("list");
    //随机颜色
    function rancolor(){
        var colorstr=["#FF4D00","#FFBF00","#00FFFF","#66FF00","#6495ED","#DA70D6","#C0C0C0","#8CE600","#FF8C69","#00FA9A"];
        var i=Math.floor(Math.random()*10);
        return colorstr[i];}
    //随机生成数据
    document.getElementById("random").onclick=function(){
        for(i=0;i<=50;i++){
            data[i]=Math.floor(Math.random()*100);
        }
        updata();
    };
    function updata() {
        container.innerHTML="";
        for(var i = 0; i < data.length;i++){
            var li = document.createElement("li");
            li.innerText = data[i];
            li.style.height = data[i]+"px";
            li.style.backgroundColor=rancolor();
            li.setAttribute("id","li-"+i);
            container.appendChild(li);
        }
    }
    //排序算法
    document.getElementById("sortdata").onclick=function(){
        var i = 0,j = 1,temp;
                len = data.length;
                timer = null;
        timer = setInterval(run,25);
        function run() {
            if (i < len) {
                if (j < len) {
                    if (data[i] > data[j]) {
                        temp = data[i];
                        data[i] = data[j];
                        data[j] = temp;
                        updata();
                    }
                    j++;
                } else {
                    i++;
                    j = i + 1;
                }
            } else {
                clearInterval(timer);
                return;
            }
        }
    };