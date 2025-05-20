import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BaseDashboard from "./dashboards/BaseDashboard";
import './AddUsers.css';

const AddUsers = ({ user }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    role: "consultant",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      alert("Please fill out all fields.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:3001/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add user.");
      }
  
      alert("User added successfully!");
      navigate("/adminDashboard");
    } catch (error) {
      console.error("Error adding user:", error);
      alert(`Error: ${error.message}`);
    }
  };
  
  return (
  <BaseDashboard user={user}>
      <div className="add-users-page">
        <div className="add-users-container">
          <h2 className="add-users-title">Add User</h2>
          <div className="add-users-underline"></div>
          <form onSubmit={handleSubmit} className="add-users-form">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />

            <label>Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="consultant">Consultant</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>

            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />

            <button type="submit" className="add-users-submit">
              Add
            </button>
          </form>
          
        </div>
      </div>
    </BaseDashboard>
  );
};

export default AddUsers;