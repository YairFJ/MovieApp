import { Router } from "express";
import multer from 'multer';
import path from 'path';
import { createPeli, getPelis, getPeli, updatePeli, deletePeli } from '../controllers/pelis.controllers.js';

// Configuración de almacenamiento de multer para guardar imágenes en el servidor
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'C:/xampp/htdocs/portadas'); // Ruta de guardado de las imágenes
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Nombre único para cada archivo
  }
});

// Configuración de multer
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const mimeType = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    if (mimeType && extname) {
      return cb(null, true);
    }
    cb(new Error('Error: El archivo debe ser PNG o JPG'));
  }
});

// Creamos una instancia del router para manejar las rutas de la API
const router = Router();

// Ruta para obtener todas las películas
router.get('/peliculas', getPelis);

// Ruta para obtener una película específica por ID
router.get('/pelicula/:id', getPeli);

// Ruta para crear una nueva película, con la carga de la portada (POST /pelicula)
router.post('/pelicula', upload.single('portada'), createPeli); // Usamos multer para la portada

// Ruta para actualizar una película específica por ID
router.put('/pelicula/:id', updatePeli);

// Ruta para eliminar una película específica por ID
router.delete('/pelicula/:id', deletePeli);

export default router;