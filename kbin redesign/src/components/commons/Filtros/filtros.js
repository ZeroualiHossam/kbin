import React, { useState } from 'react';
import './filtros.css';

const Filtros = ({ onFilterClick, onTypeSelect }) => {
    const [activeFilter, setActiveFilter] = useState('top');
    const [activeType, setActiveType] = useState('all');

    const handleFilterClick = (filter) => {
        setActiveFilter(filter);
        onFilterClick(filter);
    }

    const handleTypeSelect = (type) => {
        setActiveType(type);
        onTypeSelect(type);
    }

    return (
        <div className='container'>
            <div className="filtros">
                <div className="filtros-left">
                    <a href="#" className={activeFilter === 'top' ? 'active' : ''} onClick={() => handleFilterClick('top')}>Top</a>
                    <a href="#" className={activeFilter === 'newest' ? 'active' : ''} onClick={() => handleFilterClick('newest')}>Newest</a>
                    <a href="#" className={activeFilter === 'commented' ? 'active' : ''} onClick={() => handleFilterClick('commented')}>Commented</a>
                </div>
                <div className="filtros-right">
                    <div className="dropdown">
                        <img className="image" src="https://api.iconify.design/flowbite:filter-solid.svg?color=rgb(167, 162, 162)" alt="Logo" />
                        <div className="dropdown-content">
                            <a href="#" className={activeType === 'all' ? 'active' : ''} onClick={() => handleTypeSelect('all')}>Todo</a>
                            <a href="#" className={activeType === 'links' ? 'active' : ''} onClick={() => handleTypeSelect('links')}>Links</a>
                            <a href="#" className={activeType === 'threads' ? 'active' : ''} onClick={() => handleTypeSelect('threads')}>Threads</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Filtros;
