import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Login.css';
import email_icon from "./assets/email.png";
import password_icon from "./assets/password.png";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === "manager@example.com" && password === "password123") {
      localStorage.setItem("user_id", 2); //added by nabeel
      navigate("/managerDashboard");}

    else if (email === "admin@example.com" && password === "password123") {
      localStorage.setItem("user_id", 3); //added by nabeel
      navigate("/adminDashboard"); }

    else if (email === "consultant@example.com" && password === "password123") {
      localStorage.setItem("user_id", 1); //added by nabeel
      navigate("/consultantDashboard");

    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <>
      <div className="container">
        <form onSubmit={handleLogin}>
          <div className="header">
            <div className="text">Login</div>
            <div className="underline"></div>
          </div>

          <div className="inputs">
            <div className="input">
              <img src={email_icon} alt="Email Icon" />  
              <input 
                type="email" 
                placeholder="Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>

            <div className="input">
              <img src={password_icon} alt="Password Icon" />  
              <input 
                type="password" 
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
          </div>

          {/* Forgot Password */}
          <div className="forgot">
            Forgot Password? <span>Click Here</span>
          </div>

          <div className="submit-container">
            <button type="submit" className="submit">Login</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
