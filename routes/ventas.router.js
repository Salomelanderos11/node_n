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
     
    //console.log(datos);
   // res.status(200).json({exito:datos});
    try {
        console.log("ok1");
        const respuesta = await ventas.insertarventa(datos);
        //console.log("respuesta");
        if(respuesta){     
            //res.status(200).json("Orden no encontrada");
            res.status(200).json({exito : respuesta});
            console.log("insertado")
        }
        
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error al ejecutar la consulta de insercion" })
    }
});


router.delete('/:id', async (req, res) => {
    console.log("oks1");
    const datos =req.params.id;
     
    //console.log(datos);
   // res.status(200).json({exito:datos});
    try {
        const respuesta = await ventas.eliminarorden(datos);
        //console.log("respuesta");
        if(respuesta.exito == true){
            return res.status(200).json({exito : true, mensaje: "Orden eliminada correctamente."});

        }else{
            res.status(200).json(respuesta);
        }
        
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error al ejecutar la consulta de eliminación" })
    }
});



router.patch('/:id', async (req, res) => {
    const id = req.params.id;
    const body = req.body; 
    if (isNaN(id) || body == null ) return res.status(400).json({ error: "Datos inválidos" });
    try {
        const respuesta = await empleados.actualizacionParcial(id,body);
        res.status(200).json({respuesta: respuesta})
    } catch (error) {
        res.status(500).json({ error: "Error interno al eliminar el empleado//" });
    }

});


module.exports = router;
