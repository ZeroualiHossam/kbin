import React, { useState } from 'react';
import './Home.css';
import Thread from '../../components/commons/Thread/thread-list';
import Filtros from '../../components/commons/Filtros/filtros';

const Home = ({ onThreadEdit, user, token })=> {
    const [filter, setFilter] = useState('top');
    const [type, setType] = useState('all');
    return (
        <div className='home'>
            <Filtros onFilterClick={setFilter} onTypeSelect={setType}/>
            <Thread filter={filter} type={type} onThreadEdit={onThreadEdit} user={user} token={token} />
        </div>
    );
}

export default Home;