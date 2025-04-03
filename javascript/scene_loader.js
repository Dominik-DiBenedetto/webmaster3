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
    camera.position.set(0.8, 1.4, 1.0)

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
    controls.target.set(0, 1, 0)

    window.addEventListener('resize', onWindowResize, false)
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        render();
    }

    function animate() { // render loop
        requestAnimationFrame(animate);
        controls.update();
        render();
    }

    function render() {
        renderer.render(scene, camera);
    }

    animate();

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

export function loadModel(modelName, scene, position=[0,0,0], scale=[1,1,1])
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
                    }
                })
                mesh.position.set(...position);
                object.scale.set(...scale)
                scene.add(object)
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
            },
            (error) => {
                console.log(error)
            }
        )
    } else {
        console.log(modelName)
        glbLoader.load(modelName, (model) => {
            console.log(model);
            console.log(model.scene);
            const mesh = model.scene;
            mesh.traverse(function (child) {
                if (child.isMesh) {
                    // child.material = material
                    if (child.material) {
                        child.material.transparent = false
                    }
                } else if (child.isLight) {
                    child.intensity = 20;
                    console.log(child)
                }
            })
            mesh.position.set(...position);
            mesh.scale.set(...scale);
            scene.add(mesh)
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
        },
        (error) => {
            console.log(error)
        }
    );
    }
}

// Other functions

// Resize scene
