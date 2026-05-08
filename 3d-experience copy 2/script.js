// ---------------- SCENE ----------------
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0f172a);
scene.fog = new THREE.FogExp2(0x0f172a, 0.015);

// ---------------- CAMERA ----------------
const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 1, 6);

// ---------------- RENDERER ----------------
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#canvas"),
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// ---------------- LIGHT ----------------
scene.add(new THREE.AmbientLight(0xffffff, 0.7));

const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
keyLight.position.set(5, 5, 5);
scene.add(keyLight);

// ---------------- CURSOR ----------------
const mouse = new THREE.Vector2();

window.addEventListener("mousemove", (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

// ---------------- MODELS ----------------
let models = [];
let currentModelIndex = -1;

const modelPaths = [
  "./models/model1.glb",
  "./models/model2.glb",
  "./models/model3.glb"
];

const loader = new THREE.GLTFLoader();

modelPaths.forEach((path, index) => {
  loader.load(path, (gltf) => {
    const m = gltf.scene;

    m.scale.set(0.6, 0.6, 0.6);
    m.position.set(0, -1, 0);
    m.visible = false;

    scene.add(m);
    models[index] = m;
  });
});

// ---------------- PARTICLES ----------------
const particleCount = 1200;
const positions = new Float32Array(particleCount * 3);

for (let i = 0; i < positions.length; i++) {
  positions[i] = (Math.random() - 0.5) * 20;
}

const particles = new THREE.Points(
  new THREE.BufferGeometry().setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  ),
  new THREE.PointsMaterial({
    size: 0.03,
    color: 0xffffff,
    opacity: 0.3,
    transparent: true
  })
);

scene.add(particles);

// ---------------- SPHERES ----------------
const spheres = [];

const sphereGeo = new THREE.SphereGeometry(0.15, 16, 16);
const sphereMat = new THREE.MeshStandardMaterial({
  color: 0x60a5fa,
  emissive: 0x1e3a8a,
  emissiveIntensity: 1
});

for (let i = 0; i < 80; i++) {
  const s = new THREE.Mesh(sphereGeo, sphereMat);

  s.position.set(
    (Math.random() - 0.5) * 20,
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 20
  );

  s.userData.baseScale = 1;

  scene.add(s);
  spheres.push(s);
}

// ---------------- SCROLL ----------------
let targetScroll = 0;
let currentScroll = 0;

window.addEventListener("scroll", () => {
  targetScroll = window.scrollY;
});

// ---------------- PARTICLES ----------------
function updateParticles() {
  const pos = particles.geometry.attributes.position;

  for (let i = 0; i < pos.count; i++) {
    const ix = i * 3;

    const dx = mouse.x * 5 - pos.array[ix];
    const dy = mouse.y * 5 - pos.array[ix + 1];

    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 3.5) {
      pos.array[ix] += dx * 0.02;
      pos.array[ix + 1] += dy * 0.02;

      if (dist < 0.4) {
        pos.array[ix] = (Math.random() - 0.5) * 20;
        pos.array[ix + 1] = (Math.random() - 0.5) * 20;
        pos.array[ix + 2] = (Math.random() - 0.5) * 20;
      }
    }
  }

  pos.needsUpdate = true;
}

// ---------------- SPHERES ----------------
function updateSpheres() {
  const cam = camera.position;

  spheres.forEach((s) => {
    if (!s) return;

    const dx = s.position.x - cam.x;
    const dy = s.position.y - cam.y;
    const dz = s.position.z - cam.z;

    const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);

    // float motion
    s.position.y += Math.sin(Date.now() * 0.001 + s.position.x) * 0.002;

    // attraction
    if (dist < 6) {
      s.position.x -= dx * 0.01;
      s.position.y -= dy * 0.01;
      s.position.z -= dz * 0.01;
    }

    // grow over time
    s.userData.baseScale += 0.002;
    s.scale.setScalar(s.userData.baseScale);

    // collect
    if (dist < 0.8) {
      scene.remove(s);
    }
  });
}

// ---------------- WORLD ----------------
function updateWorld(progress) {
  const total = modelPaths.length;
  const scaled = progress * total;

  const index = Math.floor(scaled);

  if (index !== currentModelIndex) {
    currentModelIndex = index;
  }

  models.forEach((m, i) => {
    if (!m) return;

    m.visible = i === index;

    // ALL MODELS SAME SIZE NOW
    m.scale.set(0.6, 0.6, 0.6);
  });

  particles.material.opacity = 0.2 + progress * 0.6;

  camera.position.x = Math.sin(progress * Math.PI * 2) * 2;
  camera.position.y = progress * 3;
  camera.position.z = 6 - progress * 10;
  camera.lookAt(0, 0, 0);
}

// ---------------- LOOP ----------------
function animate() {
  requestAnimationFrame(animate);

  currentScroll += (targetScroll - currentScroll) * 0.08;

  const maxScroll = document.body.scrollHeight - window.innerHeight;
  const progress = maxScroll ? currentScroll / maxScroll : 0;

  updateParticles();
  updateSpheres();
  updateWorld(progress);

  renderer.render(scene, camera);
}

animate();

// ---------------- RESIZE ----------------
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});