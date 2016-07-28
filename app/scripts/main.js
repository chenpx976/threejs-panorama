var camera, scene, renderer, stats;

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
    onPointerDownPointerX,
    onPointerDownPointerY,
    onPointerDownLon,
    onPointerDownLat,
    target = new THREE.Vector3();
var o = new Orienter();
init();
requestAnimationFrame(animate);

function webglAvailable() {
    try {
        var canvas = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && (
            canvas.getContext('webgl') ||
            canvas.getContext('experimental-webgl')));
    } catch (e) {
        return false;
    }
}

function initRender() {
    if (webglAvailable()) {
        return new THREE.WebGLRenderer({
            antialias: true
        });
    } else {
        return new THREE.CanvasRenderer();
    }
}

function init() {

    var container, mesh;
    o.init();
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.right = '0px';
    stats.domElement.style.top = '0px';
    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(stats.domElement);

    container = document.getElementById('container');

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1100);

    scene = new THREE.Scene();

    var sides = [{
        url: 'images/back.jpg', // back
        position: [-512, 0, 0],
        rotation: [0, Math.PI / 2, 0]
    }, {
        url: 'images/front.jpg', // front
        position: [512, 0, 0],
        rotation: [0, -Math.PI / 2, 0]
    }, {
        url: 'images/top.jpg', // top
        position: [0, 512, 0],
        rotation: [Math.PI / 2, 0, Math.PI /2]
    }, {
        url: 'images/bottom.jpg', //bottom
        position: [0, -512, 0],
        rotation: [-Math.PI / 2, 0, -Math.PI /2]
    }, {
        url: 'images/right.jpg', // right
        position: [0, 0, 512],
        rotation: [0, Math.PI, 0]
    }, {
        url: 'images/left.jpg', // left
        position: [0, 0, -512],
        rotation: [0, 0, 0]
    }];

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

    /*
        phi = THREE.Math.degToRad(90 - lat);
        theta = THREE.Math.degToRad(lon);

        target.x = 500 * Math.sin(phi) * Math.cos(theta);
        target.y = 500 * Math.cos(phi);
        target.z = 500 * Math.sin(phi) * Math.sin(theta);

        camera.lookAt(target);

        renderer.render(scene, camera);*/

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
o.handler = function(obj) {
    var tip = document.getElementById('tip');
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
        '<br>' + 'direction:' + obj.dir;

    dLat = obj.lat - preLat;
    dLon = preLon - obj.lon;

    lon = Math.floor(lon + dLon);
    lat = Math.floor(lat + dLat);
    lat = Math.max(-85, Math.min(85, lat));
    phi = THREE.Math.degToRad(90 - lat);
    theta = THREE.Math.degToRad(lon);

    target.x = Math.floor(500 * Math.sin(phi) * Math.cos(theta));
    target.y = Math.floor(500 * Math.cos(phi));
    target.z = Math.floor(500 * Math.sin(phi) * Math.sin(theta));

    preLon = obj.lon;
    preLat = obj.lat;
};

function update() {
    if (isUserDrag || isUserInteracting) {
        lat = Math.max(-85, Math.min(85, lat));
        phi = THREE.Math.degToRad(90 - lat);
        theta = THREE.Math.degToRad(lon);

        target.x = 500 * Math.sin(phi) * Math.cos(theta);
        target.y = 500 * Math.cos(phi);
        target.z = 500 * Math.sin(phi) * Math.sin(theta);
    }

    camera.lookAt(target);
    renderer.render(scene, camera);

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function loadTexture(path) {

    var texture = new THREE.Texture(texture_placeholder);
    var material = new THREE.MeshBasicMaterial({ map: texture, overdraw: 0.5 });

    var image = new Image();
    image.onload = function() {

        texture.image = this;
        texture.needsUpdate = true;

    };
    image.src = path;

    return material;

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
        // console.log('touchMove', lon, lat);
        isUserDrag = true;

        lon = (onPointerDownPointerX - event.touches[0].pageX) * 0.1 + onPointerDownLon;
        lat = (event.touches[0].pageY - onPointerDownPointerY) * 0.1 + onPointerDownLat;

    }

}

function onDocumentTouchEnd(event) {
    // console.log('touchEnd');
    isUserDrag = false;

}
