const el = document.getElementById('poster');
const height1 = el.clientHeight;
const width1 = el.clientWidth;

const cuerposCelestes = [
    { name: 'Mercurio', semiMajorAxis: 0.38709893, 
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

    { name: 'Tierra', semiMajorAxis: 1.00000011, 
                        inclination: 0.00005, 
                        perihelionArgument: 100.47,
                        eccentricity: 0.01671022, 
                        longitudeAscendingNode: -11.26064, 
                        meanAnomaly: 100.47, 
                        orbitalPeriodSideral: 1 },

    { name: 'Marte', semiMajorAxis: 1.5236623, 
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


el.addEventListener('mousemove', evt => {
    const { layerX, layerY } = evt;
    const yRotation = ((layerX - width1 / 2) / width1) * 10;
    const xRotation = ((layerY - height1 / 2) / height1) * -10; // Negar xRotation para el efecto deseado

    const string = `
        perspective(500px)
        scale(1,1)
        rotateX(${xRotation}deg)
        rotateY(${yRotation}deg) /* Cambiar a rotateY */
    `;
    el.style.transform = string; // Corregir 'trasnform' a 'transform'

});

el.addEventListener('mouseout', () => {
    el.style.transform = `
        perspective(500px)
        scale(1,1)
        rotateX(0)
        rotateY(0) /* Cambiar a rotateY */
    `;
});



// Función para cambiar la imagen del poster
export function updatePosterImage(planetName) {
    const posterElement = document.querySelector('#poster');
    const nombre = document.querySelector('#nombre');
    const argPerigee = document.querySelector('#argPerigee');
    const sidereal = document.querySelector('#sidereal');
    const meanAnomoly = document.querySelector('#meanAnomoly');
    const raan = document.querySelector('#raan');
    const semiMajorAxis = document.querySelector('#semiMajorAxis');
    const eccentricity = document.querySelector('#eccentricity');
    const inclination = document.querySelector('#inclination');

    // Buscar los datos del planeta seleccionado
    const planeta = cuerposCelestes.find(p => p.name === planetName);
    console.log(planeta)
    
    if (planeta) {
        // Cambiar la imagen de fondo en función del planeta seleccionado
        switch (planeta.name) {
            case 'Mercurio':
                posterElement.style.backgroundImage = "url('../textures/logo_mercurio.jpg')";
                nombre.textContent = planeta.name;
                argPerigee.textContent = planeta.perihelionArgument;
                sidereal.textContent = planeta.orbitalPeriodSideral;
                meanAnomoly.textContent = planeta.meanAnomaly;
                raan.textContent = planeta.longitudeAscendingNode;
                semiMajorAxis.textContent = planeta.semiMajorAxis;
                eccentricity.textContent = planeta.eccentricity;
                inclination.textContent = planeta.inclination;
                break;
            case 'Venus':
                posterElement.style.backgroundImage = "url('../textures/logo_venus.jpg')";
                nombre.textContent = planeta.name;
                argPerigee.textContent = planeta.perihelionArgument;
                sidereal.textContent = planeta.orbitalPeriodSideral;
                meanAnomoly.textContent = planeta.meanAnomaly;
                raan.textContent = planeta.longitudeAscendingNode;
                semiMajorAxis.textContent = planeta.semiMajorAxis;
                eccentricity.textContent = planeta.eccentricity;
                inclination.textContent = planeta.inclination;
                break;
            case 'Tierra':
                posterElement.style.backgroundImage = "url('../textures/logo_tierra.jpg')";
                nombre.textContent = planeta.name;
                argPerigee.textContent = planeta.perihelionArgument;
                sidereal.textContent = planeta.orbitalPeriodSideral;
                meanAnomoly.textContent = planeta.meanAnomaly;
                raan.textContent = planeta.longitudeAscendingNode;
                semiMajorAxis.textContent = planeta.semiMajorAxis;
                eccentricity.textContent = planeta.eccentricity;
                inclination.textContent = planeta.inclination;
                break;
            case 'Marte':
                posterElement.style.backgroundImage = "url('../textures/logo_marte.jpg')";
                nombre.textContent = planeta.name;
                argPerigee.textContent = planeta.perihelionArgument;
                sidereal.textContent = planeta.orbitalPeriodSideral;
                meanAnomoly.textContent = planeta.meanAnomaly;
                raan.textContent = planeta.longitudeAscendingNode;
                semiMajorAxis.textContent = planeta.semiMajorAxis;
                eccentricity.textContent = planeta.eccentricity;
                inclination.textContent = planeta.inclination;
                break;
            case 'Jupiter':
                posterElement.style.backgroundImage = "url('../textures/logo_jupiter.jpg')";
                nombre.textContent = planeta.name;
                argPerigee.textContent = planeta.perihelionArgument;
                sidereal.textContent = planeta.orbitalPeriodSideral;
                meanAnomoly.textContent = planeta.meanAnomaly;
                raan.textContent = planeta.longitudeAscendingNode;
                semiMajorAxis.textContent = planeta.semiMajorAxis;
                eccentricity.textContent = planeta.eccentricity;
                inclination.textContent = planeta.inclination;
                break;
            default:
                posterElement.style.backgroundImage = "url('../textures/logo_tierra.jpg')";
                nombre.textContent = planeta.name;
                argPerigee.textContent = planeta.perihelionArgument;
                sidereal.textContent = planeta.orbitalPeriodSideral;
                meanAnomoly.textContent = planeta.meanAnomaly;
                raan.textContent = planeta.longitudeAscendingNode;
                semiMajorAxis.textContent = planeta.semiMajorAxis;
                eccentricity.textContent = planeta.eccentricity;
                inclination.textContent = planeta.inclination;
                break;
        }

        // Actualizar el texto del HTML con los datos del planeta

    } else {
        console.error('Planeta no encontrado:', planetName);
    }
}


