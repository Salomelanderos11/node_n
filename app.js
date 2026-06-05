const express = require('express');
const empleados = require('./ejemplo'); // Tu archivo con la conexión a la base de datos
const app = express();
const PORT = 3000;

app.use(express.json());

// --- ENDPOINTS ---dasd

// 1. GET: Obtener todos los empleados directamente de la Base de Datos
app.get('/api/empleado', async (req, res) => {
    try {
        // Ejecutamos la función asíncrona esperando su resultado
        const listaEmpleados = await empleados.obtenerUsuarios();
        res.status(200).json(listaEmpleados);
    } catch (error) {
        res.status(500).json({ error: "Error interno al obtener los empleados" });
    }
});

// 2. GET: Obtener un empleado específico por su ID
app.get('/api/empleado/:id', async (req, res) => {
    const id_emp = parseInt(req.params.id);

    try {
        const listaEmpleados = await empleados.obtenerUsuarios();
        console.log(listaEmpleados)
        const empleado_espe = listaEmpleados.find(r => r.employee_id === id_emp);

        if (!empleado_espe) {
            return res.status(404).json({ error: "Empleado no encontrado" });
        }
        
        res.status(200).json(empleado_espe);
    } catch (error) {
        res.status(500).json({ error: "Error interno al buscar el empleado" });
    }
});

// Iniciamos el servidor
app.listen(PORT, () => {
    console.log(`API ejecutándose en http://localhost:${PORT}`);
});