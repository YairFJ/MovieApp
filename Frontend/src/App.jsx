import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Categories from './components/Categories';
import MovieGrid from './components/MovieGrid';
import MovieModal from './components/MovieModal';
import ModalMovies from './components/ModalMovies';  // Importamos el Modal
import axios from 'axios';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MovieBd from './components/MovieBd';

const API_KEY = '3fd2be6f0c70a2a598f084ddfb75487c';
const BASE_URL = 'https://api.themoviedb.org/3';

function App() {
  const [movies, setMovies] = useState([]);
  const [category, setCategory] = useState('popular');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showModal, setShowModal] = useState(false);  // Estado para manejar el modal

  // Función para abrir el modal
  const handleShowModal = () => setShowModal(true);

  // Función para cerrar el modal
  const handleCloseModal = () => setShowModal(false);

  // Fetch de películas según la categoría
  useEffect(() => {
    fetchMovies(category);
  }, [category]);

  const fetchMovies = async (category) => {
    try {
      const response = await axios.get(`${BASE_URL}/movie/${category}?api_key=${API_KEY}&language=es-ES&region=ES`);
      setMovies(response.data.results);
    } catch (error) {
      console.error('Error al obtener películas:', error);
    }
  };

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
  };

  const handleMovieSelect = async (movie) => {
    try {
      const response = await axios.get(`${BASE_URL}/movie/${movie.id}?api_key=${API_KEY}&append_to_response=videos&language=es-ES`);
      const movieData = response.data;

      const trailer = movieData.videos.results.find(
        (video) => video.type === 'Trailer' && video.site === 'YouTube' && video.iso_639_1 === 'es'
      );

      setSelectedMovie({
        ...movieData,
        trailerUrl: trailer ? `https://www.youtube.com/embed/${trailer.key}` : null
      });
    } catch (error) {
      console.error('Error al obtener detalles de la película:', error);
    }
  };

  const closeModal = () => {
    setSelectedMovie(null);
  };

  const handleSearch = async (query) => {
    if (!query) {
      fetchMovies(category);
      return;
    }
    try {
      const response = await axios.get(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}&language=es-ES`);
      const moviesWithImages = response.data.results.filter((movie) => movie.poster_path);
      setMovies(moviesWithImages);
    } catch (error) {
      console.error('Error al buscar películas:', error);
    }
  };

  return (
    <Router>
      <div className="App">
        <Header onSearch={handleSearch}  /> {/* Pasa handleShowModal a SearchBar */}
        
        {/* El Modal que se activa al presionar el botón "+" */}
        <ModalMovies show={showModal} handleClose={handleCloseModal} />

        <Routes>
          <Route
            path="/"
            element={
              <>
                <Categories onCategoryChange={handleCategoryChange} />
                <MovieGrid movies={movies} onMovieSelect={handleMovieSelect} />
                {selectedMovie && <MovieModal movie={selectedMovie} onClose={closeModal} />}
              </>
            }
          />
       
          <Route path="/pelisdb" element={<MovieBd/>}/>
        </Routes>
      </div>

    </Router>
  );
}

export default App;
