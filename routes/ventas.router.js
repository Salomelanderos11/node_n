const express = require('express');
const router = express.Router();
const ventas = require('../baseD/ventas');

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

        const{ fecha_inicio , fecha_fin }= req.query;
        console.log(fecha_inicio,fecha_fin,22);
        if(inicio && fin){
            const listaventas = await ventas.obtenerventas_intervalo([fecha_inicio , fecha_fin]);     
            return res.status(200).json(listaventas);
        }    
                 
            const listaventas = await ventas.obtenerventas();     
            res.status(200).json(listaventas);
    } catch (error) {
            res.status(500).json({ error: "Error interno al recuperar el listado de ventas."});
    }
    
});


router.get('/:folio', async (req, res) => {
    const folio = parseInt(req.params.folio, 10);
    if (isNaN(folio)) {
        return res.status(400).json({ error: "El folio proporcionado debe ser un valor numérico válido." });
    }

    try {
        const venta = await ventas.obtenerventa(folio);
        
        if (!venta || venta.length === 0) {     
            return res.status(404).json({ error: `La orden con el folio [${folio}] no fue encontrada.` });
        }
        
        res.status(200).json(venta);
    } catch (error) {
        res.status(500).json({ error: "Error interno al buscar la orden solicitada." });
    }
});

router.post('/', async (req, res) => {
    const datos = req.body;
    
    if (!datos || Object.keys(datos).length === 0) {
        return res.status(400).json({ error: "El cuerpo de la petición no contiene datos para procesar." });
    }
    if (!datos.detalles || !Array.isArray(datos.detalles) || datos.detalles.length === 0) {
        return res.status(400).json({ error: "No puedes registrar una venta sin añadir artículos en los detalles." });
    }

    try {
        const respuesta = await ventas.insertarventa(datos);
        res.status(201).json(respuesta); 
    } catch (error) {
        manejarErroresPostgres(error, res);
    }
});

router.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
        return res.status(400).json({ error: "El ID a eliminar debe ser un valor numérico." });
    }
     
    try {
        const respuesta = await ventas.eliminarorden(id);
        
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
        return res.status(400).json({ error: "El ID de la orden debe ser numérico." });
    }
    if (!body || !Array.isArray(body) || body.length === 0) {
        return res.status(400).json({ error: "Debes enviar un arreglo con los productos que deseas actualizar." });
    }

    try {
        const respuesta = await ventas.actualizacionParcial(id, body);
        
        if (respuesta.exito === true) {
            return res.status(200).json(respuesta);
        } else {
            return res.status(400).json({ error: respuesta.error });
        }
    } catch (error) {
        res.status(500).json({ error: "Error interno al intentar actualizar los productos de la orden." });
    }
});

module.exports = router;