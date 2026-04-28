import { useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import "./Register.css";
import { useNavigate } from "react-router-dom";
import loginImg from "../assets/login-illustration.png";


function Register() {
  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [role,setRole] = useState("donor");
  const [contact, setContact] = useState("");
  const [location, setLocation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
  e.preventDefault();
  try {
    const res = await API.post("/auth/register", {
      name, email, password, role, contact, location
    });
    alert("User registered successfully.Please Login.");
    navigate("/login");
  } catch (err) {
    alert("User already exist, please Login.");
  }
};



 return (
  <div className="auth-wrapper">
    <div className="auth-card">

      {/* LEFT SIDE IMAGE */}
      <div className="login-left">
        <img src={loginImg} alt="login" />
      </div>
      <div className="login-right">
      <div className="auth-header">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join our food reduction mission</p>
      </div>

      <form onSubmit={handleRegister} className="register-form">
        <div className="input-group">
          <input
            className="auth-input"
            placeholder="Full Name"
            onChange={(e)=>setName(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <input
            className="auth-input"
            type="email"
            placeholder="Email Address"
            onChange={(e)=>setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-group password-group">
          <input
            className="auth-input"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            onChange={(e)=>setPassword(e.target.value)}
            required
          />
          <button 
            type="button" 
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "👁️" : "🙈"}
          </button>
        </div>

        <div className="role-selector">
          <button 
            type="button" 
            className={`role-tab ${role === 'donor' ? 'active' : ''}`}
            onClick={() => setRole('donor')}
          >
            Donor
          </button>
          <button 
            type="button" 
            className={`role-tab ${role === 'receiver' ? 'active' : ''}`}
            onClick={() => setRole('receiver')}
          >
            NGO / Receiver
          </button>
        </div>

        {role === "receiver" && (
          <div className="extra-fields">
             <div className="input-group">
              <input
                className="auth-input"
                placeholder="Contact Number"
                onChange={(e)=>setContact(e.target.value)}
                required
              />
            </div>
             <div className="input-group">
              <input
                className="auth-input"
                placeholder="Organization Location"
                onChange={(e)=>setLocation(e.target.value)}
                required
              />
            </div>
          </div>
        )}

        <button className="auth-btn">
          <span>Get Started</span>
          <div className="btn-shine"></div>
        </button>

        <p className="auth-switch">
          Already have an account?{" "}
          <Link to="/login" className="login-link">Sign In</Link>
        </p>

      </form>
    </div>
    </div>
  </div>
);


}

export default Register;
