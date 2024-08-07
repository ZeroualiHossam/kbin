import { Link, useParams, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import './NavBar.css'; 

function NavBar({user, refreshData}) {
    const { username } = useParams();
    const location = useLocation();
    const pathname = location.pathname;
    const lastSegment = pathname.split('/').filter(Boolean).pop();

    const [info, setInfo] = useState({
        num_threads: 0,
        num_comments: 0,
        num_boosts: 0,
    });
    
    useEffect(() => {
        fetchData();
    }, [refreshData, username]);

    const fetchData = () => {
        fetch(`https://asw-projecte-kbin-social-alphatretze.onrender.com/api/users/${username}/num/`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })

            .then(data => {
                setInfo({
                num_threads: data[0].count_threads,
                num_comments: data[0].count_comentaris,
                num_boosts: data[0].count_boosted,
                });
            })

            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
            });
    }

    const isActive = (path) => lastSegment === path;

    return (
        <div className='contenidor'>
            <div className="navbar">
                <Link to={`/profile/${username}/threads`} className={isActive('threads') ? 'nav-item active' : 'nav-item'}>Threads ({info.num_threads})</Link>
                <Link to={`/profile/${username}/comments`} className={isActive('comments') ? 'nav-item active' : 'nav-item'}>Comments ({info.num_comments})</Link>
                {user === username ?
                    <Link to={`/profile/${username}/boosts`} className={isActive('boosts') ? 'nav-item active' : 'nav-item'}>Boosts ({info.num_boosts})</Link>
                    : null}
            </div>
        </div>
    );
}

export default NavBar;
