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
        const listaEmpleados = await empleados.obtenerUsuarios();
        const empleado_espe = listaEmpleados.find(r => r.employee_id === id_emp);

        if (!empleado_espe) {
            return res.status(404).json({ error: "Empleado no encontrado" });
        }
        res.status(200).json(empleado_espe);
    } catch (error) {
        res.status(500).json({ error: "Error interno al buscar el empleado" });
    }
});

router.post('/', async (req, res) => {
    const parmetros = req.body;
    console.log(parmetros);
    if (parmetros){
    res.status(200).json("todo ok")}
    else {res.status(500).json("no se recibio nada.")}
}
);

router.delete('/:id', async (req, res) =>{
    const id_emp = req.params.id;
    console.log(id_emp);


})



// Exportamos el enrutador
module.exports = router;