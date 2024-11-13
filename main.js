import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';





const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
scene.add( directionalLight );

const light = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( light );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

scene.background = new THREE.Color(0xb68bcb);

const controls = new OrbitControls(camera, renderer.domElement);


const geometry = new THREE.SphereGeometry(2, 32, 16 );
const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
const sphere = new THREE.Mesh( geometry, material );
sphere.position.set( 4, -3.5 ,20);
scene.add( sphere );

const geometry1 = new THREE.PlaneGeometry(200, 200);
const material1 = new THREE.MeshBasicMaterial({ color: 0x8e44ad, side: THREE.DoubleSide });
const plane = new THREE.Mesh(geometry1, material1);
plane.rotation.x = -Math.PI / 2;
plane.position.y = -5.6;
scene.add(plane);

const loader = new GLTFLoader();
let gpost;
loader.load( 'fb.glb', function ( gltf ) {
    console.log('Model loaded successfully');
    gpost = gltf.scene;
    gltf.scene.scale.set(30, 20, 30);
	gpost.position.set(4,1,-50);

    gpost.traverse((node) => {
        if (node.isMesh) {
            // Apply a new material with the desired color to each mesh
            node.material = new THREE.MeshStandardMaterial({ color: 0xff5733 }); // Example color: orange
        }
    })
    scene.add( gltf.scene );

}, undefined, function ( error ) {

    console.error( error );

} );

camera.position.set(0, 30, 75);
camera.lookAt(0, 20, 0);

document.addEventListener('keydown',(e)=>{
    if(sphere)
    {
        switch(e.key)
        {
            case 'ArrowUp':
                sphere.position.z -= 2;
                sphere.rotation.x -= 0.1;
                break;
            case 'ArrowDown':
                sphere.position.z += 2;
                sphere.rotation.x += 0.1;
                break;
            case 'ArrowLeft':
                sphere.position.x -= 2;
                sphere.rotation.z -= 0.1;
                break;
            case 'ArrowRight':
                sphere.position.x += 2;
                sphere.rotation.z += 0.1;
                break;
        }
    }
	
});

function animate() {
	
    controls.update();
	renderer.render( scene, camera );

}