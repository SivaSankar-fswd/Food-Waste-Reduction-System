import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./Login.css";
import loginImg from "../assets/login-illustration.png";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const res = await API.post("/auth/login", { email, password });

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("role", res.data.role);
    localStorage.setItem("userId", res.data.id);

    window.dispatchEvent(new Event("storage"));

    // Role based redirect
    if (res.data.role === "admin") {
      navigate("/");
    } 
    else if (res.data.role === "donor") {
      navigate("/");
    } 
   else {
     navigate("/");
   }


  } catch (err) {
    alert("Not have an account. please Register.");
  }
};



  return (
    
    <div className="login-page">
    <div className="login-card">

      {/* LEFT SIDE IMAGE */}
      <div className="login-left">
        <img src={loginImg} alt="login" />
      </div>

      {/* RIGHT SIDE FORM */}
      <div className="login-right">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p className="subtitle">Sign in to continue your mission</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group password-group">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

          <button type="submit" className="login-btn">
            <span>Sign In</span>
            <div className="btn-shine"></div>
          </button>
        </form>

        <p className="switch-text">
          Don't have an account?
          <span onClick={() => navigate("/register")}> Sign up</span>
        </p>
      </div>

    </div>
  </div>

  );
}

export default Login;
