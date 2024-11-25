
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PermissionManagement = () => {
  const [permissions, setPermissions] = useState([]);
  const [newPermission, setNewPermission] = useState({ name: '' });
  const [editPermission, setEditPermission] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3001/permissions')
      .then((response) => {
        setPermissions(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the permissions!", error);
      });
  }, []);

  const handleAddPermission = (newPermission) => {
    axios.post('http://localhost:3001/permissions', newPermission)
      .then((response) => {
        setPermissions([...permissions, response.data]);
      })
      .catch((error) => {
        console.error("There was an error adding the permission!", error);
      });
  };

  const handleEditPermission = (id, updatedPermission) => {
    axios.put(`http://localhost:3001/permissions/${id}`, updatedPermission)
      .then((response) => {
        setPermissions(permissions.map(permission => permission.id === id ? response.data : permission));
        setEditPermission(null);
      })
      .catch((error) => {
        console.error("There was an error editing the permission!", error);
      });
  };

  const handleDeletePermission = (id) => {
    axios.delete(`http://localhost:3001/permissions/${id}`)
      .then(() => {
        setPermissions(permissions.filter(permission => permission.id !== id));
      })
      .catch((error) => {
        console.error("There was an error deleting the permission!", error);
      });
  };

  const handlePermissionChange = (e) => {
    const { name, value } = e.target;
    if (editPermission) {
      setEditPermission({ ...editPermission, [name]: value });
    } else {
      setNewPermission({ ...newPermission, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editPermission) {
      handleEditPermission(editPermission.id, editPermission);
    } else {
      handleAddPermission(newPermission);
      setNewPermission({ name: '' });
    }
  };

  const handleEditClick = (permission) => {
    setEditPermission(permission);
  };

  return (
    <div className="container">
      <h2>Permission Management</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={editPermission ? editPermission.name : newPermission.name}
          onChange={handlePermissionChange}
          placeholder="Permission Name"
        />
        <button type="submit">{editPermission ? 'Edit Permission' : 'Add Permission'}</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Permission Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {permissions.map((permission) => (
            <tr key={permission.id}>
              <td>{permission.name}</td>
              <td>
                <button onClick={() => handleEditClick(permission)}>Edit</button>
                <button onClick={() => handleDeletePermission(permission.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PermissionManagement;
