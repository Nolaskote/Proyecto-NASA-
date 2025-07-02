import * as THREE from "three";


// Constructor to generate objects that identify orbital elements.
export function Trajectory(name, smA,oI,aP,oE,aN,mAe,Sidereal){

   this.name = name                               // name the object
   this.smA = smA                 //a             // semi major axis
   this.oI = oI * 0.01745329      //i              // orbital inclination --> convert degrees to radians
   this.aP = aP * 0.01745329      //peri           // argument of Perigee --> convert degrees to radians
   this.oE = oE                   //e             // orbital eccentricity
   this.aN = aN * 0.01745329      //node           // ascending node --> convert degrees to radians
   this.period = Sidereal         //period                 // siderial period as a multiple of Earth's orbital period
   this.epochMeanAnomaly = mAe * 0.01745329 //M   // mean anomaly at epoch 
   this.trueAnomoly = 0                           // initialize to mean anomaly at epoch
   this.position = [0,0,0] 
   this.time = 0 
}
//--------------------------------------------
//        Trajectory Propagator
//--------------------------------------------
Trajectory.prototype.propagate = function(uA){
// Purpose: Determine a position on an orbital trajectory based on a true anomoly.
// Used by the traceOrbits function to draw the orbits.
var pos = [] ;
var xdot; var ydot; var zdot;            // velocity coordinates
var theta = uA;                          // Update true anomaly.
var smA = this.smA;                      // Semi-major Axis
var oI =  this.oI ;                      // Orbital Inclination
var aP = this.aP ;                       // Get the object's orbital elements.
var oE = this.oE;                        // Orbital eccentricity
var aN = this.aN ;                       // ascending Node
var sLR = smA * (1 - oE^2) ;             // Compute Semi-Latus Rectum.
var r = sLR/(1 + oE * Math.cos(theta));  // Compute radial distance.

// Compute position coordinates pos[0] is x, pos[1] is y, pos[2] is z
pos[0] = r * (Math.cos(aP + theta) * Math.cos(aN) - Math.cos(oI) * Math.sin(aP + theta) * Math.sin(aN)) ;  
pos[1] = r * (Math.cos(aP + theta) * Math.sin(aN) + Math.cos(oI) * Math.sin(aP + theta) * Math.cos(aN)) ;
pos[2] = r * (Math.sin(aP + theta) * Math.sin(oI)) ;

return pos ;
}

//-----------------------------------------------------------------------------------------------------
export function traceOrbits(heavenlyBodies) {
   var material = new THREE.LineBasicMaterial({ color: 0x999999 });
   console.log("Entering traceOrbits " + heavenlyBodies.length);

   const lines = []; // Arreglo para almacenar las líneas generadas.

   for (var hB in heavenlyBodies) {
       var orbPos = [];
       var positions = []; // Arreglo para almacenar las posiciones de los vértices.

       var i = 0.0;
       while (i <= 6.28) { // 6.28 es aproximadamente 2π
           orbPos = heavenlyBodies[hB].propagate(i); // Propaga las posiciones de la órbita.
           // Almacena las coordenadas x, y, z en el arreglo de posiciones.
           positions.push(orbPos[0], orbPos[2], orbPos[1]); // No es necesario toFixed aquí.

           i += 0.0785; // Incrementa el ángulo para la siguiente posición.
       }
      
       // Convertir el arreglo de posiciones en un Float32Array
       const positionsNumbers = new Float32Array(positions);
      
       // Crea un nuevo BufferGeometry.
       var geometry = new THREE.BufferGeometry();
       // Establece el atributo de posición en la geometría.
       geometry.setAttribute('position', new THREE.BufferAttribute(positionsNumbers, 3));
       //console.log(geometry)
       // Crea una línea basada en la geometría y el material.
       var line = new THREE.Line(geometry, material);
       var orbitName = heavenlyBodies[hB].name + "_trace";
       line.name = orbitName;

       // Añade la línea al escenario.
       //scene.add(line);
       lines.push(line); // Almacena la línea en el arreglo.

       //console.log("line name  " + orbitName);
   }

   console.log("Exiting traceOrbits");
   return lines; // Devuelve todas las líneas creadas.
};
/*-------------------------------------------------------------*
 *   Utility functions for true, eccentric and mean anomalies  *
 *-------------------------------------------------------------*/
 function trueToEccentricAnomaly(e,f) {
// http://mmae.iit.edu/~mpeet/Classes/MMAE441/Spacecraft/441Lecture19.pdf slide 7 
 var eccentricAnomaly = 2* Math.atan(Math.sqrt((1-e)/(1+e))* Math.tan(f/2));

	return eccentricAnomaly ;
}
function meanToEccentricAnomaly (e, M) {
// Solves for eccentric anomaly, E from a given mean anomaly, M
// and eccentricty, e.  Performs a simple Newton-Raphson iteration
// Code derived from Matlab scripts written by Richard Rieber, 1/23/2005
// http://www.mathworks.com/matlabcentral/fileexchange/6779-calce-m
   var tol = 0.0001;  // tolerance
   var eAo = M;       // initialize eccentric anomaly with mean anomaly
   var ratio = 1;     // set ratio higher than the tolerance
   var eccentricAnomaly 
while (Math.abs(ratio) > tol) {
    var f_E = eAo - e * Math.sin(eAo) - M;
    var f_Eprime = 1 - e * Math.cos(eAo);
    ratio = f_E / f_Eprime;
    if (Math.abs(ratio) > tol) {
        eAo = eAo - ratio;
	 // console.log ("ratio  " + ratio) ;
	  }
    else
        eccentricAnomaly = eAo;
   }
    return eccentricAnomaly 
} 
function eccentricToTrueAnomaly(e, E) {
 // http://mmae.iit.edu/~mpeet/Classes/MMAE441/Spacecraft/441Lecture19.pdf slide 8
	var trueAnomaly = 2 * Math.atan(Math.sqrt((1+e)/(1-e))* Math.tan(E/2));
	return trueAnomaly
}


// Función para actualizar la posición de los cuerpos celestes y retornar las posiciones con sus nombres
export function updatePosition(heavenlyBodies, simSpeed) {
    var result = [];  // Arreglo para almacenar las posiciones y nombres
    var deltaTime = 0;

    // Iterar sobre cada cuerpo celeste
    for (let hB in heavenlyBodies) {

        // Calcular la posición actual basada en la anomalía verdadera
        var hbTAnomoly = heavenlyBodies[hB].trueAnomoly;
        var currentPosition = heavenlyBodies[hB].propagate(hbTAnomoly);  // Determinar la posición actual

        // Cálculos relacionados con la anomalía
        var n = (2 * Math.PI) / (heavenlyBodies[hB].period * 365.25);  // Movimiento medio en radianes por día
        var e = heavenlyBodies[hB].oE;  // Excentricidad orbital
        var f = heavenlyBodies[hB].trueAnomoly;  // Anomalía verdadera actual

        // Convertir anomalía verdadera a excéntrica
        var eA = trueToEccentricAnomaly(e, f);

        // Calcular la anomalía media actual
        var m0 = eA - e * Math.sin(eA);

        // Incrementar el tiempo con la velocidad de simulación
        deltaTime = simSpeed * n;

        // Actualizar la anomalía media
        var mA = deltaTime + m0;

        // Actualizar el tiempo del cuerpo celeste
        heavenlyBodies[hB].time = heavenlyBodies[hB].time + deltaTime;

        // Convertir de anomalía media a excéntrica y luego a verdadera
        eA = meanToEccentricAnomaly(e, mA);
        var trueAnomaly = eccentricToTrueAnomaly(e, eA);

        // Asignar la nueva anomalía verdadera
        heavenlyBodies[hB].trueAnomoly = trueAnomaly;

        // Añadir al resultado el nombre y la posición actual
        result.push({
            name: heavenlyBodies[hB].name,
            currentPosition: currentPosition
        });
        //console.log(result)
    }

    // Llamada a la función para actualizar la fecha (si es relevante en tu simulación)
    //updateTheDate();

    // Retornar el arreglo con los nombres y posiciones de los cuerpos celestes
    return result;
};

/*----------------------------------------------------------------------------------------------*
 *                            {--- Global variables --}                                         *
 *----------------------------------------------------------------------------------------------*/
var epoch = new Date('December 9, 2014');  // start the calendar 
var simSpeed = 0.75 ;                        // value from the scroll control
var solid = false;                        // start simulation with solid rendering of orbits
var solidLabels = false;                  // start simulation with solid rendering of Labels

// Specify trajectories' sMA, oI, aP, oE, aN, mAe, Sidereal <-- refer to Trajectory constructor.
// Orbital elements source: http://www.met.rdg.ac.uk/~ross/Astronomy/Planets.html#rates
// Orbital period source: http://en.wikipedia.org/wiki/Orbital_period
// Mean Anomoly at epoch for planets http://farside.ph.utexas.edu/teaching/celestial/Celestial/node34.html
// Source: http://neo.jpl.nasa.gov/cgi-bin/neo_elem?type=PHA;hmax=all;max_rows=20;action=Display%20Table;show=1&sort=moid&sdir=ASC
