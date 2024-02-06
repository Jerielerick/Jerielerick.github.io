document.addEventListener('DOMContentLoaded', function() {
    // Obtener datos con el método GET
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'datos.json', true);

    xhr.onload = function() {
        if (xhr.status === 200) {
            const datos = JSON.parse(xhr.responseText);
            mostrarDatosEnTabla(datos);
        }
    };

    xhr.send();
});

function mostrarDatosEnTabla(datos) {
    const tabla = document.getElementById('miTabla');

    // Crear encabezados de tabla
    const encabezados = Object.keys(datos[0]);
    const encabezadosHTML = encabezados.map(encabezado => `<th>${encabezado}</th>`).join('');
    const encabezadosRow = `<tr>${encabezadosHTML}</tr>`;
    tabla.innerHTML += encabezadosRow;

    // Crear filas de datos
    datos.forEach(fila => {
        const filaHTML = encabezados.map(encabezado => `<td>${fila[encabezado]}</td>`).join('');
        const filaRow = `<tr>${filaHTML}</tr>`;
        tabla.innerHTML += filaRow;
    });
}
