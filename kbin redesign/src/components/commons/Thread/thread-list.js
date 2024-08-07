import { formatDistanceToNow, parseISO } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { deleteThread ,fetchThreadsMagazine, fetchBoostUser, fetchThreadsUser, fetchThreads, fetchUserDownvotes, fetchUserUpvotes, handleBoost, handleVoteDown, handleVoteUp } from '../../../api/api'; // Importa las funciones necesarias
import './thread.css';

const Thread = ({ filter, type, query, onThreadEdit, user, token, notifyUpdate }) => {
    const [data, setData] = useState([]);
    const [upvotedThreads, setUpvotedThreads] = useState([]);
    const [downvotedThreads, setDownvotedThreads] = useState([]);
    const [boostedThreads, setBoostedThreads] = useState([]);
    const { username } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    
    const handleUpdate = () => {
        if (notifyUpdate) notifyUpdate(); 
    };

    const updateVotes = () => {
        if (token) {
            fetchUserUpvotes(token)
                .then(upvotes => setUpvotedThreads(upvotes))
                .catch(error => console.error(error));

            fetchUserDownvotes(token)
                .then(downvotes => setDownvotedThreads(downvotes))
                .catch(error => console.error(error));
        }
    }

    const fetchBoosts = async () => {
        try {
            const response = await fetch(`https://asw-projecte-kbin-social-alphatretze.onrender.com/api/users/${user}/boosts/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setBoostedThreads(data);
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
    };
    const fetchThread = ()  => {
        const threadId = location.pathname.split('/')[2];
        fetch(`https://asw-projecte-kbin-social-alphatretze.onrender.com/api/threads/${threadId}`)
            .then(response => response.json())
            .then(data => {
                if (data) {
                    setData([data]);
                } else {
                    setData([]);
                }
            });
        }

    const pathname = location.pathname;
    const lastSegment = pathname.split('/').filter(Boolean).pop();

    useEffect(() => {
        let url;
        if (lastSegment === 'boosts') {
            fetch(`https://asw-projecte-kbin-social-alphatretze.onrender.com/api/users/${username}/boosts/?filter_by=${filter}&link_filter=${type}`, {
                method: 'GET', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}` 
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                console.log(lastSegment);
                console.log('threads get succesfully');
                return response.json();
            })
            .then(data => {
                setData(data);
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
            });
        }

        else if (lastSegment === 'threads') {
            fetch(`https://asw-projecte-kbin-social-alphatretze.onrender.com/api/users/${username}/threads/?filter_by=${filter}&link_filter=${type}`)
            .then(response => {
              if (!response.ok) {
                  throw new Error('Network response was not ok');
              }
              else {
                  console.log('threads get succesfully');
                  return response.json();
              }
            })
        
            .then(data => {
              setData(data);
            })
        
            .catch(error => {
              console.error('There has been a problem with your fetch operation:', error);
            });
        }

        else if (location.pathname === '/search-thread') {
            if (query) {
                url = `https://asw-projecte-kbin-social-alphatretze.onrender.com/api/search/?filter_by=${filter}&link_filter=${type}&q=${query}`;
                console.log(url);
                fetch(url)
                    .then(response => response.json())
                    .then(data => {
                        if (Array.isArray(data)) {
                            setData(data);
                        } else {
                            setData([]);
                        }
                    });
            } else {
                setData([]);
            }
        } else if (location.pathname.startsWith('/edit-thread/')) {
            const threadId = location.pathname.split('/')[2];
            url = `https://asw-projecte-kbin-social-alphatretze.onrender.com/api/threads/${threadId}`;
            console.log(url);
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    if (data) {
                        setData([data]);
                    } else {
                        setData([]);
                    }
                });
        } else if (location.pathname.startsWith('/view-thread/')) {
            fetchThread();
        } else if (location.pathname.startsWith('/m/')) {
            fetchThreadsMagazine(lastSegment,filter,type,token)
                .then(data => setData(data))
                .catch(error => console.error(error));
        }else {
            url = `https://asw-projecte-kbin-social-alphatretze.onrender.com/api/threads/?filter_by=${filter}&link_filter=${type}`;
            console.log(url);
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    if (Array.isArray(data)) {
                        setData(data);
                    } else {
                        setData([]);
                    }
                });
        }

        updateVotes();
        fetchBoosts();

    }, [filter, type, username, query, location.pathname, user, token]);

    if (location.pathname === '/search-thread' && !query) {
        return null;
    }

    const isUpvoted = (threadId) => upvotedThreads.some(upvote => upvote.id === threadId);
    const isDownvoted = (threadId) => downvotedThreads.some(downvote => downvote.id === threadId);
    const isBoosted = (threadId) => boostedThreads.some(boost => boost.id === threadId);
    const isEditThreadPage = location.pathname.startsWith('/edit-thread/');

    return (
        <div className="list-thread">
            {Array.isArray(data) && data.length > 0 && data.map((thread, index) => (
                <div className="box" key={index}>
                    <div className='zona-superior'>
                        <div className="box-left">
                            <div className={`vote-up ${isUpvoted(thread.id) ? 'vote-up-active' : ''}`} onClick={() => !isEditThreadPage && handleVoteUp(thread.id, token).then(() => {
                                if (lastSegment === 'boosts') fetchBoostUser(filter, type, user, token).then(data => setData(data));
                                else if (lastSegment === 'threads') fetchThreadsUser(filter, type, user).then(data => setData(data));
                                else if (location.pathname.startsWith('/m/')) fetchThreadsMagazine(lastSegment,filter, type, token).then(data => setData(data));
                                else if (location.pathname.startsWith('/view-thread/')) fetchThread();
                                else fetchThreads(filter, type).then(data => setData(data));
                                updateVotes();
                            })}>
                                <p>{thread.upvotes_count}</p>
                                <a><img src="https://api.iconify.design/ep:top.svg?color=black" alt="" /></a>
                            </div>
                            <div className={`vote-down ${isDownvoted(thread.id) ? 'vote-down-active' : ''}`} onClick={() => !isEditThreadPage && handleVoteDown(thread.id, token).then(() => {
                                if (lastSegment === 'boosts') fetchBoostUser(filter, type, user, token).then(data => setData(data));
                                else if (lastSegment === 'threads') fetchThreadsUser(filter, type, user).then(data => setData(data));
                                else if (location.pathname.startsWith('/m/')) fetchThreadsMagazine(lastSegment,filter, type, token).then(data => setData(data));
                                else if (location.pathname.startsWith('/view-thread/')) fetchThread();
                                else fetchThreads(filter, type).then(data => setData(data));
                                updateVotes();
                            })}>
                                <p>{thread.downvotes_count}</p>
                                <a><img src="https://api.iconify.design/ep:bottom.svg?color=black" alt="" /></a>
                            </div>
                        </div>
                        <div className="box-right">
                            <div className="box-top">
                                <Link className='name' to={`/view-thread/${thread.id}`}>{thread.title}</Link>
                                {thread.url && (
                                    <a className='url' href={thread.url}> ({thread.url}) </a>
                                )}
                            </div>
                            <div className="box-center">
                                <a className='name' href={`/profile/${thread.created_by_name}/threads`}>{thread.created_by_name}, </a>
                                <a className='created'> {formatDistanceToNow(parseISO(thread.created))} ago, </a>
                                <a className='magazine' href={`/m/${thread.magazine_name}`}>{thread.magazine_name}</a>
                            </div>
                            <div className='box-bottom'>
                                <a className='comments' href=''> {thread.comments_count} comments </a>
                                <a className={`boost ${isBoosted(thread.id) ? 'boost-active' : ''}`} href='' onClick={(event) => {
                                    event.preventDefault();
                                    handleBoost(thread.id, token).then(() => {
                                        if (lastSegment === 'boosts') fetchBoostUser(filter, type, user, token).then(data => setData(data));
                                        else if (lastSegment === 'threads') fetchThreadsUser(filter, type, user).then(data => setData(data));
                                        else if (location.pathname.startsWith('/m/')) fetchThreadsMagazine(lastSegment,filter, type, token).then(data => setData(data));
                                        else if (location.pathname.startsWith('/view-thread/')) fetchThread();
                                        else fetchThreads(filter, type).then(data => setData(data));
                                        fetchBoosts();
                                        handleUpdate();
                                    });
                                }}>boost ({thread.boosts_count})</a>
                                {user === thread.created_by_name && (
                                    <div className='propietario'>
                                        {!location.pathname.startsWith('/edit-thread/') && (
                                            <Link className='edit' to={`/edit-thread/${thread.id}`} onClick={() => onThreadEdit && onThreadEdit(thread.id)}> edit </Link>
                                        )}
                                        <a className='delete' href='' onClick={(event) => {
                                            event.preventDefault();
                                            deleteThread(thread.id, token).then(() => {
                                                console.log(lastSegment);
                                                if (lastSegment === 'boosts') fetchBoostUser(filter, type, user, token).then(data => setData(data));
                                                else if (lastSegment === 'threads') fetchThreadsUser(filter, type, user).then(data => setData(data));
                                                else if (location.pathname.startsWith('/m/')) fetchThreadsMagazine(lastSegment,filter, type, token).then(data => setData(data));
                                                else {
                                                    fetchThreads(filter, type).then(data => setData(data));
                                                    navigate('/');
                                                }
                                                handleUpdate();
                                            });
                                        }}> delete </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    {(location.pathname.startsWith('/edit-thread/') || location.pathname.startsWith('/view-thread/')) ? (
                        <div className='propietario-edit'>
                            <p className='thread-body'> {thread.body} </p>
                        </div>
                    ) : null}
                </div>
            ))}
        </div>
    );
}

export default Thread;
