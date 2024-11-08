import React, { useState } from 'react';
import axios from 'axios';

const FormPage = () => {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    duracion: '',
    genero: '',
    fecha_lanzamiento: '',
    portada: null, 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      portada: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const data = new FormData();
    for (let key in formData) {
      data.append(key, formData[key]);
    }
  
    try {
      const response = await axios.post('http://localhost:3000/api/pelicula', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Película guardada:', response.data);
  
      setFormData({
        titulo: '',
        descripcion: '',
        duracion: '',
        genero: '',
        fecha_lanzamiento: '',
        portada: null,
      });
    } catch (error) {
      console.error('Error al guardar la película:', error);
    }
  };
  

  return (
    <div className="formbold-main-wrapper">
      <div className="formbold-form-wrapper">
        <form onSubmit={handleSubmit}>
          <div className="formbold-input-flex">
            <div>
              <input
                type="text"
                name="titulo"
                id="titulo"
                className="formbold-form-input"
                value={formData.titulo}
                onChange={handleChange}
              />
              <label htmlFor="titulo" className="formbold-form-label">
                Titulo
              </label>
            </div>
            <div>
              <input
                type="date"
                name="fecha_lanzamiento"
                id="fecha_lanzamiento"
                className="formbold-form-input"
                value={formData.fecha_lanzamiento}
                onChange={handleChange}
              />
              <label htmlFor="fecha_lanzamiento" className="formbold-form-label">
                Fecha Lanzamiento
              </label>
            </div>
          </div>

          <div className="formbold-input-flex">
            <div>
              <input
                type="text"
                name="duracion"
                id="duracion"
                className="formbold-form-input"
                value={formData.duracion}
                onChange={handleChange}
              />
              <label htmlFor="duracion" className="formbold-form-label">
                Duración
              </label>
            </div>
            <div>
              <input
                type="text"
                name="genero"
                id="genero"
                className="formbold-form-input"
                value={formData.genero}
                onChange={handleChange}
              />
              <label htmlFor="genero" className="formbold-form-label">
                Género
              </label>
            </div>
          </div>

          <div className="formbold-textarea">
            <textarea
              rows="6"
              name="descripcion"
              id="descripcion"
              className="formbold-form-input"
              value={formData.descripcion}
              onChange={handleChange}
            ></textarea>
            <label htmlFor="descripcion" className="formbold-form-label">
              Descripción
            </label>
          </div>
          
          <div className="formbold-input-file">
            <label htmlFor="imagen" className="formbold-input-label">
              Subir Portada
              <input
                type="file"
                name="imagen[]"
                id="imagen"
                onChange={handleFileChange}
              />
            </label>
          </div>
          <button className="formbold-btn" type="submit">
            Subir Película
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormPage;