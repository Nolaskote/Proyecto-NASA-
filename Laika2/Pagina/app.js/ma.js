document.querySelector('#boton').addEventListener('click', traerDatos);

function traerDatos() {
    const xttp = new XMLHttpRequest();
    console.log("crear base de asteroides")
    xttp.open('GET', 'datos_asteroides.json', true);
    xttp.send();
    xttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let datos = JSON.parse(this.responseText);

            // Función para eliminar nombres repetidos
            let datosUnicos = eliminarNombresRepetidos(datos);

            // Asignar los datos únicos a la variable asteroids
            asteroids = datosUnicos;
            console.log(asteroids);

            // Cargar datos previamente guardados del localStorage
            loadDataFromStorage();

            // Iniciar el proceso de consultas una vez cargados los asteroides
            startQueryProcess();
        }
    };
}

function eliminarNombresRepetidos(datos) {
    let nombresVistos = new Set();
    let resultado = [];

    datos.forEach(asteroide => {
        if (!nombresVistos.has(asteroide.name)) {
            nombresVistos.add(asteroide.name);
            resultado.push(asteroide);
        }
    });

    return resultado;
}

// Declaración de variables
let asteroids = [];
let asteroidData = {};
let queryIndex = 0;
const maxQueriesPerHour = 200;

// Función para realizar una consulta a la API
async function fetchAsteroidData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Error en la consulta');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

// Guardar los datos obtenidos en localStorage
function saveDataToStorage() {
    localStorage.setItem('asteroidData', JSON.stringify(asteroidData));
    localStorage.setItem('queryIndex', queryIndex);
}

// Cargar los datos desde localStorage
function loadDataFromStorage() {
    console.log("Revisar en localStorage")
    const storedData = localStorage.getItem('asteroidData');
    const storedIndex = localStorage.getItem('queryIndex');
    
    if (storedData) {
        asteroidData = JSON.parse(storedData);
        console.log("Datos cargados desde localStorage:", asteroidData);
    }
    
    if (storedIndex) {
        queryIndex = parseInt(storedIndex, 10);
        console.log("Progreso cargado desde localStorage: QueryIndex =", queryIndex);
    }
}

// Función para manejar el proceso de las consultas con retraso
function startQueryProcess() {
    console.log("Inicia adquisicion de Datos")
    const interval = setInterval(async () => {
        if (queryIndex >= asteroids.length || queryIndex >= maxQueriesPerHour) {
            clearInterval(interval); // Detener el intervalo cuando llegamos al límite o terminamos la lista
            console.log('Límite alcanzado o todas las consultas completadas');
            return;
        }

        const asteroid = asteroids[queryIndex];
        const url = asteroid.links.self;

        if (asteroidData[asteroid.id]) {
            console.log(`Asteroide ${asteroid.name} ya consultado, saltando...`);
        } else {
            console.log(`Consultando asteroide: ${asteroid.name}`);

            const data = await fetchAsteroidData(url);
            if (data) {
                asteroidData[asteroid.id] = {
                    close_approach_data: data.close_approach_data,
                    orbital_data: data.orbital_data
                };
                console.log(`Datos guardados para el asteroide ${asteroid.name}`);
                console.log(asteroidData)
                saveDataToStorage(); // Guardar datos en localStorage
            }
        }

        queryIndex++;
        saveDataToStorage(); // Guardar el progreso en localStorage
    }, 90000);  // 80000 ms = 80 segundos, es decir, menos de 50 consultas por hora
}
