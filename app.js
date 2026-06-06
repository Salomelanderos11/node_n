const express = require('express');
const app = express();
const PORT = 3000;

// Importar el enrutador de empleados
const empleadosRouter = require('./routes/empleados.router');

app.use(express.json());

// Vincular el enrutador a la ruta base que quieras
// Esto hace que automáticamente todo lo que esté dentro de 'empleadosRouter' comience con /api/empleado
app.use('/api/empleado', empleadosRouter);


const nuevoEmpleado = {
    nombre: "Carlos Ortega",
    puesto: "Desarrollador Backend",
    salario: 45000
};

fetch('http://localhost:3000/api/empleado', {
    method: 'POST', // 1. Especificar el método HTTP
    headers: {
        'Content-Type': 'application/json' // 2. Indicar al servidor que enviamos JSON
    },
    body: JSON.stringify(nuevoEmpleado) // 3. Convertir el objeto JS a una cadena JSON
})
.then(response => {
    if (!response.ok) {
        throw new Error(`Error en la petición: ${response.status}`);
    }
    return response.json(); // Convertir la respuesta del servidor a objeto JS
})
.then(data => {
    console.log('Empleado registrado con éxito:', data);
})
.catch(error => {
    console.error('Hubo un fallo al enviar los datos:', error);
});




async function crearEmpleado(empleado) {
    try {
        const respuesta = await fetch('http://localhost:3000/api/empleado', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(empleado)
        });

        if (!respuesta.ok) {
            throw new Error(`HTTP error! status: ${respuesta.status}`);
        }

        const datosServidor = await respuesta.json();
        console.log('Respuesta:', datosServidor);
    } catch (error) {
        console.error('Error al guardar:', error);
    }
}

crearEmpleado(nuevoEmpleado);
app.listen(PORT, () => {
    console.log(`API ejecutándose en http://localhost:${PORT}`);
});