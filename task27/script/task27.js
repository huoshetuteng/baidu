$ = function(el) {
    return document.querySelector(el);
};
/**
 * ����̨���
 * @param message ��Ϣ
 * @param colour ��ɫ
 */
var consoleText = $("#console-text");
//��ȡ��ǰ������ʱ�� ��ʽ��yyyy-MM-dd HH:MM:SS��
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
//��ӡ��Ϣ
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
 * ����������ϵͳ�ͺ�
 * @type {*[]}
 */
var driverModel = [{
    model: 'ǰ����',
    speed: 3,
    consume: 5
}, {
    model: '���ں�',
    speed: 5,
    consume: 7
}, {
    model: '��Խ��',
    speed: 8,
    consume: 9
}];
/**
 * ��������Դϵͳ�ͺ�
 * @type {*[]}
 */
var energyModel = [{
    model: '������',
    rate: 2
}, {
    model: '������',
    rate: 3
}, {
    model: '������',
    rate: 4
}];
/**
 * �ɴ���
 * @param {number} orbitId ���ڹ��
 */
/**
 * ������ֹͣ״̬
 * @type {number}
 */
var STOP = 0;
/**
 * ����������״̬
 * @type {number}
 */
var START = 1;

function SpaceShip(orbitId, drive, rate) {
    var obj = {
        //���ڹ��
        _orbit: orbitId,
        //��ǰ״̬
        _status: STOP,
        //��ǰ��Դ
        _energy: 100,
        //��Դ�Ƿ����
        _energyStatus: true,
        //�ٶ�
        _speed: driverModel[drive].speed,
        //��Դ�����ٶ�
        _consume: driverModel[drive].consume,
        //��Դ�����ٶ�
        _rate: energyModel[rate].rate,
        //�Ѿ�����
        _destroyed: false,
        //����λ�ã���ת�Ƕ�)
        _angle: 0,
        //����ϵͳ
        drive: {
            //����
            start: function() {
                if (obj._energy > 0) {
                    obj._status = START;
                }
            },
            //ֹͣ����
            stop: function() {
                obj._status = STOP;
            },
            //���������Ա�����ķ��й���
            fly: function() {
                if (obj._status == START) {
                    obj._angle += obj._speed;
                }
                obj._angle = obj._angle % 360;
            }
        },
        //��Դϵͳ
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
            //��ȡ��ǰ��Դֵ
            get: function() {
                return obj._energy;
            }
        },
        //������������
        destroy: function() {
            this._destroyed = true;
        }
    };
    return obj;
}
/**
 * �������Ա
 */
var spaceManager = {

    //�ɴ��б�
    spaceShipList: [],
    //�ɴ����й���ID
    spaceShipFlyManager: 0,
    /**
     * ��������ɴ�
     * @param orbitId ���ID
     */
    createSpaceShip: function(orbitId, drive, rate) {
        //�����ɴ����󲢱��浽����
        var obj = new SpaceShip(orbitId, drive, rate);
        spaceManager.spaceShipList.push(obj);
        // var shipId = spaceManager.spaceShipList.length-1;
        //�����ɴ�����div
        var spaceshipDiv = document.createElement("div");
        spaceshipDiv.id = "spaceship" + orbitId;
        spaceshipDiv.className = "space-ship orbit-ship" + orbitId;
        //����������div
        var energyDiv = document.createElement("div");
        energyDiv.className = "energy";
        spaceshipDiv.appendChild(energyDiv);
        //���������ı�div
        var textDiv = document.createElement("div");
        textDiv.className = "text";
        textDiv.innerHTML = "100%";
        spaceshipDiv.appendChild(textDiv);
        //���ɴ���ʾ��ҳ����
        document.body.appendChild(spaceshipDiv);

        //�����ɴ�������ť
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
            if (random >= 0.1) { //�źŷ���ɹ���Ϊ90%
                for (var i = 0; i < spaceManager.spaceShipList.length; i++) {
                    if (spaceManager.spaceShipList[i]._orbit == orbit) {
                        switch (message) {
                            case 'start':
                                spaceManager.spaceShipList[i].drive.start();
                                log(spaceManager.spaceShipList[i]._orbit+1+"�ŷɴ���ʼ����", "#0FF7D4");
                                break;
                            case 'stop':
                                spaceManager.spaceShipList[i].drive.stop();
                                log(spaceManager.spaceShipList[i]._orbit+1+"�ŷɴ�ֹͣ����", "#07F007");
                                break;
                            case 'destroy':
                                spaceManager.spaceShipList[i].destroy();
                                log(spaceManager.spaceShipList[i]._orbit+1+"�ŷɴ��ɹ�����", "#F9D50A");
                                //ɾ���ɴ�������ť
                                $("#shipControl").removeChild(e.target.parentNode);
                                break;
                        }
                    }
                }
            } else {
                switch (message) {
                    case 'start':
                        log("���ָ���ʧ��,�������·���", "#FB2222");
                        spaceManager.action(orbit, message);
                        break;
                    case 'stop':
                        log("ָֹͣ���ʧ��,�������·���", "#FB2222");
                        spaceManager.action(orbit, message);
                        break;
                    case 'destroy':
                        log("�ݻ�ָ���ʧ��,�������·���", "#FB2222");
                        spaceManager.action(orbit, message);
                        break;
                }
            }
        }, 300);

    }
};

/**
 * �ɴ����м���ʾ����
 */
(function() {
    spaceManager.spaceShipFlyManager = setInterval(function() {
        for (var i = 0; i < spaceManager.spaceShipList.length; i++) {
            //�����ٵķɴ�������
            if (spaceManager.spaceShipList[i]._destroyed) {
                //�ڽ�����ʾ��ɾ���ɴ�
                //��ȡ�ɴ�Div;
                var spaceShipDiv = $("#spaceship" + spaceManager.spaceShipList[i]._orbit);
                if ($("#spaceship" + spaceManager.spaceShipList[i]._orbit) !== null) {
                    document.body.removeChild($("#spaceship" + spaceManager.spaceShipList[i]._orbit));
                    spaceManager.spaceShipList.splice(i, 1);
                }
                continue;
            }
            spaceManager.spaceShipList[i].drive.fly();
            //��ȡ�ɴ�Div
            var orbit = spaceManager.spaceShipList[i]._orbit;
            var ship = $("#spaceship" + orbit);
            //��Դ���������������У����򲹳���Դ
            if (spaceManager.spaceShipList[i]._energyStatus === true) {
                //�޸ķɴ�λ��
                ship.style.webkitTransform = "rotate(" + spaceManager.spaceShipList[i]._angle + "deg)";
                ship.style.mozTransform = "rotate(" + spaceManager.spaceShipList[i]._angle + "deg)";
                ship.style.msTransform = "rotate(" + spaceManager.spaceShipList[i]._angle + "deg)";
                ship.style.oTransform = "rotate(" + spaceManager.spaceShipList[i]._angle + "deg)";
                ship.style.transform = "rotate(" + spaceManager.spaceShipList[i]._angle + "deg)";
                //��Դ������ʾ
                spaceManager.spaceShipList[i].energy.consume();
                ship.firstElementChild.style.width = spaceManager.spaceShipList[i].energy.get() + "%";
                ship.lastElementChild.innerHTML = spaceManager.spaceShipList[i].energy.get() + "%";
            } else {
                //��Դ������ʾ
                spaceManager.spaceShipList[i].energy.add();
                ship.firstElementChild.style.width = spaceManager.spaceShipList[i].energy.get() + "%";
                ship.lastElementChild.innerHTML = spaceManager.spaceShipList[i].energy.get() + "%";
            }
        }
    }, 100);
})();


//��Ӳ����ɴ�����¼�ð��
var shipControl = $("#shipControl");
var buttonClick = function(e) {
    if (e.target && e.target.nodeName.toUpperCase() == "BUTTON") {
        //��ȡ�ɴ������
        var orbit = e.target.parentNode.id.slice(7) - 0;
        //��ȡָ�����ͣ�start��stop��destroy��
        var message = e.target.dataset.type;
        //��ť����
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

//��ȡѡ���ķɴ��ͺ�
function getRadioValue(radionObj) {
    var str = [];
    for (var i = 0; i < radionObj.length; i++) {
        if (radionObj[i].checked) {
            str.push(parseInt(radionObj[i].value));
        }
    }
    return str;
}
//��Ӵ����ɴ��ĵ���¼�
var create = $("#create");
create.addEventListener("click", function() {
    var input = document.getElementsByTagName("input");
    //ѡ�еķɴ�������ֵ
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
 * ��������϶�
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