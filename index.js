import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";

let container;
let camera, scene, renderer;

scene = new THREE.Scene();
scene.background = new THREE.Color(0xbaeaf3);
camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

renderer = new THREE.WebGLRenderer();
// //implement orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;
renderer.setSize(window.innerWidth, window.innerHeight);

//basic javascript

//identify div to render
container = document.getElementById("modeling");
if (container) {
  container.appendChild(renderer.domElement);
} else {
  console.error('Element with ID "modeling" not found');
}
//autopopulate year span
// Get the current year
const currentYear = new Date().getFullYear();

// Calculate the difference
const yearDifference = currentYear - 2019;
console.log(currentYear);
// Update the span element with the calculated value
const yearSpan = document.getElementById("elapsed");
yearSpan.textContent = yearDifference;

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;
function animate() {
  renderer.render(scene, camera);
  controls.update();
}
renderer.setAnimationLoop(animate);

function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", handleWindowResize, false);
