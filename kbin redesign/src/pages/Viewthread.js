import React from 'react';
import Thread from '../components/commons/Thread/thread-list';
import Comments from '../components/commons/Comments/comment-list';

const Viewthread = ({user, token }) => {

    return (
        <>
            <Thread user={user} token={token}/>
            <Comments user={user} token={token}/>
        </>
    );
}

export default Viewthread;