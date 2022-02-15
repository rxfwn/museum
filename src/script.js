import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import gsap from 'gsap'
import * as dat from 'lil-gui'
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';

//Character controller 
class BasicCharacterController {
    constructor() {
        this._input = new BasicCharacterControllerInput();
        this._stateMachine = new FiniteStateMachine(new BasicCharacterControllerProxy(this));

        this._LoadModels();
    }
};

class BasicCharacterControllerInput {
    constructor(){

    }
};

class FiniteStateMachine{
    constructor()
    {

    }
};

//ADDING DEBUG 
const gui =  new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//Object
 
const geometry = new THREE.PlaneGeometry(7,7 )
const material = new THREE.MeshBasicMaterial({ color: 0x191919 })
const mesh = new THREE.Mesh(geometry, material)

mesh.rotation.x = Math.PI * -0.5

scene.add(mesh)

//Character Loader
const gltfLoader = new GLTFLoader()

gltfLoader.load(
    '/models/Bear/Bear.gltf',
    (gltf) =>
    {
        scene.add(gltf.scene.children[0])
    }
    
)


// Light
const ambientLight = new THREE.AmbientLight()
ambientLight.color = new THREE.Color(0xffffff)
ambientLight.intensity = 1
scene.add(ambientLight)

//Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    document.body.appendChild( VRButton.createButton( renderer ) );
    renderer.xr.enabled = true;
})


// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.minDistance = 1
controls.maxDistance = 10
controls.enablePan = false
controls.maxPolarAngle = Math.PI / 2 -0.10
controls.update();

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()