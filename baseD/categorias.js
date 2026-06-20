const db = require('./db');


async function obtener(id) {
    try { 
        //console.log(typeof(id));
        if(id != null){
            const sql = 'select  * from categories where category_id = $1'
            const resp = await  db.query(sql,[id]);
            return resp.rows;
        }
        const sql = 'select  * from categories '
        const resp = await db.query(sql);
        
        return resp.rows
        
    } catch (error) {
        
    }
}


async function insertar(categoria) {
    try { 
        //console.log(typeof(id));
        
        const sql = 'select insertar_categoria($1)'
        const resp = await  db.query(sql,[categoria]);
        return resp.rows;
        
    } catch (error) {
        
    }
}



module.exports = {
    obtener,insertar
    }