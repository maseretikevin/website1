import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

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
const loader = new GLTFLoader();
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
// Function to calculate the difference in years
function diff_years(dt2, dt1) {
  let diff = (dt2 - dt1) / 1000 / 60 / 60 / 24 / 365.25; // Calculate in years
  return Math.abs(Math.round(diff)); // Return the absolute value and round it
}
const dt1 = new Date(2019, 2, 28); // Feb 28, 2019

// Calculate the difference in years
const yearDifference = diff_years(new Date(), dt1);
// Assign yearDifference to the data-purecounter-end attribute of the element with id 'elapsed'
const elapsedElement = document.getElementById("elapsed");

if (elapsedElement) {
  elapsedElement.setAttribute("data-purecounter-end", yearDifference);
} else {
  alert('Element with ID "elapsed" not found');
}
// const yearSpan = document.getElementById("elapsed");
// yearSpan.textContent = 3;
//gltf file
// Instantiate a loader
// console.log("public / models / low_poly_mountain_free / scene.gltf");
loader.load(
  "public/models/low_poly_mountain_free/scene.gltf",
  function (gltf) {
    scene.add(gltf.scene);

    // gltf.animations; // Array<THREE.AnimationClip>
    // gltf.scene; // THREE.Group
    // gltf.scenes; // Array<THREE.Group>
    // gltf.cameras; // Array<THREE.Camera>
    // gltf.asset; // Object
  },
  // called while loading is progressing
  function (xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  // called when loading has errors
  function (error) {
    console.log("An error happened");
  }
);

//ground
const mesh = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshPhongMaterial({ color: 0xcbcbcb, depthWrite: false })
);
mesh.rotation.x = -Math.PI / 2;
mesh.receiveShadow = true;

//add light
const light = new THREE.AmbientLight(0x404040, 3);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
scene.add(directionalLight);
scene.add(light);
scene.add(mesh);

const geometry = new THREE.SphereGeometry(12, 32, 16);
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
