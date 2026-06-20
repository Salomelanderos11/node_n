const { json } = require('express');
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

async function eliminar(id) {
    try { 
        //console.log(typeof(id));
        
        const sql = 'delete from categories where category_id = $1'
        const resp = await  db.query(sql,[id]);
        if (resp.rowCount == 1 ) {return {exito: true}} 
        else{ return {exito : false }} 
         
    } catch (error) {
        return {err: error}
    }
}

const ncat=
{
    
    category_name: 'abarroooootes',
    description: 'detodo',
    picture: 10101010100
  };


async function actualizacion(id,ncat) {
    try { 
        const columns = Object.keys(ncat);
        let valores = Object.values(ncat);
        
        let val = columns.map((c,index) =>{
            return `${c} = $${index +1} `
        }).join(', ');
        valores.push(id);
        //console.log(val);
        

        
        const sql = `update categories set ${val} where category_id = $${valores.length}`
        const resp = await  db.query(sql, valores);
        if (resp.rowCount >0){
            return {exito :true, mensaje : "Categoria actualizada !!"}
        }
        else {
                        return {exito :false, mensaje : "Categoria NO encontrada"}
        }
         
    } catch (error) {
        return {err: error}
    }
}
// Ejemplo dentro de una ruta de Express o función contenedora
async function ejecutar() {
    const resultado = await actualizacion(9, ncat); 
    console.log(resultado); // <-- Aquí ya NO saldrá pending. Mostrará la respuesta de Postgres.
}

//ejecutar();



module.exports = {
    obtener,insertar,eliminar,actualizacion
    }