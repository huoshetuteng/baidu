$ = function(el) {
    return document.querySelector(el);
};
/**
 * ����̨���
 * @param message ��Ϣ
 * @param colour ��ɫ
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

function SpaceShip(orbitId) {
    var obj = {
        //���ڹ��
        _orbit: orbitId,
        //��ǰ״̬
        _status: STOP,
        //��ǰ��Դ
        _energy: 100,
        //��Դ�Ƿ����
        _energyStatus: true,
        //��Դ�����ٶ�
        _rate: 2,
        //��Դ�����ٶ�
        _decrease: 1,
        //�Ѿ�����
        _destroyed: false,
        //�ٶ�
        _speed: 3,
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
                obj._energy += obj._decrease;
                if (obj._energy >= 100) {
                    obj._energy = 100;
                    obj._energy_status = true;
                }
            },
            consume: function() {
                if (obj._status == START) {
                    obj._energy -= obj._decrease;
                }
                if (obj._energy <= 0) {
                    obj._status = STOP;
                    obj._energy = 0;
                    obj._energy_status = false;
                }
            },
            //��ȡ��ǰ��Դֵ
            get: function() {
                return obj._energy;
            }
        },
        //�����ٶȺ���Դ�����ٶȳ�ʼ��
        init: function(arr) {
            this._speed = parseInt(arr[0]);
            this._rate = parseInt(arr[1]);
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
    createSpaceShip: function(orbitId, arr) {
        //�����ɴ����󲢱��浽����
        var obj = new SpaceShip(orbitId);
        obj.init(arr);
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
                    spaceManager.spaceShipList.splice(i,1);
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


//��ӵ���¼�ð��
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
                //ɾ���ɴ�������ť
                $("#shipControl").removeChild(e.target.parentNode);
        }
    }
};
shipControl.addEventListener("click", buttonClick);

//��ȡѡ���ķɴ��ͺ�
function getRadioValue(radionObj) {
    var str = [];
    for (var i = 0; i < radionObj.length; i++) {
        if (radionObj[i].checked) {
            str.push(radionObj[i].value);
        }
    }
    return str;
}
//��ӵ���¼�
var create = $("#create");
create.addEventListener("click", function() {
    var obj = document.getElementsByTagName("input");
    var arrValue = getRadioValue(obj);
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
    spaceManager.createSpaceShip(orbit, arrValue);
    console.log(spaceManager.spaceShipList)
}, false);

/**
 * ��������϶�
 */
(function() {
    //��ȡ����Ԫ��
    var control = document.getElementById("control");
    var title = document.getElementById("control-title");
    //��ʼλ��
    control.style.left = 0;
    control.style.top = 0;
    var draggingControl = false;
    var start = [0, 0];
    var position = [
        control.style.left.substr(0, control.style.left.length - 2) - 0,
        control.style.top.substr(0, control.style.top.length - 2) - 0
    ];
    //���¼�
    title.addEventListener("mousedown", function(e) { //��갴���¼�
        start[0] = e.clientX - position[0];
        start[1] = e.clientY - position[1];
        draggingControl = true;
        console.log(e.clientX,e.clientY)
    });
    addEventListener("mouseup", function() { //���̧���¼�
        draggingControl = false;
    });
    addEventListener("mousemove", function(e) { //����ƶ��¼�
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