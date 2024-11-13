import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );
const controls = new OrbitControls( camera, renderer.domElement );

const trunk_geometry = new THREE.CylinderGeometry( 1, 1, 4, 64 ); 
const trunk_material = new THREE.MeshBasicMaterial( {color: 0xffffbb} ); 
const cylinder = new THREE.Mesh( trunk_geometry, trunk_material ); 
scene.add( cylinder );
cylinder.position.y =1;

let i=0;
let apples=[];
for(i=0;i<20;i++){
    const apple_geometry = new THREE.SphereGeometry( 0.1, 32, 32 ); 
    const apple_material = new THREE.MeshBasicMaterial( { color: 0xff0000 } ); 
    const apple = new THREE.Mesh( apple_geometry, apple_material );
    scene.add( apple );


 apple.position.set(Math.random()*10 -5,2.1,Math.random()*10 -5);
 apple.collected = false; // New flag
 apples.push(apple);
}

const bucket_geometry = new THREE.CylinderGeometry( 0.5, 0.5, 0.8, 50 ); 
const bucket_material = new THREE.MeshBasicMaterial( {color: 0xffff00} ); 
const bucket = new THREE.Mesh( bucket_geometry, bucket_material ); 
scene.add( bucket );
bucket.position.y = -0.5;
bucket.position.z = 2;


const leave_geometry = new THREE.ConeGeometry( 7, 1, 32 ); 
const leave_material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
const leave = new THREE.Mesh(leave_geometry, leave_material ); 
scene.add( leave );
leave.position.y =3;

const geometry = new THREE.BoxGeometry( 20, 0.1, 20 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ffff } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );
cube.position.y=-1;

camera.position.z = 5;
let score =0;
//let count =0;
function animate() {


    apples.forEach((apple, index) => {
        setTimeout(() => {
           // setInterval(() => {
                apple.position.y -= 0.001;
                if(!apple.collected && bucket.position.distanceTo(apple.position)<0.8)
                    {
                        scene.remove(apple);
                        score +=5;
                        apple.collected =true;
                    }
                
           // }, 1000);
        }, index * 2000);
        
       // Delay each apple's fall by 2 seconds multiplied by its index
    });

    document.getElementById("score").innerHTML="score="+score;
	//cube.rotation.x += 0.01;
	//cube.rotation.y += 0.01;
    controls.update();
	renderer.render( scene, camera );

}

document.addEventListener('keydown',(e)=>{
    if(bucket)
    {
        switch(e.key)
        {
            case 'ArrowUp':
                bucket.position.z -= 0.1;
                
                break;
            case 'ArrowDown':
                bucket.position.z += 0.1;
                
                break;
            case 'ArrowLeft':
                bucket.position.x -= 0.1;
                
                break;
            case 'ArrowRight':
                bucket.position.x += 0.1;
                
                break;
        }
    }
	
});