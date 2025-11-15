import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.152.2/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.152.2/examples/jsm/controls/OrbitControls.js';

const canvas = document.getElementById('c');
const renderer = new THREE.WebGLRenderer({canvas, antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio || 1);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

const camera = new THREE.PerspectiveCamera(50, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0,1.6,3);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0,1,0);

const light = new THREE.HemisphereLight(0xffffee, 0x080820, 1.2);
scene.add(light);

const loader = new GLTFLoader();
let avatars = [];

// Funzione per aggiungere avatar
async function addAvatar() {
  const gltf = await loader.loadAsync('models/avatar.glb'); // Metti qui il tuo file
  const model = gltf.scene.clone();
  model.position.x = avatars.length * 1.4 - 1.4;
  model.scale.set(1,1,1);
  scene.add(model);
  avatars.push(model);
  document.getElementById('status').innerText = 'Personaggi: ' + avatars.length;
}

// Funzione per rimuovere ultimo avatar
function removeAvatar() {
  const last = avatars.pop();
  if(last) {
    scene.remove(last);
    document.getElementById('status').innerText = 'Personaggi: ' + avatars.length;
  }
}

// Placeholder scena successiva (puoi poi implementare storyboard)
function nextScene() {
  console.log("Cambio scena...");
  // qui aggiungerai logica per modificare animazioni e posizione personaggi
}

// Animazione
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

// Eventi UI
document.getElementById('add').onclick = addAvatar;
document.getElementById('remove').onclick = removeAvatar;
document.getElementById('nextScene').onclick = nextScene;

// Registrazione video
document.getElementById('record').onclick = async () => {
  const stream = canvas.captureStream(30);
  const rec = new MediaRecorder(stream, {mimeType:'video/webm;codecs=vp9'});
  const chunks = [];
  rec.ondataavailable = e => { if(e.data.size) chunks.push(e.data); };
  rec.onstop = () => {
    const blob = new Blob(chunks, {type:'video/webm'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'scene.webm';
    a.click();
    URL.revokeObjectURL(url);
  };
  rec.start();
  setTimeout(()=>rec.stop(), 10000);
};

// Resize
window.addEventListener('resize', ()=>{
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
