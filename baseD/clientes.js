const { parse } = require('dotenv');
const db = require('./db');

const dic={
  "ID de Cliente": "customer_id",
  "Nombre de la Empresa": "company_name",
  "Nombre del Contacto": "contact_name",
  "Cargo del Contacto": "contact_title",
  "Dirección": "address",
  "Ciudad": "city",
  "Región / Estado": "region",
  "Código Postal": "postal_code",
  "País": "country",
  "Teléfono": "phone",
  "Fax": "fax"
}
async function  obtener(id) {
    try {
        if(id && id!=null){
            const sql = 'select * from customers where customer_id = $1'
            const resp = await db.query(sql,[id]);
            return resp.rows;
        }
        
            const sql = 'select * from customers'
            const resp = await db.query(sql);
            return resp.rows;        


        const sql = 'select * from customers'
        const resp = await db.query(sql);
        return resp.rows;
    } catch (error) {
        return {err: error}
    }
}


async function eliminar(id) {
    try {
        const nid= parseInt(id,10);
        if (!isNaN(nid)){
            return {exito:false, mensaje:"El id debe ser numero valido"}
        }
        const sql = 'delete from customers where customer_id = $1'
        const resp = await db.query(sql,[nid]);
        if(resp.rows >0){
            return {exito:true, mensaje : "Cliente eliminado correctamente."}
        }
        else{
            
            return {exito:false, mensaje : "No exite un cliente con el id ingresado"}
        }

    } catch (error) {
        return {exito:false, mensaje: error}   
    }
}

async function actualizar(id,cliente) {
    try {
        const columns = Object.keys(cliente);
        const valores = Object.values(cliente);

        let values= columns.map((c,i) => {
            let llave= dic[c] || c;
            return  `${llave} = $${i+1} `
            
        }).join(', ');
        valores.push(id);
        const sql = `update customers set ${values} where customer_id = $${valores.length} `
        const resp = await db.query(sql,valores);
        if(resp.rows >0){
            return {exito:true, mensaje : "Cliente actualizado correctamente."}
        }
        else{
            
            return {exito:false, mensaje : "No exite un cliente con el id ingresado"}
        }

    } catch (error) {
        return {exito:false, mensaje: error}   

    }
}




module.exports = {obtener,eliminar,actualizar}