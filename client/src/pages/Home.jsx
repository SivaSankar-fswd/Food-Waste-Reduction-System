import { useNavigate} from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../services/api";
import "./Home.css";
import heroImg from "../assets/hero.png";

function Home() {
const navigate = useNavigate();
const [form, setForm] = useState({
  name: "",
  email: "",
  message: ""
});

const [success, setSuccess] = useState("");

useEffect(() => {
  const role = localStorage.getItem("role");
  if (role === "admin") {
    navigate("/admin");
  }
}, [navigate]);

  const handleDonate = () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      navigate("/login");
    } else if (role === "donor") {
      navigate("/donor");
    } else {
      navigate("/receiver");
    }
  };

  const handleRequest = () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      navigate("/login");
    } else if (role === "receiver") {
      navigate("/receiver");
    } else {
      navigate("/donor");
    }
  };

const handleChange = (e) => {
  setForm({
    ...form,
    [e.target.name]: e.target.value
  });
};

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.name || !form.email || !form.message) {
   
    return;
  }

  try {
    await API.post("/contact", form);
    setSuccess("Message sent successfully to admin!");
    setForm({ name: "", email: "", message: "" });
    setTimeout(() => setSuccess(""), 3000);
  } catch {
    alert("Failed to send message");
  }
};


  return (
    <div>

      {/* Hero Section */}
      <div className="hero-section" id="Home" style={{backgroundImage:`url(${heroImg})`}}>
        <div className="hero-overlay">
          <h1>Food Waste<br/>Reduction System</h1>

          <div className="hero-buttons">
            <button className="btn-green" onClick={handleDonate}>
              Donate Food
            </button>

            <button className="btn-green-outline" onClick={handleRequest}>
              Request Food
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section" id="Features">
        <h1>Features</h1><br/><br/>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🤲</div>
            <h4>Food Sharing</h4>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h4>Waste Monitoring</h4>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📄</div>
            <h4>Reporting</h4>
          </div>

          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h4>Community Support</h4>
          </div>
        </div>
      </div>
    <br/>

<div id="About">
    <h1>🌱 About Us</h1><br/>
    <h2>Food Waste Reduction System</h2><br/>
    <p> Food waste is one of the major challenges faced by modern society. Every day, large quantities of edible food are discarded while many people struggle to access even a single meal. Our platform is designed to bridge this gap by connecting those who have surplus food with those who need it.</p>

<p>The Food Waste Reduction System is a web-based application that enables food donors such as restaurants, event organizers, and individuals to share excess food with NGOs and receivers in a simple and organized manner. The system ensures that surplus food reaches the right people at the right time instead of being wasted.</p><br/>


</div>


<div className="vis-card">
<div className="Vision">
   <h3>🌍 Our Vision</h3><br/>
   <p>Our vision is to build a society where no edible food is wasted and no person suffers from hunger due to lack of access to resources. We aim to create a community-driven ecosystem where technology enables responsible sharing of surplus food in a simple and reliable way.

We aspire to encourage people, organizations, and institutions to treat food as a valuable resource rather than disposable waste. By connecting donors and receivers through a digital platform, we envision a future where food redistribution becomes a daily practice and social responsibility becomes a natural habit.</p><br/>
</div>


<div className="Mision">
  <h3>🎯 Our Mission</h3><br/>
  <p>Our mission is to develop an accessible and user-friendly system that allows individuals and organizations to share surplus food efficiently with those in need. We aim to simplify communication between donors and receivers so that food can be collected quickly and safely.</p>
</div>

</div>

           <div className="stats-container">
                <div className="stat-box">
                    <span className="stat-number">500K+</span>
                    <span className="stat-label">Meals Redistributed</span>
                </div>
                <div className="stat-box">
                    <span className="stat-number">10K+</span>
                    <span className="stat-label">Active Donors</span>
                </div>
                <div className="stat-box">
                    <span className="stat-number">200+</span>
                    <span className="stat-label">Partner Organizations</span>
                </div>
            </div>

<div className="contact-card" id="Contact">
<div className="contact">
  <h2>📞 Contact Us</h2><br/>
   <p>We welcome your suggestions, feedback, and support.<br/>
If you would like to collaborate, donate food, or need assistance using the platform, please feel free to reach out to us.</p>
 <h3>📍 Address</h3><br/>
 <p>Food Waste Reduction System<br/>
 Nazareth, Thoothukudi District,<br/>
 Tamil Nadu, India.</p>

<h3>📧 Email</h3>
<p className="email" style={{color: "white"}} onClick={() => window.location.href = "mailto:evrgrnsiva@gmail.com"}>evrgrnsiva@gmail.com</p>

<h3>📱 Phone</h3>
<p className="email" style={{color: "white"}} ><a style={{color: "white"}} href="tel:7010286162">+91 7010286162</a></p>

</div>


{/* CONTACT SECTION */}
<div className="home-contact-section">
  <h2>Contact Us</h2>
  <p>Have questions or want to donate food? Send us a message.</p>

  {success && <div className="home-success-msg">{success}</div>}

  <form className="home-contact-form" onSubmit={handleSubmit}>

    <input
      type="text"
      name="name"
      placeholder="Your Name"
      value={form.name}
      onChange={handleChange}
      required
    />

    <input
      type="email"
      name="email"
      placeholder="Your Email"
      value={form.email}
      onChange={handleChange}
      required
    />

    <textarea
      name="message"
      placeholder="Your Message"
      rows="5"
      value={form.message}
      onChange={handleChange}
      required
    />

    <button type="submit">Send Message</button>

  </form>
</div>

</div>

<div className="footer">
<footer>
        <div className="footer-content">
            <div className="footer-links">
                <a href="#Home">Home</a>
                <a href="#Features">Features</a>
                <a href="#About">About</a>
                <a href="#Contact">Contact</a>
            </div>
            <div className="social-links">
                <a href="#" ><i className="fab fa-facebook-f"></i></a>
                <a href="#"><i className="fab fa-twitter"></i></a>
                <a href="https://www.instagram.com/donat.efood?igsh=ejBreWdnM3I2ejM2" target="_blank"><i className="fab fa-instagram"></i></a>
                <a href="#"><i className="fab fa-linkedin-in"></i></a>
            </div>
            <p>&copy; 2026 Food Waste Reduction System. All rights reserved.</p>
        </div>
    </footer>
</div>

    </div>
  );
}

export default Home;
