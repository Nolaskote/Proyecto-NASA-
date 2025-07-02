// Exporta la función traerDatos para ser utilizada en otro archivo
export function traerDatos(ruta, text) {
    return new Promise((resolve, reject) => {
        const xttp = new XMLHttpRequest();
        console.log(`${text}`);
        xttp.open('GET', `${ruta}`, true);
        xttp.send();
        xttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let datos = JSON.parse(this.responseText);

                // Resolver la promesa con los datos únicos
                resolve(datos);
                //console.log(datos)
            } else if (this.readyState == 4 && this.status !== 200) {
                // En caso de error, rechazar la promesa
                reject('Error en la consulta');
            }
        };
    });
}


export function limpiarPropiedadesArreglo(asteroides) {
    return asteroides.map(asteroide => {
        // Eliminar las propiedades que no se necesitan
        const { links, neo_reference_id, nasa_jpl_url, ...resto } = asteroide;
        return resto;  // Devolver el objeto limpio
    });
}
