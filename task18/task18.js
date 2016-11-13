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
$ = function (el) { return document.querySelector(el); };

 //事件绑定函数，兼容浏览器差异
//  function addEvent(element, event, listener) {
//   if (element.addEventListener) {
//     element.addEventListener(event, listener, false);
// } else if (element.attachEvent) {
//     element.attachEvent("on" + event, listener);
// } else {
//     element["on" + event] = listener;
// }
// }
// window.onload=function () {
//   var container = document.getElementById("container");
//   var buttonList = document.getElementsByTagName("button");
//   var result = document.getElementById("result");
//   var queue = {
//     str: [],
//     leftPush:function (num) {
//         this.str.unshift(num);
//         this.paint();
//     },
//     rightPush:function (num) {
//         this.str.push(num);
//         this.paint();
//     },
//     leftPop:function () {
//         if(!this.isEmpty()){
//             this.str.shift();
//             this.paint();
//         }else{
//             alert("The queue is already empty!");
//         }
//     },
//     rightPop:function () {
//         if(!this.isEmpty()){
//             this.str.pop();
//             this.paint();
//         }else{
//             alert("The queue is already empty!");
//         }
//     },
//     isEmpty:function () {
//         return (this.str.length ===0);
//     },
//     paint:function () {
//         var str1 = "";
//         this.str.forEach(function(item,index,array){
//             str1 += ("<div>" + parseInt(item) +"</div>");
//             console.log(str1);
//         });
//         result.innerHTML = str1;
//         this.deleteItem();
//     },
//     validate:function (input) {
//         var r = /^-?\d+$/;
//         return r.test(input);
//     },
//     // deleteID: function(id) {
//     //   console.log(id);
//     //   this.str.splice(id, 1);
//     //   this.paint();
//     // },
//     // deleteItem:function () {
//     //     for(var i = 0; i < result.childNodes.length;i++){
//     //         addEvent(result.childNodes[i],"click",function(i){
//     //             return function(){
//     //                 return queue.deleteID(i);
//     //             };
//     //         }(i));
//     //     }
//     // }
//      deleteItem:function () {
//         for(var i = 0; i < result.childNodes.length;i++){
//             addEvent(result.childNodes[i],"click",function(i){
//                 return function(){
//                     queue.str.splice(i,1);
//                     queue.paint();
//                 };
//             }(i));
//         }
//     }
// };

// addEvent(buttonList[0],"click",function(){
//     var input = document.getElementById("input").value;
//     if(queue.validate(input)){
//         queue.leftPush(input);
//     }else{
//         alert("Please enter an interger!");
//     }

// });
// addEvent(buttonList[1],"click",function(){
//     var input = document.getElementById("input").value;
//     if(queue.validate(input)){
//         queue.rightPush(input);
//     }else{
//         alert("Please enter an interger!");
//     }
// });
// addEvent(buttonList[2],"click",function(){
//     queue.leftPop();
// });
// addEvent(buttonList[3],"click",function(){
//     queue.rightPop();
// });
// };
var arrayData = [];
$("#insert").onclick = function(){
    var str = $('#input').value.trim();
    var data =str.split(/[^0-9a-zA-Z\u4e00-\u9fa5]+/);
    if(data.length!==0){
        data.forEach(function(item, index, array){
            arrayData.push(item);
        });
    }else {
        alert("Please enter data");
    }
    render();
};
$("#search").onclick = function () {
    var str = $('#searchInput').value.trim();
    render(str);

};
function render(str) {
    $('#result').innerHTML = arrayData.map(function(item, index, array) {
        if(str != null){
            item = item.replace(new RegExp(str, "g"),"<span class='select'>" + str + "</span>");
        }
        return "<div>" + item +"</div>";
    }).join("");
}