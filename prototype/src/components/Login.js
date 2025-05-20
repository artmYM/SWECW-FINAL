import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Login.css';
import email_icon from "../assets/email.png";
import password_icon from "../assets/password.png";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const role = localStorage.getItem("userRole");

    if (storedUsername && role) {
      if (role === "manager") navigate("/managerDashboard");
      else if (role === "admin") navigate("/adminDashboard");
      else if (role === "consultant") navigate("/consultantDashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
  
      if (!response.ok) {
        setError("Invalid username or password");
        return;
      }
      
  
      const data = await response.json();

      // Store user info in localStorage
      localStorage.setItem("username", username);
      localStorage.setItem("userRole", data.role);
      


      if (data.role === "manager") {
        navigate("/managerDashboard");
      } else if (data.role === "admin") {
        navigate("/adminDashboard");
      } else if (data.role === "consultant") {
        navigate("/consultantDashboard");
      } else {
        alert("Unknown role");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setError("Server error. Please try again.");
    }
    
  };

  return (
    <>
      <div className="login-page">
        <div className="container">
          <form onSubmit={handleLogin}>
            <div className="header">
              <div className="text">Login</div>
              <div className="login-underline"></div>
            </div>

            <div className="inputs">
              <div className="input">
                <img src={email_icon} alt="Email Icon" />  
                <input 
                  type="text" 
                  placeholder="Username" 
                  value={username}
                  onChange={(e) => {setUsername(e.target.value); setError("");}}
                  required 
                />
              </div>

              <div className="input">
                <img src={password_icon} alt="Password Icon" />  
                <input 
                  type="password" 
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {setPassword(e.target.value); setError("");}}
                  required 
                />
              </div>
            </div>

            
            {error && <div className="error-message">{error}</div>}

            <div className="submit-container">
              <button type="submit" className="submit">Login</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
