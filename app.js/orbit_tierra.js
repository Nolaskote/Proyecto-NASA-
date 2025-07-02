import * as THREE from "three";
import { OrbitControls } from 'jsm/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from "jsm/renderers/CSS2DRenderer.js";
import { GUI } from "jsm/libs/lil-gui.module.min.js";
///import { TextGeometry } from 'jsm/geometries/TextGeometry.js';
import {Trajectory, traceOrbits,updatePosition} from "./propagador.js";
import { updatePosterImage } from "./animaciones_pag.js";
import { traerDatos} from "./orbit_asteroids.js";


///"Marte",1.5236623,1.85061,336.04084084,0.09341233,49.57854,355.,1.881
const container = document.getElementById('container');

// Variables para raycasting
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let selectedObject = null;  // Variable para almacenar el cuerpo celeste seleccionado

// Función para manejar el clic del mouse para selecccinar planetas

function onMouseClick(event) {
    event.preventDefault();

    // Calcular la posición del mouse en coordenadas normalizadas (-1 a 1)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Configurar el raycaster para la cámara y el mouse
    raycaster.setFromCamera(mouse, camera);

    // Ajustar el rayo a la capa 3
    raycaster.layers.set(3);  // Limitar el raycaster a la capa 3

    // Obtener los objetos que intersectan con el rayo en la capa 3
    const intersects = raycaster.intersectObjects(scene.children, true);

    // Si hay alguna intersección, seleccionar el primer objeto
    if (intersects.length > 0) {
        selectedObject = intersects[0].object;

        // Verificar si el objeto seleccionado es un planeta y está en la capa 3
        if (selectedObject.isPlanet) {
            if (typeof selectedObject.toggleHalo === "function") {
                selectedObject.toggleHalo();  // Activar o desactivar el halo
                setTimeout(() => {
                    selectedObject.toggleHalo();
                }, 2000);
            }
            let plant = updatePosterImage(selectedObject.name);
            console.log("Planeta seleccionado en la capa 3:", selectedObject.name);
        } else {
            console.log("El objeto seleccionado no es un planeta.");
        }
    } else {
        selectedObject = null;  // No hay selección si no intersecta nada
    }
    
}

//console.log({}=AsteroidsDate)

var allAsteroids = [] ;
var allCuerpoAsteroids = [] ;
var heavenlyBodies = [] ;
var positionAsteriods;
var epoch = new Date('Enero 1, 2024');  // start the calendar 
var simSpeed = 0.2 ;                        // value from the scroll control
var simSpeedAsteroids = 200;
var Asteroid_arranche = false;
var Asteroid_BASE = false;
var moonAngle = 0;  // To track the current angle of the Moon's orbit
var moonSpeed = 0.05;  // Control the speed of the Moon's orbit



const ruta1 = './estado_actual.json';
const texto1 = 'Data Asteroides';


const ruta2 = './datos_asteroides.json';
const texto2 = 'CAracteristicas de Asteroides';

// Arreglo para almacenar los resultados
let AsteroidsPArameter ={};
let AsteroidsBase= {};
let resultadoAsteroides = [];
let resultadoBase = [];
let BASe_unificada = []

traerDatos(ruta1, texto1)
    .then(datosUnicos => {
        // Asignar los datos obtenidos a la variable global
        console.log('Datos guardados cargando... todos los parametros:', datosUnicos);
        AsteroidsPArameter  =  extraerDatosAsteroide(datosUnicos);
    })
    .catch(error => {
        console.error('Error al obtener los datos:', error);
    });

traerDatos(ruta2, texto2)
    .then(datosUnicos => {
        // Asignar los datos obtenidos a la variable global
        console.log('Datos guardados cargando... todos los asteroides :', datosUnicos);
        AsteroidsBase  =  extraerDatosBaseAsteroides(datosUnicos);
    })
    .catch(error => {
        console.error('Error al obtener los datos:', error);
    });

    
function extraerDatosBaseAsteroides(asteroid) {
    //console.log(asteroid)
    const asteroidData = asteroid;

    asteroidData.forEach(({id,name,nasa_jpl_url,is_potentially_hazardous_asteroid}) => { 
        //console.log(`ID del asteroide: ${id}, Nombre del asteroide: ${name}, es peligroso ${is_potentially_hazardous_asteroid}`);
        const date_asteroids= {id, name, nasa_jpl_url, is_potentially_hazardous_asteroid}
        resultadoBase.push(date_asteroids)
       
    })
    console.log ("Datos de todos lo asteroides de la base")
    console.log(resultadoBase);

    Asteroid_BASE= true;
};

function unificarBase(){
    if(Asteroid_BASE === true && Asteroid_arranche === true){
        // Crear un nuevo arreglo uniendo los elementos de los dos arreglos
        const arregloUnido = resultadoAsteroides.map(item1 => {
            // Buscar el objeto correspondiente en el segundo arreglo por ID
            const matchingItem = resultadoBase.find(item2 => {item2.id === item1.id
                
                return item2
            });
            console.log(matchingItem)
            
            
            // Si existe un objeto coincidente, combinar sus datos en un solo objeto
            if (matchingItem) {
            return {
                ...item1, // Incluye todas las propiedades del primer arreglo
                ...matchingItem // Incluye todas las propiedades del segundo arreglo
            };
            }
            
            // Si no hay coincidencia, devolver solo el objeto del primer arreglo
            return item1;
        });
        
        // Mostrar el resultado combinado\

        console.log("Tosododknsdfnngdsnagnafniafhhlnfdanlafd")
        
        unificarBase= arregloUnido;
        console.log(unificarBase);
        // Llamar a la función para poblar la tabla con los datos de los asteroides
        populateTable(unificarBase);

    }
};

function extraerDatosAsteroide(asteroid) {
    //console.log(asteroid)
    const asteroidData = asteroid.asteroidData;

    for (let id in asteroidData) {
        if (asteroidData[id].orbital_data) {
            const { 
                semi_major_axis,
                inclination,
                perihelion_argument,
                eccentricity,
                ascending_node_longitude,
                mean_anomaly,
                orbital_period,                 
                } = asteroidData[id].orbital_data;


            //console.log(`Asteroide ID: ${id}, Orbit ID: ${asteroidData[id].orbital_data.orbit_id}`);
            resultadoAsteroides.push({
                asteroid_id: id,
                semi_major_axis,
                inclination,
                perihelion_argument,
                eccentricity,
                ascending_node_longitude,
                mean_anomaly,
                orbital_period,
            });
        }
    }

    
    // Función para convertir strings a números
    const convertirStringsANumeros = (arr) => {
        return arr.map(asteroide => {
            return {
                asteroid_id: asteroide.asteroid_id,  // Mantén el ID como cadena de texto
                semi_major_axis: parseFloat(asteroide.semi_major_axis),
                inclination: parseFloat(asteroide.inclination),
                perihelion_argument: parseFloat(asteroide.perihelion_argument),
                eccentricity: parseFloat(asteroide.eccentricity),
                ascending_node_longitude: parseFloat(asteroide.ascending_node_longitude), 
                mean_anomaly: parseFloat(asteroide.mean_anomaly),
                orbital_period: parseFloat(asteroide.orbital_period),
            };
        });
    };
    // Extraer las propiedades deseadas del objeto
    console.log("Resultados de asteroides")
    console.log(resultadoAsteroides);
    const asteroidesConvertidos = convertirStringsANumeros(resultadoAsteroides);
    

    asteroidesConvertidos.forEach(Asteroides=> {
        const trayectoria = new Trajectory(
            Asteroides.asteroid_id,
            Asteroides.semi_major_axis,
            Asteroides.inclination,
            Asteroides.perihelion_argument,
            Asteroides.eccentricity,
            Asteroides.ascending_node_longitude,
            Asteroides.meanAnomaly,
            Asteroides.orbital_period
        );
        allAsteroids.push(trayectoria);

    });
    // Usar traceOrbits para obtener las órbitas
    const orbitas = traceOrbits(allAsteroids);

    // Añadir todas las órbitas a la escena de forma dinámica
    orbitas.forEach(orbita => {
        scene.add(orbita);  // Agregar cada órbita generada a la escena
        orbita.layers.set(1);
    });
    console.log("Resultado de Trayectorias")
    console.log(allAsteroids)
    //Cargar Asteroides Objetos
    //console.log(resultadoAsteroides)
    resultadoAsteroides.forEach(Asteroides=> {
        //console.log(Asteroides.asteroid_id)
        const Cuerpo_Asteroids = new cuerpoAsteroid(
            Asteroides.asteroid_id,
            0.01,
            '../textures/tex_asteroid.jpg',
            '../textures/tex_asteroid_map.jpg'
        );
        allCuerpoAsteroids.push(Cuerpo_Asteroids);

    });

   allCuerpoAsteroids.forEach(Cuerpo_asteroide => {
        //console.log(Cuerpo_asteroide)
        scene.add(Cuerpo_asteroide)
    });

    //console.log("Envio de datos al propagador")
    
    Asteroid_arranche = true;

    //dos arreglos
    // console.log("dos arreglos")
    // console.log(positionAsteriods)
    // console.log(allCuerpoAsteroids)

    unificarBase()

} 

function populateTable(asteroids) {
    const tableBody = document.getElementById("asteroidDataBody");
    tableBody.innerHTML = ""; // Limpiar contenido existente

    asteroids.forEach(asteroid => {
        const row = document.createElement("tr");
        //console.log(asteroid.nasa_jpl_url)

        row.innerHTML = `
            <td>${asteroid.asteroid_id}</td>
            <td>${asteroid.is_potentially_hazardous_asteroid}</td>
            <td><a href="${asteroid.nasa_jpl_url}" target="_blank">Link</a></td>
        `;

        tableBody.appendChild(row);
    });
}


// Ejemplo de uso con un asteroide
//const datosFiltrados = extraerDatosAsteroide(asteroidData['2096590']);
//console.log(datosFiltrados);




/// creacion de planetas de sistema solar
/* Name? semiMajorAxis?a 
        inclination:?i 
        perihelionArgument?peri 
        eccentricity?e 
        longitudeAscendingNode?node  
        meanAnomaly?M 
        orbitalPeriodSideral?period
*/
///"Marte",1.5236623,1.85061,336.04084084,0.09341233,49.57854,355.,1.881
// creacion de cuerpo celeste

const cuerposCelestes = [
    { name: 'Mercury', semiMajorAxis: 0.38709893, 
                        inclination: 7.00487, 
                        perihelionArgument: 77.46, 
                        eccentricity: 0.20563069, 
                        longitudeAscendingNode: 48.33167, 
                        meanAnomaly: 252.25, 
                        orbitalPeriodSideral: 0.240846 },

    { name: 'Venus', semiMajorAxis: 0.72333199, 
                        inclination: 3.39471, 
                        perihelionArgument: 131.77, 
                        eccentricity: 0.00677323, 
                        longitudeAscendingNode: 76.68069, 
                        meanAnomaly: 181.98, 
                        orbitalPeriodSideral: 0.615 },

    { name: 'Earth', semiMajorAxis: 1.00000011, 
                        inclination: 0.00005, 
                        perihelionArgument: 100.47,
                        eccentricity: 0.01671022, 
                        longitudeAscendingNode: -11.26064, 
                        meanAnomaly: 100.47, 
                        orbitalPeriodSideral: 1 },

    { name: 'Mars', semiMajorAxis: 1.5236623, 
                        inclination: 1.85061, 
                        perihelionArgument: 336.04084084, 
                        eccentricity: 0.09341233, 
                        longitudeAscendingNode: 49.57854, 
                        meanAnomaly: 355.43, 
                        orbitalPeriodSideral: 1.881 },

    { name: 'Jupiter', semiMajorAxis: 5.20336301, 
                        inclination: 1.30530, 
                        perihelionArgument: 14.75385, 
                        eccentricity: 0.04839266, 
                        longitudeAscendingNode: 100.55615, 
                        meanAnomaly: 34.40438, 
                        orbitalPeriodSideral: 11.862 }
];

// Recorrer el arreglo y crear un nuevo objeto Trajectory para cada cuerpo celeste
cuerposCelestes.forEach(Planetas=> {
    const trayectoria = new Trajectory(
        Planetas.name,
        Planetas.semiMajorAxis,
        Planetas.inclination,
        Planetas.perihelionArgument,
        Planetas.eccentricity,
        Planetas.longitudeAscendingNode,
        Planetas.meanAnomaly,
        Planetas.orbitalPeriodSideral
    );
    heavenlyBodies.push(trayectoria);
    //console.log(trayectoria) 
});

// generar la orbita que siquen 
//console.log(heavenlyBodies)

const [first,second,third,fourt,five] = traceOrbits(heavenlyBodies);
//console.log(first, second, third,fourt,five);

const linea_orbita = first;
const linea_orbita1 = second;
const linea_orbita2 = third;
const linea_orbita3 = fourt;
const linea_orbita4 = five;


//traceOrbits(heavenlyBodies)
let gui;

let camera, scene, renderer, labelRenderer;

const layers = {

    'Toggle Planet': function () {

        camera.layers.toggle(0);

    },
    'Toggle Orbits': function () {

        camera.layers.toggle(1);

    },
    'Enable All': function () {

        camera.layers.enableAll();

    },

    'Disable All': function () {

        camera.layers.disableAll();

    }

};


/// CONSTRUCTOR DE CLASE
class cuerpoCeleste extends THREE.Mesh {
    constructor(name, radio, textura = "../textures/defaut.jpg") {
        // Crear la geometría y el material
        const Geometry = new THREE.SphereGeometry(radio, 200, 200);
        const Material = new THREE.MeshPhongMaterial({
            specular: 0x333333,
            shininess: 5,
            map: new THREE.TextureLoader().load(textura),
            normalScale: new THREE.Vector2(0.85, 0.85)
        });

        // Llamar al constructor de la clase padre (THREE.Mesh)
        super(Geometry, Material);

        // Propiedades adicionales
        this.name = name;
        this.radio = radio;
        this.textura = textura;
        this.haloActivo = false; // Control para saber si el halo está activado o no
        this.haloMesh = null;    // Referencia al halo
        this.isPlanet = true;    // Marcar este objeto como un planeta

        // Crear la etiqueta para el cuerpo celeste
        const cuerpoDiv = document.createElement('div');
        cuerpoDiv.className = 'label';
        cuerpoDiv.textContent = `${this.name}`;
        cuerpoDiv.style.backgroundColor = 'transparent';
        cuerpoDiv.style.color = 'green';  // Cambiar el color del texto
        cuerpoDiv.style.fontSize = '20px'; // Ajustar el tamaño de la fuente, opcional
        cuerpoDiv.style.fontWeight = 'bold'; // Cambiar el peso de la fuente, opcional

        const cuerpoLabel = new CSS2DObject(cuerpoDiv);
        cuerpoLabel.position.set(1.8 * this.radio, 0, 0);
        cuerpoLabel.center.set(0, 1);
        this.add(cuerpoLabel); // Agregar la etiqueta al objeto
    }

    // Método para activar o desactivar el halo
    toggleHalo() {
        if (this.haloActivo) {
            // Deshabilitar el halo removiéndolo de la escena
            this.remove(this.haloMesh);
            this.haloActivo = false;
        } else {
            // Crear el halo y añadirlo
            const glowGeometry = new THREE.SphereGeometry(this.radio * 1.5, 32, 32);
            const glowMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    "c": { value: 0.5 },
                    "p": { value: 2.0 },
                    glowColor: { value: new THREE.Color(0xFFD700) }, // Color dorado
                    viewVector: { value: camera.position }
                },
                vertexShader: `
                    precision mediump float;
                    uniform vec3 viewVector;
                    uniform float c;
                    uniform float p;
                    varying float intensity;

                    void main() {
                        vec3 vNormal = normalize(normalMatrix * normal);
                        vec3 vNormView = normalize(viewVector - (modelViewMatrix * vec4(position, 1.0)).xyz);
                        intensity = pow(c - dot(vNormal, vNormView), p);
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    precision mediump float;
                    uniform vec3 glowColor;
                    varying float intensity;

                    void main() {
                        vec3 glow = glowColor * intensity;
                        gl_FragColor = vec4(glow, 1.0);
                    }
                `,
                side: THREE.BackSide,
                blending: THREE.AdditiveBlending,
                transparent: true
            });

            this.haloMesh = new THREE.Mesh(glowGeometry, glowMaterial);
            this.add(this.haloMesh);
            this.haloActivo = true;
        }
    }

    // Método para cambiar la posición del planeta
    Variar_posicion(xParement, yParament, zParament) {
        this.position.set(xParement, zParament, yParament);
    }

    // Método para rotar el planeta
    rotar() {
        this.rotation.y += 0.01;  // Ejemplo de rotación en el eje Y
    }
}


class cuerpoAsteroid extends THREE.Mesh {
    constructor(name, radio, textura = "../textures//tex_asteroid.jpg",map = "../textures/tex_asteroid_map.jpg",id= "??") {
        // Crear la geometría y el material
        const Geometry = new THREE.SphereGeometry(radio, 20, 20);
        const positionAttribute = Geometry.attributes.position;
        Geometry.scale(1, 0.6, 1);

        // // Modificar la geometría para hacerla irregular
        for (let i = 0; i < positionAttribute.count; i++) {
            const x = positionAttribute.getX(i);
            const y = positionAttribute.getY(i);
            const z = positionAttribute.getZ(i);

            // Aplicar aleatoriedad a cada vértice
            positionAttribute.setXYZ(i, 
                x + (Math.random() - 1) * 0.08,
                y + (Math.random() - 1) * 0.08,
                z + (Math.random() - 1) * 0.08
            );
        }
        // Actualizar la geometría
        positionAttribute.needsUpdate = true;


        const Material = new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load(textura),
            //normalMap: new THREE.TextureLoader().load(map),
        });

        // Llamar al constructor de la clase padre (THREE.Mesh)
        super(Geometry, Material);

        // Propiedades adicionales
        this.cuerpoId = id;
        this.name = name;
        this.radio = radio;
        this.textura = textura;
        this.isPlanet = false;    // Marcar este objeto como un planeta

        // Crear la etiqueta para el cuerpo celeste
        const cuerpoDiv = document.createElement('div');
        cuerpoDiv.className = 'label';
        cuerpoDiv.textContent = `${this.name}`;
        cuerpoDiv.style.backgroundColor = 'transparent';


        const cuerpoLabel = new CSS2DObject(cuerpoDiv);
        cuerpoLabel.position.set(1.5 * this.radio, 0, 0);
        cuerpoLabel.center.set(0, 1);
        this.add(cuerpoLabel); // Agregar la etiqueta al objeto
    }

    // Método para cambiar la posición del Asteroide
    Variar_posicion(xParement, yParament, zParament) {

        this.position.set(xParement, zParament, yParament);
    }

    // Método para rotar el planeta
    rotar() {
        this.rotation.y += 0.01;  // Ejemplo de rotación en el eje Y
    }
}



// declaracion de Ceuerpos planetarios
let SOL;
let Luna;

let MERCURIO = new cuerpoCeleste("Mercury",0.1,"../textures/textura-mercurio.jpg");
let VENUS = new cuerpoCeleste("Venus",0.15,"../textures/venus.jpg");
let TIERRA = new cuerpoCeleste("Earth",0.2,"../textures/tierra.jpg");
let MARTE = new cuerpoCeleste("Mars",0.2,"../textures/marte.jpeg");
let JUPITER = new cuerpoCeleste("Jupiter",0.3,"../textures/jupiter.jpeg");



init();
animate();



// FUNCIONES ///////////////////////////////////////

function init() {
    
    const SOL_RADIUS = 0.5;
    const LUNA_RADIUS = 0.08;

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 200 );
    camera.position.set( 20, 6, 20 );
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
    //scene.add( axesHelper );

    Luna
    const lunaGeometry = new THREE.SphereGeometry( LUNA_RADIUS, 16, 16 );
    const lunaMaterial = new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load(`../textures/luna.jpeg`),
    });
    Luna = new THREE.Mesh( lunaGeometry, lunaMaterial );
    scene.add(Luna);

    // Crear la etiqueta para el cuerpo celeste
    const lunaDiv = document.createElement('div');
    lunaDiv.className = 'label';
    lunaDiv.textContent = `Moon`;
    lunaDiv.style.backgroundColor = 'transparent';
    lunaDiv.style.color = 'blue';  // Cambiar el color del texto
    lunaDiv.style.fontSize = '20px'; // Ajustar el tamaño de la fuente, opcional
    lunaDiv.style.fontWeight = 'bold'; // Cambiar el peso de la fuente, opcional


    
    const lunaLabel = new CSS2DObject(lunaDiv);
    lunaLabel.position.set(1.8 * LUNA_RADIUS, 0, 0);
    lunaLabel.center.set(0, 1);
    Luna.add(lunaLabel); // Agregar la etiqueta al objeto
    


    // sol
    const solGeometry = new THREE.SphereGeometry( SOL_RADIUS, 16, 16 );
    const solMaterial = new THREE.MeshBasicMaterial({

        map: new THREE.TextureLoader().load(`../textures/sol.jpeg`),
    });
    SOL = new THREE.Mesh( solGeometry, solMaterial );
    scene.add( SOL);
    // Luz simulando el Sol
    const sunlight = new THREE.PointLight(0xffffff, 100, 200);
    sunlight.position.set(0, 0, 0);
    scene.add(sunlight)


    // scene.add(orbaste);
    // scene.add(orbaste1);
    // scene.add(orbaste2);
    // scene.add(orbaste3);


    /// objeto de la ecena
    
    scene.add(linea_orbita);
    scene.add(linea_orbita1);
    scene.add(linea_orbita2);
    scene.add(linea_orbita3);
    scene.add(linea_orbita4);


    scene.add(MERCURIO);
    scene.add(VENUS);
    scene.add(TIERRA);
    scene.add(MARTE);
    scene.add(JUPITER);
   

    //Delimitar capas de visualizacion
    linea_orbita.layers.set(1);
    linea_orbita1.layers.set(1);
    linea_orbita2.layers.set(1);
    linea_orbita3.layers.set(1);
    linea_orbita4.layers.set(1);

    SOL.layers.set(3);
    MERCURIO.layers.set(3);
    VENUS.layers.set(3);
    TIERRA.layers.set(3);
    MARTE.layers.set(3);
    JUPITER.layers.set(3);
   


    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('container').appendChild(renderer.domElement);

    labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize( window.innerWidth, window.innerHeight );
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0px';
    document.getElementById('container').appendChild( labelRenderer.domElement );


    const controls = new OrbitControls( camera, labelRenderer.domElement );
    controls.minDistance = 5;
    controls.maxDistance = 100;

    //

    window.addEventListener( 'resize', onWindowResize );

    initGui();
    // Agregar el evento de clic
    window.addEventListener('click', onMouseClick, false)

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

    labelRenderer.setSize( window.innerWidth, window.innerHeight );

}


function animate() {

    //const time = Date.now() * 0.0001;
    requestAnimationFrame(animate);

    //const elapsed =  clock.getElapsedTime();
    //console.log(heavenlyBodies)

    //let moonAngle = 0;         // Un ángulo para controlar la órbita de la Luna


    const position = updatePosition(heavenlyBodies,simSpeed);


    position.forEach(({ name, currentPosition }) => {

    // Verificar si el nombre del cuerpo es "TIERRA"
        if (name === "Mercury") {
            // Suponiendo que currentPosition es un arreglo con [X, Y, Z]
            const [Xpos, Ypos, Zpos] = currentPosition;
            // Llamar al método Variar_posicion con las coordenadas
            MERCURIO.Variar_posicion(Xpos, Ypos, Zpos);
        }
     
        if (name === "Earth") {
            // Suponiendo que currentPosition es un arreglo con [X, Y, Z]
            const [Xpos, Ypos, Zpos] = currentPosition;
            TIERRA.rotar();

            // Actualizar la posición de la Tierra
            TIERRA.Variar_posicion(Xpos, Ypos, Zpos);
    
            // Calcular la posición de la Luna alrededor de la Tierra
            moonAngle += moonSpeed; // Aumentar el ángulo para simular el movimiento orbital
    
            const moonX = Xpos + 0.4 * Math.cos(moonAngle); // Desplazamiento en X
            const moonY = Ypos + 0.4* Math.sin(moonAngle); // Desplazamiento en Z
    
            // Actualizar la posición de la Luna en relación a la Tierra
            Luna.position.set(moonX, Zpos, moonY);

        }
        if (name === "Mars") {
            // Suponiendo que currentPosition es un arreglo con [X, Y, Z]
            const [Xpos, Ypos, Zpos] = currentPosition;

            // Llamar al método Variar_posicion con las coordenadas
           // console.log(MARTE)
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
        

    });
    
    if(Asteroid_arranche){

        positionAsteriods = updatePosition(allAsteroids,simSpeedAsteroids);
        //console.log("Ingreso al simulador")
        //console.log(allAsteroids)
        // Aplicar la posición a todos los asteroides
        //console.log(positionAsteriods)
        positionAsteriods.forEach(({name,currentPosition}) => {
            //console.log(name);
            // Aquí buscamos el asteroide en allCuerpoAsteroids para actualizar su posición
            //console.log(`Asteroide: ${name}, Posición: ${currentPosition}`)
            const asteroide = allCuerpoAsteroids.find(ast => ast.name === name);
            //console.log(`el asteroide es ${asteroide.name}`)
            //console.log(asteroide)
            if (asteroide) {
                //console.log("entrraraad")
                const [Xpos, Ypos, Zpos] = currentPosition;
                //console.log(`datos x ${Xpos}  y  ${Ypos} `)
                //console.log(asteroide)
                asteroide.Variar_posicion(Xpos, Ypos, Zpos); // Mover el asteroide
            }
            if (!asteroide) {
                console.warn(`Asteroide con nombre ${name} no encontrado.`);
            }
        });
       //console.log("nsdnfnsgingsjian")
    }

    renderer.render( scene, camera );
    labelRenderer.render( scene, camera );

}





function updateTheDate() { 
    // Display the simulated date to the right of the model.
   //  epoch.setTime(epoch.getTime() + simSpeed * 86400)
	 if (simSpeed == 1) {
	   epoch.setDate(epoch.getDate() + 1) ;            // At maximum speed, increment calendar by a day for each clock-cycle.
	 } else {  epoch.setTime(epoch.getTime() + simSpeed * 24 * 3600000) ; }  // 24 hours * milliseconds in an hour * simSpeed 

//	 document.getElementById("modelDate").innerHTML = (epoch.getMonth() + 1) + "-" + epoch.getDate() + "-" + epoch.getFullYear() ;
   }


function initGui() {

    gui = new GUI();

    gui.title( 'Camera Layers' );

    gui.add( layers, 'Toggle Planet' );
    gui.add( layers, 'Toggle Orbits' );
    gui.add( layers, 'Enable All' );
    gui.add( layers, 'Disable All' );

    gui.open();

}
