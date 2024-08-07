import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchUsersTokens } from '../../../api/api.js';
import './header.css';

const Header = ({ setUser, setToken, initializeUserAndToken }) => {
    const [usersTokens, setUsersTokens] = useState([]);
    const [selectedUserToken, setSelectedUserToken] = useState(localStorage.getItem('selectedUserToken') || '');
    const [activeLink, setActiveLink] = useState('');
    const location = useLocation();

    useEffect(() => {
        fetchUsersTokens().then(data => {
            setUsersTokens(data.tokens);
            if (!selectedUserToken) {
                const initialToken = data.tokens[0].token;
                setSelectedUserToken(initialToken);
                const initialUser = data.tokens[0].user;
                initializeUserAndToken(initialUser, initialToken);
                localStorage.setItem('selectedUserToken', initialToken);
                localStorage.setItem('user', initialUser);
            }
        });
    }, [selectedUserToken]);

    useEffect(() => {
        switch (location.pathname) {
            case '/':
                setActiveLink('Threads');
                break;
            case '/magazines':
                setActiveLink('Magazines');
                break;
            default:
                setActiveLink('');
                break;
        }
    }, [location]);

    const handleWheel = (event) => {
        if (location.pathname !== '/') {
            return;
        }
        if (usersTokens.length > 0) {
            const currentIndex = usersTokens.findIndex(userToken => userToken.token === selectedUserToken);
            let newIndex;
            if (event.deltaY < 0) {
                newIndex = (currentIndex + 1) % usersTokens.length;
            } else {
                newIndex = (currentIndex - 1 + usersTokens.length) % usersTokens.length;
            }
            const newUserToken = usersTokens[newIndex];
            setSelectedUserToken(newUserToken.token);
            setUser(newUserToken.user);
            setToken(newUserToken.token);
            localStorage.setItem('selectedUserToken', newUserToken.token);
            localStorage.setItem('user', newUserToken.user);
            localStorage.setItem('token', newUserToken.token);
        }
    };

    const selectedUser = usersTokens.find(userToken => userToken.token === selectedUserToken)?.user;

    return (
        <div className="header">
            <div className="leftside">
                <a href='/'><img className="logo" src="https://kbin.social/kbin_logo.svg" alt="Logo" /></a>
                <ul>
                    <li>
                        <a href="/" onClick={() => setActiveLink('Threads')} className={activeLink === 'Threads' ? 'active' : ''}>Threads</a>
                        <a href="/magazines" onClick={() => setActiveLink('Magazines')} className={activeLink === 'Magazines' ? 'active' : ''}>Magazines</a>
                    </li>
                </ul>
            </div>

            <div className="rightside">
                <nav className="contenedor-opciones">
                    <ul>
                        <li><a href='/search-thread'><img className="" src="https://api.iconify.design/heroicons-solid:search.svg?color=white" alt="Logo" /></a></li>
                        <li>
                            <div className="dropdown">
                                <a href='/'><img className="" src="https://api.iconify.design/heroicons-solid:plus.svg?color=white" alt="Logo" /></a>
                                <div className="dropdown-content">
                                    <a href="/createlink">Add new link</a>
                                    <a href="/createthread">Add new thread</a>
                                    <a href="/createmagazine">Create new magazine</a>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className="dropdown">
                                <a href='/'><img className="" src="https://api.iconify.design/heroicons-solid:menu.svg?color=white" alt="Logo" /></a>
                                <div className="dropdown-content">
                                    <a href="#">Subscribed</a>
                                    <a href="#">Moderated</a>
                                    <a href="#">Favourites</a>
                                    <a href="#">All</a>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div className="dropdown">
                                <a href="" onWheel={handleWheel}>{selectedUser}</a>
                                <div className="dropdown-content">
                                    <a href={`/profile/${selectedUser}/threads`}>Profile</a>
                                    <a href={`/profile/${selectedUser}/edit`}>Settings</a>
                                </div>
                            </div>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
}

export default Header;
