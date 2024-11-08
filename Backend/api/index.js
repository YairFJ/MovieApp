import express from 'express'

import { PORT } from './config.js';

import indexRoutes from './routes/index.routes.js';


import pelisRouters from './routes/pelis.routes.js';


import cors from 'cors';


// Creamos una instancia de la aplicación express
const app = express()
app.use(cors({
    origin: 'http://localhost:5173',
  }));
// Middleware que permite a la aplicación recibir y procesar datos en formato JSON
app.use(express.json())

// Definimos las rutas de la API que provienen de indexRoutes, usando el prefijo '/api'
app.use('/api', indexRoutes)

// Definimos las rutas de la API para las películas, también bajo el prefijo '/api'
app.use('/api', pelisRouters)
/* app.use('/api',actorRouters) */


// Definimos las rutas de la API para las series, también bajo el prefijo '/api'
/* app.use('/api', seriesRouters) */

// Iniciamos el servidor en el puerto definido en la variable PORT
app.listen(PORT)

// Imprimimos un mensaje en la consola indicando que el servidor está corriendo y en qué puerto
console.log(`Server running on PORT: ${PORT}`)
