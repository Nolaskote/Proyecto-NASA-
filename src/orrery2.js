import * as THREE from 'three';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

const textureLoader = new THREE.TextureLoader();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Agregar textura de fondo
const backgroundTexture = textureLoader.load('public/textures/stars.jpg'); // Cambia por tu imagen
scene.background = backgroundTexture;


const sunLabel = document.createElement('div');
sunLabel.className = 'label';
sunLabel.textContent = 'PLAY'; // Texto del Sol
sunLabel.style.color = 'black';
sunLabel.style.fontSize = '20px';
sunLabel.style.fontFamily = 'times new roman';
sunLabel.style.visibility = 'hidden'; // No necesita estar visible en el DOM
sunLabel.style.position = 'fixed'; // Remover del flujo del documento

document.body.appendChild(sunLabel); 

// Convertir el texto en un objeto 3D usando CSS2DObject
const sunLabelObject = new CSS2DObject(sunLabel);
sunLabelObject.element.style.visibility = 'visible';
// Ahora es seguro ajustar la posición del texto
sunLabelObject.position.set(0, 0, 0); // Ajustar la posición del texto cerca del Sol

// Textura del Sol
const sunTexture = textureLoader.load('public/textures/8k_sun.jpg');
const sunGeometry = new THREE.SphereGeometry(1.5, 32, 32);
const sunMaterial = new THREE.MeshPhongMaterial({ map: sunTexture, emissive: new THREE.Color(0x000000) });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);

// Añadir el texto al Sol
sun.add(sunLabelObject);

// Añadir el Sol a la escena
scene.add(sun);

// CSS2DRenderer para renderizar el texto
const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
document.body.appendChild(labelRenderer.domElement);

// Luz simulando el Sol
const sunlight = new THREE.PointLight(0xffffff, 100, 200);
sunlight.position.set(0, 0, 0);
scene.add(sunlight);

// Luz ambiental
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);


// Textura y geometría de los planetas (igual que antes)
// Mercurio
const mercuryTexture = textureLoader.load('public/textures/textura-mercurio.jpg');
const mercuryGeometry = new THREE.SphereGeometry(0.2, 32, 32);
const mercuryMaterial = new THREE.MeshPhongMaterial({ map: mercuryTexture });
const mercury = new THREE.Mesh(mercuryGeometry, mercuryMaterial);
scene.add(mercury);

// Venus
const venusTexture = textureLoader.load('public/textures/venus.jpg');
const venusGeometry = new THREE.SphereGeometry(0.45, 32, 32);
const venusMaterial = new THREE.MeshPhongMaterial({ map: venusTexture });
const venus = new THREE.Mesh(venusGeometry, venusMaterial);
scene.add(venus);

// Tierra
const earthTexture = textureLoader.load('public/textures/1_earth_16k.jpg');
const earthGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const earthMaterial = new THREE.MeshPhongMaterial({ map: earthTexture });
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

// Marte
const marsTexture = textureLoader.load('public/textures/8k_mars.jpg');
const marsGeometry = new THREE.SphereGeometry(0.4, 32, 32);
const marsMaterial = new THREE.MeshPhongMaterial({ map: marsTexture });
const mars = new THREE.Mesh(marsGeometry, marsMaterial);
scene.add(mars);

//cinturón de asteroides
const asteroidTexture = textureLoader.load('public/textures/asteroid.jpg'); // Cambia 'ruta/a/tu-textura.jpg' por la ubicación de tu textura

// Crear el material con la textura usando MeshStandardMaterial
const asteroidMaterial = new THREE.MeshStandardMaterial({
    map: asteroidTexture,  // Textura aplicada
    roughness: 0.7,        // Ajusta la rugosidad para un aspecto más mate
    metalness: 0.1         // Leve metalizado para un brillo sutil
});

const asteroidBeltGroup = new THREE.Group();

const asteroidGeometry = new THREE.SphereGeometry(0.1, 8, 8); // Geometría de asteroide

for (let i = 0; i < 400; i++) {
    const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
    const distance = Math.random() * (8 - 4) + 8; // Rango entre Marte y Júpiter
    const angle = Math.random() * Math.PI * 2;    // Ángulo aleatorio

    // Convertir coordenadas polares a cartesianas
    asteroid.position.x = distance * Math.cos(angle);
    asteroid.position.z = distance * Math.sin(angle);

    asteroidBeltGroup.add(asteroid);
}

scene.add(asteroidBeltGroup);

// Júpiter
const jupiterTexture = textureLoader.load('public/textures/8k_jupiter.jpg');
const jupiterGeometry = new THREE.SphereGeometry(1, 32, 32);
const jupiterMaterial = new THREE.MeshPhongMaterial({ map: jupiterTexture });
const jupiter = new THREE.Mesh(jupiterGeometry, jupiterMaterial);
scene.add(jupiter);

// Saturno
const saturnTexture = textureLoader.load('public/textures/8k_saturn.jpg');
const saturnGeometry = new THREE.SphereGeometry(0.9, 32, 32);
const saturnMaterial = new THREE.MeshPhongMaterial({ map: saturnTexture });
const saturn = new THREE.Mesh(saturnGeometry, saturnMaterial);
scene.add(saturn);

// Anillo de Saturno
const saturnRingTexture = textureLoader.load('public/textures/8k_saturn_ring_alpha.png');
const saturnRingGeometry = new THREE.RingGeometry(1.1, 2, 64);
const saturnRingMaterial = new THREE.MeshBasicMaterial({
    map: saturnRingTexture,
    side: THREE.DoubleSide,
    transparent: true
});
const saturnRing = new THREE.Mesh(saturnRingGeometry, saturnRingMaterial);
saturnRing.rotation.x = Math.PI / 2;
saturn.add(saturnRing);

// Urano con textura
const uranusTexture = textureLoader.load('public/textures/uranus.jpg');
const uranusGeometry = new THREE.SphereGeometry(0.75, 32, 32);
const uranusMaterial = new THREE.MeshPhongMaterial({ map: uranusTexture });
const uranus = new THREE.Mesh(uranusGeometry, uranusMaterial);
scene.add(uranus);

//anillo de Urano
const uranusRingTexture = textureLoader.load('public/textures/8k_saturn_ring_alpha.png'); // Textura del anillo
const uranusRingGeometry = new THREE.RingGeometry(1, 1.5, 64);  // Geometría del anillo (radio interno, radio externo)
const uranusRingMaterial = new THREE.MeshBasicMaterial({
    map: uranusRingTexture,
    side: THREE.DoubleSide,  // Hace visible el anillo por ambos lados
    transparent: true        // Permite la transparencia de la textura
});
const uranusRing = new THREE.Mesh(uranusRingGeometry, uranusRingMaterial);
uranusRing.rotation.x = Math.PI / 2;  // Rotar el anillo para que esté en el mismo plano que Urano
uranus.add(uranusRing);  // Agregar el anillo como hijo de Urano para que se mueva con él

// Neptuno con textura
const neptuneTexture = textureLoader.load('public/textures/neptune.jpg');
const neptuneGeometry = new THREE.SphereGeometry(0.65, 32, 32);
const neptuneMaterial = new THREE.MeshPhongMaterial({ map: neptuneTexture });
const neptune = new THREE.Mesh(neptuneGeometry, neptuneMaterial);
scene.add(neptune);

//cinturon de asteroides externo
const asteroidBeltGroup2 = new THREE.Group();

const asteroidGeometry2 = new THREE.SphereGeometry(0.1, 8, 8); 

for (let i = 0; i < 2000; i++) {
    const asteroid = new THREE.Mesh(asteroidGeometry2, asteroidMaterial);
    const distance = Math.random() * (40 - 20) + 35; 
    const angle = Math.random() * Math.PI * 2;   

    // Convertir coordenadas polares a cartesianas
    asteroid.position.x = distance * Math.cos(angle);
    asteroid.position.z = distance * Math.sin(angle);

    asteroidBeltGroup2.add(asteroid);
}

scene.add(asteroidBeltGroup2);

// Posición inicial de los planetas
sun.position.set(0, 0, 0);
mercury.position.set(2, 0, 0);
venus.position.set(3, 0, 0);
earth.position.set(4, 0, 0);
mars.position.set(5.5, 0, 0);
jupiter.position.set(8, 0, 0);
saturn.position.set(10, 0, 0);
uranus.position.set(11, 0, 0);
neptune.position.set(12, 0, 0);

// Posicionar y rotar la cámara para una vista inclinada
camera.position.set(0, 5, 10); // Ajusta la altura y distancia

// Hacer que la cámara mire hacia el Sol
camera.lookAt(sun.position);

// Ahora aplicamos la inclinación rotando la cámara en el eje Z
const tiltAngle = Math.PI / -8; // 22.5 grados
camera.rotation.z = tiltAngle; // Aplicar la rotación en Z

// Crear líneas de órbitas de los planetas
function createOrbitLine(radius) {
    const points = [];
    for (let i = 0; i <= 64; i++) {
        const angle = (i / 64) * 2 * Math.PI;
        points.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
    }
    const orbitGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
    const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
    scene.add(orbitLine);
}

// Crear órbitas como líneas
createOrbitLine(2.37);     //Órbita de Mercurio
createOrbitLine(4);     //Órbita de Venus
createOrbitLine(5);    // Órbita de la Tierra
createOrbitLine(6.8);  // Órbita de Marte
createOrbitLine(13.5);    // Órbita de Júpiter
createOrbitLine(17.5);    // Órbita de Saturno
createOrbitLine(22);    // Órbita de Urano
createOrbitLine(25.2);    // Órbita de Neptuno

sun.position.set(0, 0, 0);
mercury.position.set(2, 0, 0);
venus.position.set(3, 0, 0);
earth.position.set(4, 0, 0);
mars.position.set(5.5, 0, 0);
jupiter.position.set(8, 0, 0);
saturn.position.set(10, 0, 0);
uranus.position.set(11, 0, 0);
neptune.position.set(12, 0, 0);

// Variables para el raycaster
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const highlightedColor = 0xDAA520; // Color dorado para el efecto de brillo
const originalColor = sunMaterial.emissive.getHex(); // Color original del Sol

function onMouseMove(event) {
    // Calcula la posición del mouse en coordenadas normalizadas (-1 a +1)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Actualiza el raycaster con la posición del mouse
    raycaster.setFromCamera(mouse, camera);

    // Calcula los objetos intersectados por el rayo
    const intersects = raycaster.intersectObject(sun);

    // Si el ratón está sobre el Sol, cambia su color
    if (intersects.length > 0) {
        sunMaterial.emissive.set(highlightedColor); // Aumenta el brillo
    } else {
        sunMaterial.emissive.set(originalColor); // Restablece el brillo al color original
    }
}

window.addEventListener('mousemove', onMouseMove);


// Función para manejar clics en el Sol
function onDocumentMouseDown(event) {
    event.preventDefault();

    // Normalizar las coordenadas del ratón
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Establecer el Raycaster desde la cámara hacia el ratón
    raycaster.setFromCamera(mouse, camera);

    // Detectar intersecciones con los objetos
    const intersects = raycaster.intersectObjects([sun]);

    // Si hay una intersección con el Sol
    if (intersects.length > 0) {
        window.location.href = './app.js/Simulador.html';
    }
}
function onDocumentMouseMove(event) {
    // Normalizar coordenadas del ratón
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Raycaster para detectar si el ratón está sobre el Sol
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects([sun]);

    // Cambiar el cursor si está sobre el Sol
    if (intersects.length > 0) {
        document.body.style.cursor = 'pointer'; // Cambiar a mano
    } else {
        document.body.style.cursor = 'default'; // Cambiar a cursor normal
    }
}

// Añadir el evento de clic
window.addEventListener('mousedown', onDocumentMouseDown, false);
window.addEventListener('mousemove', onDocumentMouseMove, false);

function calculateLogarithmicScale(distance) {
    return Math.log10(distance + 1);  // Escala logarítmica
}

// Definiendo la distancia del sol a cada planeta en UA
const distancesInAU = {
    mercury: 0.39,
    venus: 0.72,
    earth: 1,
    mars: 1.52,
    jupiter: 5.20,
    saturn: 9.58,
    uranus: 19.18,
    neptune: 30.07,
    uranus: 19.18,
    neptune: 30.07
};

// Factor de escala para visualización
const scaleFactor = 17;

// Función para calcular la distancia escalada
function scaledDistance(distance) {
    return Math.log10(distance + 1) * scaleFactor;
}

//Velocidades de traslación
// Definimos constantes
const AU = 149597870.7; // 1 Unidad Astronómica en kilómetros
const SECONDS_PER_DAY = 86400 / 32; // Un día en segundos
const TIME_SCALE = SECONDS_PER_DAY; // Tiempo de simulación (1 segundo = 1 día)

// Velocidades orbitales en km/s
const orbitalVelocities = {
    mercury: 47.87,
    venus: 35.02,
    earth: 29.78,
    mars: 24.077,
    jupiter: 13.07,
    saturn: 9.68,
    uranus: 6.80,
    neptune: 5.43
};

// Convertir velocidades a UA/día y escalar
const scaledVelocities = {};
Object.keys(orbitalVelocities).forEach(planet => {
    const velocityInAUPerSec = orbitalVelocities[planet] / AU; // km/s a UA/s
    const velocityInAUPerSimTime = velocityInAUPerSec * TIME_SCALE; // Escalar por el tiempo de simulación
    scaledVelocities[planet] = velocityInAUPerSimTime; // Almacenar velocidad escalada
});

// Velocidades de rotación en radianes por segundo (rad/seg)
const rotationSpeedsInRadPerSecond = {
    mercury: 1.26e-6 * 100,  // Aumentar Mercurio
    venus: -2.99e-7 * 100,   // Aumentar Venus
    earth: 7.27e-5,     // rad/seg
    mars: 7.09e-5,      // rad/seg
    jupiter: 1.76e-4,   // rad/seg
    saturn: 1.64e-4,    // rad/seg
    uranus: -1.01e-4,   // rad/seg (rotación retrógrada)
    neptune: 1.08e-4,    // rad/seg
    sun: 2.92e-6
};

// Velocidades de rotación para los anillos 
const ringRotationSpeedsInRadPerSecond = {
    saturnRings: 2.0e-5,  // Velocidad de rotación para los anillos de Saturno
    uranusRings: 2.5e-5,  // Velocidad de rotación para los anillos de Urano
};
// Escalar las velocidades para la simulación
const timeScale = 86400 / 128; // Factor de escala para acelerar el tiempo 
const scaledRotationSpeeds = {};
Object.keys(rotationSpeedsInRadPerSecond).forEach(planet => {
    scaledRotationSpeeds[planet] = rotationSpeedsInRadPerSecond[planet] * timeScale; // Aplicar el factor de escala
});

// Escalar las velocidades de los anillos para la simulación
const scaledRingSpeeds = {};

Object.keys(ringRotationSpeedsInRadPerSecond).forEach(rings => {
    scaledRingSpeeds[rings] = ringRotationSpeedsInRadPerSecond[rings] * timeScale;
});

// Velocidad de rotación para el Sol
const scaledSunRotationSpeed = rotationSpeedsInRadPerSecond.sun * timeScale;

// Animación (órbitas)
function animate() {
    const time = Date.now() * 0.0001;
    requestAnimationFrame(animate);


    // Movimiento orbital simple (órbita circular)
    mercury.position.x = Math.cos(Date.now() * scaledVelocities.mercury) * scaledDistance(distancesInAU.mercury);
    mercury.position.z = Math.sin(Date.now() * scaledVelocities.mercury) * scaledDistance(distancesInAU.mercury);

    venus.position.x = Math.cos(Date.now() * scaledVelocities.venus) * scaledDistance(distancesInAU.venus);
    venus.position.z = Math.sin(Date.now() * scaledVelocities.venus) * scaledDistance(distancesInAU.venus);

    earth.position.x = Math.cos(Date.now() * scaledVelocities.earth) * scaledDistance(distancesInAU.earth);
    earth.position.z = Math.sin(Date.now() * scaledVelocities.earth) * scaledDistance(distancesInAU.earth);

    mars.position.x = Math.cos(Date.now() * scaledVelocities.mars) * scaledDistance(distancesInAU.mars);
    mars.position.z = Math.sin(Date.now() * scaledVelocities.mars) * scaledDistance(distancesInAU.mars);

    jupiter.position.x = Math.cos(Date.now() * scaledVelocities.jupiter) * scaledDistance(distancesInAU.jupiter);
    jupiter.position.z = Math.sin(Date.now() * scaledVelocities.jupiter) * scaledDistance(distancesInAU.jupiter);

    saturn.position.x = Math.cos(Date.now() * scaledVelocities.saturn) * scaledDistance(distancesInAU.saturn);
    saturn.position.z = Math.sin(Date.now() * scaledVelocities.saturn) * scaledDistance(distancesInAU.saturn);

    uranus.position.x = Math.cos(Date.now() * scaledVelocities.uranus) * scaledDistance(distancesInAU.uranus);
    uranus.position.z = Math.sin(Date.now() * scaledVelocities.uranus) * scaledDistance(distancesInAU.uranus);

    neptune.position.x = Math.cos(Date.now() * scaledVelocities.neptune) * scaledDistance(distancesInAU.neptune);
    neptune.position.z = Math.sin(Date.now() * scaledVelocities.neptune) * scaledDistance(distancesInAU.neptune);

    mercury.rotation.y += scaledRotationSpeeds.mercury;   // Mercurio
    venus.rotation.y += scaledRotationSpeeds.venus;       // Venus (rotación retrógrada)
    earth.rotation.y += scaledRotationSpeeds.earth;       // Tierra
    mars.rotation.y += scaledRotationSpeeds.mars;         // Marte
    jupiter.rotation.y += scaledRotationSpeeds.jupiter;   // Júpiter
    saturn.rotation.y += scaledRotationSpeeds.saturn;
    uranus.rotation.y += scaledRotationSpeeds.uranus;     // Urano (rotación retrógrada)
    neptune.rotation.y += scaledRotationSpeeds.neptune;   // Neptuno

    sun.rotation.y += scaledSunRotationSpeed;

    // Renderizado
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
}
animate();

// Redimensionar la ventana
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

window.addEventListener('load', function() {
    setTimeout(function() {
        // Inicia la animación del cometa y el texto
        document.querySelector('.comet').style.animationPlayState = 'running';
        document.querySelector('.overlay-text').style.animationPlayState = 'running';
    }, 500); // Ajusta este tiempo según sea necesario
});