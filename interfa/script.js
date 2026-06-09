
const nuevoEmpleado = {
    employeeId: 444,
    lastName: "Ortega",
    firstName: "Carlos",

    title: "Desarrollador Backend",
    

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
        let respuesta_ser;
        if(datosServidor.respuesta){
            respuesta_ser = datosServidor.respuesta.exito == true ?  datosServidor.respuesta.mesaje : "Error al insertar los datos";
        }
        else{
            respuesta_ser = datosServidor.error;
        }
        console.log('Respuesta:', respuesta_ser);
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
    console.log(nuevoEmpleado.employeeId);
    
    eliminar(nuevoEmpleado.employeeId);
});


const cambiosEmpleado = {
    title: "Senior Backend eveloper",
    lastName: "arizona",
    firstName: "jose e.",
    birthDate:"1948-12-07"
    
};

async function acctualizar(id, nuevos) {
    try {
        const respuesta = await fetch(`http://localhost:3000/api/empleado/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            }, body: JSON.stringify(nuevos)
        });

        if (!respuesta.ok) {
            throw new Error(`HTTP error! status: ${respuesta.status}`);
        }

        const datosServidor = await respuesta.json();
        console.log(datosServidor);
        const mesaje = datosServidor.respuesta.exito == true ? ("Se han actualizados los datos",datosServidor.respuesta.msj): "Error :" + datosServidor.respuesta.msj
        console.log(mesaje);
    } catch (error) {
        console.error('Error al actualizar:', error);
    }
}

const boton3 = document.getElementById("32");
boton3.addEventListener("click", () =>  {
    
    acctualizar(444,cambiosEmpleado);
});





a= {"employee_id":444,"last_name":"arizona","first_name":"jose e.","title":"Senior Backend eveloper","title_of_courtesy":null,"birth_date":null,"hire_date":null,"address":null,"city":null,"region":null,"postal_code":null,"country":null,"home_phone":null,"extension":null,"photo":null,"notes":null,"reports_to":null,"photo_path":null}

console.log(Object.keys(a))
