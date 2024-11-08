import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ModalMovies from './ModalMovies';
function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    if (query) onSearch(query);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        className="search-input"
        placeholder="Buscar..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button className="search-button" type='submit' onClick={handleSearch}>Buscar</button>
      
       
     
    

    </div>
  );
}

export default SearchBar;
