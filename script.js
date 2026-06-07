
const nuevoEmpleado = {
    salario: 444,
    ape: "Ortega",
    nombre: "Carlos",

    puesto: "Desarrollador Backend",
    

};
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

const boton = document.getElementById("12");
boton.addEventListener("click", () =>  {
    console.log("d")
    crearEmpleado(nuevoEmpleado);
});



async function eliminar(id) {
    try {
        const respuesta = await fetch(`http://localhost:3000/api/empleado/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!respuesta.ok) {
            throw new Error(`HTTP error! status: ${respuesta.status}`);
        }

        const datosServidor = await respuesta.json();
        console.log('Eliminado con exito:', datosServidor);
    } catch (error) {
        console.error('Error al eliminar:', error);
    }
}

const boton2 = document.getElementById("22");
boton2.addEventListener("click", () =>  {
    console.log(nuevoEmpleado.salario);
    
    eliminar(nuevoEmpleado.salario);
});