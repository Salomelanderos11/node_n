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
const  ventas =
[{"order_id":10248,"order_date":"1996-07-04T07:00:00.000Z","employee_id":5,"product_name":"Mozzarella di Giovanni","unit_price":34.8,"quantity":5,"discount":0,"customer_id":"VINET"},{"order_id":10248,"order_date":"1996-07-04T07:00:00.000Z","employee_id":5,"product_name":"Queso Cabrales","unit_price":14,"quantity":12,"discount":0,"customer_id":"VINET"},{"order_id":10248,"order_date":"1996-07-04T07:00:00.000Z","employee_id":5,"product_name":"Singaporean Hokkien Fried Mee","unit_price":9.8,"quantity":10,"discount":0,"customer_id":"VINET"}];


async function solventas() {
    try {
        const respuesta = await fetch('http://localhost:3000/api/ventas');

        if (!respuesta.ok) {
            throw new Error(`HTTP error! status: ${respuesta.status}`);
        }

        const datosServidor = await respuesta.json();
        console.log(datosServidor);
        return datosServidor
    } catch (error) {
        console.error('Error al guardar:', error);
    }
}

console.log(solventas());

const botonVer = document.getElementById('btn-ver-empleados');

let seccionLista = document.getElementById("lista-empleados-seccion");

// 2. Escuchamos el clic en el botón






function crear_tabla(datos) {
    // 1. Limpiamos la sección por si ya había una tabla vieja cargada
    seccionLista.innerHTML = ""; 
    console.log(datos);

    // 2. Creamos los contenedores principales
    let div2 = document.createElement('div');
    div2.className = "contenido-desplegable";
    
    let h = document.createElement('h3');
    h.textContent = "Lista de Empleados Activos"; // Le asignamos texto al título
    
    let tabla = document.createElement('table');
    tabla.className = "tabla-empleados";
    
    // 3. ENCABEZADOS: Creamos la fila de los títulos (Fila Principal)
    let trEncabezado = document.createElement('tr');
    const columnas = Object.keys(datos[0]); // Obtenemos las llaves (id, nombre, puesto...)
    
    columnas.forEach(col => {
        let th = document.createElement('th');
        th.textContent = col.toUpperCase(); // Convertimos a mayúsculas para estética
        trEncabezado.appendChild(th);
    });
    tabla.appendChild(trEncabezado); // Metemos los encabezados a la tabla

    // 4. DATOS: Recorremos cada empleado del array para crear sus filas de datos
    datos.forEach(empleado => {
        let trDatos = document.createElement('tr'); // Una fila por cada empleado
        
        columnas.forEach(col => {
            let td = document.createElement('td');
            td.textContent = empleado[col]; // Accedemos al valor dinámicamente
            trDatos.appendChild(td);
        });
        
        tabla.appendChild(trDatos); // Añadimos la fila de datos a la tabla
    });

    // 5. INSERCIÓN EN EL DOM (Respetando tu orden de jerarquía)
    div2.appendChild(h);
    div2.appendChild(tabla);
    seccionLista.appendChild(div2);
}




botonVer.addEventListener('click',async () => {
    // toggle() hace magia: si la clase 'abierto' no está, la pone; si ya está, la quita.
    let ab = await solventas();
     crear_tabla(ab);
    seccionLista.classList.toggle('abierto');

});


//crear_tabla(ventas);

       // 1. Guardamos el botón y la sección oculta en variables
