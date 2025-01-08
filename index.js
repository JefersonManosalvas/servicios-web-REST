const express = require('express');

const app = express();
const PORT = 3000;

app.use(express.json());

// Configurar manualmente los encabezados CORS para permitir solicitudes
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Permite todas las orígenes
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Métodos permitidos
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Encabezados permitidos
    next();
});

// Manejar solicitudes preflight (OPTIONS)
app.options('*', (req, res) => {
    res.sendStatus(204); // No Content
});

let fruterias = [];

// Obtener todas las frutas (GET)
app.get('/frutas', (req, res) => {
    res.json(fruterias);
});

// Crear una nueva fruta (POST) - Ahora recibimos los datos por el cuerpo de la solicitud
// Crear una nueva fruta (POST) - Recibir los datos por la URL
app.post('/frutas', (req, res) => {
    const { nombre, cantidad } = req.query;

    if (!nombre || !cantidad) {
        return res.status(400).json({ message: 'Faltan datos de la fruta' });
    }

    const fruta = {
        id: fruterias.length + 1,
        nombre,
        cantidad: parseInt(cantidad, 10) // Convertir la cantidad a un número entero
    };

    fruterias.push(fruta);
    res.json(fruta);
});

// Actualizar una fruta por ID utilizando query string en la URL (PUT)
app.put('/frutas/editar', (req, res) => {
    const { id, nombre, cantidad } = req.query;  // Obtiene los parámetros de la query string

    // Verificar que se han proporcionado los datos necesarios
    if (!id || !nombre || !cantidad) {
        return res.status(400).json({ message: 'Faltan datos para editar la fruta' });
    }

    // Buscar la fruta por ID
    const fruta = fruterias.find(f => f.id == id);

    // Si no se encuentra la fruta, devolver un error
    if (!fruta) {
        return res.status(404).json({ message: 'Fruta no encontrada' });
    }

    // Actualizar los valores de la fruta
    fruta.nombre = nombre;
    fruta.cantidad = parseInt(cantidad, 10); // Convertir la cantidad a número entero

    // Responder con el mensaje de éxito y los detalles de la fruta actualizada
    res.json({ message: 'Fruta actualizada', fruta });
});




// Eliminar una fruta por ID (DELETE)
app.delete('/frutas/:id', (req, res) => {
    const { id } = req.params;  // Accedemos al parámetro 'id' de la URL

    // Buscar la fruta por su ID
    const index = fruterias.findIndex(f => f.id == id);  // Encuentra el índice de la fruta

    // Si no se encuentra la fruta, devolvemos un error
    if (index === -1) {
        return res.status(404).json({ message: 'Fruta no encontrada' });
    }

    // Eliminar la fruta del array
    fruterias.splice(index, 1);

    // Devolver una respuesta indicando que la fruta ha sido eliminada
    res.json({ message: 'Fruta eliminada' });
});


app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
