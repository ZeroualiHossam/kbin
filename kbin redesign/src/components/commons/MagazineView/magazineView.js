import React, { useState, useEffect } from 'react';
import { handleSubscribe,fetchMagazine } from '../../../api/api.js';
import './magazineView.css';

const MagazineView = ({ magazine_name, token }) => {
    const [magazine, setMagazine] = useState([]);


    useEffect(() => {
        if(token) {
            fetchMagazine(magazine_name,token)
                .then(data => setMagazine(data))
                .catch(error => console.error(error));
        }
    }, [magazine_name, token]);

    const handleSubscription = () => {
        handleSubscribe(magazine.name, token)
            .then(response => {
                if (response.ok) {
                    setMagazine(prevMagazine => ({
                        ...prevMagazine,
                        is_subscribed: !prevMagazine.is_subscribed,
                        total_subscriber_count: magazine.is_subscribed ? magazine.total_subscriber_count - 1 : magazine.total_subscriber_count + 1
                    }));
                } else {
                    throw new Error('Failed to subscribe');
                }
            })
            .catch(error => console.error(error));
    };

    return (
        <div className="containerMagazine">
        <section className="magazineSection">
            <h3 className='magazineH3'>MAGAZINE</h3>
            <div className="magazineDiv">
                <h4 className="magazineName">
                    <a href={`/m/${magazine.name}`}>
                        {magazine.name}
                    </a>
                </h4>
                <p className="magazineTitle">{magazine.title}</p>
                <aside className="magazine__subscribe_view" data-controller="subs">
                    <div className='action'>
                        <span className="magazine__subscribe_view">{magazine.total_subscriber_count}</span>
                            <button type="button" className="magazine__subscribe_view-button" onClick={() => handleSubscription()}>
                                {magazine.is_subscribed ? 'Unsubscribe' : 'Subscribe'}
                            </button>
                        </div>
                     </aside>
            </div>
            <div className="contentMagazine magazineDescription">
                <h3 className='magazineH3'>ABOUT COMMUNITY</h3>
                <p className='magazineInfo'>{magazine.description ? magazine.description : 'No description provided'}</p>
            </div>
            <h3 className="magazineH3 mt-3">RULES</h3>
            <div className="contentMagazine magazineRules">
                <p className='magazineInfo'>{magazine.rules ? magazine.rules : 'No rules provided'}</p>
            </div>
        </section>
    </div>
    );
}

export default MagazineView;
