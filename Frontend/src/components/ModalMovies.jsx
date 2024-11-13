import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { styled } from '@mui/material/styles';
import MuiButton from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';

// Ocultar input de archivo visualmente
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const movies = ['Accion', 'Comedia', 'Ciencia Ficcion'];

function ModalMovies({ show, handleClose }) {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    duracion: '',
    genero: '',
    fecha_lanzamiento: '',
    portada: null,
    rating: 2.5, // Añadimos el campo para rating
  });

  // Manejar cambios en los inputs de texto
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Manejar cambios en el input de archivo
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log('Portada seleccionada:', file);
    setFormData({
      ...formData,
      portada: file,
    });
  };

  // Manejar cambios en el rating
  const handleRatingChange = (event, newValue) => {
    setFormData({
      ...formData,
      rating: newValue, // Actualizamos el valor del rating
    });
  };

  // Enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    // Añadir todos los campos al FormData
    for (let key in formData) {
      data.append(key, formData[key]);
    }

    try {
      // Petición POST a la API
      const response = await axios.post('http://localhost:3000/api/pelicula', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Película guardada:', response.data);

      // Resetear el formulario después de guardar la película
      setFormData({
        titulo: '',
        descripcion: '',
        duracion: '',
        genero: '',
        fecha_lanzamiento: '',
        portada: null,
        rating: 2.5, // Resetear el rating
      });

      // Cerrar el modal después de guardar
      handleClose();
    } catch (error) {
      console.error('Error al guardar la película:', error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title className="title-modal">Agregar Película</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <label htmlFor="titulo">Titulo</label>
          <input
            type="text"
            name="titulo"
            id="titulo"
            value={formData.titulo}
            onChange={handleChange}
          />

          <label htmlFor="descripcion">Descripcion</label>
          <textarea
            name="descripcion"
            id="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
          />

          <label htmlFor="duracion">Duracion</label>
          <input
            type="text"
            name="duracion"
            id="duracion"
            value={formData.duracion}
            onChange={handleChange}
          />

          <Autocomplete
            disablePortal
            options={movies}
            sx={{ width: 300 }}
            value={formData.genero}
            onChange={(e, newValue) => setFormData({ ...formData, genero: newValue })}
            renderInput={(params) => (
              <TextField {...params} label="Genero" />
            )}
          />

          <Stack spacing={1}>
            <label htmlFor="">Rating</label>
            <Rating
              name="half-rating"
              value={formData.rating}
              precision={0.5}
              onChange={handleRatingChange}
            />
          </Stack>

          <label htmlFor="fecha_lanzamiento">Fecha Lanzamiento</label>
          <input
            type="date"
            name="fecha_lanzamiento"
            id="fecha_lanzamiento"
            value={formData.fecha_lanzamiento}
            onChange={handleChange}
          />

          <MuiButton
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
          >
            Subir Portada
            <VisuallyHiddenInput
              type="file"
              onChange={handleFileChange}
              accept="image/*"
            />
          </MuiButton>
        </form>
      </Modal.Body>

      <Modal.Footer>
        <MuiButton onClick={handleClose} className="btn-cerrar">
          Cerrar
        </MuiButton>
        <MuiButton className="w-100 btn-agregar" type="submit" variant="primary" onClick={handleSubmit}>
          Agregar
        </MuiButton>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalMovies;
