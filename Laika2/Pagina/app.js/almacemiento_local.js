function obtenerDatosLocalStorage() {
    let todosLosDatos = []; // Arreglo para almacenar todos los datos combinados

    // Recorrer todas las claves de LocalStorage
    for (let i = 0; i < localStorage.length; i++) {
        const clave = localStorage.key(i); // Obtener la clave
        const valor = localStorage.getItem(clave); // Obtener el valor asociado a la clave

        try {
            // Intentar parsear el valor como JSON
            const datos = JSON.parse(valor);

            // Verificar si el valor parseado es un objeto que contiene datos de asteroides
            if (datos && datos.near_earth_objects) {
                // Extraer los datos de near_earth_objects y combinarlos en un solo arreglo
                Object.keys(datos.near_earth_objects).forEach(fecha => {
                    todosLosDatos.push(...datos.near_earth_objects[fecha]);
                });
            }
        } catch (error) {
            console.error(`Error al procesar los datos de la clave: ${clave}`, error);
        }
    }

    return todosLosDatos;
}

// Llamar a la función para obtener los datos combinados de localStorage
const datosCombinados = obtenerDatosLocalStorage();

// Función para exportar datos como un archivo JSON
function exportarDatosComoJSON(datos, nombreArchivo) {
    // Convertir los datos a formato JSON
    const datosStr = JSON.stringify(datos, null, 2);

    // Crear un blob (objeto de datos) con los datos
    const blob = new Blob([datosStr], { type: 'application/json' });

    // Crear un enlace temporal para la descarga
    const enlace = document.createElement('a');
    enlace.href = URL.createObjectURL(blob);
    enlace.download = nombreArchivo;

    // Simular un clic en el enlace para descargar el archivo
    enlace.click();

    // Limpiar el objeto URL
    URL.revokeObjectURL(enlace.href);
}

// Función para obtener y exportar los datos de queryIndex y asteroidData
function exportarEstadoActual() {
    const queryIndex = localStorage.getItem('queryIndex');
    const asteroidData = localStorage.getItem('asteroidData');

    // Crear un objeto con el estado actual
    const estadoActual = {
        queryIndex: queryIndex ? JSON.parse(queryIndex) : null,
        asteroidData: asteroidData ? JSON.parse(asteroidData) : {}
    };

    // Exportar el estado actual como archivo JSON
    exportarDatosComoJSON(estadoActual, 'estado_actual.json');
}

// Exportar los datos de los asteroides como un archivo JSON
exportarDatosComoJSON(datosCombinados, 'datos_asteroides.json');

// Exportar el estado de queryIndex y asteroidData
exportarEstadoActual();
