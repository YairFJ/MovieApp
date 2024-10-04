import { Router } from "express";

// Importamos los controladores que se encuentran en el archivo 'pelis.controllers.js'
// Estos controladores manejan la lógica para las distintas operaciones CRUD
import {
    getPelis,      // Para obtener todas las películas
    getPeli,       // Para obtener una película específica
    createPeli,    // Para crear una nueva película
    updatePeli,    // Para actualizar una película existente
    deletePeli     // Para eliminar una película
} from '../controllers/pelis.controllers.js'

// Creamos una instancia del router para manejar las rutas de la API
const router = Router()

// Definimos las rutas de la API con sus respectivos métodos HTTP

// Ruta para obtener todas las películas (GET /peliculas)
router.get('/peliculas', getPelis)

// Ruta para obtener una película específica por ID (GET /pelicula/:id)
router.get('/pelicula/:id', getPeli)

// Ruta para crear una nueva película (POST /pelicula)
router.post('/pelicula', createPeli)

// Ruta para actualizar una película específica por ID (PUT /pelicula/:id)
router.put('/pelicula/:id', updatePeli)

// Ruta para eliminar una película específica por ID (DELETE /pelicula/:id)
router.delete('/pelicula/:id', deletePeli)


export default router