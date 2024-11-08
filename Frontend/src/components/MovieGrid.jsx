import React from 'react';

function MovieGrid({ movies, onMovieSelect }) {
  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <div 
          key={movie.id}
          className="movie-card"
          onClick={() => onMovieSelect(movie)}
        >
          <img 
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
            alt={movie.title} 
            className="movie-poster" 
          />
          <div className="movie-info">
            <div className="movie-title">{movie.title}</div>
            <div className="movie-rating">{movie.vote_average.toFixed(1)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MovieGrid;
