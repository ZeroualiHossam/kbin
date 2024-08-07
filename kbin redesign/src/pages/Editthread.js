import React, { useState, useEffect } from 'react';
import Thread from '../components/commons/Thread/thread-list';
import ThreadForm from '../components/commons/Formulario-Editar/thread-form';

const EditThread = ({ editingThreadId, user, token }) => {
    const [ThreadId, setEditingThreadId] = useState(editingThreadId);

    useEffect(() => {
        if (!ThreadId) {
            const storedThreadId = localStorage.getItem('editingThreadId');
            if (storedThreadId) {
                setEditingThreadId(storedThreadId);
            }
        }
    }, [ThreadId]);

    useEffect(() => {
        if (ThreadId) {
            localStorage.setItem('editingThreadId', ThreadId);
        }
    }, [ThreadId]);

    return (
        <>
            <Thread user={user} token={token} />
            {ThreadId && <ThreadForm threadID={ThreadId} user={user} token={token}/>}
        </>
    );
}

export default EditThread;







