import React, { useState } from 'react';
import Buscador from '../components/commons/Buscador/buscador';
import Filtros from '../components/commons/Filtros/filtros';
import Thread from '../components/commons/Thread/thread-list';

const Searchthread = ({ user, token }) => {
    const [filter, setFilter] = useState('top');
    const [type, setType] = useState('all');
    const [query, setQuery] = useState('');

    return (
        <>
            <Buscador onSearch={setQuery} />
            <Filtros onFilterClick={setFilter} onTypeSelect={setType} />
            <Thread filter={filter} type={type} query={query} user={user} token={token}/>
        </>
    );
}

export default Searchthread;