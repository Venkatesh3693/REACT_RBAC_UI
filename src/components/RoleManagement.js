
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [newRole, setNewRole] = useState({ name: '', permissions: '' });
  const [editRole, setEditRole] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3001/roles')
      .then((response) => {
        setRoles(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the roles!", error);
      });
  }, []);

  const handleAddRole = (newRole) => {
    axios.post('http://localhost:3001/roles', newRole)
      .then((response) => {
        setRoles([...roles, response.data]);
      })
      .catch((error) => {
        console.error("There was an error adding the role!", error);
      });
  };

  const handleEditRole = (id, updatedRole) => {
    axios.put(`http://localhost:3001/roles/${id}`, updatedRole)
      .then((response) => {
        setRoles(roles.map(role => role.id === id ? response.data : role));
        setEditRole(null);
      })
      .catch((error) => {
        console.error("There was an error editing the role!", error);
      });
  };

  const handleDeleteRole = (id) => {
    axios.delete(`http://localhost:3001/roles/${id}`)
      .then(() => {
        setRoles(roles.filter(role => role.id !== id));
      })
      .catch((error) => {
        console.error("There was an error deleting the role!", error);
      });
  };

  const handleRoleChange = (e) => {
    const { name, value } = e.target;
    if (editRole) {
      setEditRole({ ...editRole, [name]: value });
    } else {
      setNewRole({ ...newRole, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editRole) {
      handleEditRole(editRole.id, editRole);
    } else {
      handleAddRole(newRole);
      setNewRole({ name: '', permissions: '' });
    }
  };

  const handleEditClick = (role) => {
    setEditRole(role);
  };

  return (
    <div className="container">
      <h2>Role Management</h2>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={editRole ? editRole.name : newRole.name}
          onChange={handleRoleChange}
          placeholder="Role Name"
        />
        <input
          type="text"
          name="permissions"
          value={editRole ? editRole.permissions : newRole.permissions}
          onChange={handleRoleChange}
          placeholder="Permissions (comma-separated)"
        />
        <button type="submit">{editRole ? 'Edit Role' : 'Add Role'}</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Role Name</th>
            <th>Permissions</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.id}>
              <td>{role.name}</td>
              <td>{role.permissions.join(', ')}</td>
              <td>
                <button onClick={() => handleEditClick(role)}>Edit</button>
                <button onClick={() => handleDeleteRole(role.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoleManagement;
