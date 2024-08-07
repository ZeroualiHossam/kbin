import React, { useState, useEffect } from 'react';
import { handleSubscribe,fetchMagazines } from '../../../api/api.js';
import './magazine.css'

const MagazineList = ({ token }) => {
    const [magazines, setMagazines] = useState([]);
    const [order, setOrder] = useState('subscribers');


    useEffect(() => {
        if(token) {
            fetchMagazines(token,order)
                .then(data => setMagazines(data))
                .catch(error => console.error(error));
        }
    }, [token,order]);

    const handleSubscription = (magazineName) => {
        handleSubscribe(magazineName, token)
            .then(response => {
                if (response.ok) {
                    setMagazines(prevMagazines => 
                        prevMagazines.map(magazine => 
                            magazine.name === magazineName ? { 
                                ...magazine, 
                                is_subscribed: !magazine.is_subscribed,
                                total_subscriber_count: magazine.is_subscribed ? magazine.total_subscriber_count - 1 : magazine.total_subscriber_count + 1
                            } : magazine
                        )
                    );
                    throw new Error('Failed to subscribe');
                }
            })
                .catch(error => console.error(error));           
    };

    const handleOrderChange = (newOrder) => {
        setOrder(newOrder);
    };

    return (
        <div className="magazine-container">
        <div className='container'>
            <div className="filtros_magazines">
                <div className="filtros-left-magazine">
                    <a className={order === 'threads' ? 'active-magazine' : ''} onClick={() => handleOrderChange('threads')}>#Threads</a>
                    <a className={order === 'comments' ? 'active-magazine' : ''} onClick={() => handleOrderChange('comments')}>#Comments</a>
                    <a className={order === 'subscribers' ? 'active-magazine' : ''} onClick={() => handleOrderChange('subscribers')}>#Subscribers</a>
                </div>
            </div>
        </div>
        <div className="magazine-table-responsive">
            <table className="magazine-table">
                <thead className="magazine-thead">
                    <tr>
                        <th className="magazine-th">Name</th>
                        <th className="magazine-th">Threads</th>
                        <th className="magazine-th">Comments</th>
                        <th className="magazine-th">Subscriptions</th>
                    </tr>
                </thead>
                <tbody className="magazine-tbody">
                    {magazines.map((magazine, index) => (
                        <tr key={index} className="magazine-tr">
                            <td className="magazine-td">
                                <a href={`/m/${magazine.name}`} className="magazine-inline stretched-link" title={magazine.name}>{magazine.name}</a>
                            </td>
                            <td className="magazine-td">{magazine.total_threads_count}</td>
                            <td className="magazine-td">{magazine.total_comments_count}</td>
                            <td className="magazine-td">
                                <aside className="magazine__subscribe" data-controller="subs">
                                    <div className='action'>
                                        <span className="magazine__subscribe-count">{magazine.total_subscriber_count}</span>
                                        <button type="button" className="magazine__subscribe-button" onClick={() => handleSubscription(magazine.name)}>
                                            {magazine.is_subscribed ? 'Unsubscribe' : 'Subscribe'}
                                        </button>
                                    </div>
                                </aside>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
    );
}

export default MagazineList;
