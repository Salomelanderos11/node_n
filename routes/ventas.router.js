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


module.exports = router;
