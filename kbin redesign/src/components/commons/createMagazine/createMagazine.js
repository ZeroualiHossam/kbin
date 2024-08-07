import React, { useState } from 'react';

import '../createThread/createThread.css'

function CreateMagazine({token}) {
    const [magazine, setMagazine] = useState({
        name: '',
        title: '',
        description: '',
        rules: ''
    });


    const handleChange = (event) => {
        const { name, value } = event.target;
        setMagazine(prevMagazine => ({
            ...prevMagazine,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();


        try {
            const response = await fetch(`https://asw-projecte-kbin-social-alphatretze.onrender.com/api/magazines/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(magazine)
            });

            if (response.status === 201) {
                console.log('Magazine created successfully');
                alert('Magazine created successfully!');

            } else if (response.status === 400) {
                console.log('Bad request, please check the data');
                alert('Bad request, please check the data');
                
            } else {
                throw new Error(`HTTP error! status: ${response.status}`); 
            }
        } catch (error) {
            console.error('Failed to create magazine:', error);
            alert('Failed to create magazine');
        }
    };

    return (
        <div className="create-thread">
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={magazine.name}
                        onChange={handleChange}
                        maxLength="25"
                        placeholder="The name can't be larger than 25 characters."
                        required
                    />
                </div>
                <div>
                    <label>Title:</label>
                    <input
                        type="text"
                        name="title"
                        value={magazine.title}
                        onChange={handleChange}
                        maxLength="50"
                        placeholder="The title can't be larger than 50 characters."
                        required
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea
                        name="description"
                        value={magazine.description}
                        onChange={handleChange}
                        maxLength="10000"
                        placeholder="The description can't be larger than 10000 characters"
                    />
                </div>
                <div>
                    <label>Rules:</label>
                    <textarea
                        name="rules"
                        value={magazine.rules}
                        onChange={handleChange}
                        maxLength="10000"
                        placeholder="The rules can't be larger than 10000 characters"
                    />
                </div>
                <button type="submit">Create new magazine</button>
            </form>
        </div>
    );
}

export default CreateMagazine;
