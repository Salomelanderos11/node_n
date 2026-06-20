const express = require('express');
const router = express.Router();
const cat = require('../baseD/categorias');


function manejarErroresPostgres(error, res) {
    console.error("Detalle del error en BD:", error);

    if (error.code === '23503') {
        return res.status(400).json({ error: "Operación inválida. El cliente, empleado o producto especificado no existe en el sistema." });
    }
    if (error.code === '23502') {
        return res.status(400).json({ error: `El campo obligatorio [${error.column}] está vacío o ausente.` });
    }
    if (error.code === '22P02') {
        return res.status(400).json({ error: "Formato de datos incorrecto detectado por la base de datos." });
    }

    return res.status(500).json({ error: "Ocurrió un error inesperado en el servidor." });
}



router.get('/', async (req, res) => {
    try {
        const catq = await cat.obtener();
        res.status(200).json({res:catq})

    } catch (error) {
            res.status(500).json({ error: "Error interno al recuperar el listado de ventas."});
    }
    
});


router.get('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
        return res.status(400).json({ error: "El ID proporcionado debe ser un valor numérico válido." });
        }
        const catq = await cat.obtener(id);
        res.status(200).json({res:catq})

    } catch (error) {
            res.status(500).json({ error: "Error interno al recuperar el listado."});
    }
    
});


router.post('/', async (req, res) => {
    try {
        const ncat = req.body;
        console.log(ncat);
        const catq = await cat.insertar(ncat);
        res.status(200).json({res:catq})

    } catch (error) {
            res.status(500).json({ error: "Error interno al recuperar el listado."});
    }
    
});


module.exports = router;