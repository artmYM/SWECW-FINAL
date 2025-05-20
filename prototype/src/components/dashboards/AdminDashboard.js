import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BaseDashboard from "./BaseDashboard";
import './AdminDashboard.css';

const AdminDashboard = ({ user }) => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "consultant",
    password: ""
  });

  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch existing users from API
    const fetchUsers = async () => {
      const response = await fetch("http://localhost:3001/api/users");
      const data = await response.json();
      setUsers(data.map(user => ({
        id: user.user_id,
        name: user.username,
        email: user.email, // Email doesn't exist yet in DB
        role: user.role
      })));
    };
    fetchUsers().catch(err => console.error("Error fetching users:", err));
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      alert("Please fill out all fields.");
      return;
    }
    setUsers([...users, formData]);
    setFormData({ name: "", email: "", role: "consultant", password: "" });
    alert("User added (not saved - demo only)");
  };

  return (
    <BaseDashboard user={user}>
      <div className="admin-dashboard">
        <div className="admin-section">
          <div className="admin-header">
            <h2 className="section-title">Current Users</h2>
            <p>From here you can manage users on the system.<br></br><br></br>If a user cannot be removed they may still have unresolved timesheets on their account.</p><br></br>
      
          </div>

          <table className="admin-table">
            <thead>
              <tr>
                <th></th>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, index) => (
                <tr key={u.index}>
                  <td>{index + 1}</td>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>
                  <button
                  onClick={async () => {
                    const userId = users[index].id; // Get the user ID
                    try {
                      const response = await fetch(`http://localhost:3001/api/users/${userId}`, {
                        method: "DELETE"
                      });

                      if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || "Failed to delete user.");
                      }

                      // Remove the user from the frontend state
                      const updatedUsers = users.filter((_, i) => i !== index);
                      setUsers(updatedUsers);

                      alert("User removed successfully.");
                    } catch (error) {
                      console.error("Error removing user:", error);
                      alert(`Error: ${error.message}`);
                    }
                  }}
                  style={{
                    background: "rgb(202, 54, 54)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    padding: "8px 10px",
                    cursor: "pointer",
                  }}
                >
                  Remove
                </button>
                </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button className="add-user-btn" onClick={() => navigate("/addUsers")}>
            + User
          </button>
        </div>
      </div>
    </BaseDashboard>
  );
};

export default AdminDashboard;