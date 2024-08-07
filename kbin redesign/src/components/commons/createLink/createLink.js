import React, { useState, useEffect } from 'react';

import '../createThread/createThread.css';

function CreateLink({ token }) {
    const [thread, setThread] = useState({
        title: '',
        body: '',
        url: '',
        magazine_name: ''
    });

    const [magazineName, setMagazineName] = useState([]);

    useEffect(() => {
        fetch(`https://asw-projecte-kbin-social-alphatretze.onrender.com/api/magazines/`)
        .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json();
        })
    
        .then(data => {
          setMagazineName(data.map(item => item.name));
        })
    
        .catch(error => {
          console.error('There has been a problem with your fetch operation:', error);
        });
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setThread(prevThread => ({
            ...prevThread,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log('Submitting:', thread);

        try {
            const response = await fetch(`https://asw-projecte-kbin-social-alphatretze.onrender.com/api/threads/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify(thread)
            });

            if (response.status === 201) {
                console.log('Thread created successfully');
                alert('Thread created successfully!');

            } else if (response.status === 400) {
                console.log('Bad request, please check the data');
                alert('Bad request, please check the data');
                
            } else {
                throw new Error(`HTTP error! status: ${response.status}`); 
            }
        } catch (error) {
            console.error('Failed to create thread:', error);
            alert('Failed to create thread');
        }
    };

    return (
        <div className="create-thread">
            <form onSubmit={handleSubmit}>
                <div>
                    <label>URL:</label>
                    <input
                        type="url"
                        name="url"
                        value={thread.url}
                        onChange={handleChange}
                        required
                    />
                    </div>
                <div>
                    <label>Title:</label>
                    <input
                        type="text"
                        name="title"
                        value={thread.title}
                        onChange={handleChange}
                        maxLength="255"
                        required
                    />
                    <div className="error">The title can't be larger than 255 characters.</div>
                </div>
                <div>
                    <label>Body:</label>
                    <textarea
                        name="body"
                        value={thread.body}
                        onChange={handleChange}
                        maxLength="35000"
                    />
                    <div className="error">The body can't be larger than 35000 characters.</div>
                </div>
                <div>
                    <label>Select a magazine:</label>
                    <select name="magazine_name" value={thread.magazine_name} onChange={handleChange} required >
                        <option value="">Please select</option>
                        {magazineName.map((name, index) => (
                            <option key={index} value={name}>{name}</option>
                        ))}
                    </select>
                </div>
                <button type="submit">Add new link</button>
            </form>
        </div>
    );
}

export default CreateLink;
