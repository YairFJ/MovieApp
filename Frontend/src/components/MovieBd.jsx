import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';


const URI = 'http://localhost:3000/api/peliculas';

function MovieBd() {
  const [pelis, setPelis] = useState([]);

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

  return (
    <div className="movie-grid">
      {pelis.map((peli) => (
        <div key={peli.id} className="movie-card">
          <img
            src={`http://localhost/${peli.portada}`} // Corregido con comillas
            alt={peli.titulo}
            className="movie-poster"
          />
          <div className="movie-info">
            <div className="movie-title">{peli.titulo}</div>
<<<<<<< HEAD
            <div className="movie-rating">{peli.rating} / 5.0</div>
=======
            <div className="movie-rating">{peli.rating}</div>
>>>>>>> Enzo
          </div>
        </div>
      ))}
    </div>
  );
}

export default MovieBd;
