import React, { useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import './editProfile.css';

function EditProfile({ token }) {
    const { username } = useParams();

    const [form, setForm] = useState({
        username: "",
        bio: "",
        avatar: null,
        cover: null
    });

    useEffect(() => {
        fetch(`https://asw-projecte-kbin-social-alphatretze.onrender.com/api/users/${username}/`)
        .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json();
        })
    
        .then(data => {
          setForm({
            username: data.profile.username,
            bio: data.profile.bio,
            avatar: data.profile.avatar,
            cover: data.profile.cover
          });
        })
    
        .catch(error => {
          console.error('There has been a problem with your fetch operation:', error);
        });
      
    }, [username]);

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent the default form submission behavior
    
        const formData = new FormData();
        formData.append('username', form.username);
        formData.append('bio', form.bio);
        if (form.avatar) formData.append('avatar', form.avatar);
        if (form.cover) formData.append('cover', form.cover);

        try {
            const response = await fetch(`https://asw-projecte-kbin-social-alphatretze.onrender.com/api/users/${username}/`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Token ${token}`
                },
                body: formData  
            });
    
            if (!response.ok) {
                console.log(token);
                throw new Error('No es pot');
            }

            const result = await response.json();  
            console.log('Profile updated successfully:', result);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Failed to update profile:', error);
            alert('Failed to update profile');
        }
    };    

    const handleChange = (event) => {
        const { name, value, files, type } = event.target;
        if (type === 'file') {
            setForm(prevForm => ({
                ...prevForm,
                [name]: files[0]
            }));
        } else {
            setForm(prevForm => ({
                ...prevForm,
                [name]: value
            }));
        }
    };

    return (
        <div className="edit-profile">
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username: </label>
                    <input type="text" name="username" value={form.username} onChange={handleChange} />
                </div>
                <div>
                    <label>Bio:</label>
                    <textarea name="bio" value={form.bio} onChange={handleChange} />
                </div>
                <div>
                    <label>Avatar: </label>
                    <input type="file" name="avatar" onChange={handleChange} />
                </div>
                <div>
                    <label>Cover:</label>
                    <input type="file" name="cover" onChange={handleChange} />
                </div>
                <button type="submit">Save</button>
            </form>
        </div>
    );
}

export default EditProfile;
