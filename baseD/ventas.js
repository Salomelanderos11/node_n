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


module.exports = {obtenerventas}