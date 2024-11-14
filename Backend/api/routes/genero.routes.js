// routes/generos.routes.js
import express from 'express';
import mysql from 'mysql2';

// Crear un router para los géneros
const router = express.Router();

// Crear conexión a la base de datos
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',  // Asegúrate de tener la contraseña correcta
  database: 'peli_db',  // Nombre de la base de datos
});

// Ruta para obtener los géneros
router.get('/generos', (req, res) => {
  connection.query('SELECT id,nombre FROM generos', (error, results) => {
    if (error) {
      console.error('Error al obtener los géneros:', error);
      return res.status(500).json({ error: 'Error al obtener los géneros' });
    }
    res.json(results); // Responder con los géneros
  });
});

export default router;

