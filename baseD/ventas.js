const db = require('./db');



function obtener_fecha() {
    const hoy = new Date();
    const año = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');    
    return `${año}-${mes}-${dia}`;
}




async function obtenerventas() {
    //const año = new Date().getFullYear(); 
    const sql = `select o.order_id , o.customer_id, o.employee_id, o.order_date, o.required_date, o.ship_name,count(od.order_id) as "total articulos" , sum(od.quantity*(1-od.discount)* p.unit_price) as Total from orders o
                    inner join order_details od on od.order_id = o.order_id
                    inner join products p on p.product_id = od.product_id
                    where date_part('year',order_date) =  date_part('year',current_date)
                    group by  o.order_id , o.customer_id, o.employee_id, o.order_date, o.required_date, o.ship_name
                    order by order_date desc`;
    
        
    try {
        const resultado = await db.query(sql);
        return resultado.rows; 
    } catch (error) {
        console.error("Error en la capa de datos (obtenerventas): ", error.message);
        throw error; 
    }
}

async function obtenerventa(folio) {
    const sql = `
        SELECT o.order_id, o.order_date, o.employee_id, od.product_id, 
               od.unit_price, od.quantity, od.discount, o.customer_id 
        FROM order_details od 
        INNER JOIN orders o ON o.order_id = od.order_id
        WHERE o.order_id = $1   
        GROUP BY o.order_id, od.product_id, od.unit_price, od.quantity, od.discount, o.customer_id
        ORDER BY  o.order_date,o.order_id`;
        
    try {
        const resultado = await db.query(sql, [folio]);
        return resultado.rows; 
    } catch (error) {
        console.error(`Error en la capa de datos (obtenerventa - Folio: ${folio}): `, error.message);
        throw error;
    }
}

async function insertarventa(datos) {
    const sql = `SELECT insertar_orden_completa($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) AS nuevo_id`;
    
    try {
        const resultado = await db.query(sql, datos);
        
        if (resultado.rows.length > 0 && resultado.rows[0].nuevo_id) {
            return {
                exito: true,
                order_id: resultado.rows[0].nuevo_id
            };
        } else {
            throw new Error("La base de datos ejecutó la acción pero no retornó un ID válido.");
        }
    } catch (error) {
        console.error('Error en la BD al ejecutar insertar_orden_completa:', error.message);
        throw error; 
    }
}

async function eliminarorden(id) {
    const sql = `DELETE FROM orders WHERE order_id = $1`;
    
    try {
        const resultado = await db.query(sql, [id]);
        
        if (resultado.rowCount > 0) {
            return {
                exito: true,
                mensaje: `La orden con ID ${id} y sus detalles asociados fueron eliminados.`
            };
        } else {
            return {
                exito: false,
                mensaje: `No se encontró ninguna orden registrada con el ID ${id}.`
            };
        }
    } catch (error) {
        console.error(`Error en la BD al intentar eliminar la orden ${id}:`, error.message);
        throw error; 
    }
}

async function actualizacionParcial(id, params) {
    if (!params || params.length === 0) {
        return { exito: false, mensaje: "No se proporcionaron productos para actualizar." };
    }

    const columnas = Object.keys(params[0]).slice(1); 
    const client = await db.connect(); 

    try {
        await client.query('BEGIN');

        for (const producto of params) {
            const valoresCampos = Object.values(producto); 
            valoresCampos.push(id); 

            const columnsql = columnas.map((llave, index) => { 
                return `${llave} = $${index + 2}`; 
            }).join(', ');
            
            const sql = `UPDATE order_details SET ${columnsql} WHERE order_id = $${valoresCampos.length} AND product_id = $1`;
            const resultado = await client.query(sql, valoresCampos);

            if (resultado.rowCount === 0) {
                throw new Error(`El producto con ID ${producto.product_id} no pertenece a la orden ${id}.`);
            }
        }

        await client.query('COMMIT');
        return { exito: true, mensaje: "Todos los productos de la orden fueron actualizados con éxito." };

    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Transacción abortada. Se ejecutó ROLLBACK exitosamente. Motivo:", error.message);
        return { exito: false, error: error.message };
    } finally {
        client.release(); 
    }
}

async function obtenerventas_intervalo(fechas) {
    const sql = `
        SELECT o.order_id, o.order_date, o.employee_id, p.product_name, 
               od.unit_price, od.quantity, od.discount, o.customer_id 
        FROM order_details od 
        INNER JOIN orders o ON o.order_id = od.order_id     
        INNER JOIN products p ON p.product_id = od.product_id
        where o.order_date between  $1 and $2
        GROUP BY o.order_id, p.product_name, od.unit_price, od.quantity, od.discount, o.customer_id
        ORDER BY o.order_date DESC, o.order_id`;
        
    try {
        const resultado = await db.query(sql, fechas);
        return resultado.rows; 
    } catch (error) {
        console.error("Error al jecutar consulta de intervalo: ", error.message, 1);
        throw error; 
    }
}



module.exports = {
    obtenerventas,
    obtenerventa,
    insertarventa,
    eliminarorden,
    actualizacionParcial,obtenerventas_intervalo
};