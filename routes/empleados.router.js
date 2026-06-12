const express = require('express');
const router = express.Router();
const empleados = require('../baseD/employees');

function manejarErroresPostgres(error, res) {
    console.error("Detalle del error en BD:", error);

    if (error.code === '23505') {
        return res.status(400).json({ error: "El ID de empleado ya se encuentra registrado en el sistema." });
    }
    if (error.code === '23503') {
        return res.status(400).json({ error: "No se puede eliminar este empleado porque tiene órdenes de venta vinculadas." });
    }
    if (error.code === '23502') {
        return res.status(400).json({ error: `El campo obligatorio [${error.column}] no puede estar vacío.` });
    }

    return res.status(500).json({ error: "Ocurrió un error inesperado en el servidor de base de datos." });
}

router.get('/', async (req, res) => {
    try {
        const listaEmpleados = await empleados.obtenerUsuarios();
        res.status(200).json(listaEmpleados);
    } catch (error) {
        res.status(500).json({ error: "Error interno al recuperar el listado de empleados." });
    }
});

router.get('/:id', async (req, res) => {
    const id_emp = parseInt(req.params.id, 10);
    if (isNaN(id_emp)) {
        return res.status(400).json({ error: "El ID proporcionado debe ser un valor numérico válido." });
    }

    try {
        const empleado = await empleados.obtenerUsuario(id_emp);
        
        if (!empleado) {
            return res.status(404).json({ error: `El empleado con ID ${id_emp} no fue encontrado.` });
        }
        res.status(200).json(empleado);
    } catch (error) {
        res.status(500).json({ error: "Error interno al buscar el empleado solicitado." });
    }
});

router.post('/', async (req, res) => {
    const parametros = req.body;
    
    if (!parametros || typeof parametros !== "object" || Object.keys(parametros).length === 0) {
        return res.status(400).json({ error: "No se recibieron datos válidos en el cuerpo de la petición." });
    }
        
    try {
        const respuesta = await empleados.insertar(parametros);
        res.status(201).json(respuesta); 
    } catch (error) {
        manejarErroresPostgres(error, res);
    }
});

router.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
        return res.status(400).json({ error: "El ID proporcionado debe ser numérico." });
    }

    try {
        const respuesta = await empleados.delete_user(id);
        
        if (respuesta.exito === true) {
            return res.status(200).json(respuesta);
        } else {
            return res.status(404).json(respuesta);
        }
    } catch (error) {
        manejarErroresPostgres(error, res);
    }
});

router.patch('/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const body = req.body; 
    
    if (isNaN(id)) {
        return res.status(400).json({ error: "El ID del empleado debe ser numérico." });
    }
    if (!body || typeof body !== "object" || Object.keys(body).length === 0) {
        return res.status(400).json({ error: "Debes enviar al menos un campo para actualizar." });
    }

    try {
        const respuesta = await empleados.actualizacionParcial(id, body);
        
        if (respuesta.exito === true) {
            return res.status(200).json(respuesta);
        } else {
            return res.status(404).json(respuesta);
        }
    } catch (error) {
        res.status(500).json({ error: "Error interno al intentar actualizar los datos del empleado." });
    }
});

module.exports = router;