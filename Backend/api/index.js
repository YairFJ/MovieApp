import express from 'express'

import { PORT } from './config.js';

import indexRoutes from './routes/index.routes.js';


import pelisRouters from './routes/pelis.routes.js';


import cors from 'cors';



const app = express()
app.use(cors({
    origin: 'http://localhost:5173',
  }));

app.use(express.json())


app.use('/api', indexRoutes)


app.use('/api', pelisRouters)
/* app.use('/api',actorRouters) */



/* app.use('/api', seriesRouters) */

app.listen(PORT)


console.log(`Server running on PORT: ${PORT}`)
