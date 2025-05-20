import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BaseDashboard from "./BaseDashboard";

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
    <BaseDashboard title="Add Users" user={user}>
      <div
        style={{
          maxWidth: "500px",
          margin: "0 auto",
          padding: "20px",
          background: "rgb(38, 39, 46)",
          borderRadius: "15px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
        }}
      >
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              style={{
                width: "95%",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc"
              }}
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc"
              }}
            >
              <option value="consultant">Consultant</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={{
                width: "95%",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc"
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              background: "rgb(64, 65, 68)",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px"
            }}
          >
            Add
          </button>
        </form>
      </div>
      <button
        onClick={() => navigate("/adminDashboard")}
        style={{
          marginTop: "20px",
          padding: "10px 15px",
          background: "#C4FF00",
          fontSize: "16px",
          color: "rgb(53, 53, 53)",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          display: "block",
          margin: "20px auto"
        }}
      >
        Back to Dashboard
      </button>
    </BaseDashboard>
  );
};

export default AddUsers;