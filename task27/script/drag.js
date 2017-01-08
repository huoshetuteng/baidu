/**
 * 面板拖动操作
 * @param {dom对象} control 拖拽的面板
 * @param {dom对象} title 可拖拽的范围
 */
function drag(control,title) {
    var draggingControl = false;
    var start = [0, 0];
    var position = [
        control.offsetLeft,
        control.offsetTop
    ];
    //绑定事件
    title.addEventListener("mousedown", function(e) { //鼠标按下事件
        start[0] = e.clientX - position[0];
        start[1] = e.clientY - position[1];
        draggingControl = true;
    });
    addEventListener("mouseup", function() { //鼠标抬起事件
        draggingControl = false;
    });
    addEventListener("mousemove", function(e) { //鼠标移动事件
        if (draggingControl) {
            position[0] = e.clientX - start[0];
            position[1] = e.clientY - start[1];
            if (position[0] > window.innerWidth - control.offsetWidth) {
                position[0] = window.innerWidth - control.offsetWidth;
            }
            if (position[0] < 0) {
                position[0] = 0;
            }
            if (position[1] > window.innerHeight - control.offsetHeight) {
                position[1] = window.innerHeight - control.offsetHeight;
            }
            if (position[1] < 0) {
                position[1] = 0;
            }
            control.style.left = position[0] + "px";
            control.style.top = position[1] + "px";
        }
    });
};