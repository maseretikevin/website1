import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";

let container;
let camera, scene, renderer;
const hdriLoader = new RGBELoader();
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

//env
const pmremGenerator = new THREE.PMREMGenerator(renderer);
hdriLoader.load(
  "https://skybox.blockadelabs.com/e/fa00372073d38aca126654ff000ecebc",
  function (texture) {
    const envMap = pmremGenerator.fromEquirectangular(texture).texture;
    texture.dispose();
    scene.environment = envMap;
  }
);
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
  "/models/low_poly_mountain_free/scene.gltf",
  function (gltf) {
    scene.add(gltf.scene);

    // Center model
    const bbox = new THREE.Box3().setFromObject(model);
    const center = bbox.getCenter(new THREE.Vector3());
    model.position.sub(center);

    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    // controls.enableRotate = false;
    // controls.enableZoom = true;
    controls.rotateSpeed = 1.0; //rotation speed
    controls.zoomSpeed = 1.2; //zoom speed
    controls.maxPolarAngle = Math.PI / 2;
    controls.minDistance = 3;
    controls.maxDistance = 5;
    controls.enableDamping = true;
    controls.dampingFactor = 0.25; //0.05

    function render() {
      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }
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
  new THREE.PlaneGeometry(100, 100),
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

const geometry = new THREE.SphereGeometry(150, 32, 16);
const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

camera.position.z = 8;
camera.position.x = 3;
camera.position.y = 5;
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
