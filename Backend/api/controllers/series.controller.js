import {pool} from "../db.js"

export const getSeries = async (req, res) => {
    try{
        // Obtenemos las series ordenadas de forma ascendente por la fecha en que se creo el registro
        const[result] = await pool.query('SELECT * FROM series WHERE enabled = true ORDER BY created_at ASC')
        // Devolvemos el resultado en formato JSON
        res.json(result)
    }catch(error){
        // Si ocurre un error, se devuelve un mensaje de error con el estado 500
        res.status(500).json({message: 'Internal server error'})
    }
}



export const getSerie = async (req, res) => {
    try{
        // Obtenemos la serie seleccionada mediante un id pasado por parametro
        const[result] = await pool.query('SELECT * FROM series WHERE id=? AND enabled = true', [req.params.id])
        // Si no encuentra la serie va a devolver un error 404
        if(result.length === 0) return res.status(404).json({message: 'Serie not found'})
        // Devolvemos la pelicula encontrada en formato JSON
        res.json(result[0])
    }catch(error){
        res.status(500).json({message: 'Internal server error'})
    }
}


export const createSerie = async (req, res) => {
    try{
        // Obtenemos los datos de la nueva serie desde el cuerpo de la solicitud
        const {titulo, descripcion, primera_emision , ultima_emision, portada, cant_temporadas, genero_id , actor_id} = req.body
        // Insertamos la nueva pelicula en la base de datos
        const[result] = await pool.query('INSERT INTO series (titulo, descripcion, primera_emision , ultima_emision, portada, cant_temporadas, genero_id , actor_id) VALUES (?,?,?,?,?,?,?,?)',
            [titulo, descripcion, primera_emision , ultima_emision, portada, cant_temporadas, genero_id , actor_id])
        // Devolvemos la nueva pelicula agregada junto con su ID
        res.send ({
            id : result.insertId,
            titulo,
            descripcion,
            primera_emision,
            ultima_emision, 
            fecha_lanzamiento, 
            portada, 
            cant_temporadas,
            genero_id,
            actor_id
        })
    }catch(error){
        res.json(error)
        res.status(500).json({message: 'Internal server error'})
    }
}


export const updateSerie = async (req, res) => {
    try{
        // Obtenemos los datos de la serie que queremos actualizar
        const {titulo, descripcion, primera_emision , ultima_emision, portada, cant_temporadas, genero_id , actor_id} = req.body

        // Verificamos si la serie con el id existe y está habilitada
        const [existingSerie] = await pool.query('SELECT * FROM series WHERE id = ? AND enabled = true',[req.params.id])
        if(existingSerie.length === 0) return res.status(404).json({message: 'Serie not found'})

        // Actualizamos la serie con los nuevos datos
        const[result] = await pool.query('UPDATE series SET ? WHERE id = ? ',[
            {titulo, descripcion, primera_emision , ultima_emision, portada, cant_temporadas, genero_id , actor_id},
            req.params.id
        ]) 

        // Si no se modificó ninguna fila, devolvemos error 404
        if (result.affectedRows === 0){
            return res.status(404).json({message: 'Serie not found'})   
        }

        // Obtenemos la serie actualizada
        const[updateSerie] = await pool.query('SELECT * FROM series WHERE id = ?',[req.params.id])
        // Devolvemos la pelicula actualizada
        res.json(updateSerie[0])
    }catch(error){
        res.status(500).json({message: 'Internal server error'})
    }
}


export const deleteSerie = async (req, res) =>{
    try{
        // Verificamos si la serie con el id existe y está habilitada
        const[result] = await pool.query('SELECT * FROM series WHERE id = ? AND enabled = true',[req.params.id])
        if(result.length === 0) return res.status(404).json({message: 'Serie not found'})
        
        // Deshabilitamos la serie en vez de eliminarla de forma permanente
        await pool.query('UPDATE series SET enabled = false WHERE id = ?',[req.params.id])
        // Devolvemos un mensaje indicando que la película fue eliminada exitosamente
        res.json({message: `Serie ${result[0].id} deleted successfully`})
    }catch(error){
        res.status(500).json({message: 'Internal server error'}) 
    }
}
