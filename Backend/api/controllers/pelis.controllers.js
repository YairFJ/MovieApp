import {pool} from "../db.js"

export const getPelis = async (req, res) => {
    try{
        
        const[result] = await pool.query('SELECT * FROM peliculas ORDER BY created_at ASC')
       
        res.json(result)
    }catch(error){
       
        res.status(500).json({message: 'Internal server error'})
    }
}



export const getPeli = async (req, res) => {
    try{
        
        const[result] = await pool.query('SELECT * FROM peliculas WHERE id=?', [req.params.id])
       
        if(result.length === 0) return res.status(404).json({message: 'Movie not found'})
        
        res.json(result[0])
    }catch(error){
        res.status(500).json({message: 'Internal server error'})
    }
}


export const createPeli = async (req, res) => {
    try {
        // Desestructurar los campos, incluido el rating
        const { titulo, descripcion, duracion, genero, fecha_lanzamiento, rating } = req.body;

        const portadaPath = req.file ? 'portadas/' + req.file.filename : null; // Ruta relativa de la portada

        if (!portadaPath) {
            return res.status(400).json({ message: 'No se ha subido una portada válida.' });
        }

        // Incluir el rating en la consulta de inserción
        const [result] = await pool.query(
            'INSERT INTO peliculas (titulo, descripcion, duracion, genero_id, fecha_lanzamiento, portada, rating) VALUES (?,?,?,?,?,?,?)',
            [titulo, descripcion, duracion, genero, fecha_lanzamiento, portadaPath, rating]
        );

        return res.send({
            id: result.insertId,
            titulo,
            descripcion,
            duracion,
            genero,
            fecha_lanzamiento,
            portada: portadaPath,
            rating
        });
    } catch (error) {
        console.error(error); 
        return res.status(500).json({ message: 'Internal server error' }); 
    }
};


export const updatePeli = async (req, res) => {
    try {
        // Desestructurar el rating junto con los otros campos
        const { titulo, descripcion, duracion, genero, fecha_lanzamiento, portada, rating } = req.body;

        // Verificar que la película existe
        const [existingPeli] = await pool.query('SELECT * FROM peliculas WHERE id = ? AND enabled = true', [req.params.id]);
        if (existingPeli.length === 0) return res.status(404).json({ message: 'Movie not found' });

        // Actualizar la película incluyendo el rating
        const [result] = await pool.query('UPDATE peliculas SET ? WHERE id = ?', [
            { titulo, descripcion, duracion, genero, fecha_lanzamiento, portada, rating },
            req.params.id
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        const [updatedPeli] = await pool.query('SELECT * FROM peliculas WHERE id = ?', [req.params.id]);

        res.json(updatedPeli[0]);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};


export const deletePeli = async (req, res) =>{
    try{
        
        const[result] = await pool.query('SELECT * FROM peliculas WHERE id = ? AND enabled = true',[req.params.id])
        if(result.length === 0) return res.status(404).json({message: 'Movie not found'})
        
        
        await pool.query('UPDATE peliculas SET enabled = false WHERE id = ?',[req.params.id])
       
        res.json({message: `Movie ${result[0].id} deleted successfully`})
    }catch(error){
        res.status(500).json({message: 'Internal server error'}) 
    }
}
