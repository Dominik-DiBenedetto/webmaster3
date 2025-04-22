import { init, loadModel } from "./scene_loader";
import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';

import modelUrl from "../models/Salad bar2.gltf";
import plateStack from "../models/platestacks.glb";
import plateUrl from "../models/plate.glb";
import tongUrl from "../models/tongs.glb";
import trayUrl from "../models/tray.glb";
import lettuceUrl from "../models/lettuce.glb";
import containerUrl from "../models/container.glb";
import croutonUrl from "../models/croutons.glb";
import dressingsUrl from "../models/dressings.glb";
import pepperUrl from "../models/peppers.glb";
import tomatoesUrl from "../models/tomatoes.glb";

const [scene, camera, renderer, controls] = init(window.innerWidth, window.innerHeight, document.body);

const ORDER_DIV = document.querySelector(".order-frame");

// Objects
let plate, tongs, leftTong, rightTong = null;

// Building
loadModel(modelUrl, scene, document.querySelector(".loading-progress"));
loadModel(plateStack, scene, null, [2.324, 0.993, 1.425], [0.2,0.2,0.2]);
loadModel(plateUrl, scene, null, [2.324, 1.029, 1.425], [0.2,0.2,0.2]);
loadModel(tongUrl, scene, null, [2.324, 1.029, 1.425], [0.2,0.2,0.2]);

// Food Trays
loadModel(trayUrl, scene, null, [1.5,1.06,0.1], [0.035,0.035,.035])
loadModel(trayUrl, scene, null, [0.75,1.06,0.1], [0.035,0.035,.035])
loadModel(trayUrl, scene, null, [0,1.06,0.1], [0.035,0.035,.035])
loadModel(trayUrl, scene, null, [-0.75,1.06,0.1], [0.035,0.035,.035])

loadModel(containerUrl, scene, null, [-1.721, 1.130, 0], [0.098, 0.077, 0.155], undefined, true);
loadModel(containerUrl, scene, null, [-1.468, 1.130, 0], [0.098, 0.077, 0.155], undefined, true);

// Food
loadModel(lettuceUrl, scene, null, [1.5,1.06,0.1], [0.05,0.05,.05])
loadModel(dressingsUrl, scene, null, [-1.981, 1, -.6], [.25, .25, .25], [0,-90,0], true);
loadModel(tomatoesUrl, scene, null, [0.75,1.1,0.3], [0.0015,0.0015,0.0015], undefined,true);
loadModel(croutonUrl, scene, null, [0,1.1,0.25], [0.005,0.005,0.005], undefined,true);

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

let tongTween, foodTween;
const tongRaycaster = new THREE.Raycaster();
const tongRaycastDir = new THREE.Vector3(0, -0.5, 0);

const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
const plane = new THREE.Plane(new THREE.Vector3(0,0,1), 0);

let foods = []
let foodOffsets = {
  "lettuce": {x: 0.15, y: 0.05, z: -0.85},
  "tomatoes": {x: 0, y: 0.05, z: -0.75},
  "croutons": {x: 0, y: 0.1, z: -0.7},
}

// State
let order = {}
let keysPressed = {}

let shouldCloseTongs = false;
let grabbingFood = false;

let mousePosX, mousePosY = 0;

// Funcs

function handleKeyboardInput(delta) {
    if (keysPressed['w'] && !grabbingFood) {
      cameraPosition.x -= moveSpeed * delta;
    }
    if (keysPressed['s'] && !grabbingFood) {
      cameraPosition.x += moveSpeed * delta;
    }
    if (keysPressed['a'] && !grabbingFood) {
      cameraRotation.y += rotateSpeed * delta;
    }
    if (keysPressed['d'] && !grabbingFood) {
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
    foods.forEach((food) => {
      if (order[food.name]){
        food.position.copy(new THREE.Vector3().addVectors(platePos, order[food.name]));
      }
    })
  }

function checkForFood(){
  tongRaycaster.set(tongs.position, tongRaycastDir)
  let intersects = tongRaycaster.intersectObjects(foods);
  for (let i=0; i <intersects.length; i++) {
    console.log(intersects[i])
    return intersects[i].object;
  }
}

function handleTongs(delta)
{
  if (leftTong == null || rightTong == null) return;
  if (shouldCloseTongs){ /// close tongs "chomp"
    leftTongRot.y += tongOpenSpeed*delta;
    leftTongRot.y = Math.min(tongCloseRotPos, leftTongRot.y)
    leftTong.rotation.setFromVector3(leftTongRot)

    rightTongRot.y -= tongOpenSpeed*delta;
    rightTongRot.y = Math.max(-tongCloseRotPos, rightTongRot.y)
    rightTong.rotation.setFromVector3(rightTongRot)

    // pickup object
    if (rightTongRot.y == -tongCloseRotPos && !grabbingFood){
      let foodItem = checkForFood();
      if (foodItem == null) return;
      console.log(foodItem.parent.name)
      let offset = foodOffsets[foodItem.parent.name];
      
      foodTween = new TWEEN.Tween(foodItem.parent.position).to({ x: platePos.x+offset.x, y: platePos.y+offset.y, z: platePos.z+offset.y }, 500).easing(TWEEN.Easing.Cubic.In).start();
      
      tongTween = new TWEEN.Tween(tongs.position).to({ x: platePos.x, y: platePos.y+.2, z: platePos.z-0.8 }, 500).easing(TWEEN.Easing.Cubic.In).start().onComplete(() => {
        let tongMousePos = followMouse(tongs, true);
        order[foodItem.parent.name] = offset;
        createUIOrderItem(foodItem.parent.name);
        tongTween = new TWEEN.Tween(tongs.position).to({ x: tongMousePos.x, y: tongMousePos.y, z: tongMousePos.z }, 500).easing(TWEEN.Easing.Cubic.In).start().onComplete(() => {
          grabbingFood = false;
        });
      });

      grabbingFood = true;
    }
  } else {
    leftTongRot.y -= tongOpenSpeed*delta;
    leftTongRot.y = Math.max(0, leftTongRot.y)
    leftTong.rotation.setFromVector3(leftTongRot)

    rightTongRot.y += tongOpenSpeed*delta;
    rightTongRot.y = Math.min(0, rightTongRot.y)
    rightTong.rotation.setFromVector3(rightTongRot)
  }
  if (tongs == null) {tongs = scene.getObjectByName("tongs"); tongs.rotation.setFromVector3(tongRot)};
  followMouse(tongs)
}

window.addEventListener("keydown", (e) => {
    keysPressed[e.key] = true;
    if (plate == null) plate = scene.getObjectByName("plate");
    
})

window.addEventListener("keyup", (e) => {
    keysPressed[e.key] = false;
})

function followMouse(object, returnPos=false)
{
  if (object == null) return;
  if (object == tongs && grabbingFood && !returnPos) return;
  mouse.x = (mousePosX / window.innerWidth) * 2 - 1;
  mouse.y = -(mousePosY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse,camera);

  const intersectPoint = new THREE.Vector3();
  raycaster.ray.intersectPlane(plane, intersectPoint);

  // If there is an intersection, update the model's position
  if (intersectPoint) {
    intersectPoint.z = 0.25;
    if (!returnPos) object.position.copy(intersectPoint);
    else return intersectPoint;
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
  if (!grabbingFood) { 
    handleTongs(delta);
  }
  render();
  if (grabbingFood) {tongTween.update(); foodTween.update();}
  if (foods.length < Object.keys(foodOffsets).length) {
    if (foods.length < 1) {
      let lettuce = scene.getObjectByName("lettuce");
      if (lettuce == null) return;
      foods.push(lettuce);
    }
    if (foods.length < 2) {
      let tomatoes = scene.getObjectByName("tomatoes");
      if (tomatoes == null) return;
      foods.push(tomatoes);
    }
    if (foods.length < 3) {
      let croutons = scene.getObjectByName("croutons");
      if (croutons == null) return;
      foods.push(croutons);
    }
    console.log(foods)
  }
}

function render() {
    renderer.render(scene, camera);
}

animate();


// ORDER UI

let menu = {
  "lettuce": 0.99,
  "tomatoes": 1.39,
  "croutons": 0.49
};

function createUIOrderItem(itemName){
  let price = menu[itemName];
  if (price == null) {alert("invalid item?"); return;}
  let order = document.createElement("div");
  order.classList.add("order");

  let itemNameSpan = document.createElement("span");
  itemNameSpan.classList.add("item-name");
  itemNameSpan.textContent = itemName;

  let filler = document.createElement("span");
  filler.classList.add("item-filler");
  let filler2 = document.createElement("span");
  filler2.classList.add("item-filler");
  let filler3 = document.createElement("span");
  filler3.classList.add("item-filler");

  let itemPrice = document.createElement("span");
  itemPrice.classList.add("item-price");
  itemPrice.textContent = `$${price}`;

  let removeBtn = document.createElement("span");
  removeBtn.classList.add("remove-item");
  let xLogo = document.createElement("i");
  xLogo.classList.add("fa-solid");
  xLogo.classList.add("fa-x");
  removeBtn.appendChild(xLogo);

  order.appendChild(itemNameSpan);
  order.appendChild(filler);
  order.appendChild(filler2);
  order.appendChild(filler3);
  order.appendChild(itemPrice);
  order.appendChild(removeBtn);

  document.querySelector(".orders").appendChild(order);
  if (!ORDER_DIV.classList.contains("active")) ORDER_DIV.classList.add("active");
}

// Dragging
dragElement(ORDER_DIV);

function dragElement(elm) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  elm.querySelector(".header").onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;

    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elm.style.top = (elm.offsetTop - pos2) + "px";
    elm.style.left = (elm.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}