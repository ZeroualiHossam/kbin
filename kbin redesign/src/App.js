import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home/Home';
import Searchthread from './pages/Searchthread';
import EditThread from './pages/Editthread';
import ViewThread from './pages/Viewthread';
import EditProfile from './components/commons/editProfile/editProfile';
import CreateThread from './components/commons/createThread/createThread';
import CreateLink from './components/commons/createLink/createLink';
import Header from './components/commons/Header/header';
import UserThreads from './pages/UserThreads';
import UserBoosts from './pages/UserBoosts';
import UserComments from './pages/UserComments';
import Magazines from './pages/Magazines';
import ViewMagazine from './pages/ViewMagazine';
import CreateMagazine from './components/commons/createMagazine/createMagazine';



function App() {
  const [editingThreadId, setEditingThreadId] = useState(null);
  const [user, setUser] = useState(localStorage.getItem('user'));
  const [token, setToken] = useState(localStorage.getItem('token'));

  console.log(user, token);

  const handleThreadEdit = (id) => {
    setEditingThreadId(id);
  };

  const initializeUserAndToken = (initialUser, initialToken) => {
    if (!user && initialUser) {
      setUser(initialUser);
      localStorage.setItem('user', initialUser);
    }
    if (!token && initialToken) {
      setToken(initialToken);
      localStorage.setItem('token', initialToken);
    }
  };

  return (
    <Router className='container'>
      <Header setUser={setUser} setToken={setToken} initializeUserAndToken={initializeUserAndToken} />
      <Routes>
        <Route path="/" element={<Home onThreadEdit={handleThreadEdit} user={user} token={token} />} />
        <Route path="/search-thread" element={<Searchthread user={user} token={token} />} />
        <Route path="/edit-thread/:id" element={<EditThread editingThreadId={editingThreadId} onThreadEdit={handleThreadEdit}  user={user} token={token} />} />
        <Route path="/view-thread/:id" element={<ViewThread user={user} token={token} />} />
        <Route path="/profile/:username/threads" element={<UserThreads onThreadEdit={handleThreadEdit} user={user} token={token} />} />
        <Route path="/profile/:username/boosts" element={<UserBoosts onThreadEdit={handleThreadEdit} user={user} token={token} />} />
        <Route path="/profile/:username/comments" element={<UserComments user={user} token={token}/>} />
        <Route path="/profile/:username/edit" element={<EditProfile token={token}/>} />
        <Route path="/createthread" element={<CreateThread token={token} />} />
        <Route path="/createlink" element={<CreateLink token={token} />} />
        <Route path="/magazines" element={<Magazines token={token} />} />
        <Route path="/m/:magazine_name" element={<ViewMagazine onThreadEdit={handleThreadEdit} user={user} token={token} />} />
        <Route path="/createmagazine" element={<CreateMagazine token={token} />} />
      </Routes>
    </Router>
  );
}

export default App;
