$ = function(el) {
    return document.querySelector(el);
};
/**
 * 控制台输出
 * @param message 消息
 * @param colour 颜色
 */
var consoleText = $("#console-text");
//获取当前的日期时间 格式“yyyy-MM-dd HH:MM:SS”
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var seconds = date.getSeconds();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    if (seconds >= 0 && seconds <= 9) {
        seconds = "0" + seconds;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + " " + date.getHours() + seperator2 + date.getMinutes() + seperator2 + seconds;
    return currentdate;
}
//打印信息
function log(message, colour) {
    var date = new Date();
    var p = document.createElement("p");
    p.innerHTML = getNowFormatDate() + " ";
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
var driverModel = [{
    model: '前进号',
    speed: 3,
    consume: 5
}, {
    model: '奔腾号',
    speed: 5,
    consume: 7
}, {
    model: '超越号',
    speed: 8,
    consume: 9
}];
/**
 * 常量：能源系统型号
 * @type {*[]}
 */
var energyModel = [{
    model: '劲量型',
    rate: 2
}, {
    model: '光能型',
    rate: 3
}, {
    model: '永久型',
    rate: 4
}];
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

function SpaceShip(orbitId, drive, rate) {
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
                if (obj._energy >= 100) {
                    obj._energy = 100;
                    obj._energyStatus = true;
                }
            },
            consume: function() {
                if (obj._status == START) {
                    obj._energy -= (Math.floor(obj._consume / 4));
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
    createSpaceShip: function(orbitId, drive, rate) {
        //创建飞船对象并保存到数组
        var obj = new SpaceShip(orbitId, drive, rate);
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
    action: function(orbit, message) {
        var random = Math.random();
        setTimeout(function() {
            if (random >= 0.1) { //信号发射成功率为90%
                for (var i = 0; i < spaceManager.spaceShipList.length; i++) {
                    if (spaceManager.spaceShipList[i]._orbit == orbit) {
                        switch (message) {
                            case 'start':
                                spaceManager.spaceShipList[i].drive.start();
                                log(spaceManager.spaceShipList[i]._orbit+1+"号飞船开始飞行", "#0FF7D4");
                                break;
                            case 'stop':
                                spaceManager.spaceShipList[i].drive.stop();
                                log(spaceManager.spaceShipList[i]._orbit+1+"号飞船停止飞行", "#07F007");
                                break;
                            case 'destroy':
                                spaceManager.spaceShipList[i].destroy();
                                log(spaceManager.spaceShipList[i]._orbit+1+"号飞船成功销毁", "#F9D50A");
                                //删除飞船操作按钮
                                $("#shipControl").removeChild(e.target.parentNode);
                                break;
                        }
                    }
                }
            } else {
                switch (message) {
                    case 'start':
                        log("起飞指令发送失败,正在重新发送", "#FB2222");
                        spaceManager.action(orbit, message);
                        break;
                    case 'stop':
                        log("停止指令发送失败,正在重新发送", "#FB2222");
                        spaceManager.action(orbit, message);
                        break;
                    case 'destroy':
                        log("摧毁指令发送失败,正在重新发送", "#FB2222");
                        spaceManager.action(orbit, message);
                        break;
                }
            }
        }, 300);

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
                    spaceManager.spaceShipList.splice(i, 1);
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


//添加操作飞船点击事件冒泡
var shipControl = $("#shipControl");
var buttonClick = function(e) {
    if (e.target && e.target.nodeName.toUpperCase() == "BUTTON") {
        //获取飞船轨道号
        var orbit = e.target.parentNode.id.slice(7) - 0;
        //获取指令类型（start，stop，destroy）
        var message = e.target.dataset.type;
        //按钮禁用
        //start
        if(message=="start"){
            e.target.nextSibling.disabled=false;
        }
        //stop
        if(message=="stop"){
            e.target.previousSibling.disabled=false;
        }
        //destroy
        if(message=="destroy"){
            e.target.previousSibling.disabled=true;
            e.target.previousSibling.previousSibling.disabled=true;
        }
        e.target.disabled=true;
        spaceManager.action(orbit, message);
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
//添加创建飞船的点击事件
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
    spaceManager.createSpaceShip(orbit, val[0], val[1]);
}, false);

/**
 * 操作面板拖动
 */
window.onload=function(){
    var control = document.getElementById("control");
    var controlTitle = document.getElementById("control-title");
    drag(control,controlTitle);
    var console = document.getElementById("console");
    var consoleTitle = document.getElementById("console-title");
    drag(console,consoleTitle);
    var screen = document.getElementById("screen");
    var screenTitle = document.getElementById("screen-title");
    drag(screen,screenTitle);
};