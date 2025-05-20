import fdm_logo from "../assets/fdm.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { Button } from "./Button.js";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const path = location.pathname;

  // Check if user is logged in
  const isLoggedIn = localStorage.getItem("userRole") !== null;
  const role = localStorage.getItem("userRole");

  const handleLogout = () => {
    // Clear session/localStorage
    localStorage.clear();
    navigate("/Login");
  };

  //When logo is clicked, and user is logged in, navigate to the appropriate dashboard based on user role
  const handleLogoClick = () => {
    if (path === "/" && isLoggedIn) {
      if (role === "consultant") navigate("/consultantDashboard");
      else if (role === "manager") navigate("/managerDashboard");
      else if (role === "admin") navigate("/adminDashboard");
      else if (role === "finance") navigate("/accountantDashboard");
      else navigate("/login");
    } else {
      navigate("/");
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo" onClick={handleLogoClick} style={{ cursor: "pointer" }}>
          <img src={fdm_logo} alt="FDM logo" />
        </div>

        {isLoggedIn ? (
          <Button buttonStyle="btn--outline" onClick={handleLogout}>
            LOGOUT
          </Button>
        ) : (
          <Link to="/login">
            <Button buttonStyle="btn--outline">LOGIN</Button>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
