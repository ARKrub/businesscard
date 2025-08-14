let scene, camera, renderer;
let arToolkitSource, arToolkitContext;
let markerRoot;

// Initialize
init();
animate();

function init() {
  scene = new THREE.Scene();

  camera = new THREE.Camera();
  scene.add(camera);

  renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(new THREE.Color('lightgrey'), 0)
  document.body.appendChild(renderer.domElement);

  // AR Toolkit Source
  arToolkitSource = new THREEx.ArToolkitSource({ sourceType: 'webcam' });
  arToolkitSource.init(() => onResize());

  window.addEventListener('resize', () => onResize());

  // AR Toolkit Context
  arToolkitContext = new THREEx.ArToolkitContext({
    cameraParametersUrl: 'https://cdn.jsdelivr.net/npm/ar.js@4.3.2/three.js/data/camera_para.dat',
    detectionMode: 'mono'
  });

  arToolkitContext.init(() => {
    camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
  });

  // Marker
  markerRoot = new THREE.Group();
  scene.add(markerRoot);
  let markerControls = new THREEx.ArMarkerControls(arToolkitContext, markerRoot, {
    type: 'pattern',
    patternUrl: 'img/business-card.patt' // Your marker pattern file
  });

  // Add a simple 3D model
  let loader = new THREE.GLTFLoader();
  loader.load('model/avatar.glb', function(gltf){
    gltf.scene.scale.set(0.5, 0.5, 0.5);
    markerRoot.add(gltf.scene);
  });

  // Optional: Light
  let light = new THREE.AmbientLight(0xffffff, 1);
  scene.add(light);
}

function onResize(){
  arToolkitSource.onResizeElement();
  arToolkitSource.copyElementSizeTo(renderer.domElement);
  if(arToolkitContext.arController !== null)
    arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas);
}

function update(){
  if(arToolkitSource.ready !== false)
    arToolkitContext.update(arToolkitSource.domElement);
}

function render(){
  renderer.render(scene, camera);
}

function animate(){
  requestAnimationFrame(animate);
  update();
  render();
}

function openLink(url){
  window.open(url, '_blank');
}
