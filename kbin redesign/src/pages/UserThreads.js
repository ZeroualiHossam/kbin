import UserProfile from '../components/commons/UserProfile/UserProfile';
import Thread from '../components/commons/Thread/thread-list';
import Filtros from '../components/commons/Filtros/filtros';
import React, { useState } from 'react';
import NavBar from '../components/commons/NavBar/NavBar';

function UserThreads({ onThreadEdit, user, token }) {
    const [filter, setFilter] = useState('top');
    const [type, setType] = useState('all');
    const [refreshData, setRefreshData] = useState(false);

    const notifyUpdate = () => {
        setRefreshData(prev => !prev); 
    };

    return (
        <div>
            <UserProfile />
            <NavBar user={user} refreshData={refreshData}/>
            <Filtros onFilterClick={setFilter} onTypeSelect={setType} />
            <Thread filter={filter} type={type} onThreadEdit={onThreadEdit} user={user} token={token} notifyUpdate={notifyUpdate} />
        </div>
    );
}

export default UserThreads;