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
  const sql = 'SELECT * FROM employees where $1';
  const valores = [true]; // Usar parámetros ($1, $2) evita la inyección SQL

  try {
    const resultado = await db.query(sql,id);
    return resultado.rows
} catch (err) {
    console.error('No se pudieron obtener los usuarios');
  }

}

module.exports = { obtenerUsuarios };