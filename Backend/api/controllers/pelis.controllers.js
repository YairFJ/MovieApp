import {pool} from "../db.js"

export const getPelis = async (req, res) => {
    try{
        // Obtenemos las peliculas ordenadas de forma ascendente por la fecha en que se creo el registro
        const[result] = await pool.query('SELECT * FROM peliculas ORDER BY created_at ASC')
        // Devolvemos el resultado en formato JSON
        res.json(result)
    }catch(error){
        // Si ocurre un error, se devuelve un mensaje de error con el estado 500
        res.status(500).json({message: 'Internal server error'})
    }
}



export const getPeli = async (req, res) => {
    try{
        // Obtenemos la pelicula seleccionada mediante un id pasado por parametro
        const[result] = await pool.query('SELECT * FROM peliculas WHERE id=?', [req.params.id])
        // Si no encuentra la pelicula va a devolver un error 404
        if(result.length === 0) return res.status(404).json({message: 'Movie not found'})
        // Devolvemos la pelicula encontrada en formato JSON
        res.json(result[0])
    }catch(error){
        res.status(500).json({message: 'Internal server error'})
    }
}


export const createPeli = async (req, res) => {
    try {
        // Obtenemos los datos de la nueva pelicula desde el cuerpo de la solicitud
        const { titulo, descripcion, duracion, genero, fecha_lanzamiento } = req.body;

        // Verificamos si se ha subido una portada
        const portadaPath = req.file ? 'portadas/' + req.file.filename : null; // La ruta relativa del archivo subido

        if (!portadaPath) {
            return res.status(400).json({ message: 'No se ha subido una portada válida.' });
        }

        // Insertamos la nueva pelicula en la base de datos
        const [result] = await pool.query(
            'INSERT INTO peliculas (titulo, descripcion, duracion, genero, fecha_lanzamiento, portada) VALUES (?,?,?,?,?,?)',
            [titulo, descripcion, duracion, genero, fecha_lanzamiento, portadaPath]
        );

        // Devolvemos la nueva pelicula agregada junto con su ID
        return res.send({
            id: result.insertId,
            titulo,
            descripcion,
            duracion,
            genero,
            fecha_lanzamiento,
            portada: portadaPath
        });
    } catch (error) {
        console.error(error); // Esto ayuda a identificar el error en la consola
        return res.status(500).json({ message: 'Internal server error' }); // Envía solo una respuesta
    }
};


export const updatePeli = async (req, res) => {
    try{
        // Obtenemos los datos de la pelicula que queremos actualizar
        const {titulo, descripcion, duracion, genero, fecha_lanzamiento, portada} = req.body

        // Verificamos si la pelicula con el id existe y está habilitada
        const [existingPeli] = await pool.query('SELECT * FROM peliculas WHERE id = ? AND enabled = true',[req.params.id])
        if(existingPeli.length === 0) return res.status(404).json({message: 'Movie not found'})

        // Actualizamos la pelicula con los nuevos datos
        const[result] = await pool.query('UPDATE peliculas SET ? WHERE id = ? ',[
            {titulo, descripcion, duracion, genero, fecha_lanzamiento, portada},
            req.params.id
        ]) 

        // Si no se modificó ninguna fila, devolvemos error 404
        if (result.affectedRows === 0){
            return res.status(404).json({message: 'Movie not found'})   
        }

        // Obtenemos la pelicula actualizada
        const[updatePeli] = await pool.query('SELECT * FROM peliculas WHERE id = ?',[req.params.id])
        // Devolvemos la pelicula actualizada
        res.json(updatePeli[0])
    }catch(error){
        res.status(500).json({message: 'Internal server error'})
    }
}


export const deletePeli = async (req, res) =>{
    try{
        // Verificamos si la pelicula con el id existe y está habilitada
        const[result] = await pool.query('SELECT * FROM peliculas WHERE id = ? AND enabled = true',[req.params.id])
        if(result.length === 0) return res.status(404).json({message: 'Movie not found'})
        
        // Deshabilitamos la pelicula en vez de eliminarla de forma permanente
        await pool.query('UPDATE peliculas SET enabled = false WHERE id = ?',[req.params.id])
        // Devolvemos un mensaje indicando que la película fue eliminada exitosamente
        res.json({message: `Movie ${result[0].id} deleted successfully`})
    }catch(error){
        res.status(500).json({message: 'Internal server error'}) 
    }
}
