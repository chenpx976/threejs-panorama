var stage, box, camera, stats;

var texture_placeholder,
    isUserInteracting = false,
    isUserDrag = false,
    onMouseDownMouseX = 0,
    onMouseDownMouseY = 0,
    lon = 0,
    onMouseDownLon = 0,
    lat = 0,
    onMouseDownLat = 0,
    phi = 0,
    theta = 0,
    preLon = 0,
    preLat = 0,
    dLon = 0,
    dLat = 0,
    target = {},
    limitDeg = 3,
    onPointerDownPointerX,
    onPointerDownPointerY,
    onPointerDownLon,
    onPointerDownLat;
var o = new Orienter();
init();
requestAnimationFrame(animate);

function init() {
    stage = new C3D.Stage();
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.right = '0px';
    stats.domElement.style.top = '0px';
    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(stats.domElement);
    stage.size(
        window.innerWidth,
        window.innerHeight
    ).material({
        color: '#cccccc'
    }).update();

    document.getElementById('main').appendChild(stage.el);
    var materials1 = {
        front: 'images/cube/Park2/negz.jpg', // front
        back: 'images/cube/Park2/posz.jpg', // back
        left: 'images/cube/Park2/negx.jpg', // left
        right: 'images/cube/Park2/posx.jpg', // right
        up: 'images/cube/Park2/posy.jpg', // up
        down: 'images/cube/Park2/negy.jpg' // down
    };
    var materials2 = {
        front: "images/cube_FR.jpg",
        back: "images/cube_BK.jpg",
        left: "images/cube_LF.jpg",
        right: "images/cube_RT.jpg",
        up: "images/cube_UP.jpg",
        down: "images/cube_DN.jpg"
    }
    box = new C3D.Skybox();
    box.size(1024)
        .position(0, 0, 0)
        .material(materials2).update();

    stage.addChild(box);

    camera = stage.camera;
    o.init();
    document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('mouseup', onDocumentMouseUp, false);
    document.addEventListener('mousewheel', onDocumentMouseWheel, false);

    document.addEventListener('touchstart', onDocumentTouchStart, false);
    document.addEventListener('touchmove', onDocumentTouchMove, false);
    document.addEventListener('touchend', onDocumentTouchEnd, false);

    //

    window.addEventListener('resize', onWindowResize, false);

}

function animate() {
    stats.begin();

    update();

    stats.end();
    requestAnimationFrame(animate);
}

function update() {
    /*    lat = Math.max(-85, Math.min(85, lat));
     phi = THREE.Math.degToRad(90 - lat);
     theta = THREE.Math.degToRad(lon);
     target.x = 100 * Math.sin(phi) * Math.cos(theta);
     target.y = 100 * Math.cos(phi);
     target.z = 100 * Math.sin(phi) * Math.sin(theta);
     camera.rotation( -target.y, target.x, 0).update();
     */
    if (isUserDrag) {
        // dLon = lon - onPointerDownLon;
        // dLat = lat - onPointerDownLat;
        // camera.rotate(-lat, -lon, 0).update();
        isUserDrag = false;

    } else {
        o.handler = function(obj) {

            dLat = preLat - obj.lat;
            dLon = -preLon + obj.lon;
            // lon = obj.lon;
            // lat = obj.lat;
            // lat = Math.max(-85, Math.min(85, lat));
            // phi = THREE.Math.degToRad(90 - lat);
            // theta = THREE.Math.degToRad(lon);
            // target.x = 1 * Math.sin(phi) * Math.cos(theta);
            // target.y = 1 * Math.cos(phi);
            // target.z = 1 * Math.sin(phi) * Math.sin(theta);
            lon = lon + dLon;
            lat = lat + dLat;
            lat = Math.max(-85, Math.min(85, lat));

            camera.rotate(dLat, dLon, 0).update();
            preLon = obj.lon;
            preLat = obj.lat;

            var tip = document.getElementById('tip');
            tip.innerHTML =
                'alpha:' + obj.a +
                '<br>' + 'beta:' + obj.b +
                '<br>' + 'gamma:' + obj.g +
                '<br>' + 'longitude:' + obj.lon +
                '<br>' + 'latitude:' + obj.lat +
                '<br>' + 'lon:' + lon +
                '<br>' + 'lat:' + lat +
                '<br>' + 'dLon:' + dLon +
                '<br>' + 'dLat:' + dLat +
                '<br>' + 'phi:' + phi +
                '<br>' + 'theta:' + theta +
                '<br>' + 'targetX:' + target.x +
                '<br>' + 'targetY:' + target.y +
                '<br>' + 'targetZ:' + target.z +
                '<br>' + 'direction:' + obj.dir;
        };
    }

}


// 事件处理
function onWindowResize() {
    stage.size(
        window.innerWidth,
        window.innerHeight
    ).update();
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
        console.log('touchstart');
        isUserDrag = true;
        onPointerDownPointerX = event.touches[0].pageX;
        onPointerDownPointerY = event.touches[0].pageY;

        onPointerDownLon = lon;
        onPointerDownLat = lat;

    }

}

function onDocumentTouchMove(event) {

    if (event.touches.length == 1) {

        event.preventDefault();
        console.log('touchMove', lon, lat);

        lon = (onPointerDownPointerX - event.touches[0].pageX) * 0.1 + onPointerDownLon;
        lat = (event.touches[0].pageY - onPointerDownPointerY) * 0.1 + onPointerDownLat;

    }

}

function onDocumentTouchEnd(event) {
    console.log('touchEnd');

}
