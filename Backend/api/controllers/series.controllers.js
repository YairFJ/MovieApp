import {pool} from "../db.js"

export const getSeries = async (req, res) => {
    try{
        
        const[result] = await pool.query('SELECT * FROM series WHERE enabled = true ORDER BY created_at ASC')
        
        res.json(result)
    }catch(error){
        
        res.status(500).json({message: 'Internal server error'})
    }
}



export const getSerie = async (req, res) => {
    try{
        
        const[result] = await pool.query('SELECT * FROM series WHERE id=? AND enabled = true', [req.params.id])
        
        if(result.length === 0) return res.status(404).json({message: 'Serie not found'})
        
        res.json(result[0])
    }catch(error){
        res.status(500).json({message: 'Internal server error'})
    }
}


export const createSerie = async (req, res) => {
    try{
        
        const {titulo, descripcion, primera_emision , ultima_emision, portada, cant_temporadas, genero_id , actor_id} = req.body
        
        const[result] = await pool.query('INSERT INTO series (titulo, descripcion, primera_emision , ultima_emision, portada, cant_temporadas, genero_id , actor_id) VALUES (?,?,?,?,?,?,?,?)',
            [titulo, descripcion, primera_emision , ultima_emision, portada, cant_temporadas, genero_id , actor_id])
        
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
        
        const {titulo, descripcion, primera_emision , ultima_emision, portada, cant_temporadas, genero_id , actor_id} = req.body

        
        const [existingSerie] = await pool.query('SELECT * FROM series WHERE id = ? AND enabled = true',[req.params.id])
        if(existingSerie.length === 0) return res.status(404).json({message: 'Serie not found'})

        
        const[result] = await pool.query('UPDATE series SET ? WHERE id = ? ',[
            {titulo, descripcion, primera_emision , ultima_emision, portada, cant_temporadas, genero_id , actor_id},
            req.params.id
        ]) 

        
        if (result.affectedRows === 0){
            return res.status(404).json({message: 'Serie not found'})   
        }

       
        const[updateSerie] = await pool.query('SELECT * FROM series WHERE id = ?',[req.params.id])
       
        res.json(updateSerie[0])
    }catch(error){
        res.status(500).json({message: 'Internal server error'})
    }
}


export const deleteSerie = async (req, res) =>{
    try{
       
        const[result] = await pool.query('SELECT * FROM series WHERE id = ? AND enabled = true',[req.params.id])
        if(result.length === 0) return res.status(404).json({message: 'Serie not found'})
        
        
        await pool.query('UPDATE series SET enabled = false WHERE id = ?',[req.params.id])
        
        res.json({message: `Serie ${result[0].id} deleted successfully`})
    }catch(error){
        res.status(500).json({message: 'Internal server error'}) 
    }
}
