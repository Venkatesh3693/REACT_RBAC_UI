
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ setUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    axios.get('http://localhost:3001/users', { params: { email: username, password: password } })
      .then((response) => {
        const user = response.data.find(user => user.email === username && user.password === password);
        if (user) {
          setUser(user);
          navigate('/');
        } else {
          alert('Invalid username or password');
        }
      })
      .catch((error) => {
        console.error("There was an error logging in!", error);
      });
  };

  return (
    <div>
      <h2>Login</h2>
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
