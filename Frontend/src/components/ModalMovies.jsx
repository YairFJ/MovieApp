import React, { useState,useEffect } from 'react';
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



function ModalMovies({ show, handleClose }) {
  const [movies, setMovies] = useState([]); // Géneros que vendrán de la base de datos
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    duracion: '',
    genero: null,
    fecha_lanzamiento: '',
    portada: null,
    rating: 2.5, // Añadimos el campo para rating
  });
  const [loading, setLoading] = useState(true); // Estado de carga de géneros

  useEffect(() => {
    axios.get('http://localhost:3000/api/generos')
      .then((response) => {
        console.log('Géneros obtenidos:', response.data);
        setMovies(response.data); // Asegúrate de que cada objeto tenga { id, nombre }
        setLoading(false); // Los géneros fueron cargados
      })
      .catch((error) => {
        console.error('Error al obtener los géneros:', error);
        setLoading(false); // Finaliza la carga en caso de error
      });
  }, []);

  // Manejar cambios en los inputs de texto
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validación para descripcion (max 255 caracteres y no permite caracteres especiales)
    if (name === 'descripcion') {
      if (value.length <= 255 && /^[a-zA-Z0-9áéíóúÁÉÍÓÚ\s.,!?()-]*$/.test(value)) {
        setFormData({
          ...formData,
          [name]: value,
        });
      }
    }

    // Validación para duracion (solo números enteros)
    if (name === 'duracion') {
      if (/^\d*$/.test(value)) {
        setFormData({
          ...formData,
          [name]: value,
        });
      }
    }

    // Para otros campos sin validación especial
    if (name !== 'descripcion' && name !== 'duracion') {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
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

    if (!formData.genero) {
      alert('Por favor, selecciona un género.');
      return;
    }

    console.log('Generando data para enviar:', formData);

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
        genero: null,
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
            options={movies}
            getOptionLabel={(option) => option.nombre}
            onChange={(event, value) => {
              console.log("Opción seleccionada:", value);
              setFormData((prevFormData) => ({
                ...prevFormData,
                genero: value ? value.id : null, // Aseguramos que se guarde el id
              }));
              console.log("ID del género seleccionado:", value ? value.id : null); // Verifica el ID seleccionado
            }}
            renderInput={(params) => (
              <TextField {...params} label="Género" variant="outlined" />
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

          <MuiButton
            type="submit"
            className="w-100 btn-agregar"
            variant="primary"
          >
            Agregar
          </MuiButton>
        </form>
      </Modal.Body>

      <Modal.Footer>
        <MuiButton onClick={handleClose} className="btn-cerrar">
          Cerrar
        </MuiButton>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalMovies;