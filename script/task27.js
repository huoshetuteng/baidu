$ = function(el) {
    return document.querySelector(el);
};
/**
 * 控制台输出
 * @param message 消息
 * @param colour 颜色
 */
var consoleText = $("#console-text");

function log(message, colour) {
    var date = new Date();
    var p = document.createElement("p");
    p.innerHTML = getTime() + " ";
    var span = document.createElement("span");
    span.innerHTML = message;
    span.style.color = colour;
    p.appendChild(span);
    consoleText.appendChild(p);
    console.log("%c" + message, "background-color:" + colour);
    consoleText.scrollTop = consoleText.scrollHeight;
}
/**
 * 常量：动能系统型号
 * @type {*[]}
 */
var driverModel = [
    {model: '前进号', speed: 3, consume: 5},
    {model: '奔腾号', speed: 5, consume: 7},
    {model: '超越号', speed: 8, consume: 9}
];
/**
 * 常量：能源系统型号
 * @type {*[]}
 */
var energyModel = [
    {model: '劲量型', rate: 2},
    {model: '光能型', rate: 3},
    {model: '永久型', rate: 4}
];
/**
 * 飞船类
 * @param {number} orbitId 所在轨道
 */
/**
 * 常量：停止状态
 * @type {number}
 */
var STOP = 0;
/**
 * 常量：飞行状态
 * @type {number}
 */
var START = 1;

function SpaceShip(orbitId,drive,rate) {
    var obj = {
        //所在轨道
        _orbit: orbitId,
        //当前状态
        _status: STOP,
        //当前能源
        _energy: 100,
        //能源是否充满
        _energyStatus: true,
        //速度
        _speed: driverModel[drive].speed,
        //能源消耗速度
        _consume: driverModel[drive].consume,
        //能源补充速度
        _rate: energyModel[rate].rate,
        //已经销毁
        _destroyed: false,
        //所在位置（旋转角度)
        _angle: 0,
        //动力系统
        drive: {
            //飞行
            start: function() {
                if (obj._energy > 0) {
                    obj._status = START;
                }
            },
            //停止飞行
            stop: function() {
                obj._status = STOP;
            },
            //由宇宙管理员操作的飞行功能
            fly: function() {
                if (obj._status == START) {
                    obj._angle += obj._speed;
                }
                obj._angle = obj._angle % 360;
            }
        },
        //能源系统
        energy: {
            add: function() {
                obj._energy += obj._rate;
                console.log(obj._rate)
                console.log(obj._energy)
                if (obj._energy >= 100) {
                    obj._energy = 100;
                    obj._energyStatus = true;
                }
            },
            consume: function() {
                if (obj._status == START) {
                    obj._energy -= obj._consume;
                }
                if (obj._energy <= 0) {
                    obj._status = STOP;
                    obj._energy = 0;
                    obj._energyStatus = false;
                }
                
            },
            //获取当前能源值
            get: function() {
                return obj._energy;
            }
        },
        //立即销毁自身
        destroy: function() {
            this._destroyed = true;
        }
    };
    return obj;
}
/**
 * 宇宙管理员
 */
var spaceManager = {

    //飞船列表
    spaceShipList: [],
    //飞船飞行管理ID
    spaceShipFlyManager: 0,
    /**
     * 创建宇宙飞船
     * @param orbitId 轨道ID
     */
    createSpaceShip: function(orbitId,drive,rate) {
        //创建飞船对象并保存到数组
        var obj = new SpaceShip(orbitId,drive,rate);
        spaceManager.spaceShipList.push(obj);
        // var shipId = spaceManager.spaceShipList.length-1;
        //创建飞船主体div
        var spaceshipDiv = document.createElement("div");
        spaceshipDiv.id = "spaceship" + orbitId;
        spaceshipDiv.className = "space-ship orbit-ship" + orbitId;
        //创建能量条div
        var energyDiv = document.createElement("div");
        energyDiv.className = "energy";
        spaceshipDiv.appendChild(energyDiv);
        //创建能量文本div
        var textDiv = document.createElement("div");
        textDiv.className = "text";
        textDiv.innerHTML = "100%";
        spaceshipDiv.appendChild(textDiv);
        //将飞船显示到页面上
        document.body.appendChild(spaceshipDiv);

        //创建飞船操作按钮
        var controlDiv = document.createElement("div");
        var shipControl = $("#shipControl");
        controlDiv.id = "control" + orbitId;
        controlDiv.innerHTML = "<span>spaceship No." + (orbitId + 1) + "</span>" +
            '<button type="button" data-type="start">start</button>' +
            '<button type="button" data-type="stop">stop</button>' +
            '<button type="button" data-type="destroy">destroy</button>';
        shipControl.appendChild(controlDiv);

    },
    destroy: function(orbit) {
        for (var i = 0; i < spaceManager.spaceShipList.length; i++) {
            if (spaceManager.spaceShipList[i]._orbit == orbit) {
                spaceManager.spaceShipList[i].destroy();
            }
        }
    },
    start: function(orbit) {
        for (var i = 0; i < spaceManager.spaceShipList.length; i++) {
            if (spaceManager.spaceShipList[i]._orbit == orbit) {
                spaceManager.spaceShipList[i].drive.start();
            }
        }
    },
    stop: function(orbit) {
        for (var i = 0; i < spaceManager.spaceShipList.length; i++) {
            if (spaceManager.spaceShipList[i]._orbit == orbit) {
                spaceManager.spaceShipList[i].drive.stop();
            }
        }
    }
};

/**
 * 飞船飞行及显示管理
 */
(function() {
    spaceManager.spaceShipFlyManager = setInterval(function() {
        for (var i = 0; i < spaceManager.spaceShipList.length; i++) {
            //已销毁的飞船不处理
            if (spaceManager.spaceShipList[i]._destroyed) {
                //在界面显示中删除飞船
                //获取飞船Div;
                var spaceShipDiv = $("#spaceship" + spaceManager.spaceShipList[i]._orbit);
                if ($("#spaceship" + spaceManager.spaceShipList[i]._orbit) !== null) {
                    document.body.removeChild($("#spaceship" + spaceManager.spaceShipList[i]._orbit));
                    spaceManager.spaceShipList.splice(i,1);
                }
                continue;
            }
            spaceManager.spaceShipList[i].drive.fly();
            //获取飞船Div
            var orbit = spaceManager.spaceShipList[i]._orbit;
            var ship = $("#spaceship" + orbit);
            //能源补充完毕则继续飞行，否则补充能源
            if (spaceManager.spaceShipList[i]._energyStatus === true) {
                //修改飞船位置
                ship.style.webkitTransform = "rotate(" + spaceManager.spaceShipList[i]._angle + "deg)";
                ship.style.mozTransform = "rotate(" + spaceManager.spaceShipList[i]._angle + "deg)";
                ship.style.msTransform = "rotate(" + spaceManager.spaceShipList[i]._angle + "deg)";
                ship.style.oTransform = "rotate(" + spaceManager.spaceShipList[i]._angle + "deg)";
                ship.style.transform = "rotate(" + spaceManager.spaceShipList[i]._angle + "deg)";
                //能源消耗显示
                spaceManager.spaceShipList[i].energy.consume();
                ship.firstElementChild.style.width = spaceManager.spaceShipList[i].energy.get() + "%";
                ship.lastElementChild.innerHTML = spaceManager.spaceShipList[i].energy.get() + "%";
            } else {
                //能源补充显示
                spaceManager.spaceShipList[i].energy.add();
                ship.firstElementChild.style.width = spaceManager.spaceShipList[i].energy.get() + "%";
                ship.lastElementChild.innerHTML = spaceManager.spaceShipList[i].energy.get() + "%";
            }
        }
    }, 100);
})();


//添加点击事件冒泡
var shipControl = $("#shipControl");
var buttonClick = function(e) {
    if (e.target && e.target.nodeName.toUpperCase() == "BUTTON") {
        var orbit = e.target.parentNode.id.slice(7) - 0;
        var message = e.target.dataset.type;
        switch (message) {
            case 'start':
                spaceManager.start(orbit);
                break;
            case 'stop':
                spaceManager.stop(orbit);
                break;
            case 'destroy':
                spaceManager.destroy(orbit);
                //删除飞船操作按钮
                $("#shipControl").removeChild(e.target.parentNode);
        }
    }
};
shipControl.addEventListener("click", buttonClick);

//获取选定的飞船型号
function getRadioValue(radionObj) {
    var str = [];
    for (var i = 0; i < radionObj.length; i++) {
        if (radionObj[i].checked) {
            str.push(parseInt(radionObj[i].value));
        }
    }
    return str;
}
//添加点击事件
var create = $("#create");
create.addEventListener("click", function() {
    var input = document.getElementsByTagName("input");
    //选中的飞船参数的值
    var val = getRadioValue(input);
    var orbit;
    if (!$("#control0")) {
        orbit = 0;
    } else if (!$("#control1")) {
        orbit = 1;
    } else if (!$("#control2")) {
        orbit = 2;
    } else if (!$("#control3")) {
        orbit = 3;
    } else {
        return;
    }
    spaceManager.createSpaceShip(orbit, val[0],val[1]);
}, false);

/**
 * 操作面板拖动
 */
(function() {
    //获取对象元素
    var control = document.getElementById("control");
    var title = document.getElementById("control-title");
    //初始位置
    control.style.left = 0;
    control.style.top = 0;
    var draggingControl = false;
    var start = [0, 0];
    var position = [
        control.style.left.substr(0, control.style.left.length - 2) - 0,
        control.style.top.substr(0, control.style.top.length - 2) - 0
    ];
    //绑定事件
    title.addEventListener("mousedown", function(e) { //鼠标按下事件
        start[0] = e.clientX - position[0];
        start[1] = e.clientY - position[1];
        draggingControl = true;
        // console.log(e.clientX,e.clientY)
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
})();