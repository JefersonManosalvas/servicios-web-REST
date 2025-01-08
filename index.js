const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());

const DB_FILE = 'usuarios.json';

// Función para leer la "base de datos"
const readDB = () => {
    if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(DB_FILE, JSON.stringify([]));
    }
    return JSON.parse(fs.readFileSync(DB_FILE));
};

// Función para escribir en la "base de datos"
const writeDB = (data) => {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

// Ruta para obtener todos los usuarios
app.get('/users', (req, res) => {
    const usuarios = readDB();
    res.json(usuarios);
});

// Ruta para crear un nuevo usuario
app.post('/users/:name/:id', (req, res) => {
    const { name, id } = req.params;

    // Validar que el id sea un número
    if (isNaN(id)) {
        return res.status(400).json({ error: 'El ID debe ser un número válido.' });
    }

    const usuarios = readDB();
    const nuevoUsuario = {
        id: parseInt(id),
        name,
    };

    usuarios.push(nuevoUsuario);
    writeDB(usuarios);

    res.status(201).json({
        message: 'Usuario creado',
        user: nuevoUsuario,
    });
});

// Ruta para actualizar un usuario por id
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    // Validar que el id sea un número
    if (isNaN(id)) {
        return res.status(400).json({ error: 'El ID debe ser un número válido.' });
    }

    const usuarios = readDB();
    const usuarioIndex = usuarios.findIndex((user) => user.id === parseInt(id));

    if (usuarioIndex === -1) {
        return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    // Actualizar el usuario
    usuarios[usuarioIndex].name = name || usuarios[usuarioIndex].name;
    writeDB(usuarios);

    res.json({
        message: 'Usuario actualizado',
        user: usuarios[usuarioIndex],
    });
});

// Ruta para eliminar un usuario por id
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;

    // Validar que el id sea un número
    if (isNaN(id)) {
        return res.status(400).json({ error: 'El ID debe ser un número válido.' });
    }

    const usuarios = readDB();
    const newUsers = usuarios.filter((user) => user.id !== parseInt(id));

    if (usuarios.length === newUsers.length) {
        return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    writeDB(newUsers);

    res.status(204).send(); // No content
});

// Servidor en escucha
app.listen(3001, () => {
    console.log('Servidor iniciado en http://localhost:3001');
});
