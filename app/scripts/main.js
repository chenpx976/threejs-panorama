var camera, scene, renderer, controls;

var isUserInteracting = false,
    flagDrag = true,
    flagOri = true,
    lon = 0,
    lat = 0,
    phi = 0,
    theta = 0,
    preLon = 0,
    preLat = 0,
    dLon = 0,
    dLat = 0,
    hfov = 100,
    offset = 10,
    onPointerDownPointerX,
    onPointerDownPointerY,
    onPointerDownLon,
    onPointerDownLat,
    compass,
    A,
    o = new Orienter(),
    target = new THREE.Vector3();


// 全景图图片
var sides = [{
    url: 'images/front.jpg', // front
    position: [512, 0, 0],
    rotation: [0, -Math.PI / 2, 0]
}, {
    url: 'images/back.jpg', // back
    position: [-512, 0, 0],
    rotation: [0, Math.PI / 2, 0]
}, {
    url: 'images/left.jpg', // left
    position: [0, 0, -512],
    rotation: [0, 0, 0]
}, {
    url: 'images/right.jpg', // right
    position: [0, 0, 512],
    rotation: [0, Math.PI, 0]
}, {
    url: 'images/top.jpg', // top
    position: [0, 512, 0],
    rotation: [Math.PI / 2, 0, Math.PI / 2]
}, {
    url: 'images/bottom.jpg', //bottom
    position: [0, -512, 0],
    rotation: [-Math.PI / 2, 0, -Math.PI / 2]
}];


init();

function init() {
    var container, mesh;
    o.init();
    // 指南针
    compass = document.createElement('div');
    compass.id = 'compass';
    document.body.appendChild(compass);

    // 容器
    container = document.getElementById('container');
    camera = new THREE.PerspectiveCamera(85, window.innerWidth / window.innerHeight, 1, 1100);
    scene = new THREE.Scene();

    // 生成立方全景
    var cube = new THREE.Object3D();
    scene.add(cube);

    for (var i = 0; i < sides.length; i++) {

        var side = sides[i];

        var element = document.createElement('img');
        element.width = 1026; // 2 pixels extra to close the gap.
        element.src = side.url;

        var object = new THREE.CSS3DObject(element);
        object.position.fromArray(side.position);
        object.rotation.fromArray(side.rotation);
        cube.add(object);

    }

    // 渲染器
    renderer = new THREE.CSS3DRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // 初始化定位
    render(0, lat);

    // 添加事件监听
    listeners(flagDrag);
    if (flagOri) {
        window.addEventListener('deviceorientation', oriInit);
    }

    // 控制按钮
    document.getElementById('drag').addEventListener('touchstart', function(e) {
        flagDrag = !flagDrag;
        listeners(flagDrag);
    }, false);
    document.getElementById('ori').addEventListener('touchstart', function(e) {
        flagOri = !flagOri;
        if (flagOri) {
            window.addEventListener('deviceorientation', oriInit);
        } else {
            window.removeEventListener('deviceorientation', oriInit);
        }
    }, false);


    window.addEventListener('resize', onWindowResize, false);

    // 执行动画
    animate();

}

// 重力感应处理
function oriInit() {
    o.handler = function(obj) {
        if (flagOri && !isUserInteracting) {
            // 开启重力感应
            dLat = Math.abs(obj.lat - preLat) > offset ? 0 : obj.lat - preLat;
            dLon = Math.abs(preLon - obj.lon) > offset ? 0 : preLon - obj.lon;
            lon = Math.floor(lon + dLon);
            lat = Math.floor(lat + dLat);
            render(lon, lat);
            preLon = obj.lon;
            preLat = obj.lat;
        }

    };
}



function animate() {
    if (flagDrag && isUserInteracting) {
        render(lon, lat);
    }
    A = requestAnimationFrame(animate);
}

// 渲染处理
function render(lon, lat) {
    lat = Math.max(-85, Math.min(85, lat));
    theta = THREE.Math.degToRad(lon);
    phi = THREE.Math.degToRad(90 - lat);
    target.x = Math.floor(500 * Math.sin(phi) * Math.cos(theta));
    target.y = Math.floor(500 * Math.cos(phi));
    target.z = Math.floor(500 * Math.sin(phi) * Math.sin(theta));
    compass.style.transform = 'rotate(' + lon + 'deg)';
    compass.style.webkitTransform = 'rotate(' + lon + 'deg)';
    camera.lookAt(target);
    renderer.render(scene, camera);
}


function listeners(flagDrag) {

    if (flagDrag) {
        document.addEventListener('mousedown', onDocumentMouseDown, false);
        document.addEventListener('mousemove', onDocumentMouseMove, false);
        document.addEventListener('mouseup', onDocumentMouseUp, false);

        document.addEventListener('touchstart', onDocumentTouchStart, false);
        document.addEventListener('touchmove', onDocumentTouchMove, false);
        document.addEventListener('touchend', onDocumentTouchEnd, false);
    } else {
        document.removeEventListener('mousedown', onDocumentMouseDown, false);
        document.removeEventListener('mousemove', onDocumentMouseMove, false);
        document.removeEventListener('mouseup', onDocumentMouseUp, false);

        document.removeEventListener('touchstart', onDocumentTouchStart, false);
        document.removeEventListener('touchmove', onDocumentTouchMove, false);
        document.removeEventListener('touchend', onDocumentTouchEnd, false);
    }

}

// 基础事件处理
function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function onDocumentMouseDown(event) {

    event.preventDefault();

    isUserInteracting = true;
    onPointerDownPointerX = event.clientX;
    onPointerDownPointerY = event.clientY;

    onPointerDownLon = lon;
    onPointerDownLat = lat;

}

function onDocumentMouseMove(event) {

    if (isUserInteracting === true) {

        lon = (onPointerDownPointerX - event.clientX) * 0.1 + onPointerDownLon;
        lat = (event.clientY - onPointerDownPointerY) * 0.1 + onPointerDownLat;

    }

}

function onDocumentMouseUp(event) {

    isUserInteracting = false;

}

function onDocumentMouseWheel(event) {

    camera.fov -= event.wheelDeltaY * 0.05;
    camera.updateProjectionMatrix();

}


function onDocumentTouchStart(event) {

    if (event.touches.length == 1) {

        event.preventDefault();
        isUserInteracting = true;
        onPointerDownPointerX = event.touches[0].pageX;
        onPointerDownPointerY = event.touches[0].pageY;

        onPointerDownLon = lon;
        onPointerDownLat = lat;

    }

}

function onDocumentTouchMove(event) {

    if (event.touches.length == 1) {

        event.preventDefault();
        isUserInteracting = true;
        var touchmovePanSpeedCoeff = hfov / 360;
        lon = (onPointerDownPointerX - event.touches[0].pageX) * touchmovePanSpeedCoeff + onPointerDownLon;
        lat = (event.touches[0].pageY - onPointerDownPointerY) * touchmovePanSpeedCoeff + onPointerDownLat;

    }

}

function onDocumentTouchEnd(event) {
    isUserInteracting = false;
}
