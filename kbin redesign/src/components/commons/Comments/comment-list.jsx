import './comments.css';
import { useLocation, useNavigate, useParams} from 'react-router-dom';
import { useState, useEffect } from 'react';
import Comment from './comment.jsx';
import {fetchCommentsThread, createComment, fetchCommentsUser} from '../../../api/api.js';

export default function Comments ({user, token}) {

    const location = useLocation();
    const { username } = useParams();
    const threadId = location.pathname.split('/')[2];
    const navigate = useNavigate();
    const [commentsList, setCommentsList] = useState([]);
    const urlParams = new URLSearchParams(window.location.search);
    const sortBy = urlParams.get('sort_by');
    const [filter, setFilter] = useState(sortBy ? sortBy : 'upvotes');
    const [newComment, setNewComment] = useState("");
    
    const pathname = location.pathname;
    const lastSegment = pathname.split('/').filter(Boolean).pop();

    useEffect(() => {
        if (lastSegment === 'comments') {
            fetchCommentsUser(username, filter)
                .then(comments => setCommentsList(comments));
        }
        else {
            fetchCommentsThread(threadId, filter, token)
                .then(comments => setCommentsList(comments));
        }
    }, [threadId, commentsList, filter, user, token, username, lastSegment]);
    
    const updateComments = () => {
        setCommentsList([]);
    }

    const displayComments = (comments, marginLeftComment) => {
        if (!Array.isArray(comments)) {
            return null;
        }

        return (
            <ul style={{marginLeft: marginLeftComment + 1}}>
               {comments.map((comment, index) => (
                    <li className='commentItem' key={index}>
                        <Comment comment={comment} user={user} token={token} updateComments={updateComments} resetForm={filter}/>
                        {displayComments(comment.children, marginLeftComment + 1)}
                    </li>   
                ))}
            </ul>
        );

        
    }
   
    const handleFilter = (filter) => {
        navigate(`?sort_by=${filter}`);
        setFilter(filter);
    }

    const handleInputComment = (event) => {
        setNewComment(event.target.value);
    }

    const handleNewComment = async () => {
        try {
            await createComment(threadId, newComment, token);
            setNewComment("");
            updateComments();
        } catch (error) {
            console.error('Error creating comment:', error);
        }
    }
    
    return (
        <section className='centerComments'>
            {lastSegment !== 'comments' && (
            <section className='createCommentBox'>
                <section className='createCommentLine'>
                    <input type='text' className='createCommentInput' value={newComment} placeholder='Write a comment' onChange={handleInputComment}/>
                    <button className='createCommentButton' onClick={handleNewComment}>Comment!</button>
                </section>
            </section>
            )}
            <section className='commentsFilters'>
                    <section className='commentsListFilters'>
                        {lastSegment !== 'comments' && (<p className={`${filter === 'upvotes' ? 'commentsFilterActive' : 'commentsFilter'}`} onClick={() => handleFilter('upvotes')}>Top</p>)}
                        {lastSegment === 'comments' && (<p className={`${filter === 'votes' ? 'commentsFilterActive' : 'commentsFilter'}`} onClick={() => handleFilter('votes')}>Top</p>)}
                        <p className={`${filter === 'newest' ? 'commentsFilterActive' : 'commentsFilter'}`} onClick={() => handleFilter('newest')}>Newest</p>
                        <p className={`${filter === 'oldest' ? 'commentsFilterActive' : 'commentsFilter'}`} onClick={() => handleFilter('oldest')}>Oldest</p>
                    </section>
            </section>
            <section className='commentList'>
                {Array.isArray(commentsList) && commentsList.length > 0 && displayComments(commentsList, 0)}
            </section>
        </section>
    );
}