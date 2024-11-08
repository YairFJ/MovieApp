import {pool} from "../db.js"

export const getActores = async (req, res) => {
    try{
        // Obtenemos las actores ordenadas de forma ascendente por la fecha en que se creo el registro
        const[result] = await pool.query('SELECT * FROM actores WHERE  enabled = true ORDER BY created_at ASC')
        // Devolvemos el resultado en formato JSON
        res.json(result)
    }catch(error){
        console.log(error)
        // Si ocurre un error, se devuelve un mensaje de error con el estado 500
        res.status(500).json({message: 'Internal server error'})
    }
}



export const getActor = async (req, res) => {
    try{
        // Obtenemos la actor seleccionada mediante un id pasado por parametro
        const[result] = await pool.query('SELECT * FROM actores WHERE id=?', [req.params.id])
        // Si no encuentra la actor va a devolver un error 404
        if(result.length === 0) return res.status(404).json({message: 'Actor not found'})
        // Devolvemos la actor encontrada en formato JSON
        res.json(result[0])
    }catch(error){
        res.status(500).json({message: 'Internal server error'})
    }
}


export const createActor = async (req, res) => {
    try{
        // Obtenemos los datos de la nueva actor desde el cuerpo de la solicitud
        const {nombre,apellido} = req.body
        // Insertamos la nueva actor en la base de datos
        const[result] = await pool.query('INSERT INTO actores(nombre, apellido) VALUES (?,?)',
            [nombre,apellido])
        // Devolvemos la nueva actor agregada junto con su ID
        res.send ({
            id : result.insertId,
            nombre,
            apellido,
        })
    }catch(error){
        res.status(500).json({message: 'Internal server error'})
    }
}


export const updateActor = async (req, res) => {
    try{
        // Obtenemos los datos de la actor que queremos actualizar
        const {nombre,apellido} = req.body

        // Verificamos si la actor con el id existe y está habilitada
        const [existingActor] = await pool.query('SELECT * FROM actores WHERE id = ? AND enabled = true',[req.params.id])
        if(existingActor.length === 0) return res.status(404).json({message: 'Actor not found'})

        // Actualizamos la actor con los nuevos datos
        const[result] = await pool.query('UPDATE actores SET ? WHERE id = ? ',[
            {nombre,apellido},
            req.params.id
        ]) 

        // Si no se modificó ninguna fila, devolvemos error 404
        if (result.affectedRows === 0){
            return res.status(404).json({message: 'Actor not found'})   
        }

        // Obtenemos la actor actualizada
        const[updateActor] = await pool.query('SELECT * FROM actores WHERE id = ?',[req.params.id])
        // Devolvemos la actor actualizada
        res.json(updateActor[0])
    }catch(error){
        res.status(500).json({message: 'Internal server error'})
    }
}


export const deleteActor = async (req, res) =>{
    try{
        // Verificamos si la actor con el id existe y está habilitada
        const[result] = await pool.query('SELECT * FROM actores WHERE id = ? AND enabled = true',[req.params.id])
        if(result.length === 0) return res.status(404).json({message: 'Actor not found'})
        
        // Deshabilitamos la actor en vez de eliminarla de forma permanente
        await pool.query('UPDATE actores SET enabled = false WHERE id = ?',[req.params.id])
        // Devolvemos un mensaje indicando que la película fue eliminada exitosamente
        res.json({message: `Actor ${result[0].id} deleted successfully`})
    }catch(error){
        res.status(500).json({message: 'Internal server error'}) 
    }
}
