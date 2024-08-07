import './comments.css';
import { formatDistanceToNow, parseISO, set } from 'date-fns';
import { useEffect, useState } from 'react';
import {upVoteComment, downVoteComment, boostComment, deleteComment, editComment, replyComment, getThreadInfo} from '../../../api/api.js';
import { is } from 'date-fns/locale';
import { useLocation, useParams} from 'react-router-dom';

export default function Comment ({comment, user, token, updateComments, resetForm}) {
    const location = useLocation();
    const [upVoted, setUpVoted] = useState(comment.upvoted);
    const [downVoted, setDownVoted] = useState(comment.downvoted);
    const [boosted, setBoosted] = useState(comment.boosted);
    const [upVoteCount, setUpVoteCount] = useState(comment.upvotes_count);  
    const [downVoteCount, setDownVoteCount] = useState(comment.downvotes_count);
    const [boostCount, setBoostCount] = useState(comment.boosts_count);
    const [title, setTitle] = useState(''); 
    const [isReply, setIsReply] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [inputValue, setInputValue] = useState('');

    const pathname = location.pathname;
    const lastSegment = pathname.split('/').filter(Boolean).pop();

    useEffect(() => {
        setIsEdit(false);
        setIsReply(false);
        if (lastSegment === 'comments') {
            getThreadInfo(comment.thread)
                .then(thread => setTitle(thread.title));
        }
    }, [resetForm, comment.thread]);

    const handleVoteUp = async () => {
        try {
            await upVoteComment(comment.thread, comment.id, token);
            if(upVoted) {
                setUpVoted(false);
                setUpVoteCount(upVoteCount - 1);
            } else if (downVoted) {
                setUpVoted(true);
                setDownVoted(false);
                setUpVoteCount(upVoteCount + 1);
                setDownVoteCount(downVoteCount - 1);
            } else {
                setUpVoted(true);
                setUpVoteCount(upVoteCount + 1);
            }
        } catch (error) {
            console.error('Error upvoting comment:', error);
        }
    }

    const handleVoteDown = async () => {
        try {
            await downVoteComment(comment.thread, comment.id, token);
            if(downVoted) {
                setDownVoted(false);
                setDownVoteCount(downVoteCount - 1);
            } else if (upVoted) {
                setDownVoted(true);
                setUpVoted(false);
                setDownVoteCount(downVoteCount + 1);
                setUpVoteCount(upVoteCount - 1);
            } else {
                setDownVoted(true);
                setDownVoteCount(downVoteCount + 1);
            }
        } catch (error) {
            console.error('Error downvoting comment:', error);
        }
    }

    const handleBoost = async () => {
        try {
            await boostComment(comment.thread, comment.id, token);
            if(boosted) {
                setBoosted(false);
                setBoostCount(boostCount - 1);
            } else {
                setBoosted(true);
                setBoostCount(boostCount + 1);
            }
        } catch (error) {
            console.error('Error boosting comment:', error);
        }
    }

    const handleDelete = async () => {
        if(window.confirm("Are you sure you want to delete this comment?")) {
            try {
                await deleteComment(comment.thread, comment.id, token);
                updateComments();
            } catch (error) {
                console.error('Error deleting comment:', error);
            }
        }
    }

    const setReply = () => {
        if(isReply) {
            setIsReply(false);
        } else {
            if(isEdit) {
                setIsEdit(false);
            } 
            setIsReply(true);
            setInputValue('');
        }
    }

    const setEdit = () => {
        if(isEdit) {
            setIsEdit(false);
        } else {
            if(isReply) {
                setIsReply(false);
            } 
            setIsEdit(true);
            setInputValue(comment.comment);
        }
    }

    const handleInputComment = (event) => {
        setInputValue(event.target.value);
    }

    const handleNewComment = async () => {
        if(isReply) {
            try {
                await replyComment(comment.thread, comment.id, inputValue, token);
                setIsReply(false);
                setInputValue('');
                updateComments();
            } catch (error) {
                console.error('Error replying comment:', error);
            }
        } else if(isEdit) {
            try {
                await editComment(comment.thread, comment.id, inputValue, token);
                setIsEdit(false);
                setInputValue('');
                updateComments();
            } catch (error) {
                console.error('Error editing comment:', error);
            }
        }
    }

    return (
        <section className='commentBox'>
            <section className='commentContent'>
                <header className='commentHeader'>
                    <figure>
                        <a>
                        <img className='commentHeaderImage' width="40" height="40" src={comment.created_by_name_photo} onError={(e)=>{e.target.onerror = null; e.target.src="https://cdn-icons-png.flaticon.com/512/4792/4792929.png"}}/> 
                        </a>
                    </figure>
                    <header className='notImg'>
                        <div className='titleTime'>
                            <a className='title' href={`/profile/${comment.created_by_name}/threads`}>
                                <h3>{comment.created_by_name},</h3>
                            </a>
                            <div className="commentTimeLink">
                                <h3 className='time'>{formatDistanceToNow(parseISO(comment.created))} ago</h3>
                                <h3>{lastSegment === 'comments' && <a className='title' href={`/view-thread/${comment.thread}`}> to {title}</a>}</h3>
                            </div>
                        </div>
                        <div className='commentVotes'>
                            <div className={`voteUp ${upVoted ? 'voteUpActive' : ''}`} onClick={handleVoteUp}> 
                                <p className='voteCount'>{upVoteCount}</p>
                                <a><img className='voteImage' src="https://api.iconify.design/ep:top.svg?color=black"/></a>
                            </div>
                            <div className={`voteDown ${downVoted ? 'voteDownActive' : ''}`} onClick={handleVoteDown}> 
                                <p className='voteCount'>{downVoteCount}</p>
                                <a><img className='voteImage' src="https://api.iconify.design/ep:bottom.svg?color=black"/></a>
                            </div>
                        </div>
                    </header>
                </header>
                <p className='commentText'>{comment.comment}</p>
                <div className='commentActions'> 
                    <p className={`${boosted ? 'commentBoosted' : 'commentOtherActions'}`} onClick={handleBoost}>
                        boost({boostCount})
                    </p>
                    <p className='commentOtherActions' onClick={setReply}>reply</p>
                    {user === comment.created_by_name && <p className='commentOtherActions' onClick={setEdit}>edit</p>}
                    {user === comment.created_by_name && <p className='commentActionDelete' onClick={handleDelete}>delete</p>}
                </div>
                {isEdit &&
                        <section className='createCommentLine'>
                            <input type='text' className='createCommentInput' value={inputValue} placeholder='Edit comment' onChange={handleInputComment}/>
                            <button className='createCommentButton' onClick={handleNewComment}>Edit!</button>
                        </section>
                }
                {isReply &&
                        <section className='createCommentLine'>
                            <input type='text' className='createCommentInput' value={inputValue} placeholder='Write a reply' onChange={handleInputComment}/>
                            <button className='createCommentButton' onClick={handleNewComment}>Reply!</button>
                        </section>
                }
            </section>
        </section>
    );
}
