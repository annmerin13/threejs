// Import Three.js
import * as THREE from 'three';

// 1. Set up the scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 2. Create the arrow (player)
const arrowGeometry = new THREE.ConeGeometry(0.1, 1, 8); // cone shape for arrow
const arrowMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
arrow.rotation.x = Math.PI / 2; // Rotate to point forward
scene.add(arrow);

// 3. Create the target
const targetGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const targetMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const target = new THREE.Mesh(targetGeometry, targetMaterial);
target.position.set(0, 0, -10); // place target ahead of the arrow
scene.add(target);

// 4. Set camera and initial arrow position
camera.position.z = 5;
arrow.position.set(0, 0, 0); // start position for the arrow

// Variables for arrow movement
let isShooting = false;
const speed = 0.1; // arrow speed
const initialPosition = arrow.position.clone(); // Save initial position for respawn

// 5. Check collision
function checkCollision() {
    const distance = arrow.position.distanceTo(target.position);
    return distance < 0.5; // assuming the target and arrow are within 0.5 units
}

// 6. Animate function to shoot and respawn
function animate() {
    requestAnimationFrame(animate);

    // Move the arrow if it's shooting
    if (isShooting) {
        arrow.position.z -= speed; // Move forward along the z-axis
        if (checkCollision()) {
            // If collision happens, reset the arrow
            arrow.position.copy(initialPosition); // Respawn at initial position
            isShooting = false;
        }
    }

    renderer.render(scene, camera);
}

// 7. Event to start shooting
window.addEventListener('keydown', (event) => {
    if (event.key === ' ') { // Spacebar to shoot
        isShooting = true;
    }
});

// Start animation
animate();
