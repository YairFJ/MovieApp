import React from 'react';
import { Link } from 'react-router-dom';


function Categories({ onCategoryChange }) {
  const categories = [
    { id: 'popular', label: 'Películas Populares' },
    { id: 'upcoming', label: 'Próximamente en Cines' },
    { id: 'top_rated', label: 'Top Rated' },
  ];

  return (
    <div className="categories">
      {categories.map((cat) => (
        <button
          key={cat.id}
          className="category-button"
          onClick={() => onCategoryChange(cat.id)}
        >
          {cat.label}
        </button>
      ))}
      <Link to="/pelisdb">
        <button className="category-button">Películas Creadas</button>
      </Link>
    </div>
  );
}

export default Categories;

