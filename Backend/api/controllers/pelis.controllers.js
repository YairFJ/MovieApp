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
        
        const { titulo, descripcion, duracion, genero, fecha_lanzamiento } = req.body;

        
        const portadaPath = req.file ? 'portadas/' + req.file.filename : null; // La ruta relativa del archivo subido

        if (!portadaPath) {
            return res.status(400).json({ message: 'No se ha subido una portada válida.' });
        }

        
        const [result] = await pool.query(
            'INSERT INTO peliculas (titulo, descripcion, duracion, genero, fecha_lanzamiento, portada) VALUES (?,?,?,?,?,?)',
            [titulo, descripcion, duracion, genero, fecha_lanzamiento, portadaPath]
        );

       
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
        console.error(error); 
        return res.status(500).json({ message: 'Internal server error' }); 
    }
};


export const updatePeli = async (req, res) => {
    try{
       
        const {titulo, descripcion, duracion, genero, fecha_lanzamiento, portada} = req.body

        
        const [existingPeli] = await pool.query('SELECT * FROM peliculas WHERE id = ? AND enabled = true',[req.params.id])
        if(existingPeli.length === 0) return res.status(404).json({message: 'Movie not found'})

        
        const[result] = await pool.query('UPDATE peliculas SET ? WHERE id = ? ',[
            {titulo, descripcion, duracion, genero, fecha_lanzamiento, portada},
            req.params.id
        ]) 

        
        if (result.affectedRows === 0){
            return res.status(404).json({message: 'Movie not found'})   
        }

        
        const[updatePeli] = await pool.query('SELECT * FROM peliculas WHERE id = ?',[req.params.id])
        
        res.json(updatePeli[0])
    }catch(error){
        res.status(500).json({message: 'Internal server error'})
    }
}


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
