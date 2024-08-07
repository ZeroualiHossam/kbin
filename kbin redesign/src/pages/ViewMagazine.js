import Thread from '../components/commons/Thread/thread-list';
import Filtros from '../components/commons/Filtros/filtros';
import MagazineView from '../components/commons/MagazineView/magazineView';
import { useLocation } from 'react-router-dom';

import React, { useState } from 'react';

function ViewMagazine({ onThreadEdit,user, token }) {
    const [filter, setFilter] = useState('top');
    const [type, setType] = useState('all');
    const location = useLocation()
    const pathname = location.pathname;
    const lastSegment = pathname.split('/').filter(Boolean).pop();
    return (
        <div>
            <MagazineView  magazine_name ={lastSegment} token={token} />
            <Filtros onFilterClick={setFilter} onTypeSelect={setType}/>
            <Thread filter={filter} type={type} onThreadEdit={onThreadEdit} user={user} token={token} />
        </div>
    );
}

export default ViewMagazine;