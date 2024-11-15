import React, { useState, useEffect } from 'react';
import axios from 'axios';

const URI = 'http://localhost:3000/api/peliculas';

function MovieBd() {
  const [pelis, setPelis] = useState([]);
  const [selectedPeli, setSelectedPeli] = useState(null); // Estado para la película seleccionada
  const [showModal, setShowModal] = useState(false); // Estado para mostrar el modal

  useEffect(() => {
    getPelis();
  }, []);

  const getPelis = async () => {
    const res = await axios.get(URI);
    setPelis(res.data);
  };

  const deletePelis = async (id) => {
    await axios.delete(`${URI}/${id}`); 
    getPelis();
  };

  const handleMovieClick = (peli) => {
    setSelectedPeli(peli);
    setShowModal(true); // Muestra el modal al hacer clic
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPeli(null);
  };

  // Función para formatear la fecha
  const formatFecha = (fecha) => {
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="movie-grid">
      {pelis.map((peli) => (
        <div key={peli.id} className="movie-card" onClick={() => handleMovieClick(peli)}>
          <img
            src={`http://localhost/${peli.portada}`}
            alt={peli.titulo}
            className="movie-poster"
          />
          <div className="movie-info">
            <div className="movie-title">{peli.titulo}</div>
            <div className="movie-rating">{peli.rating} / 5.0</div>
          </div>
        </div>
      ))}

      {showModal && selectedPeli && (
        <div className="modal">
          <div className="modal-content">
            <h2>{selectedPeli.titulo}</h2>
            <p><strong>Descripción:</strong> {selectedPeli.descripcion}</p>
            <p><strong>Fecha de creación:</strong> {formatFecha(selectedPeli.fecha_lanzamiento)}</p>
            <p><strong>Rating:</strong> {selectedPeli.rating} / 5.0</p>
            <button onClick={closeModal}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MovieBd;
