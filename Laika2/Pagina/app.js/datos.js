window.addEventListener('load', () => {
    const form = document.querySelector('#fechaForm');
    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevenir el envío del formulario
        const startDate = document.querySelector('#startDate').value;
        const endDate = document.querySelector('#endDate').value;

        // Verificar que se ingresaron las fechas
        if (startDate && endDate) {
            // Convertir las fechas a objetos Date para calcular la diferencia
            const fechaInicio = new Date(startDate);
            const fechaFin = new Date(endDate);
            
            // Calcular la diferencia en milisegundos y luego convertir a días
            const diferenciaDias = (fechaFin - fechaInicio) / (1000 * 60 * 60 * 24);

            if (diferenciaDias > 8) {
                alert('La diferencia entre la fecha de inicio y la fecha final no puede ser mayor a 8 días.');
            } else if (diferenciaDias < 0) {
                alert('La fecha de inicio no puede ser posterior a la fecha final.');
            } else {
                obtenerDatos(startDate, endDate);
            }
        } else {
            alert('Por favor, ingresa ambas fechas.');
        }
    });

    // Llamar la función obtenerDatos por defecto con una fecha inicial y final predeterminada
    obtenerDatos('2024-01-01', '2024-01-08');
});

function obtenerDatos(date_init, date_finit) {
    const Nasa_api = 'DEMO_KEY';
    const ruta = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${date_init}&end_date=${date_finit}&api_key=${Nasa_api}`;
    
    // Verificar si ya existen datos guardados en LocalStorage
    const datosGuardados = localStorage.getItem(`${date_init}-${date_finit}`);
    
    if (datosGuardados) {
        console.log('Datos cargados desde LocalStorage');
        mostrarDatos(JSON.parse(datosGuardados));
    } else {
        console.log('Consultando datos desde la API');
        fetch(ruta)
        .then(respuesta => respuesta.json())
        .then(resultado => {
            // Guardar los datos en LocalStorage
            localStorage.setItem(`${date_init}-${date_finit}`, JSON.stringify(resultado));
            mostrarDatos(resultado); 
        });
    }
}

function mostrarDatos({ element_count, near_earth_objects }) {
    const titulo = document.querySelector('#titulo');
    titulo.innerHTML = `Número de asteroides detectados: ${element_count}`;

    // Limpiar la tabla antes de agregar nuevos datos
    const tabla = document.querySelector('#tablaDatos');
    tabla.innerHTML = '';

    // Iterar sobre los objetos cercanos a la Tierra por fecha y llenar la tabla
    Object.keys(near_earth_objects).forEach(fecha => {
        near_earth_objects[fecha].forEach(asteroide => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${fecha}</td>
                <td>${asteroide.name}</td>
                <td>${asteroide.id}</td>
                <td><a href="${asteroide.nasa_jpl_url}" target="_blank">Ver en NASA</a></td>
                <td>${asteroide.is_potentially_hazardous_asteroid ? 'Sí' : 'No'}</td>
                <td><a href="${asteroide.links.self}" target="_blank">Link API</a></td>
            `;
            
            tabla.appendChild(row);
        });
    });
}
