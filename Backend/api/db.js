import {createPool} from "mysql2/promise"

// Configuramos la base de datos
export const pool = createPool({
    host: 'localhost',
    user: 'root',
    port: '3306',
    password: '',
    database:'peli_db'
})