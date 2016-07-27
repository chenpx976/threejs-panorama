var camera, scene, renderer, stats, controlers, controls2;

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

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.right = '0px';
    stats.domElement.style.top = '0px';
    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(stats.domElement);

    container = document.getElementById('container');
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1100);
    scene = new THREE.Scene();
    controlers = new THREE.DeviceOrientationControls(camera);

/*
    texture_placeholder = document.createElement('canvas');
    texture_placeholder.width = 128;
    texture_placeholder.height = 128;
    var context = texture_placeholder.getContext('2d');
    context.fillStyle = 'rgb( 200, 200, 200 )';
    context.fillRect(0, 0, texture_placeholder.width, texture_placeholder.height);
    var materials = [
        loadTexture('images/3_1.jpg'), // right
        loadTexture('images/3_3.jpg'), // left
        loadTexture('images/3_0.jpg'), // top
        loadTexture('images/3_5.jpg'), // bottom
        loadTexture('images/3_4.jpg'), // back
        loadTexture('images/3_2.jpg') // front
    ];
    mesh = new THREE.Mesh(new THREE.BoxGeometry(300, 300, 300, 7, 7, 7), new THREE.MultiMaterial(materials));
    mesh.scale.x = -1;
    */

    var geometry = new THREE.SphereGeometry( 500, 60, 40 );
    geometry.scale( - 1, 1, 1 );

    var material = new THREE.MeshBasicMaterial( {
        map: new THREE.TextureLoader().load( 'images/cube/2294472375_24a3b8ef46_o.jpg' )
    } );

    mesh = new THREE.Mesh( geometry, material );

    scene.add(mesh);


    renderer = initRender();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
    controls2 = new THREE.OrbitControls(camera, renderer.domElement);
    //controls.addEventListener( 'change', render ); // add this only if there is no animation loop (requestAnimationFrame)
    controls2.enableDamping = true;
    controls2.addEventListener('change', render);


    /*
        phi = THREE.Math.degToRad(90 - lat);
        theta = THREE.Math.degToRad(lon);

        target.x = 500 * Math.sin(phi) * Math.cos(theta);
        target.y = 500 * Math.cos(phi);
        target.z = 500 * Math.sin(phi) * Math.sin(theta);

        camera.lookAt(target);

        renderer.render(scene, camera);*/
    /*
        document.addEventListener('mousedown', onDocumentMouseDown, false);
        document.addEventListener('mousemove', onDocumentMouseMove, false);
        document.addEventListener('mouseup', onDocumentMouseUp, false);
        document.addEventListener('mousewheel', onDocumentMouseWheel, false);

        document.addEventListener('touchstart', onDocumentTouchStart, false);
        document.addEventListener('touchmove', onDocumentTouchMove, false);
        document.addEventListener('touchend', onDocumentTouchEnd, false);
    */
    //

    window.addEventListener('resize', onWindowResize, false);

}

function animate() {
    stats.begin();

    update();

    stats.end();
    requestAnimationFrame(animate);

}
/*o.handler = function(obj) {
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
};*/

function update() {
    /*if (isUserDrag || isUserInteracting) {
        lat = Math.max(-85, Math.min(85, lat));
        phi = THREE.Math.degToRad(90 - lat);
        theta = THREE.Math.degToRad(lon);

        target.x = 500 * Math.sin(phi) * Math.cos(theta);
        target.y = 500 * Math.cos(phi);
        target.z = 500 * Math.sin(phi) * Math.sin(theta);
    }

    camera.lookAt(target);
    */

    controlers.update();
    render();

}

function render() {
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
/*
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
*/
