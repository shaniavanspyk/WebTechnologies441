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


// ---------------- GLB MODEL ----------------
let model;


const loader = new THREE.GLTFLoader();


loader.load("./models/model.glb", (gltf) => {
  model = gltf.scene;
  model.scale.set(0.6, 0.6, 0.6);
  model.position.set(0, -1, 0);
  scene.add(model);
});


// ---------------- PARTICLES ----------------
const particleCount = 1200;
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
  opacity: 0.7
});


const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);


// ---------------- CHAPTERS ----------------
const chapters = [
  { fog: 0.015, color: 0x0f172a, light: 1.2 },
  { fog: 0.03, color: 0x1e1b4b, light: 1.5 },
  { fog: 0.05, color: 0x4c1d95, light: 1.8 },
  { fog: 0.02, color: 0x000000, light: 0.8 }
];


// ---------------- SCROLL ----------------
let targetScroll = 0;
let currentScroll = 0;


window.addEventListener("scroll", () => {
  targetScroll = window.scrollY;
});


// ---------------- CAMERA + WORLD UPDATE ----------------
function updateWorld(progress) {
  const chapterIndex = Math.min(
    chapters.length - 1,
    Math.floor(progress * chapters.length)
  );


  const chapter = chapters[chapterIndex];


  // 🌫 fog
  scene.fog.density += (chapter.fog - scene.fog.density) * 0.05;


  // 🎨 background
  scene.background.lerp(new THREE.Color(chapter.color), 0.02);


  // 💡 light
  keyLight.intensity += (chapter.light - keyLight.intensity) * 0.05;


  // 🎥 camera path
  camera.position.x = Math.sin(progress * Math.PI * 2) * 2;
  camera.position.y = progress * 3;
  camera.position.z = 6 - progress * 10;


  camera.lookAt(0, 0, 0);


  // 🧍 MODEL DISAPPEAR EFFECT
  if (model) {
    // fade out as you scroll
    const fadeStart = 0.4;
    const fadeEnd = 0.8;


    let opacity = 1;


    if (progress > fadeStart) {
      opacity = 1 - (progress - fadeStart) / (fadeEnd - fadeStart);
      opacity = Math.max(0, opacity);
    }


    model.traverse((child) => {
      if (child.material) {
        child.material.transparent = true;
        child.material.opacity = opacity;
      }
    });


    // subtle float
    model.position.y = -1 + Math.sin(currentScroll * 0.002) * 0.3;
  }


  // ✨ PARTICLES BECOME MORE IMPORTANT
  particles.material.opacity = 0.3 + progress * 0.7;
  particles.rotation.y += 0.0005;
  particles.rotation.x += 0.0002;
}


// ---------------- ANIMATION ----------------
function animate() {
  requestAnimationFrame(animate);


  currentScroll += (targetScroll - currentScroll) * 0.08;


  const maxScroll =
    document.body.scrollHeight - window.innerHeight;


  const progress = currentScroll / maxScroll;


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
