import { init, loadModel } from "./scene_loader";
import * as THREE from 'three';
const [scene, camera, renderer, controls] = init(window.innerWidth, window.innerHeight, document.body);
loadModel("Salad bar2.gltf", scene);

const paintingLight1 = new THREE.PointLight(0xF2DDC5, 1.92)
paintingLight1.position.set(-2.916, 2.58, -5.028);

const paintingLight2 = new THREE.PointLight(0xF2DDC5, 1.92)
paintingLight2.position.set(0.214, 2.58, -5.028);

const paintingLight3 = new THREE.PointLight(0xF2DDC5, 1.92)
paintingLight3.position.set(3.584, 2.58, -5.028);

scene.add(paintingLight1);
scene.add(paintingLight2);
scene.add(paintingLight3);

const extraSceneLightRight = new THREE.PointLight(0xFFFFFF, 20);
extraSceneLightRight.position.set(7.264, 2.243, 1.195);

const extraSceneLightLeft = new THREE.PointLight(0xFFFFFF, 20);
extraSceneLightLeft.position.set(-9.729, 2.243, -0.967);

scene.add(extraSceneLightRight);
scene.add(extraSceneLightLeft);