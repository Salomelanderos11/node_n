const db = require('./db');


async function obtenerventas() {
    const sql = `select o.order_id,o.order_date, o.employee_id, od.product_id, od.unit_price,od.quantity, od.discount, o.customer_id from order_details od inner join orders o on o.order_id = od.order_id
group by o.order_id, od.product_id,od.unit_price,od.quantity,od.discount, o.customer_id
order by o.order_id, o.order_date`
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
    const sql = 'CALL insertar_orden_completa($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)'
    const params = datos;
    try {
        const trespuesta =await ab.query(sql,params);
        return {exito: true, mensaje:"Se ha registrado la venta."}
    } catch (error) {
        console.error('Error interno al Registrar venta:', err.message);
        return { exito: false, error: err.message };
    }
}




module.exports = {obtenerventas,obtenerventa}