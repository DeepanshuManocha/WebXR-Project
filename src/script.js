import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Water } from "three/examples/jsm/objects/Water.js";

const scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(
  90,
  window.innerWidth / window.innerHeight,
  0.01,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.maxPolarAngle = Math.PI * 0.495;
controls.target.set(0, 10, 0);
controls.minDistance = 40.0;
controls.maxDistance = 200.0;
controls.enableZoom = false;
controls.enablePan = false;
controls.update();

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(-1, 2, 4);
scene.add(light);

window.addEventListener("resize", function () {
  let aspectRatio = window.innerWidth / window.innerHeight;
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = aspectRatio;
  camera.updateProjectionMatrix();
});

let water;

// set water geometry
const waterGeometry = new THREE.PlaneGeometry(550, 550);

//water
water = new Water(waterGeometry, {
  textureWidth: 512,
  textureHeight: 512,
  waterNormals: new THREE.TextureLoader().load(
    "../Textures/waternormals.jpg",
    function (texture) {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    }
  ),
  alpha: 1.0,
  waterColor: 0x74ccf4,
  distortionScale: 3.7,
  fog: scene.fog !== undefined,
});
water.rotation.x = -Math.PI / 2;
scene.add(water);

//skybox
let materialArray = [
  "Skybox/valley_ft.jpg",
  "Skybox/valley_bk.jpg",
  "Skybox/valley_up.jpg",
  "Skybox/valley_dn.jpg",
  "Skybox/valley_rt.jpg",
  "Skybox/valley_lf.jpg",
];
let cubeTextureLoader = new THREE.CubeTextureLoader();
let skyBox = cubeTextureLoader.load(materialArray);
scene.background = skyBox;

function animate() {
  requestAnimationFrame(animate);
  render();
}

function render() {
  const time = performance.now() * 0.001;
  water.material.uniforms["time"].value += 1.0 / 60.0;
  renderer.render(scene, camera);
}

animate();
