import { Router } from "express";

// Importamos los controladores que se encuentran en el archivo 'actor.controllers.js'
// Estos controladores manejan la lógica para las distintas operaciones CRUD
import {
    getActores,      // Para obtener todas las películas
    getActor,       // Para obtener una película específica
    createActor,    // Para crear una nueva película
    updateActor,    // Para actualizar una película existente
    deleteActor     // Para eliminar una película
} from '../controllers/actores.controllers.js'

// Creamos una instancia del router para manejar las rutas de la API
const router = Router()

// Definimos las rutas de la API con sus respectivos métodos HTTP

// Ruta para obtener todas las películas (GET /actor)
router.get('/actores', getActores)

// Ruta para obtener una película específica por ID (GET /actor/:id)
router.get('/actor/:id', getActor)

// Ruta para crear una nueva película (POST /actor)
router.post('/actor', createActor)

// Ruta para actualizar una película específica por ID (PUT /actor/:id)
router.put('/actor/:id', updateActor)

// Ruta para eliminar una película específica por ID (DELETE /actor/:id)
router.delete('/actor/:id', deleteActor)


export default router