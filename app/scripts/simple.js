var camera, scene, renderer, stats, controls, controls2;

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
    camera = new THREE.PerspectiveCamera(85, window.innerWidth / window.innerHeight, 1, 1100);
    camera.position.z = 0.01;
    controls = new THREE.OrbitControls(camera);
    controls.enableZoom = false;
    controls.enablePan = false;


    scene = new THREE.Scene();

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
    /*
        var geometry = new THREE.SphereGeometry(500, 60, 40);
        geometry.scale(-1, 1, 1);

        var material = new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load('images/cube/2294472375_24a3b8ef46_o.jpg')
        });

        mesh = new THREE.Mesh(geometry, material);
    */
    // scene.add(mesh);

    cssScene();
    // renderer = initRender();
    renderer = new THREE.CSS3DRenderer();
    // renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    window.addEventListener('deviceorientation', setOrientationControls, true);

    window.addEventListener('resize', onWindowResize, false);


}

function setOrientationControls(e) {
    console.log(e.alpha);
    if (!e.alpha) {
        return;
    }
    controls = new THREE.DeviceOrientationControls(camera, true);
    controls.connect();
    controls.update();
    window.removeEventListener('deviceorientation', setOrientationControls, true);
}

function animate() {
    stats.begin();
    controls.update();
    renderer.render(scene, camera);
    stats.end();
    requestAnimationFrame(animate);
}

function update() {
    controls.update();
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

function cssScene() {
    var sides = [{
        url: 'images/cube/Bridge2/posx.jpg',
        position: [-512, 0, 0],
        rotation: [0, Math.PI / 2, 0]
    }, {
        url: 'images/cube/Bridge2/negx.jpg',
        position: [512, 0, 0],
        rotation: [0, -Math.PI / 2, 0]
    }, {
        url: 'images/cube/Bridge2/posy.jpg',
        position: [0, 512, 0],
        rotation: [Math.PI / 2, 0, Math.PI]
    }, {
        url: 'images/cube/Bridge2/negy.jpg',
        position: [0, -512, 0],
        rotation: [-Math.PI / 2, 0, Math.PI]
    }, {
        url: 'images/cube/Bridge2/posz.jpg',
        position: [0, 0, 512],
        rotation: [0, Math.PI, 0]
    }, {
        url: 'images/cube/Bridge2/negz.jpg',
        position: [0, 0, -512],
        rotation: [0, 0, 0]
    }];

    for (var i = 0; i < sides.length; i++) {

        var side = sides[i];
        var div = document.createElement( 'div' );
        div.style.width = '1024px';
        div.style.height = '1024px';
        div.style.opacity = 1;
        div.style.background = 'url('+ side.url + ')';
        // var img = document.createElement('img');
        // img.width = 1024; // 2 pixels extra to close the gap.
        // img.src = side.url;
        // div.appendChild(img);
        var object = new THREE.CSS3DObject(div);
        object.position.fromArray(side.position);
        object.rotation.fromArray(side.rotation);
        scene.add(object);

    }
}
