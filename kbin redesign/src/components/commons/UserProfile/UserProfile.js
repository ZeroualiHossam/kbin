import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './UserProfile.css';

function UserProfile() {
  const { username } = useParams();
  const [profile, setProfile] = useState({
    username: "",
    bio: "",
    avatar: "",
    cover: ""
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
      setProfile({
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

  return (
    <div className='contenedor'> 
      <div className="user-profile">
        <div className="profile-cover">
          <img src={profile.cover} alt="Cover" />
        </div>
        <div className="profile-details">
          <img src={profile.avatar} alt="Avatar" className="profile-avatar" />
          <h3>{profile.username}</h3>
          <p>{profile.bio}</p>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
