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
const ambient = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambient);

const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
keyLight.position.set(5, 5, 5);
scene.add(keyLight);


let score = 0;
let energy = 0;
let level = 0;
const maxEnergy = 120;

const ui = document.createElement("div");
ui.style.position = "fixed";
ui.style.top = "20px";
ui.style.left = "20px";
ui.style.color = "white";
ui.style.fontFamily = "monospace";
ui.style.zIndex = "10";
document.body.appendChild(ui);

function updateUI() {
  ui.innerHTML = `
  `;
}

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

    m.traverse((child) => {
      if (child.material) {
        child.material.transparent = true;
        child.material.opacity = 1;
      }
    });

    scene.add(m);
    models[index] = m;
  });
});

// ---------------- PARTICLES ----------------
const particleCount = 1500;
const positions = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 20;
}

const particlesGeometry = new THREE.BufferGeometry();
particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);

const particlesMaterial = new THREE.PointsMaterial({
  size: 0.03,
  color: 0xffffff,
  transparent: true,
  opacity: 0.3
});

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

// ---------------- SCROLL ----------------
let targetScroll = 0;
let currentScroll = 0;

window.addEventListener("scroll", () => {
  targetScroll = window.scrollY;
});

// =====================================================
// VORTEX MECHANIC
// =====================================================
const temp = new THREE.Vector3();

function updateParticles() {
  const pos = particles.geometry.attributes.position;

  for (let i = 0; i < pos.count; i++) {
    const ix = i * 3;

    let x = pos.array[ix];
    let y = pos.array[ix + 1];
    let z = pos.array[ix + 2];

    const mx = mouse.x * 5;
    const my = mouse.y * 5;

    const dx = mx - x;
    const dy = my - y;

    const dist = Math.sqrt(dx * dx + dy * dy);

    // vortex pull
    if (dist < 3.5) {
      pos.array[ix] += dx * 0.02;
      pos.array[ix + 1] += dy * 0.02;

      
      if (dist < 0.4) {
        score += 10;
        energy += 2;

        // respawn particle
        pos.array[ix] = (Math.random() - 0.5) * 20;
        pos.array[ix + 1] = (Math.random() - 0.5) * 20;
        pos.array[ix + 2] = (Math.random() - 0.5) * 20;
      }
    }
  }

  pos.needsUpdate = true;
}

// =====================================================
// (scroll +  merge)
// =====================================================
function updateWorld(progress) {

  const total = modelPaths.length;
  const scaled = progress * total;

  const modelIndex = Math.floor(scaled);
  const localProgress = scaled - modelIndex;

  if (modelIndex !== currentModelIndex) {
    currentModelIndex = modelIndex;
    level = modelIndex;
    energy = 0;
  }

  models.forEach((m, i) => {
    if (!m) return;

    m.visible = (i === modelIndex);

    let opacity = 1;

    if (i === modelIndex && localProgress > 0.6) {
      opacity = 1 - (localProgress - 0.6) / 0.4;
    }

    if (i === modelIndex + 1 && localProgress > 0.6) {
      m.visible = true;
      opacity = (localProgress - 0.6) / 0.4;
    }

    m.traverse((child) => {
      if (child.material) {
        child.material.opacity = opacity;
      }
    });

    let scale = 0.6;
    if (i === 1) scale = 0.35;

    m.scale.set(scale, scale, scale);
  });

  
  if (energy > maxEnergy) {
    energy = 0;
    particles.material.size *= 1.05;
  }

  
  particles.material.opacity = 0.25 + (energy / maxEnergy) * 0.6;

  particles.rotation.y += 0.002;
  particles.rotation.x += 0.001;

  // ---------------- CAMERA ----------------
  camera.position.x = Math.sin(progress * Math.PI * 2) * 2;
  camera.position.y = progress * 3;
  camera.position.z = 6 - progress * 10;
  camera.lookAt(0, 0, 0);
}

// =====================================================
//  ANIMATION LOOP
// =====================================================
function animate() {
  requestAnimationFrame(animate);

  currentScroll += (targetScroll - currentScroll) * 0.08;

  const maxScroll =
    document.body.scrollHeight - window.innerHeight;

  const progress = maxScroll > 0 ? currentScroll / maxScroll : 0;

  updateParticles();
  updateWorld(progress);
  updateUI();

  renderer.render(scene, camera);
}

animate();

// ---------------- RESIZE ----------------
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});