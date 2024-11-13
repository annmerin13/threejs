
import * as THREE from 'https://cdn.skypack.dev/three@0.140.2';

const playBtnScreen = document.getElementById("play-btn-screen");
const playBtn = playBtnScreen.querySelector("#play-btn");
var allObjs = [];

const keyBtns = document.querySelectorAll(".keys-container button");

let camera, scene, renderer, player;
let speed = 0.08;
const boxSideLength = 0.5;
const courseLength = 160;

let gameOver = false;
const numOfObstacles = 20;
const numOfSpheres = 20;
var obstaclesBoundingBoxes = [];

const xBoundary = 4 - (boxSideLength / 2);
const yBoundary = xBoundary / 4;

init();

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.1,
    200
  );

  camera.position.set(0, 4, -4);
  camera.lookAt(0, 0, 2);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
  directionalLight.position.set(10, 20, 0);
  scene.add(ambientLight, directionalLight);

  initializeBoxes();
  scene.background = new THREE.Color(0xb68bcb);
  
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
  
  document.body.appendChild(renderer.domElement);
}

function createBox(x, y, z) {
  const geometry = new THREE.BoxGeometry(
    boxSideLength,
    boxSideLength,
    boxSideLength
  );
  const material = new THREE.MeshLambertMaterial({ color: 0xe56956 });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  allObjs.push(mesh);
  scene.add(mesh);

  return {
    mesh,
  };
}

function createSphere(x, y, z) {
  const geometry = new THREE.SphereGeometry(boxSideLength / 2, 32, 32);
  const material = new THREE.MeshLambertMaterial({ color: 0x56e569 });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  mesh.isSphere = true;
  mesh.isPassed = false;
  
  allObjs.push(mesh);
  scene.add(mesh);

  return {
    mesh,
  };
}



function initializeSpheres() {
  for (let i = 0; i < numOfSpheres; i++) {
    const x = THREE.MathUtils.randFloatSpread(xBoundary * 2);
    const y = THREE.MathUtils.randFloatSpread(0, yBoundary * 2);
    const z = THREE.MathUtils.randFloat(10, courseLength - boxSideLength);
    
    const sphere = createSphere(x, y, z);
    
    const boundingBox = new THREE.Box3().setFromObject(sphere.mesh);
    obstaclesBoundingBoxes.push(boundingBox);
  }
}
function initializeBoxesAndSpheres() {
  
  initializeBoxes();
  
  initializeSpheres();
}


function createObstacle() {
  const x = THREE.MathUtils.randFloatSpread(xBoundary * 2);
  const y = THREE.MathUtils.randFloatSpread(0, yBoundary * 2);
  const z = THREE.MathUtils.randFloat(10, courseLength - boxSideLength);
  const obstacle = createBox(x, y, z);
  
  const boundingBox = new THREE.Box3().setFromObject(obstacle.mesh);
  obstaclesBoundingBoxes.push(boundingBox);
}

let score = 0;

function detectCollisions() {
  const playerBox = new THREE.Box3().setFromObject(player.mesh);
  // Check each object to detect if there is a collision
  for (let i = 0; i < obstaclesBoundingBoxes.length; i++) {
    const obstacleBox = obstaclesBoundingBoxes[i];
    const obstacle = allObjs[i];
    if (obstacleBox.intersectsBox(playerBox)) {
      if (obstacle.isSphere && !obstacle.isPassed) {
        score++;
        obstacle.isPassed = true;
        scoreElement.textContent = `Score: ${score}`;
      } else if (!obstacle.isSphere && i !== numOfObstacles) {
        gameOver = true;
        playBtnScreen.style.visibility = "visible";
        playBtn.focus();
        alert("You lose!");
      } else if (!obstacle.isSphere && i === numOfObstacles) {
        gameOver = true;
        playBtnScreen.style.visibility = "visible";
        playBtn.focus();
        alert("You win!");
      }
    }
  }
}


function initializeBoxes() {
  allObjs = [];
  obstaclesBoundingBoxes = [];
  
  player = createBox(0, 0, 0);

  for (let i = 0; i < numOfObstacles; i++) {
    createObstacle();
  }

  const geometry = new THREE.BoxGeometry(
    xBoundary * 2,
    yBoundary * 2,
    boxSideLength
  );
  const material = new THREE.MeshLambertMaterial({ color: "green" });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(0, 0, courseLength);
  allObjs.push(mesh);
  scene.add(mesh);

  const boundingBox = new THREE.Box3().setFromObject(mesh);
  obstaclesBoundingBoxes.push(boundingBox);
}

function animate() {
  if (gameOver) return;
  player.mesh.position.z += speed;
  camera.position.z += speed;

  detectCollisions();

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}


window.addEventListener("keydown", (e) => {
  if (gameOver) return;
  const key = e.key;
  const currXPos = player.mesh.position.x;
  const currYPos = player.mesh.position.y;
  if (key === "ArrowLeft") {
    if (currXPos > xBoundary) return;
    player.mesh.position.x += speed;
  }
  if (key === "ArrowRight") {
    if (currXPos < -xBoundary) return;
    player.mesh.position.x -= speed;
  }

});

const scoreElement = document.getElementById("score");

playBtn.addEventListener("click", () => {
  allObjs.forEach((obj) => scene.remove(obj));
  camera.position.set(0, 4, -4);
  camera.lookAt(0, 0, 2);
  initializeBoxesAndSpheres();
  gameOver = false;
  score = 0;
  scoreElement.textContent = `Score: ${score}`;
  animate();
  playBtnScreen.style.visibility = "hidden";
});

