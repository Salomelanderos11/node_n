const express = require('express');
const router = express.Router();
const empleados = require('../ejemplo'); // Ajusta la ruta si lo metes en una carpeta

// NOTA: Aquí ya no usas 'app.get', usas 'router.get'
// Tampoco repites '/api/empleado', dejas solo la raíz '/' o el parámetro '/:id'

// 1. GET: Obtener todos los empleados
router.get('/', async (req, res) => {
    try {
        const listaEmpleados = await empleados.obtenerUsuarios();
        res.status(200).json(listaEmpleados);
    } catch (error) {
        res.status(500).json({ error: "Error interno al obtener los empleados" });
    }

});

// 2. GET: Obtener un empleado por ID
router.get('/:id', async (req, res) => {
    const id_emp = parseInt(req.params.id);
    if (isNaN(id_emp)) return res.status(400).json({ error: "ID inválido" });

    try {
        const Empleado = await empleados.obtenerUsuario(id_emp);
        
        if (!Empleado) {
            return res.status(404).json({ error: "Empleado no encontrado" });
        }
        res.status(200).json(Empleado);
    } catch (error) {
        res.status(500).json({ error: "Error interno al buscar el empleado" });
    }
});

router.post('/', async (req, res) => {
    const parmetros = req.body;
    
    if (parmetros && typeof parmetros == "object"){        
        try{
            
            const respuesta = await empleados.insertar(parmetros);
            
            res.status(200).json({respuesta : respuesta});
        }
        catch(error){
            res.status(500).json({ error: "Error interno al insertar el empleado//" });
        }
    }    
    else {
        res.status(500).json("no se recibio nada.")}
}
);

router.delete('/:id',async (req, res)=> {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });
    try {
        const respuesta = await empleados.delete_user(id);
        res.status(200).json({respuesta : respuesta});
    } catch (error) {
        res.status(500).json({ error: "Error interno al eliminar el empleado//" });
    }
})




// Exportamos el enrutador
module.exports = router;