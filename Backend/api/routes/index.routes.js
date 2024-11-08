import {Router} from 'express'

import { pool } from '../db.js'

// Creamos una instancia de Router para definir las rutas de la API
const router = Router();

// Definimos una ruta GET en /ping para comprobar la conexión a la base de datos
router.get('/ping', async (req, res) => {
    // Ejecutamos una consulta a la base de datos que simplemente suma 1+1
    const [rows] = await pool.query('SELECT 1+1 as result')
    
    // Imprimimos el resultado de la consulta en la consola (solo para depuración)
    console.log(rows)
    
    // Enviamos el resultado de la consulta en formato JSON como respuesta
    res.json(rows)
})

// Definimos una ruta GET en la raíz (/) que envía un mensaje de texto
router.get('/', (req, res) => {
    // Enviamos el mensaje "Movie api" como respuesta a la solicitud
    res.send('Movie api')
})

// Exportamos el router para que pueda ser usado en otros archivos de la aplicación
export default router