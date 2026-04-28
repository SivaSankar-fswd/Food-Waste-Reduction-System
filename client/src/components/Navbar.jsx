import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef} from "react";
import "./Navbar.css";
import logo from "../assets/logo.png";
import logout from "../assets/logout.png";
import API from "../services/api";


function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [role, setRole] = useState("");
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [userPhoto, setUserPhoto] = useState("");
  const DashRef = useRef(null);

useEffect(() => {
  const handleClickOutside = (e) => {
   if (
      showMenu &&
      DashRef.current &&
      !DashRef.current.contains(e.target)
    ){
      setShowMenu(false);
    }
     };

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [showMenu]);


  useEffect(() => {
  const checkLogin = () => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");
    setIsLoggedIn(!!token);
    setRole(userRole);

    // Fetch user profile data if logged in
    if (token) {
      API.get("/user/profile", {
        headers: { Authorization: token }
      })
        .then((res) => {
          setUserPhoto(res.data.photo || "");
        })
        .catch((err) => {
          console.error("Failed to fetch profile:", err);
        });
    } else {
      setUserPhoto("");
    }
  };

  checkLogin();
  window.addEventListener("storage", checkLogin);

  // Listen for profile updates
  const handleProfileUpdate = () => {
    const token = localStorage.getItem("token");
    if (token) {
      API.get("/user/profile", {
        headers: { Authorization: token }
      })
        .then((res) => {
          setUserPhoto(res.data.photo || "");
        })
        .catch((err) => {
          console.error("Failed to fetch updated profile:", err);
        });
    }
  };

  window.addEventListener("profileUpdated", handleProfileUpdate);

  return () => {
    window.removeEventListener("storage", checkLogin);
    window.removeEventListener("profileUpdated", handleProfileUpdate);
  };
}, []);


  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setRole("");
    navigate("/");
  };

  return (
    <nav className="main-navbar">
      <div className="nav-container">
        {/* Logo */}
        <div className="nav-logo">
          <img src={logo} alt="Logo" className="logo-img" />
          <span className="logo-text">Food Waste Reduction System</span>
        </div>

        {/* Hamburger Menu Button */}
        <button 
          className="hamburger-menu" 
          onClick={() => setIsNavOpen(!isNavOpen)}
          aria-label="Toggle navigation menu"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>

        {/* Navigation Menu */}
        <ul className={`nav-menu ${isNavOpen ? 'active' : ''}`}>
          <li><Link to="/" onClick={() => setIsNavOpen(false)}>Home</Link></li>
          <li><a href="#About" onClick={() => setIsNavOpen(false)}>About</a></li>
          <li><a href="#Features" onClick={() => setIsNavOpen(false)}>Features</a></li>
          {role === "donor" && (
            <li><Link to="/donor" onClick={() => setIsNavOpen(false)}>Donate/Share Food</Link></li>
          )}
          {role === "receiver" && (
            <li><Link to="/receiver" onClick={() => setIsNavOpen(false)}>Request Food</Link></li>
          )}
          {role === "admin" && (
            <li><Link to="/admin" onClick={() => setIsNavOpen(false)}>Admin Dashboard</Link></li>
          )}
          
          
          <li><a href="#Contact" onClick={() => setIsNavOpen(false)}>Contact</a></li>
        </ul>

        {/* Right Side Auth / Profile */}
        <div className="nav-auth">
          {!isLoggedIn ? (
            <>
              <Link className="nav-btn" to="/login" onClick={() => setIsNavOpen(false)}>Login</Link>
            </>
          ) : (
            <div className="profile-menu" ref={DashRef}>
              <div className="profile-icon" onClick={() => setShowMenu(!showMenu)}>
                {userPhoto ? (
                  <img src={userPhoto} alt="Profile" className="profile-photo" />
                ) : (
                  <span className="profile-emoji">👤</span>
                )}
              </div>

              {showMenu && (
                <div className="profile-dropdown">
                  <Link to="/profile" onClick={() => setShowMenu(false)}>
                    My Profile
                  </Link>
                  <Link to={localStorage.getItem("role") === "donor" ? "/donor" : "/receiver"} onClick={() => setShowMenu(false)}>
                    Dashboard
                  </Link>
                  <button onClick={handleLogout}>Logout<img src={logout} alt="Logout Icon" className="logout-btn"/></button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
