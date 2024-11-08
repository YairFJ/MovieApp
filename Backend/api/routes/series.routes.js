import { Router } from "express";

// Importamos los controladores que se encuentran en el archivo 'sries.controllers.js'
// Estos controladores manejan la lógica para las distintas operaciones CRUD
import {
    getSeries,      // Para obtener todas las películas
    getSerie,       // Para obtener una películespecífica
    createSerie,    // Para crear una nueva película
    updateSerie,    // Para actualizar una serieexistente
    deleteSerie     // Para eliminar una película
} from '../controllers/series.controller.js';

// Creamos una instancia del router para manejar las rutas de la API
const router = Router()

// Definimos las rutas de la API con sus respectivos métodos HTTP

// Ruta para obtener todas las películas (GET /peliculas)
router.get('/series', getSeries)

// Ruta para obtener una película específica por ID (GET /pelicula/:id)
router.get('/serie/:id', getSerie)

// Ruta para crear una nueva película (POST /pelicula)
router.post('/serie', createSerie)

// Ruta para actualizar una película específica por ID (PUT /pelicula/:id)
router.put('/serie/:id', updateSerie)

// Ruta para eliminar una película específica por ID (DELETE /pelicula/:id)
router.delete('/serie/:id', deleteSerie)


export default router