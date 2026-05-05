import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { getFoodImage } from "../utils/foodImages";
import { getEnglishLocation } from "../utils/locationHelper";
import MapPicker from "../components/MapPicker";

import "../components/MapPicker.css";

function DonorDashboard() {
  const [foodName,setFoodName] = useState("");
  const [quantity,setQuantity] = useState("");
  const [location,setLocation] = useState("");
  const [photo, setPhoto] = useState("");
  const [myFoods,setMyFoods] = useState([]);
  const navigate = useNavigate();
  const donorId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const [showDialog, setShowDialog] = useState(false);
  const [contact, setContact] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [expiryDate, setExpiryDate] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [coords, setCoords] = useState({ lat: null, lng: null });

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await API.delete(`/food/delete/${id}`, {
        headers: { Authorization: token }
      });

      setMyFoods(myFoods.filter(item => item.id !== id));
      setOpenMenuId(null); // close menu after delete
    } catch {
      alert("Failed to delete");
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role === "admin") {
      navigate("/admin");
    } else if (role !== "donor") {
      navigate("/receiver");
    }
  }, []);

  useEffect(() => {
    if (!token) navigate("/login");
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenMenuId(null);
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Load donor foods
  useEffect(() => {
    API.get("/food/donor", {
      headers: { Authorization: token }
    })
    .then(res => setMyFoods(res.data))
    .catch(() => alert("Login required"));
  }, []);

  // Counts
  const allCount = myFoods.length;
  const availableCount = myFoods.filter(item => item.status === "available").length;
  const acceptedCount = myFoods.filter(item => item.status === "accepted").length;

  const handlePost = async (e) => {
    e.preventDefault();
    try {
     await API.post("/food/add",
  { 
    donor_id: donorId, 
    food_name: foodName, 
    quantity, 
    location, 
    contact,
    expiry_date: expiryDate,
    latitude: coords.lat,
    longitude: coords.lng,
    photo: photo
  },
        { headers: { Authorization: token } }
      );

      setShowDialog(true);
      setShowForm(false);

      const res = await API.get("/food/donor", {
        headers: { Authorization: token }
      });

      setMyFoods(res.data);

      setFoodName("");
      setQuantity("");
      setLocation("");
      setContact("");
      setExpiryDate("");
      setPhoto("");
      setCoords({ lat: null, lng: null });

    } catch (error) {
      console.error("Post error:", error);
      if (error.response && error.response.data && error.response.data.error) {
        alert(`Failed to post: ${error.response.data.error}`);
      } else {
        alert("Failed to post food. Please check your connection and try again.");
      }
    }
  };

  const filteredFoods = myFoods
    .filter(item => {
      if (activeTab === "available") return item.status === "available";
      if (activeTab === "accepted") return item.status === "accepted";
      return true;
    })
    .filter(item =>
      item.food_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="container mt-5">

      <div className="donor-header">
        <div> </div>
        <button
          className="post-btn"
          onClick={() => setShowForm(true)}
        >
          + Post Food Donation
        </button>
      </div>

      {/* Search */}
      <div className="search-container">
        <span className="search-icon">🔍︎</span>
        <input
          type="search"
          placeholder="Search your posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Tabs */}
      <div className="tabs-wrapper">
        <div
          className="tab-slider"
          style={{
            transform:
              activeTab === "all"
                ? "translateX(0%)"
                : activeTab === "available"
                ? "translateX(100%)"
                : "translateX(200%)"
          }}
        />
        <button className={`tab-pill ${activeTab === "all" ? "active-pill" : ""}`} onClick={() => setActiveTab("all")}>
          All ({allCount})
        </button>
        <button className={`tab-pill ${activeTab === "available" ? "active-pill" : ""}`} onClick={() => setActiveTab("available")}>
          Available ({availableCount})
        </button>
        <button className={`tab-pill ${activeTab === "accepted" ? "active-pill" : ""}`} onClick={() => setActiveTab("accepted")}>
          Accepted ({acceptedCount})
        </button>
      </div>

      {/* Cards */}
      <div className="food-grid mt-4">
        {filteredFoods.length === 0 && (
          <p className="no-results">No results found.</p>
        )}

        {filteredFoods.map(item => (
          <div className="food-card" key={item.id}>

         

            <img
              src={item.photo || getFoodImage(item.food_name)}
              alt={item.food_name}
              className="food-img"
              style={{ objectFit: 'cover' }}
            />

            <div className="food-body">
               {/* Dropdown */}
            {item.status === "available" && (
              <button className="dropdown-item"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item.id);
                      }}> 🗑 </button>
                  
            )}

                <div onClick={() => navigate(`/food/details/${item.id}`)} style={{ cursor: 'pointer' }}>
                  <h5>{item.food_name}</h5>
                    
                  <span className={
                    item.status === "accepted" ? "badge-accepted" :
                    item.status === "rejected" ? "badge-rejected" :
                    "badge-pending"
                  }>
                    {item.status === "available" ? "Available" :
                     item.status === "accepted" ? "Accepted" :
                     item.status === "rejected" ? "Rejected" :
                     item.status}
                  </span>

                  <p><b>▣ Quantity:</b> {item.quantity}</p>
                  <p><b>📍Location:</b> {getEnglishLocation(item.location)}</p>
                  <button className="view-details-btn">View Details</button>

                </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h4>Post Food Donation</h4>
            <form onSubmit={handlePost}>
              <input placeholder="Food Name" value={foodName} onChange={(e)=>setFoodName(e.target.value)} required />
              <input placeholder="Quantity" value={quantity} onChange={(e)=>setQuantity(e.target.value)} required />
              <input placeholder="Location" value={location} onChange={(e)=>setLocation(e.target.value)} required />
              
             
              <button 
                type="button" 
                className="btn btn-outline-primary mb-3 w-100" 
                onClick={() => setShowMap(!showMap)}
                style={{ borderRadius: '8px', padding: '10px' }}
              >
                {showMap ? "Hide Map" : "📍 Select on Map"}
              </button>

               


              {showMap && (
                <MapPicker 
                  initialAddress={location}
                  onLocationSelect={(address, position) => {
                    setLocation(address);
                    if (position) {
                      setCoords({ lat: position[0], lng: position[1] });
                    }
                    setShowMap(false);
                  }} 
                />
              )}
              <div className="form-group mb-3">
                <label className="form-label text-white-50 small">Upload Food Photo</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handlePhotoChange}
                  className="form-control bg-dark text-white border-secondary"
                  style={{ borderRadius: '8px' }}
                />
              </div>
              <input placeholder="Contact" value={contact} onChange={(e)=>setContact(e.target.value)} required />
              <label htmlFor="expiry">Expiry Date:
              <input placeholder="Best Before"
              id="expiry"
  type="date"
  value={expiryDate}
  onChange={(e)=>setExpiryDate(e.target.value)}
  required
/></label>
              <div className="modal-actions">
                <button className="cancel" type="button" onClick={()=>setShowForm(false)}>
                  Cancel
                </button>
                <button className="post" type="submit">
                  Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDialog && (
        <div className="dialog-overlay">
          <div className="dialog-box">
            <h4>Donation posted successfully!</h4>
            <p>Our NGO/Receiver will contact you soon.</p>
            <button className="btn btn-success mt-3" onClick={() => setShowDialog(false)}>
              OK
            </button>
          </div>
        </div>
      )}
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

export default DonorDashboard;