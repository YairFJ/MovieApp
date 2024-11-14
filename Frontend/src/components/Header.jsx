import React, { useState } from 'react';
import SearchBar from './SearchBar';
import ModalMovies from './ModalMovies';

function Header({ onSearch }) {
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <a className="boton-logo" href="../">MovieApp</a>
        </div>
      
        <SearchBar onSearch={onSearch} />
        
        {/* Botón para abrir el modal */}
        <button onClick={handleShowModal} className="open-modal-btn">
         +
        </button>

        {/* Pasar el estado del modal como prop */}
        <ModalMovies show={showModal} handleClose={handleCloseModal} />
      </div>
    </header>
  );
}

export default Header;
