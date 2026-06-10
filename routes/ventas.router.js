const express = require('express');
const router = express.Router();
const ventas = require('../baseD/ventas');

router.get('/', async (req, res) => {
    try {
        const listaventas = await ventas.obtenerventas();     
        res.status(200).json(listaventas);
    } catch (error) {
        res.status(500).json({error: "Error interno al obtener las ventas" })
    }
});
router.get('/:folio', async (req, res) => {
    const folio =parseInt( req.params.folio);
    if (isNaN(folio)) return res.status(400).json({ error: "ID inválido" });
    try {
        const venta = await ventas.obtenerventa(folio);
        if(!venta){     
            return res.status(400).json("Orden no encontrada");
        }
        res.status(200).json(venta);
    } catch (error) {
        res.status(500).json({error: "Error interno al buscar la orden" })
    }
});

router.post('/', async (req, res) => {
    const datos =req.body;
     
    console.log(datos);
     res.status(200).json({exito:datos});
    /*try {
        const venta = await ventas.obtenerventa(folio);
        if(!venta){     
            return res.status(400).json("Orden no encontrada");
        }
        res.status(200).json(venta);
    } catch (error) {
        res.status(500).json({error: "Error interno al buscar la orden" })
    }*/
});


module.exports = router;
