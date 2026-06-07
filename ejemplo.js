const db = require('./db');

async function obtenerUsuarios() {
  const sql = 'SELECT * FROM employees';
  const valores = [true]; // Usar parámetros ($1, $2) evita la inyección SQL

    try {
      const resultado = await db.query(sql);
      return resultado.rows
    } catch (err) {
        console.error('No se pudieron obtener los usuarios');
      }

}
async function obtenerUsuario(id) {
  const sql = 'SELECT * FROM employees where employee_id = $1';
  // Usar parámetros ($1, $2) evita la inyección SQL

    try {
      const resultado = await db.query(sql,[id]);
      return resultado.rows
    } catch (err) {
        console.error('No se pudieron obtener los usuarios');
      }

}

async function delete_user(id) {
  const sql = 'DELETE FROM employees where employee_id = $1';// Usar parámetros ($1, $2) evita la inyección SQL

  try {
    const resultado = await db.query(sql,[id]);
    if (resultado.rowCount > 0) {
      console.log(`Empleado con ID ${id} eliminado correctamente.`);
      return { exito: true, mensaje: "Empleado eliminado" };
    } else {
      console.log(`No se encontró ningún empleado con el ID ${id}.`);
      return { exito: false, mensaje: "El empleado no existe" };
    }

  } catch (err) {
    // Captura errores reales de Postgres (ej. problemas de clave foránea)
    console.error('Error interno al eliminar el usuario:', err.message);
    return { exito: false, error: err.message };
  }

}

async function insertar(emple_n) {
  const sql='insert into employees (employee_id,last_name, first_name, title) values ($1,$2,$3,$4)';
  const params = Object.values(emple_n);
  try{
    const resultado = await db.query(sql,params);
    if (resultado.rowCount > 0) {
        console.log('Inserción correcta en PostgreSQL');
        return {
            exito: true,
            datos: resultado.rows[0] // Devolvemos el empleado recién insertado
        };
    }    
    
    
  }
  catch (err) {
    console.error('La consulta falló de forma interna:', err.message);
    return { exito: false, error: err.message };
  }


}
module.exports = { obtenerUsuarios,obtenerUsuario,insertar,delete_user };