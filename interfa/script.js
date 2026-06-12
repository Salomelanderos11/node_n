// =========================================================================
// 🎯 CONFIGURACIÓN DE DATOS DE PRUEBA (MOCKS)
// =========================================================================

const nuevoEmpleado = {
    employeeId: 444,
    lastName: "Ortega",
    firstName: "Carlos",
    title: "Desarrollador Backend"
};

const cambiosEmpleado = {
    title: "Senior Backend Developer",
    lastName: "Arizona",
    firstName: "Jose E.",
    birthDate: "1948-12-07"
};

const productosVenta = [
    { "product_id": 11, "quantity": 5, "discount": 0.15 },
    { "product_id": 42, "quantity": 1, "discount": 0.1 }
];

// 💡 Postgres espera un objeto JSON para mapear los parámetros $1, $2, etc., en req.body
const nuevaVenta = {
    customer_id: 'VINET',
    employee_id: 5,
    order_date: null, // Lo maneja CURRENT_DATE automáticamente
    required_date: '2026-07-09',
    shipped_date: null,
    ship_via: 3,
    freight: 32.38,
    ship_name: 'Vins et alcools Chevalier',
    ship_address: '59 rue de l Abbaye',
    ship_city: 'Reims',
    ship_region: null,
    ship_postal_code: '51100',
    ship_country: 'France',
    detalles: productosVenta // El Router o driver PG se encargarán de procesarlo como JSONB
};

// =========================================================================
// 👥 MÓDULO: EMPLEADOS (FETCHES)
// =========================================================================

/**
 * 1. Crear Empleado (POST)
 */
async function crearEmpleado(empleado) {
    try {
        const respuesta = await fetch('http://localhost:3000/api/empleado', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(empleado)
        });

        const datosServidor = await respuesta.json();

        if (!respuesta.ok) {
            // Si el router arrojó un error controlado (ej. ID duplicado)
            throw new Error(datosServidor.error || `HTTP error! status: ${respuesta.status}`);
        }

        // Como aplanamos la respuesta en el router, leemos directo .mensaje
        console.log('Resultado del Servidor:', datosServidor.mensaje || "Empleado creado con éxito");
    } catch (error) {
        console.error('Error al guardar el empleado:', error.message);
    }
}

/**
 * 2. Eliminar Empleado (DELETE)
 */
async function eliminarEmpleado(id) {
    try {
        const respuesta = await fetch(`http://localhost:3000/api/empleado/${id}`, {
            method: 'DELETE'
        });

        const datosServidor = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(datosServidor.error || `HTTP error! status: ${respuesta.status}`);
        }

        console.log('Eliminado con éxito:', datosServidor.mensaje);
    } catch (error) {
        console.error('Error al eliminar el empleado:', error.message);
    }
}

/**
 * 3. Actualizar Empleado (PATCH)
 */
async function actualizarEmpleado(id, nuevosCambios) {
    try {
        const respuesta = await fetch(`http://localhost:3000/api/empleado/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevosCambios)
        });

        const datosServidor = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(datosServidor.error || `HTTP error! status: ${respuesta.status}`);
        }

        // Corregido: Quitamos el operador ternario roto con comas
        console.log("Servidor dice:", datosServidor.mensaje);
        console.log("Datos actualizados:", datosServidor.datos);
    } catch (error) {
        console.error('Error al actualizar el empleado:', error.message);
    }
}

// =========================================================================
// 📦 MÓDULO: VENTAS (FETCHES)
// =========================================================================

/**
 * 4. Registrar una Venta Completa (POST)
 */
async function registrarVenta(venta) {
    try {
        const respuesta = await fetch('http://localhost:3000/api/ventas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(venta)
        });

        const datosServidor = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(datosServidor.error || `HTTP error! status: ${respuesta.status}`);
        }

        console.log('¡Venta realizada con éxito!');
        console.log('ID de orden generada:', datosServidor.order_id);
    } catch (error) {
        console.error('Error al guardar la venta:', error.message);
    }
}

/**
 * 5. Eliminar una Orden Completa en Cascada (DELETE)
 */
async function eliminarOrden(idVenta) {
    try {
        const respuesta = await fetch(`http://localhost:3000/api/ventas/${idVenta}`, {
            method: 'DELETE'
        });

        const datosServidor = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(datosServidor.error || `HTTP error! status: ${respuesta.status}`);
        }

        console.log('Servidor dice:', datosServidor.mensaje);
    } catch (error) {
        console.error('Error al eliminar la orden:', error.message);
    }
}

// =========================================================================
// 🔘 ASIGNACIÓN DE BOTONES (LISTENERS)
// =========================================================================

const boton1 = document.getElementById("12");
if (boton1) {
    boton1.addEventListener("click", () => {
        console.log("Botón 1 presionado: Creando empleado...");
        crearEmpleado(nuevoEmpleado);
    });
}

const boton2 = document.getElementById("22");
if (boton2) {
    boton2.addEventListener("click", () => {
        console.log("Botón 2 presionado: Eliminando orden...");
        eliminarOrden(11078); // Cambia el número por el ID que gustes probar
    });
}

const boton3 = document.getElementById("32");
if (boton3) {
    boton3.addEventListener("click", () => {
        console.log("Botón 3 presionado: Registrando venta...");
        registrarVenta(nuevaVenta);
    });
}