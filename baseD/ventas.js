const db = require('./db');


async function obtenerventas() {
    const sql = `select o.order_id,o.order_date, o.employee_id, p.product_name, od.unit_price,od.quantity, od.discount, o.customer_id from order_details od inner join orders o on o.order_id = od.order_id    
                 inner join products p on p.product_id = od.product_id
group by o.order_id, p.product_name,od.unit_price,od.quantity,od.discount, o.customer_id
order by o.order_date desc,o.order_id`
    try {
        const resultado = await db.query(sql);
        console.log(resultado.rows)
        return resultado.rows;
    } catch (error) {
        console.error("No se pudo obtener las ventas: ",error.messge)
        throw error;
    }
    
}
async function obtenerventa(folio) {
    const sql = `select o.order_id,o.order_date, o.employee_id, od.product_id, od.unit_price,od.quantity, od.discount, o.customer_id from order_details od inner join orders o on o.order_id = od.order_id
                where o.order_id = $1   
                group by o.order_id, od.product_id,od.unit_price,od.quantity,od.discount, o.customer_id
                order by o.order_id, o.order_date`
    let params=[folio]
    try {
        const resultado = await db.query(sql,params);
        //console.log(resultado.rows)
        return resultado.rows;
    } catch (error) {
        console.error("No se pudo obtener las ventas: ",error.messge)
        throw error;
    }
    
}

async function delete_orden(folio) {
    //const folio = [folio]
    const sql = `
        DO $$
        BEGIN
            DELETE FROM order_details WHERE order_id = $1;
            
            DELETE FROM orders WHERE order_id = $1;

        EXCEPTION 
            WHEN OTHERS THEN
                RAISE EXCEPTION 'No se pudo eliminar la orden. Error: %', SQLERRM;
        END $$;
        `;
    try {
        const resultado = await db.query(sql,[folio]);
        if (resultado.rowCount > 0) {
            console.log(`Orden con ID ${folio} eliminada correctamente.`);
            return { exito: true, mensaje: "Empleado eliminado" };
    } else {
      console.log(`No se encontró ninguna Orden con el ID ${folio}.`);
      return { exito: false, mensaje: "La Orden no existe" };
    }
  } catch (err) {
    console.error('Error interno al eliminar la orden:', err.message);
    return { exito: false, error: err.message };
  }
}

async function insertarventa(datos) {
    const sql = `SELECT insertar_orden_completa($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) AS nuevo_id`;
    const params = datos;
    //console.log(params);
    try {
    const resultado = await db.query(sql, params);
    return {
        exito: true,
        order_id: resultado.rows[0].nuevo_id
    };
  } catch (err) {
    console.error('Error en la BD al ejecutar la función:', err.message);
    throw err; 
  }
}



async function eliminarorden(id) {
    const sql = `delete from orders where order_id = $1`;
    
    //console.log(params);
    try {
    const resultado = await db.query(sql, [id]);
    
    if (resultado.rowCount > 0) {
      return {
        exito: true,
        mensaje: `La orden con ID ${id} y sus detalles en cascada fueron eliminados.`
      };
    } else {

      return {
        exito: false,
        mensaje: `No se encontró ninguna orden con el ID ${id}.`
      };
    }
  } catch (err) {
    console.error('Error en la BD al intentar eliminar la orden:', err.message);
    throw err; 
  }
}



const productos = [
    {"product_id": 11, "quantity": 0,"discount": 0.15},
    {"product_id": 42, "quantity": 0,"discount":0.1}
    
]



async function actualizacionParcial(id, params) {
    const productos = [];
    const columnas = Object.keys(params[0]).slice(1);
    
    params.forEach(elementoParam => {
        const valores = Object.values(elementoParam);
        productos.push(valores);
    });
    
    
    let nproductos = productos.flat(1);
    let sql = ''; 

    try {
        await db.query('BEGIN; ');
        let vuelta = 0;

        for (const element of productos)  {
            element.push(id);
            const columnsql = 
                columnas.map((llave, index) => { 
                    const col_tab = llave;
                    return `${col_tab} = $${index + 2}`;
                }).join(', ');
            
            sql = ` update order_details set ${columnsql} where order_id = $${element.length} and product_id = $1; `;
            vuelta += 3;   
            console.log(sql);
            console.log(element);
            
            await db.query(sql, element);          
        }

        await db.query('COMMIT;');
        console.log("Transacción exitosa.");

    } catch (error) {
        await db.query('ROLLBACK;');
        console.error("Error en la transacción, se hizo rollback:", error.message);
    }
}
//actualizacionParcial(11078,productos);



module.exports = {obtenerventas,obtenerventa,insertarventa,eliminarorden,actualizacionParcial}