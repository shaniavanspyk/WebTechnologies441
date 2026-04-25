// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0f172a);

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 6;

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

// Cube
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(),
  new THREE.MeshStandardMaterial({ color: 0x22d3ee })
);
cube.position.x = -2.5;
scene.add(cube);

// Sphere
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.9, 32, 32),
  new THREE.MeshStandardMaterial({ color: 0x22d3ee })
);
sphere.position.x = 2.5;
scene.add(sphere);

// Load Model
let model;
const loader = new THREE.GLTFLoader();

loader.load('model.glb', function (gltf) {
  model = gltf.scene;

  // 🔽 Smaller model
  model.scale.set(0.3, 0.3, 0.3);

  model.position.set(0, -1, 0);
  scene.add(model);
});

// 3D TEXT "hello"
const fontLoader = new THREE.FontLoader();

fontLoader.load(
  'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
  function (font) {

    const textGeometry = new THREE.TextGeometry('hello', {
      font: font,
      size: 0.6,
      height: 0.1
    });

    // center text
    textGeometry.center();

    const textMaterial = new THREE.MeshStandardMaterial({
      color: 0xffccff,
      emissive: 0x222222
    });

    const textMesh = new THREE.Mesh(textGeometry, textMaterial);

    // position above model
    textMesh.position.set(0, 1.5, 0);

    scene.add(textMesh);
  }
);

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Rotation
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  sphere.rotation.y += 0.02;

  // Camera motion (extra requirement)
  camera.position.x = Math.sin(Date.now() * 0.001) * 2;
  camera.lookAt(0, 0, 0);

  renderer.render(scene, camera);
}

animate();

// Resize fix
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});