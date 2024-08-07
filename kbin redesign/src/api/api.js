export const handleVoteDown = (threadId, token) => {
    return fetch(`https://asw-projecte-kbin-social-alphatretze.onrender.com/api/threads/${threadId}/downvote/`, {
        method: 'POST',
        headers: {
            'Authorization': `Token ${token}`,
        },
    });
}

export const handleVoteUp = (threadId, token) => {
    return fetch(`https://asw-projecte-kbin-social-alphatretze.onrender.com/api/threads/${threadId}/upvote/`, {
        method: 'POST',
        headers: {
            'Authorization': `Token ${token}`,
        },
    });
}

export const handleBoost = (threadId, token) => {
    return fetch(`https://asw-projecte-kbin-social-alphatretze.onrender.com/api/threads/${threadId}/boost/`, {
        method: 'POST',
        headers: {
            'Authorization': `Token ${token}`,
        },
    });
}

export const fetchThreads = (filter, type) => {
    return fetch(`https://asw-projecte-kbin-social-alphatretze.onrender.com/api/threads/?filter_by=${filter}&link_filter=${type}`)
        .then(response => response.json());
}

export const fetchThreadsUser = (filter, type, username) => {
    return fetch(`https://asw-projecte-kbin-social-alphatretze.onrender.com/api/users/${username}/threads/?filter_by=${filter}&link_filter=${type}`)
        .then(response => response.json());
}

export const fetchBoostUser = (filter, type, username, token) => {
    return fetch(`https://asw-projecte-kbin-social-alphatretze.onrender.com/api/users/${username}/boosts/?filter_by=${filter}&link_filter=${type}`, {
        method: 'GET', 
        headers: {
            'Authorization': `Token ${token}`, 
            'Content-Type': 'application/json' 
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
}

export const fetchCommentsUser = (username, filter) => {
    return fetch(`https://asw-projecte-kbin-social-alphatretze.onrender.com/api/users/${username}/comments/?filter_by=${filter}`)
        .then(response => response.json());
}

export const fetchMagazines = (token,order) => {
    const url = `https://asw-projecte-kbin-social-alphatretze.onrender.com/api/magazines/?order=${order}`;
    return fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Token ${token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch magazines');
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error fetching magazines:', error);
            throw error;
        });
}

export const fetchMagazine = (magazine_name, token) => {
    const url =`https://asw-projecte-kbin-social-alphatretze.onrender.com/api/magazines/${magazine_name}/`
    return fetch(url,{
        method: 'GET',
        headers: {
            'Authorization': `Token ${token}`
        }
    } )
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error fetching magazine ${magazine_name}: ${response.statusText}`);
        }
            return response.json();
        })
        .then(data => {
            return data;
        })        
}

export const fetchThreadsMagazine = (magazine_name,filter,type,token) => {
    const url = `https://asw-projecte-kbin-social-alphatretze.onrender.com/api/magazines/${magazine_name}/threads?filter_by=${filter}&link_filter=${type}`;
    return fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Token ${token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch threads');
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error fetching threads:', error);
            throw error;
        });
}

export const handleSubscribe = (magazine_name, token) => {
    return fetch(`https://asw-projecte-kbin-social-alphatretze.onrender.com/api/magazines/${magazine_name}/subscribe`, {
        method: 'POST',
        headers: {
            'Authorization': `Token ${token}`,
        },
    });
}

export const deleteThread = (threadId, token) => {
    return fetch(`https://asw-projecte-kbin-social-alphatretze.onrender.com/api/threads/${threadId}/`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Token ${token}`,
        },
    });
}

export const getThreadInfo = (threadId) => {
    return fetch(`https://asw-projecte-kbin-social-alphatretze.onrender.com/api/threads/${threadId}/`)
        .then(response => response.json());
}

export const fetchUsersTokens = () => {
    return fetch('https://asw-projecte-kbin-social-alphatretze.onrender.com/api/users-token/')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch users tokens');
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error fetching users tokens:', error);
            throw error;
        });
}

export const fetchUserUpvotes = (token) => {
    return fetch('https://asw-projecte-kbin-social-alphatretze.onrender.com/api/user-upvotes/', {
        headers: {
            'Authorization': `Token ${token}`,
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch user upvotes');
        }
        return response.json();
    })
    .catch(error => {
        console.error('Error fetching user upvotes:', error);
        throw error;
    });
}

export const fetchUserDownvotes = (token) => {
    return fetch('https://asw-projecte-kbin-social-alphatretze.onrender.com/api/user-downvotes/', {
        headers: {
            'Authorization': `Token ${token}`,
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch user downvotes');
        }
        return response.json();
    })
    .catch(error => {
        console.error('Error fetching user downvotes:', error);
        throw error;
    });
}

export const fetchCommentsThread = (threadId, filter, token) => {
    return fetch(`https://asw-projecte-kbin-social-alphatretze.onrender.com/api/threads/${threadId}/comments/?sort_by=${filter}`, {
        method: 'GET',
        headers: {
            'Authorization': `Token ${token}`,
        },
    })
    .then(response => {
        if (!response.ok) {
            console.log(response.text());
            throw new Error('Failed to fetch comments');
        }
        return response.json();
    });
}

export const upVoteComment = (threadId, commentId, token) => {
    return fetch(`https://asw-projecte-kbin-social-alphatretze.onrender.com/api/threads/${threadId}/comments/${commentId}/upvote`, {
        method: 'POST',
        headers: { 'Authorization': `Token ${token}` },
    }).then(response => {
        if (!response.ok) {
            throw new Error('Failed to upvote comment');
        }
        return response.json();
    });
}

export const downVoteComment = (threadId, commentId, token) => {
    return fetch(`https://asw-projecte-kbin-social-alphatretze.onrender.com/api/threads/${threadId}/comments/${commentId}/downvote`, {
        method: 'POST',
        headers: { 'Authorization': `Token ${token}` },
    }).then(response => {
        if (!response.ok) {
            throw new Error('Failed to downvote comment');
        }
        return response.json();
    });
}

export const boostComment = (threadId, commentId, token) => {
    return fetch(`https://asw-projecte-kbin-social-alphatretze.onrender.com/api/threads/${threadId}/comments/${commentId}/boost`, {
        method: 'POST',
        headers: { 'Authorization': `Token ${token}` },
    }).then(response => {
        if (!response.ok) {
            throw new Error('Failed to boost comment');
        }
        return response.json();
    });
}

export const deleteComment = (threadId, commentId, token) => {
    return fetch(`https://asw-projecte-kbin-social-alphatretze.onrender.com/api/threads/${threadId}/comments/${commentId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Token ${token}` },
    }).then(response => {
        if (response.status !== 204) {
            throw new Error('Failed to delete comment');
        }
        return response.json();
    });
}

export const createComment = (threadId, newComment, token) => {
    return fetch(`https://asw-projecte-kbin-social-alphatretze.onrender.com/api/threads/${threadId}/comments/`, {
        method: 'POST',
        headers: { 'Authorization': `Token ${token}`,
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
            comment: newComment,
        }),
    }).then(response => {
        if (response.status !== 201) {
            throw new Error('Failed to create comment');
        }
        return response.json();
    });
}

export const editComment = (threadId, commentId, newComment, token) => {
    return fetch(`https://asw-projecte-kbin-social-alphatretze.onrender.com/api/threads/${threadId}/comments/${commentId}`, {
        method: 'PUT',
        headers: { 'Authorization': `Token ${token}`,
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
            comment: newComment,
        }),
    }).then(response => {
        if (response.status !== 200) {
            throw new Error('Failed to edit comment');
        }
        return response.json();
    }).then(text => {
        console.log(text);
        return text;
    });
}

export const replyComment = (threadId, commentId, newComment, token) => {
    return fetch(`https://asw-projecte-kbin-social-alphatretze.onrender.com/api/threads/${threadId}/comments/${commentId}`, {
        method: 'POST',
        headers: { 'Authorization': `Token ${token}`,
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
            comment: newComment,
        }),
    }).then(response => {
        if (response.status !== 201) {
            throw new Error('Failed to reply comment');
        }
        return response.json();
    });
}
