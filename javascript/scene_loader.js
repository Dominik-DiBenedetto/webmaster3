import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';


// Scene Initialization

export function init(width, height, parent, fov=75){
    const scene = new THREE.Scene();
    scene.add(new THREE.AxesHelper(5))

    // Add global hemisphere light and camera
    // const light = new THREE.HemisphereLight(0xffffff, 25)
    // scene.add(light)

    const camera = new THREE.PerspectiveCamera(fov, width/height, 0.1, 1000);
    camera.position.set(0, 1.5, 0)

    // Configure renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000);
    renderer.setPixelRatio(window.devicePixelRatio);

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = 0;
    renderer.toneMappingExposure = 1;
    renderer.toneMapping = THREE.NoToneMapping;

    parent.appendChild(renderer.domElement);

    // Add orbital controls so we can move around
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.target.set(0, 0, 0);

    window.addEventListener('resize', onWindowResize, false)
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        render();
    }

    function render() {
        renderer.render(scene, camera);
    }

    return [scene, camera, renderer, controls]
}

function onTransitionEnd( event ) {
    const element = event.target;
    element.remove();
}

// Loading manager is used to easily implement loading screens
const loadingManager = new THREE.LoadingManager( () => {
	
    const loadingScreen = document.querySelector('.loading-screen');
    loadingScreen.classList.add('fade-out');
    
    // optional: remove loader from DOM via event listener
    loadingScreen.addEventListener( 'transitionend', onTransitionEnd );
    
});

// Load Objects

const fbxLoader = new FBXLoader(loadingManager);
const glbLoader = new GLTFLoader(loadingManager);

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.7/");
dracoLoader.setDecoderConfig({ type: "js" });

glbLoader.setDRACOLoader(dracoLoader);

function degToRadians(rot){
    let rads = [];
    for (let i=0; i<rot.length; i++){
        rads.push(rot[i]*Math.PI/180)
    }
    return rads;
}

export function loadModel(modelName, scene, loadingProg=null, position=[0,0,0], scale=[1,1,1], rotation=[0,0,0], shouldZeroChildren=false)
{
    if (modelName.includes("fbx")) {
        fbxLoader.load(
            `../models/${modelName}`,
            (object) => {
                object.traverse(function (child) {
                    if (child.isMesh) {
                        // child.material = material
                        if (child.material) {
                            child.material.transparent = false
                        }
                        child.position.set(0,0,0);
                    }
                })
                mesh.position.set(...position);
                object.scale.set(...scale)
                scene.add(object)
            },
            (xhr) => {
                if (loadingProg){
                    loadingProg.innerText = `${(xhr.loaded / xhr.total) * 100}% loaded`;
                } else {
                    console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
                }
            },
            (error) => {
                console.log(error)
            }
        )
    } else {
        console.log(modelName)
        glbLoader.load(modelName, (model) => {
            const mesh = model.scene;
            mesh.traverse(function (child) {
                if (child.isMesh) {
                    // child.material = material
                    if (child.material) {
                        child.material.transparent = false
                    }
                    if (shouldZeroChildren){
                        child.traverse(function (subchild) {
                            if (subchild.isMesh) {
                                subchild.position.set(0,0,0);
                                subchild.scale.set(1,1,1);
                                subchild.rotation.set(0,0,0);
                            };
                        })
                    }
                } else if (child.isLight) {
                    child.intensity = 15;
                    
                }
            })
            let sceneName = modelName.split("/");
            sceneName = sceneName[sceneName.length-1].split(".")[0].split("-")[0];

            mesh.name = sceneName;
            mesh.position.set(...position);
            mesh.scale.set(...scale);
            mesh.rotation.set(...degToRadians(rotation));

            scene.add(mesh)
        },
        (xhr) => {
            if (loadingProg){
                loadingProg.innerText = `${Math.round(((xhr.loaded / xhr.total) * 100)*100)/100}% loaded`;
            } else {
                console.log(modelName + " " + (xhr.loaded / xhr.total) * 100 + '% loaded');
            }
        },
        (error) => {
            console.log(error)
        }
    );
    }
}

// Other functions

// Resize scene
