import * as THREE from "three";
import { OrbitControls } from 'jsm/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from "jsm/renderers/CSS2DRenderer.js";
import { GUI } from "jsm/libs/lil-gui.module.min.js";
import { TextGeometry } from 'jsm/geometries/TextGeometry.js';
import {Trajectory, traceOrbits,updatePosition} from "./propagador2.js";
import VirtualClock from 'https://virtual-clock.js.org/1.2.3/virtual-clock.mjs';

///"Marte",1.5236623,1.85061,336.04084084,0.09341233,49.57854,355.,1.881

var heavenlyBodies = [] ;
var epoch = new Date('October 6, 2024');  // start the calendar 
var simSpeed = -0.20835 ;                        // value from the scroll control
var solid = false;                        // start simulation with solid rendering of orbits
var solidLabels = false;                  // start simulation with solid rendering of Labels
const PLANETAS =['Marte','Tierra','Venus','Mercurio','Jupiter','Saturno','Urano','Neptuno'];



// creacion de cuerpo celeste
// const "Planeta" = new Trajectory("Nombre del planeta", a, I, ω, e, Ω, M, PS)
// const "Planeta" = new Trajectory("Nombre del planeta", a(au), i(deg), peri(deg), e(-), node(deg), M(deg), period(y))
const mercurio = new Trajectory('Mercurio',0.38709927,7.00497902,77.45779628,0.20563593,48.3307693,252.25032350,0.2408467)
const Venus = new Trajectory("Venus",0.72333566,3.39467605,131.60246718,0.00677672,76.67984255,181.97909950,0.61519726)
const Tierra = new Trajectory("Tierra",1.00000261,0.00005131,102.93768193,0.01671123,0,100.46457166,1.0000174)
const marte = new Trajectory("Marte",1.52371034,1.85033389,336.04084,0.09339410,49.55953891,355.45332,1.8808476)
const Jupiter = new Trajectory("Jupiter",5.202887,1.30439695,14.72847983,0.04838624,100.47390909,34.39644051,11.862615)
const Saturno = new Trajectory("Saturno",9.53667594,2.48524049,92.59887831,0.05386179,113.66242448,49.94432,29.447498)
const Urano = new Trajectory("Urano",19.18916464,0.77263783,170.9542763,0.04725744,74.01692503,313.23810541,84.016846)
const Neptuno = new Trajectory("Neptuno",30.06992276,1.77004347,44.96476227,0.00859048,131.78422574,304.88003,164.79132)
const Ast1 = new Trajectory("2024 ON",2.388133475929453,7.626454418204451,185.5609752210781,0.5783524042571452,172.2709034877492,7.172255552579749,3.690592517569898)
// agregar a la lista de cuerpos celestes
heavenlyBodies.push(marte);
heavenlyBodies.push(Tierra);
heavenlyBodies.push(Venus);
heavenlyBodies.push(mercurio);
heavenlyBodies.push(Jupiter);
heavenlyBodies.push(Saturno);
heavenlyBodies.push(Urano);
heavenlyBodies.push(Neptuno);
heavenlyBodies.push(Ast1);

// generar la orbita que siquen 
//console.log(heavenlyBodies)

const [first, second, third,fourth,fifth,sixth,seventh,eighth,nineth] = traceOrbits(heavenlyBodies);
console.log(first, second, third,fourth,fifth,sixth,seventh,eighth,nineth);

const linea_orbita = first;
const linea_orbita1 = second;
const linea_orbita2 = third;
const linea_orbita3 = fourth;
const linea_orbita4 = fifth;
const linea_orbita5 = sixth;
const linea_orbita6 = seventh;
const linea_orbita7 = eighth;
const linea_orbita8 = nineth;

//traceOrbits(heavenlyBodies)
let gui;

let camera, scene, renderer, labelRenderer;

const layers = {

    'Toggle Name': function () {

        camera.layers.toggle(0);

    },
    'Toggle Mass': function () {

        camera.layers.toggle(1);

    },
    'Enable All': function () {

        camera.layers.enableAll();

    },

    'Disable All': function () {

        camera.layers.disableAll();

    }

};

// const loader = new FontLoader();

// loader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {

// 	const geometry = new TextGeometry( 'Hello three.js!', {
// 		font: font,
// 		size: 80,
// 		depth: 5,
// 		curveSegments: 12,
// 		bevelEnabled: true,
// 		bevelThickness: 10,
// 		bevelSize: 8,
// 		bevelOffset: 0,
// 		bevelSegments: 5
// 	} );
// } );


let clock = new THREE.Clock();
const textureLoader = new THREE.TextureLoader();

/// CONSTRUCTOR DE CLASE
class cuerpoCeleste {


    constructor(name,radio,textura ="../textures/defaut.jpg",ejeX,ejeY,ejeZ){
        this.cuerpo_celeste 
        this.name= name;
        this.radio = radio;
        if(textura === ""){
            this.textura = "../textures/defaut.jpg";
        }else{
            this.textura = textura;
        }
        
        this.ejeX = ejeX;
        this.ejeY = ejeY;
        this.ejeZ = ejeZ
    }

    new_objeto(){
        const Geometry = new THREE.SphereGeometry( this.radio, 16, 16 );
        const Material = new THREE.MeshPhongMaterial( {
            specular: 0x333333,
            shininess: 5,
            map: textureLoader.load(this.textura),
            specularMap: textureLoader.load( "../textures/defaut.jpg" ),
            normalMap: textureLoader.load( 'textures/planets/earth_normal_2048.jpg' ),
            normalScale: new THREE.Vector2( 0.85, 0.85 )
        } );

        Material.map.colorSpace = THREE.SRGBColorSpace;
        this.cuerpo_celeste = new THREE.Mesh( Geometry, Material );
        scene.add(this.cuerpo_celeste);
        
        const cuerpoDiv = document.createElement( 'div' );
        cuerpoDiv.className = 'label';
        cuerpoDiv.textContent = `${this.name}`;
        cuerpoDiv.style.backgroundColor = 'transparent';

        const cuerpoLabel = new CSS2DObject( cuerpoDiv );
        cuerpoLabel.position.set( 1.5 * this.radio, 0, 0 );
        cuerpoLabel.center.set( 0, 1 );
        this.cuerpo_celeste.add( cuerpoLabel);
    }

    Variar_posicion(xParement,yParament,zParament){
        this.cuerpo_celeste.position.set( xParement, zParament , yParament);
    }
    rotar() {
        this.cuerpo_celeste.rotation.y += 0.01;  // Ejemplo de rotación en el eje Y
    }
};

var AUMEN=100;

// declaracion de Cuerpos planetarios
let SOL =new cuerpoCeleste("Sol", 0.1,"../textures/sol.jpeg",0,0);
let MERCURIO = new cuerpoCeleste("Mercurio",0.1,"../textures/mercury.webp",0.3075,0.4667);
let VENUS = new cuerpoCeleste("Venus",0.1,"../textures/venus.jpg", 0.7186,0.7279);
let TIERRA = new cuerpoCeleste("Tierra",0.07,"../textures/earth.jpg",0.9833,1.067);
let LUNA = new cuerpoCeleste("Luna",0.1,"",0.4,0.3);
let MARTE = new cuerpoCeleste("Marte",0.07,"../textures/mars.jpeg",1.3817,1.6658);
let JUPITER = new cuerpoCeleste("Jupiter",0.3,"../textures/jupiter.jpeg",4.9499,5.4586);
let SATURNO = new cuerpoCeleste("Saturno",0.35,"../textures/8k_saturn.jpg",9.0483,10.1158);
let URANO = new cuerpoCeleste("Urano",0.2,"../textures/uranus.jpg",18.753,20.0832);
let NEPTUNO = new cuerpoCeleste("Neptuno",0.2,"../textures/neptune.jpg",29.7658,30.4409);
let PLUTON = new cuerpoCeleste("PLUTON",0.2,"",0.5,0.3);
let AST1 = new cuerpoCeleste("2024 ON",0.1,"../textures/asteroid.jpg")


init();
animate();


function init() {

    //const SOL_RADIUS = 0.5;

    camera = new THREE.PerspectiveCamera( 10, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.set( 10, 5, 20 );
    camera.layers.enableAll();

    scene = new THREE.Scene();
     
    const light = new THREE.AmbientLight(0x404040);
    scene.add(light);

    const dirLight = new THREE.DirectionalLight( 0xffffff, 4 );
    dirLight.position.set( 0, 0, 1 );
    dirLight.layers.enableAll();
    scene.add( dirLight );

    const axesHelper = new THREE.AxesHelper( 2 );
    axesHelper.layers.enableAll();
    scene.add( axesHelper );


    // sol
    //const solGeometry = new THREE.SphereGeometry( SOL_RADIUS, 16, 16 );
    //const solMaterial = new THREE.MeshBasicMaterial({color : 0x400000});
    //Sol = new THREE.Mesh( solGeometry, solMaterial );
    //scene.add( Sol);
    
    
    scene.add(linea_orbita);
    scene.add(linea_orbita1);
    scene.add(linea_orbita2);
    scene.add(linea_orbita3);
    scene.add(linea_orbita4);
    scene.add(linea_orbita5);
    scene.add(linea_orbita6);
    scene.add(linea_orbita7);
    scene.add(linea_orbita8);
    //PLUTON.new_objeto();
    SOL.new_objeto();
    MERCURIO.new_objeto(); 
    VENUS.new_objeto(); 
    TIERRA.new_objeto(); 
    MARTE.new_objeto(); 
    JUPITER.new_objeto();
    SATURNO.new_objeto();
    URANO.new_objeto();
    NEPTUNO.new_objeto();
    AST1.new_objeto();
    JUPITER.rotar();
    // JUPITER.new_objeto(); 
    // SATURNO.new_objeto();      
    // URANO.new_objeto(); 
    // NEPTUNO.new_objeto(); 


    //

    // renderer = new THREE.WebGLRenderer();
    // renderer.setPixelRatio( window.devicePixelRatio );
    // renderer.setSize( window.innerWidth, window.innerHeight );
    // document.body.appendChild( renderer.domElement );

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);


    labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize( window.innerWidth, window.innerHeight );
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0px';
    document.body.appendChild( labelRenderer.domElement );

    const controls = new OrbitControls( camera, labelRenderer.domElement );
    controls.minDistance = 5;
    controls.maxDistance = 700;

    //

    window.addEventListener( 'resize', onWindowResize );

    initGui();

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

    labelRenderer.setSize( window.innerWidth, window.innerHeight );

}

//Menu de retroceder, pausar y avanzar
let sense = 1;
let paused = false;
let speed = 2628288;
let time= new Date();
let interval;

const dateDisplay = document.getElementById('dateDisplay');
const timeDisplay = document.getElementById('timeDisplay');
const pauseBtn = document.getElementById('pauseBtn');
const forwardBtn = document.getElementById('forwardBtn');
const backwardBtn = document.getElementById('backwardBtn');

//Mostrar fecha y hora
function updateDisplay() {
    // Mostrar la fecha en formato 'día/mes/año'
    dateDisplay.innerHTML = time.toLocaleDateString();
    // Mostrar la hora en formato 'HH:MM:SS'
    timeDisplay.innerHTML = time.toLocaleTimeString();
}

function startClock() {
    interval = setInterval(() => {
        time.setSeconds(time.getSeconds() + speed);
        updateDisplay();
    }, 1000);
}

pauseBtn.addEventListener('click', () => {
    if (!paused) {
        clearInterval(interval);
    } else {
        startClock();
    }
    paused = !paused;
});

pauseBtn.addEventListener('click', () => {
    pauseBtn.innerHTML = paused ? '<i class="fas fa-play"></i>':'<i class="fas fa-pause"></i>';
});

forwardBtn.addEventListener('click', () => {
    if (sense === -1){
    sense = 1
    simSpeed = (-1)*simSpeed
    speed = (-1)*speed  // Adelanta el tiempo 
    }
});

backwardBtn.addEventListener('click', () => {
    if (sense === 1){
        sense = -1
        simSpeed = (-1)*simSpeed
        speed = (-1)*speed  // Adelanta el tiempo 
    }
});

function changeSpeed(newSpeed,newVelo) {
    simSpeed = sense * newSpeed;
    speed = sense * newVelo;
}

startClock();  // Inicia el reloj

// Asociar botones con las funciones
document.getElementById('hora').addEventListener('click', function() {
    changeSpeed(-0.0002854,3600); 
});

document.getElementById('dia').addEventListener('click', function() {
    changeSpeed(-0.00685,86400); 
});

document.getElementById('semana').addEventListener('click', function() {
    changeSpeed(-0.04794,604800); 
});

document.getElementById('mes').addEventListener('click', function() {
    changeSpeed(-0.20835, 2628288); 
});

document.getElementById('año').addEventListener('click', function() {
    changeSpeed(-2.5,31536000); 
});

function animate() {

    requestAnimationFrame( animate );


    const position = updatePosition(heavenlyBodies,simSpeed);

    position.forEach(({ name, currentPosition }) => {

        if (name === "Mercurio") {
            // Suponiendo que currentPosition es un arreglo con [X, Y, Z]
            const [Xpos, Ypos, Zpos] = currentPosition;
            // Llamar al método Variar_posicion con las coordenadas
            MERCURIO.Variar_posicion(Xpos, Ypos, Zpos);
        }
     
        if (name === "Tierra") {
            // Suponiendo que currentPosition es un arreglo con [X, Y, Z]
            const [Xpos, Ypos, Zpos] = currentPosition;

            // Llamar al método Variar_posicion con las coordenadas
            TIERRA.Variar_posicion(Xpos, Ypos, Zpos);
        }
        if (name === "Marte") {
            // Suponiendo que currentPosition es un arreglo con [X, Y, Z]
            const [Xpos, Ypos, Zpos] = currentPosition;

            // Llamar al método Variar_posicion con las coordenadas
            MARTE.Variar_posicion(Xpos, Ypos, Zpos);
        }
        
        if (name === "Venus") {
            // Suponiendo que currentPosition es un arreglo con [X, Y, Z]
            const [Xpos, Ypos, Zpos] = currentPosition;

            // Llamar al método Variar_posicion con las coordenadas
            VENUS.Variar_posicion(Xpos, Ypos, Zpos);
        }
        if (name === "Jupiter") {
            // Suponiendo que currentPosition es un arreglo con [X, Y, Z]
            const [Xpos, Ypos, Zpos] = currentPosition;

            // Llamar al método Variar_posicion con las coordenadas
            JUPITER.Variar_posicion(Xpos, Ypos, Zpos);
        }
        if (name === "Saturno") {
            // Suponiendo que currentPosition es un arreglo con [X, Y, Z]
            const [Xpos, Ypos, Zpos] = currentPosition;

            // Llamar al método Variar_posicion con las coordenadas
            SATURNO.Variar_posicion(Xpos, Ypos, Zpos);
        
        }
        if (name === "Urano") {
            // Suponiendo que currentPosition es un arreglo con [X, Y, Z]
            const [Xpos, Ypos, Zpos] = currentPosition;

            // Llamar al método Variar_posicion con las coordenadas
            URANO.Variar_posicion(Xpos, Ypos, Zpos);
        }
        if (name === "Neptuno") {
            // Suponiendo que currentPosition es un arreglo con [X, Y, Z]
            const [Xpos, Ypos, Zpos] = currentPosition;

            // Llamar al método Variar_posicion con las coordenadas
            NEPTUNO.Variar_posicion(Xpos, Ypos, Zpos);
        }
        if (name === "2024 ON") {
            // Suponiendo que currentPosition es un arreglo con [X, Y, Z]
            const [Xpos, Ypos, Zpos] = currentPosition;

            // Llamar al método Variar_posicion con las coordenadas
            AST1.Variar_posicion(Xpos, Ypos, Zpos);
        }
    });

    

    // position.forEach((planet) => {
    //     if (planet.name === PLANETAS ){
            
    //     }
    // })

    // Animacion de planetas

    //MERCURIO.Variar_posicion();
    //VENUS.Variar_posicion(elapsed);
    
    //MARTE.Variar_posicion(elapsed);
    // JUPITER.Variar_posicion(elapsed);
    // SATURNO.Variar_posicion(elapsed);
    // URANO.Variar_posicion(elapsed);
    // NEPTUNO.Variar_posicion(elapsed);


    // createOrbitLine(MERCURIO.ejeX,MERCURIO.ejeY);
    // createOrbitLine(VENUS.ejeX,VENUS.ejeY);
    // createOrbitLine(TIERRA.ejeX,TIERRA.ejeY);
    // createOrbitLine(MARTE.ejeX,MARTE.ejeY);
    // createOrbitLine(JUPITER.ejeX,JUPITER.ejeY);
    // createOrbitLine(SATURNO.ejeX,SATURNO.ejeY);
    // createOrbitLine(URANO.ejeX,URANO.ejeY);
    // createOrbitLine(NEPTUNO.ejeX,NEPTUNO.ejeY);



    renderer.render( scene, camera );
    labelRenderer.render( scene, camera );

}


// FUNCIONES


function createOrbitLine(a,b) {
    const points = [];
    for (let i = 0; i <= 64; i++) {
        const angle = (i / 64) * 2 * Math.PI;
        points.push(new THREE.Vector3(Math.cos(angle) * a, 0, Math.sin(angle) * b));
    }
    const orbitGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
    const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
    scene.add(orbitLine);
}

function updateTheDate() { 
    // Display the simulated date to the right of the model.
   //  epoch.setTime(epoch.getTime() + simSpeed * 86400)
	 if (simSpeed == 1) {
	   epoch.setDate(epoch.getDate() + 1) ;            // At maximum speed, increment calendar by a day for each clock-cycle.
	 } else {  epoch.setTime(epoch.getTime() + simSpeed * 24* 3600000 ) ; }  // 24 hours * milliseconds in an hour * simSpeed 

//	 document.getElementById("modelDate").innerHTML = (epoch.getMonth() + 1) + "-" + epoch.getDate() + "-" + epoch.getFullYear() ;
   }


function initGui() {

    gui = new GUI();

    gui.title( 'Camera Layers' );

    gui.add( layers, 'Toggle Name' );
    gui.add( layers, 'Toggle Mass' );
    gui.add( layers, 'Enable All' );
    gui.add( layers, 'Disable All' );

    gui.open();

}
