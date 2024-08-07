import React, { useState } from 'react';
import './buscador.css';

const Buscador = ({ onSearch }) => {
    const [inputValue, setInputValue] = useState('');

    const handleSearch = () => {
        onSearch(inputValue);
    };

    return (
        <div className='contenedor'>
            <div className="contenedor-buscador">
                <input type="text" placeholder="Search..." value={inputValue} onChange={e => setInputValue(e.target.value)} />
                <button className='button-search' onClick={handleSearch}><img className="" src="https://api.iconify.design/heroicons-solid:search.svg?color=white" alt="Logo" /></button>
            </div>
        </div>
    )
}

export default Buscador;