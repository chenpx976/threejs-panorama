var camera, scene, renderer, controls;

var isUserInteracting = false,
    latestInteraction = Date.now(),
    flagDrag = true,
    flagOri = true,
    flagDebug = true,
    lon = 90,
    lat = 0,
    phi = 0,
    theta = 0,
    preLon = 0,
    preLat = 0,
    dLon = 0,
    dLat = 0,
    onTouchDownTouchX = 0,
    onTouchDownTouchY = 0,
    onTouchDownLon = 0,
    onTouchDownLat = 0,
    onPointerDownPointerX,
    onPointerDownPointerY,
    onPointerDownLon,
    onPointerDownLat,
    stats,
    compass,
    speed,
    A,
    timer,
    o = new Orienter(),
    target = new THREE.Vector3();
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

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '110px';
    stats.domElement.style.top = '110px';
    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(stats.domElement);

    compass = document.createElement('div');
    compass.id = 'compass';
    document.body.appendChild(compass);

    container = document.getElementById('container');
    camera = new THREE.PerspectiveCamera(85, window.innerWidth / window.innerHeight, 1, 1100);
    scene = new THREE.Scene();

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

    renderer = new THREE.CSS3DRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);


    render(0, lat);
    document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('mouseup', onDocumentMouseUp, false);
    document.addEventListener('mousewheel', onDocumentMouseWheel, false);

    document.addEventListener('touchstart', onDocumentTouchStart, false);
    document.addEventListener('touchmove', onDocumentTouchMove, false);
    document.addEventListener('touchend', onDocumentTouchEnd, false);

    //
    document.getElementById('drag').addEventListener('touchstart', function(e) {
        flagDrag = !flagDrag;
        console.log(flagDrag);
    }, false);
    document.getElementById('ori').addEventListener('touchstart', function(e) {
        flagOri = !flagOri;
        console.log(flagOri);
    }, false);

    window.addEventListener('deviceorientation', oriInit, true);


    window.addEventListener('resize', onWindowResize, false);

    animate();

}
function oriInit() {
    o.handler = function(obj) {
        /*var tip = document.getElementById('tip');
        tip.innerHTML =
            'alpha:' + obj.a +
            '<br>' + 'beta:' + obj.b +
            '<br>' + 'gamma:' + obj.g +
            '<br>' + 'longitude:' + obj.lon +
            '<br>' + 'latitude:' + obj.lat +
            '<br>' + 'lon:' + lon +
            '<br>' + 'lat:' + lat +
            '<br>' + 'phi:' + phi +
            '<br>' + 'theta:' + theta +
            '<br>' + 'direction:' + obj.dir;*/
        if (flagOri && !flagDrag) {
            // 开启重力感应 && 关闭拖拽
            lon = Math.floor(obj.lon);
            lat = Math.floor(obj.lat);
            render(-lon, lat);
            console.log('开启重力感应 && 关闭拖拽');
        } else if (flagOri && flagDrag) {
            // 开启重力感应 && 开启拖拽
            if (!isUserInteracting) {
                dLat = obj.lat - preLat;
                dLon = preLon - obj.lon;
                lon = Math.floor(lon + dLon);
                lat = Math.floor(lat + dLat);
                render(lon, lat);
                preLon = obj.lon;
                preLat = obj.lat;
                console.log('开启重力感应 && 开启拖拽');
            }
        }

    };
}



function animate() {
    stats.begin();
    if (flagDrag && isUserInteracting) {
        render(lon, lat);
    }
    stats.end();
    A = requestAnimationFrame(animate);
}
/*
function setOrientationControls(e) {
    console.log(e.alpha);
    if (!e.alpha) {
        return;
    }
    controls = new THREE.DeviceOrientationControls(camera, true);
    controls.connect();
    controls.update();
    window.removeEventListener('deviceorientation', setOrientationControls, true);
}*/


function render(lon, lat) {
    lat = Math.max(-85, Math.min(85, lat));
    theta = THREE.Math.degToRad(lon);
    phi = THREE.Math.degToRad(90 - lat);
    target.x = 1000 * 500 * Math.sin(phi) * Math.cos(theta);
    target.y = 1000 * 500 * Math.cos(phi);
    target.z = 1000 * 500 * Math.sin(phi) * Math.sin(theta);
    compass.style.transform = 'rotate(' + lon + 'deg)';
    compass.style.webkitTransform = 'rotate(' + lon + 'deg)';
    camera.lookAt(target);
    renderer.render(scene, camera);
}

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
        // console.log('touchstart');
        isUserInteracting = true;
        latestInteraction = Date.now();
        o.destroy();
        clearInterval(timer);
        onPointerDownPointerX = event.touches[0].pageX;
        onPointerDownPointerY = event.touches[0].pageY;

        onPointerDownLon = lon;
        onPointerDownLat = lat;

    }

}

function onDocumentTouchMove(event) {

    if (event.touches.length == 1) {

        event.preventDefault();
        // console.log('touchMove', lon, lat);
        isUserInteracting = true;

        lon = (onPointerDownPointerX - event.touches[0].pageX) * 0.1 + onPointerDownLon;
        lat = (event.touches[0].pageY - onPointerDownPointerY) * 0.1 + onPointerDownLat;

    }

}

function onDocumentTouchEnd(event) {
    // console.log('touchEnd');
    var dx = lon - onPointerDownLon;
    var dy = lat - onPointerDownLat;
    var dd = Date.now() - latestInteraction;
    var speedX = Math.abs(dx/dd).toFixed(2);
    var speedY = Math.abs(dy/dd).toFixed(2);
    console.log(speedX,speedY,camera.position );
    timer = setInterval(function() {
        isUserInteracting = false;
        o.init();
    },1000);
    // if (speedX > 0.5  || speedY > 0.5) {
    //     render(lon + dx * speedX, lat + dy * speedY);
    // }
}
