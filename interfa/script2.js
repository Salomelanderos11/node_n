/*
<div class="wrapper-desplegable" id="lista-empleados-seccion">
            <div class="contenido-desplegable">
                <h3>Lista de Empleados Activos</h3>
                <table class="tabla-empleados">
                    <tr>
                        <th>Nombre</th>
                        <th>Puesto</th>
                    </tr>
                    <tr>
                        <td>Juan Pérez</td>
                        <td>Desarrollador</td>
                    </tr>
                    <tr>
                        <td>María López</td>
                        <td>Diseñadora UI</td>
                    </tr>
                </table>
            </div>
        </div>*/
        


const ventasMock = [
    { "order_id": 10248, "order_date": "1996-07-04T07:00:00.000Z", "employee_id": 5, "product_name": "Mozzarella di Giovanni", "unit_price": 34.8, "quantity": 5, "discount": 0, "customer_id": "VINET" },
    { "order_id": 10248, "order_date": "1996-07-04T07:00:00.000Z", "employee_id": 5, "product_name": "Queso Cabrales", "unit_price": 14, "quantity": 12, "discount": 0, "customer_id": "VINET" },
    { "order_id": 10248, "order_date": "1996-07-04T07:00:00.000Z", "employee_id": 5, "product_name": "Singaporean Hokkien Fried Mee", "unit_price": 9.8, "quantity": 10, "discount": 0, "customer_id": "VINET" }
];

/**
 * 1. Obtener datos del servidor
 */
async function solventas() {
    try {
        const respuesta = await fetch('http://localhost:3000/api/ventas');

        if (!respuesta.ok) {
            throw new Error(`HTTP error! status: ${respuesta.status}`);
        }

        const datosServidor = await respuesta.json();
        console.log("Datos del servidor recibidos:", datosServidor);
        return datosServidor;
    } catch (error) {
        // En lugar de ocultar el error, lo propagamos o manejamos para que no rompa la UI
        console.error('Error al recuperar las ventas:', error.message);
        return null; 
    }
}

// Elementos del DOM (Cambiados nombres de variables para que coincidan con Ventas)
const botonVer = document.getElementById('btn-ver-empleados'); // Mantiene tu ID actual de HTML
let seccionLista = document.getElementById("lista-empleados-seccion"); // Mantiene tu ID actual de HTML

/**
 * 2. Generar Tabla de forma Dinámica
 */
function crear_tabla(datos) {
    // Protección crucial: Si el servidor falló o el array viene vacío, evitamos que la app se caiga
    if (!datos || !Array.isArray(datos) || datos.length === 0) {
        seccionLista.innerHTML = `<div class="contenido-desplegable"><h3>No hay registros de ventas disponibles o el servidor está apagado.</h3></div>`;
        return;
    }

    // 1. Limpiamos la sección por si ya había una tabla vieja cargada
    seccionLista.innerHTML = ""; 

    // 2. Creamos los contenedores principales
    let div2 = document.createElement('div');
    div2.className = "contenido-desplegable";
    
    let h = document.createElement('h3');
    h.textContent = "Historial de Ventas Registradas"; // 👈 Corregido el título de la tabla
    
    let tabla = document.createElement('table');
    tabla.className = "tabla-empleados"; // Conserva tu clase CSS actual
    
    // 3. ENCABEZADOS: Creamos la fila de los títulos (Fila Principal)
    let trEncabezado = document.createElement('tr');
    const columnas = Object.keys(datos[0]); // Obtenemos las llaves reales (order_id, product_name...)
    
    columnas.forEach(col => {
        let th = document.createElement('th');
        // Reemplazamos los guiones bajos por espacios para que se vea más limpio en pantalla
        th.textContent = col.replace('_', ' ').toUpperCase(); 
        trEncabezado.appendChild(th);
    });
    tabla.appendChild(trEncabezado);

    // 4. DATOS: Recorremos cada registro de venta
    datos.forEach(venta => {
        let trDatos = document.createElement('tr');
        
        columnas.forEach(col => {
            let td = document.createElement('td');
            let valor = venta[col];

            // Formateo estético opcional: Si es la fecha ISO, la hacemos legible
            if (col === 'order_date' && valor) {
                valor = new Date(valor).toLocaleDateString();
            }

            td.textContent = valor;
            trDatos.appendChild(td);
        });
        
        tabla.appendChild(trDatos);
    });

    // 5. INSERCIÓN EN EL DOM
    div2.appendChild(h);
    div2.appendChild(tabla);
    seccionLista.appendChild(div2);
}

/**
 * 3. Event Listener del Botón con protección asíncrona
 */
botonVer.addEventListener('click', async () => {
    // Si la sección ya está abierta, simplemente la cerramos sin volver a llamar a la API
    if (seccionLista.classList.contains('abierto')) {
        seccionLista.classList.remove('abierto');
        return;
    }

    // Si está cerrada, llamamos al servidor
    let listadoVentas = await solventas();
    
    // Le pasamos los datos del servidor. Si dio error (null), la función mostrará un mensaje elegante
    crear_tabla(listadoVentas);
    
    // Mostramos la sección animada por CSS
    seccionLista.classList.add('abierto');
});