import UserProfile from '../components/commons/UserProfile/UserProfile';
import React, { useState } from 'react';
import NavBar from '../components/commons/NavBar/NavBar';
import Comments from '../components/commons/Comments/comment-list';

function UserComments({user, token}) {
    const [refreshData, setRefreshData] = useState(false);

    const notifyUpdate = () => {
        setRefreshData(prev => !prev); 
    };

    return (
        <div>
            <UserProfile />
            <NavBar user={user} refreshData={refreshData}/>
            <Comments user={user} token={token}/>
        </div>
    );
}

export default UserComments;