const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 3000;

// Importar el enrutador de empleados
const empleadosRouter = require('./routes/empleados.router');
const ventasRouter = require('./routes/ventas.router');

app.use(express.json());
app.use(cors());
// Vincular el enrutador a la ruta base que quieras
// Esto hace que automáticamente todo lo que esté dentro de 'empleadosRouter' comience con /api/empleado
app.use('/api/v1/empleados', empleadosRouter);

app.use('/api/ventas',ventasRouter);
app.listen(PORT, () => {
    console.log(`API ejecutándose en http://localhost:${PORT}`);
});


