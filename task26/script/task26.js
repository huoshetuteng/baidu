/**
 * 控制台输出
 * @param message 消息
 * @param colour 颜色
 */
var consoleText = document.getElementById("console-text");

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

function SpaceShip(orbitId) {
    var obj = {
        //所在轨道
        _orbit: orbitId,
        //当前状态
        _status: STOP,
        //当前能源
        _energy: 100,
        //能源补充是否完
        _energy_status: true,
        //已经销毁
        _destroyed: false,
        //速度
        _rate: 1,
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
            _fly: function() {
                if (obj._status == START) {
                    obj._angle += obj._rate;
                }
                obj._angle = obj._angle % 360;
            }
        },
        //设置速度
        /**
         * @param rate 速率
         */
        setRate: function(rate) {
            this._rate = rate;
        },
        //能源系统
        energy: {
            /**
             * 添加能源
             * @param num 添加量
             */
            add: function(num) {
                obj._energy += num;
                if (obj._energy > 100) {
                    obj._energy = 100;
                    obj._energy_status = true;
                }
            },
            consume: function(num) {
                if (obj._status == START) {
                    obj._energy -= num;
                }
                if (obj._energy <= 0) {
                    obj._status = STOP;
                    obj._energy = 0;
                    obj._energy_status = false;
                }
            },
            //取当前能源值
            get: function() {
                return obj._energy;
            }
        },
        //信号系统
        telegraph: {
            /**
             * 向飞船发送信号
             * @param message 信号内容
             */
            sendMessage: function(message) {
                //检查消息是否是发给自己的
                if (message.id != obj._orbit) {
                    return;
                }
                //执行命令
                switch (message.command) {
                    //开始飞行
                    case 'start':
                        obj.drive.start();
                        break;
                        //停止飞行
                    case 'stop':
                        obj.drive.stop();
                        break;
                        //自爆
                    case 'destroy':
                        obj.destroy.destroy();
                        break;
                    case 'rate':
                        obj._rate = message.value;
                        break;
                }
            }
        },
        //自爆系统
        //立即销毁自身
        destroy: function() {
            obj._destroyed = true;
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
    //太阳能管理ID
    solarManager: 0,
    /**
     * 创建宇宙飞船
     * @param orbitId 轨道ID
     */
    createSpaceShip: function(orbitId) {
        //创建飞船对象并保存到数组
        var obj = new SpaceShip(orbitId);
        var shipId = this.spaceShipList.push(obj);
        //创建飞船主体div
        var spaceshipDiv = document.createElement("div");
        spaceshipDiv.id = "spaceship" + shipId;
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
    },
    //无线电，向宇宙中的飞船广播消息
    Mediator: {
        /**
         * 发送消息
         * @param message 消息
         */
        sendMessage: function(message) {
            //1秒后发送消息
            setTimeout(function() {
                //一定概率（30%）丢包
                if (Math.random() <= 0.3) {
                    log("向轨道" + (message.id + 1) + "发送的 " + message.command + " 指令丢包了！", "red");
                    return;
                }
                log("向轨道" + (message.id + 1) + "发送 " + message.command + " 指令成功！", "green");
                for (var i = 0; i < spaceManager.spaceShipList.length; i++) {
                    //已销毁的飞船不处理
                    if (spaceManager.spaceShipList[i]._destroyed) {
                        continue;
                    }
                    //向飞船发送消息
                    spaceManager.spaceShipList[i].telegraph.sendMessage(message);
                }
            }, 1000);
        },
        /**
         * 创建宇宙飞船
         * @param orbitId 轨道ID
         */
        createSpaceShip: function(orbitId) {
            //1秒后发送创建飞船消息
            setTimeout(function() {
                //一定概率（30%）丢包
                if (Math.random() <= 0.3) {
                    log("向轨道" + (orbitId + 1) + "发送的 create 指令丢包了！", "red");
                    return;
                }
                log("向轨道" + (orbitId + 1) + "发送 create 指令成功！", "green");
                spaceManager.createSpaceShip(orbitId);
            }, 1000);
        }
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
    },
    setRate: function(orbit, value) {
        for (var i = 0; i < spaceManager.spaceShipList.length; i++) {
            if (spaceManager.spaceShipList[i]._orbit == orbit) {
                spaceManager.spaceShipList[i].setRate(value);
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
                var spaceShipDiv = document.getElementById("spaceship" + (i + 1))
                if (document.getElementById("spaceship" + (i + 1)) !== null) {
                    document.body.removeChild(document.getElementById("spaceship" + (i + 1)));
                }
                continue;
            }
            // if(spaceManager.spaceShipList[i]._status==START){
            //飞船飞行控制
            spaceManager.spaceShipList[i].drive._fly();
            //飞船Div
            var ship = document.getElementById("spaceship" + (i + 1));
             console.log(spaceManager.spaceShipList[i]._angle)
                console.log(ship)
            if (spaceManager.spaceShipList[i]._energy_status == true) {
                //修改飞船位置
                ship.style.webkitTransform = "rotate(" + spaceManager.spaceShipList[i]._angle + "deg)";
                ship.style.mozTransform = "rotate(" + spaceManager.spaceShipList[i]._angle + "deg)";
                ship.style.msTransform = "rotate(" + spaceManager.spaceShipList[i]._angle + "deg)";
                ship.style.oTransform = "rotate(" + spaceManager.spaceShipList[i]._angle + "deg)";
                ship.style.transform = "rotate(" + spaceManager.spaceShipList[i]._angle + "deg)";
                //能源显示
                spaceManager.spaceShipList[i].energy.consume(1);
                ship.firstElementChild.style.width = spaceManager.spaceShipList[i].energy.get() + "%";
                ship.lastElementChild.innerHTML = spaceManager.spaceShipList[i].energy.get() + "%";
            } else {
                //能源显示
                spaceManager.spaceShipList[i].energy.add(1);
                ship.firstElementChild.style.width = spaceManager.spaceShipList[i].energy.get() + "%";
                ship.lastElementChild.innerHTML = spaceManager.spaceShipList[i].energy.get() + "%";
            }
            // }
        }
    }, 100);
})();


//添加点击事件冒泡
var controlMain = document.getElementById("control-main");
var buttonClick = function(e) {
    if (e.target && e.target.nodeName.toUpperCase() == "BUTTON") {
        var orbit = e.target.parentNode.dataset.id - 0;
        var message = e.target.dataset.type;
        switch (message) {
            case 'create':
                if (e.target.dataset.status == 'uncreated') {
                    spaceManager.createSpaceShip(orbit);
                    e.target.dataset.status = 'hasCreated';
                    e.target.innerHTML = '自爆销毁';
                    e.target.nextElementSibling.disabled = false;
                    e.target.nextElementSibling.nextElementSibling.disabled = false;
                    e.target.nextElementSibling.nextElementSibling.nextElementSibling.disabled = false;
                } else {
                    spaceManager.destroy(orbit);
                    e.target.dataset.status = 'uncreated';
                    e.target.innerHTML = '创建飞船';
                    e.target.nextElementSibling.disabled = true;
                    e.target.nextElementSibling.dataset.status = 'start';
                    e.target.nextElementSibling.innerHTML = '飞行';
                    e.target.nextElementSibling.nextElementSibling.disabled = true;
                    e.target.nextElementSibling.nextElementSibling.value = 1;
                    e.target.nextElementSibling.nextElementSibling.nextElementSibling.disabled = true;
                }
                break;
            case 'drive':
                if (e.target.dataset.status == 'start') {
                    spaceManager.start(orbit);
                    e.target.dataset.status = 'stop';
                    e.target.innerHTML = '停止';

                } else {
                    spaceManager.stop(orbit);
                    e.target.dataset.status = 'start';
                    e.target.innerHTML = '飞行';
                }
                break;
            case 'rate':
                var value = e.target.previousElementSibling.value - 0;
                spaceManager.setRate(orbit, value);
                break;
        }
    }
};
controlMain.addEventListener("click", buttonClick);