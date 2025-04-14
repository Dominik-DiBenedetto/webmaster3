import { init, loadModel } from "./scene_loader";
import * as THREE from 'three';
import modelUrl from "../models/Salad bar2.gltf";
import plateStack from "../models/platestacks.glb";
import plateUrl from "../models/plate.glb";
import tongUrl from "../models/tongs.glb";
import trayUrl from "../models/tray.glb";
import lettuceUrl from "../models/lettuce.glb";
const [scene, camera, renderer, controls] = init(window.innerWidth, window.innerHeight, document.body);

// Objects
let plate, tongs, leftTong, rightTong = null;

// Building
loadModel(modelUrl, scene, document.querySelector(".loading-progress"));
loadModel(plateStack, scene, null, [2.324, 0.993, 1.425], [0.2,0.2,0.2]);
loadModel(plateUrl, scene, null, [2.324, 1.029, 1.425], [0.2,0.2,0.2]);
loadModel(tongUrl, scene, null, [2.324, 1.029, 1.425], [0.2,0.2,0.2]);

loadModel(trayUrl, scene, null, [1.5,1.06,0.1], [0.035,0.035,.035])
loadModel(trayUrl, scene, null, [0.75,1.06,0.1], [0.035,0.035,.035])
loadModel(trayUrl, scene, null, [0,1.06,0.1], [0.035,0.035,.035])
loadModel(trayUrl, scene, null, [-0.75,1.06,0.1], [0.035,0.035,.035])

loadModel(lettuceUrl, scene, null, [1.5,1.06,0.1], [0.05,0.05,.05])

// LIGHTING \\
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

/* Movement */
let clock = new THREE.Clock();
let moveSpeed = 10;
let rotateSpeed = Math.PI / 2;
let cameraPosition = new THREE.Vector3(8.25, 1.5, 1.75);
let cameraRotation = new THREE.Vector3(0, 89.6, 0);

let platePos = new THREE.Vector3(2.324, 1.029, 1.425);
let tongRot = new THREE.Vector3(45,0,0);
let leftTongRot = new THREE.Vector3(0,0,0);
let rightTongRot = new THREE.Vector3(0,0,0);
const tongOpenSpeed = Math.PI / 4;
const tongCloseRotPos = 0.25;

const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
const plane = new THREE.Plane(new THREE.Vector3(0,0,1), 0);


// State
let order = {}
let keysPressed = {}
let shouldCloseTongs = false;

let mousePosX, mousePosY = 0;

// Funcs

function handleKeyboardInput(delta) {
    if (keysPressed['w']) {
      cameraPosition.x -= moveSpeed * delta;
    }
    if (keysPressed['s']) {
      cameraPosition.x += moveSpeed * delta;
    }
    if (keysPressed['a']) {
      cameraRotation.y += rotateSpeed * delta;
    }
    if (keysPressed['d']) {
      cameraRotation.y -= rotateSpeed * delta;
    }

    if (cameraPosition.x <= -12.94) cameraPosition.x = -12.94;
    if (cameraPosition.x >= 8.2) cameraPosition.x = 8.2;
    camera.position.copy(cameraPosition);
    camera.rotation.setFromVector3(cameraRotation);
    if (camera.position.x < 2.324 && camera.position.x > -2.4) {
      platePos.x = camera.position.x;
      if (plate != null) plate.position.copy(platePos);
    }
  }

function handleTongs(delta)
{
  if (leftTong == null || rightTong == null) return;
  if (shouldCloseTongs){
    leftTongRot.y += tongOpenSpeed*delta;
    leftTongRot.y = Math.min(tongCloseRotPos, leftTongRot.y)
    leftTong.rotation.setFromVector3(leftTongRot)

    rightTongRot.y -= tongOpenSpeed*delta;
    rightTongRot.y = Math.max(-tongCloseRotPos, rightTongRot.y)
    rightTong.rotation.setFromVector3(rightTongRot)
  } else {
    leftTongRot.y -= tongOpenSpeed*delta;
    leftTongRot.y = Math.max(0, leftTongRot.y)
    leftTong.rotation.setFromVector3(leftTongRot)

    rightTongRot.y += tongOpenSpeed*delta;
    rightTongRot.y = Math.min(0, rightTongRot.y)
    rightTong.rotation.setFromVector3(rightTongRot)
  }
  followMouse()
}

window.addEventListener("keydown", (e) => {
    keysPressed[e.key] = true;
    if (plate == null) plate = scene.getObjectByName("plate");
    
})

window.addEventListener("keyup", (e) => {
    keysPressed[e.key] = false;
})

function followMouse()
{
  mouse.x = (mousePosX / window.innerWidth) * 2 - 1;
  mouse.y = -(mousePosY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse,camera);

  const intersectPoint = new THREE.Vector3();
  raycaster.ray.intersectPlane(plane, intersectPoint);

  // If there is an intersection, update the model's position
  if (intersectPoint) {
    if (tongs == null) {tongs = scene.getObjectByName("tongs"); tongs.rotation.setFromVector3(tongRot)};
    intersectPoint.z = 0.25;
    tongs.position.copy(intersectPoint);
  }
}

window.addEventListener("mousemove", (e) => {
  mousePosX = e.clientX;
  mousePosY = e.clientY;
})

window.addEventListener("mousedown", (e) => {
  if (leftTong == null || rightTong == null) {
    tongs = scene.getObjectByName("tongs");
    tongs.rotation.setFromVector3(tongRot);
    leftTong = tongs.children[0];
    rightTong = tongs.children[1];
  }
  shouldCloseTongs = true;
})

window.addEventListener("mouseup", (e) => {
  shouldCloseTongs = false;
})


function animate() { // render loop
    let delta = clock.getDelta();
    requestAnimationFrame(animate);
    controls.update(delta);
    handleKeyboardInput(delta);
    handleTongs(delta);
    render();
}

function render() {
    renderer.render(scene, camera);
}

animate();