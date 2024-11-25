
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: '', status: 'true', password: '' });
  const [editUser, setEditUser] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3001/users')
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the users!", error);
      });
  }, []);

  const handleAddUser = (newUser) => {
    axios.post('http://localhost:3001/users', newUser)
      .then((response) => {
        setUsers([...users, response.data]);
      })
      .catch((error) => {
        console.error("There was an error adding the user!", error);
      });
  };

  const handleEditUser = (id, updatedUser) => {
    axios.put(`http://localhost:3001/users/${id}`, updatedUser)
      .then((response) => {
        setUsers(users.map(user => user.id === id ? response.data : user));
        setEditUser(null);
      })
      .catch((error) => {
        console.error("There was an error editing the user!", error);
      });
  };

  const handleDeleteUser = (id) => {
    axios.delete(`http://localhost:3001/users/${id}`)
      .then(() => {
        setUsers(users.filter(user => user.id !== id));
      })
      .catch((error) => {
        console.error("There was an error deleting the user!", error);
      });
  };

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    if (editUser) {
      setEditUser({ ...editUser, [name]: value });
    } else {
      setNewUser({ ...newUser, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editUser) {
      handleEditUser(editUser.id, editUser);
    } else {
      handleAddUser(newUser);
      setNewUser({ name: '', email: '', role: '', status: 'true', password: '' });
    }
  };

  const handleEditClick = (user) => {
    setEditUser(user);
  };

  return (
    <div className="container">
      <h2>User Management</h2>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={editUser ? editUser.name : newUser.name}
          onChange={handleUserChange}
          placeholder="Name"
        />
        <input
          type="email"
          name="email"
          value={editUser ? editUser.email : newUser.email}
          onChange={handleUserChange}
          placeholder="Email"
        />
        <input
          type="text"
          name="role"
          value={editUser ? editUser.role : newUser.role}
          onChange={handleUserChange}
          placeholder="Role"
        />
        <input
          type="password"
          name="password"
          value={editUser ? editUser.password : newUser.password}
          onChange={handleUserChange}
          placeholder="Password"
        />
        <label>
          Status:
          <select
            name="status"
            value={editUser ? editUser.status : newUser.status}
            onChange={handleUserChange}
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </label>
        <button type="submit">{editUser ? 'Edit User' : 'Add User'}</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Password</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.status ? 'Active' : 'Inactive'}</td>
              <td>{user.password}</td>
              <td>
                <button onClick={() => handleEditClick(user)}>Edit</button>
                <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
