
import React from 'react';
import Login from '../components/Login';
import Notes from './Notes';

const Home = ({ user, setUser }) => {
  return (
    <div className="container">
      <h1>Welcome to the RBAC Admin Dashboard</h1>
      <h1> log in for RBAC test environment </h1>
      {!user ? <Login setUser={setUser} /> : <Notes user={user} />}
    </div>
  );
};

export default Home;
