import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { getFoodImage } from "../utils/foodImages";
import { getEnglishLocation } from "../utils/locationHelper";
import FoodMap from "../components/FoodMap";


function ReceiverDashboard() {
  // Later this list will come from backend
  const [foods, setFoods] = useState([]);
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const receiverId = localStorage.getItem("userId");
  const [historyFoods, setHistoryFoods] = useState([]);
  const [activeTab, setActiveTab] = useState("accepted");
  const [notification, setNotification] = useState("");
  const [search, setSearch] = useState("");

  const handleStatus = async (id, status) => {
    try {
      // ✅ ADD ONLY THIS BLOCK
      if (status === "rejected") {
        const updatedFood = foods.find((food) => food.id === id);
        updatedFood.status = status;

        setHistoryFoods([...historyFoods, updatedFood]);
        setFoods(foods.filter((food) => food.id !== id));

        setDialogMessage("Order rejected successfully.");
        setShowDialog(true);
        return;
      }
      // ✅ END ADDITION

      await API.put(`/food/update-status/${id}`, {
        status,
        receiver_id: receiverId,
      });

      if (status === "accepted") {
        setDialogMessage("Your order successfully booked!");
      }
      setShowDialog(true);

      const updatedFood = foods.find((food) => food.id === id);

      updatedFood.status = status;

      setFoods(foods.filter((food) => food.id !== id));

      await fetchHistory();
    } catch {
      alert("Failed to update");
    }
  };

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "receiver") {
      navigate("/donor");
    }
  }, []);

  const fetchHistory = () => {
    API.get(`/food/receiver-history/${receiverId}`)
      .then((res) => setHistoryFoods(res.data))
      .catch(() => console.log("No history yet"));
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    API.get("/food/list")
      .then((res) => {
        if (res.data.length > foods.length) {
          setNotification("🍱 New food donation available!");
          setTimeout(() => setNotification(""), 3000);
        }
        setFoods(res.data);
      })
      .catch(() => {});
  }, []);

  const filteredHistory = historyFoods.filter(
    (item) => item.status === activeTab,
  );

  const filteredFoods = foods.filter(
    (item) =>
      item.food_name.toLowerCase().includes(search.toLowerCase()) ||
      item.location.toLowerCase().includes(search.toLowerCase()),
  );

  const filteredAccepted = filteredHistory.filter(
    (item) =>
      item.food_name.toLowerCase().includes(search.toLowerCase()) ||
      item.location.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="receiver-container">
      {/* Notification */}
      {notification && <div className="notification">{notification}</div>}

      {/* Search */}
      <div className="search-bar">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍︎</span>
          <input
            type="search"
            placeholder="Search available donations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="receiver-tabs">
        <button
          className={activeTab === "available" ? "tab active" : "tab"}
          onClick={() => setActiveTab("available")}
        >
          Available ({foods.length})
        </button>

        <button
          className={activeTab === "accepted" ? "tab active" : "tab"}
          onClick={() => setActiveTab("accepted")}
        >
          My Accepted ({filteredHistory.length})
        </button>

        <button
          className={activeTab === "map" ? "tab active" : "tab"}
          onClick={() => setActiveTab("map")}
        >
          📍 Map View
        </button>
      </div>

      {/* AVAILABLE CARDS */}
      {activeTab === "available" && (
        <div className="food-grid">
          {filteredFoods.length === 0 ? (
            <div className="no-results">No donations found.</div>
          ) : (
            filteredFoods.map((item) => (
              <div className="food-card" key={item.id}>
                <img
                  src={getFoodImage(item.food_name)}
                  alt={item.food_name}
                  className="food-img"
                />

                <div className="food-body" onClick={() => navigate(`/food/details/${item.id}`)} style={{ cursor: 'pointer' }}>
                  <h5>
                    {item.food_name}
                    <span className="status-badge available"> available </span>
                  </h5>

                  <p>
                    <b>▣ Quantity:</b> {item.quantity}
                  </p>
                  <p>
                    <b>📍Location:</b> {getEnglishLocation(item.location)}
                  </p>
                  <button className="view-details-btn">View Details</button>

                </div>

                <div className="food-body pt-0">
                  <div className="card-actions">
                    {/* <button
                  className="reject-btn"
                  onClick={() => handleStatus(item.id, "rejected")}
                >
                  Reject
                </button> */}
                    <p>
                      <a href="tel:{item.contact}">✆ Call</a>
                    </p>

                    <button
                      className="accept-btn"
                      onClick={() => handleStatus(item.id, "accepted")}
                    >
                      Accept
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ACCEPTED CARDS */}
      {activeTab === "accepted" && (
        <div className="food-grid">
          {filteredAccepted.length === 0 ? (
            <div className="no-results">No accepted donations found.</div>
          ) : (
            filteredAccepted.map((item) => (
              <div className="food-card" key={item.id}>
                <img
                  src={getFoodImage(item.food_name)}
                  alt={item.food_name}
                  className="food-img"
                />

                <div className="food-body" onClick={() => navigate(`/food/details/${item.id}`)} style={{ cursor: 'pointer' }}>
                  <h5>
                    {item.food_name}
                    <span className="status-badge accepted">accepted</span>
                  </h5>

                  <p>
                    <b>▣Quantity:</b> {item.quantity}
                  </p>
                  <p>
                    <b>📍Location:</b> {getEnglishLocation(item.location)}
                  </p>
                  <button className="view-details-btn">View Details</button>

                  
                  <br />
                  <p>
                    <a href={`tel:${item.contact}`}>✆ Call Donor</a>
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* MAP VIEW */}
      {activeTab === "map" && (
        <div className="map-view-section">
          <FoodMap foods={filteredFoods} />
        </div>
      )}

     

      {/* Success Dialog */}
      {showDialog && (
        <div className="dialog-overlay">
          <div className="dialog-box">
            <h4>{dialogMessage}</h4>
            <button
              className="btn btn-success mt-3"
              onClick={() => setShowDialog(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
      <div className="footer">
        <footer>
          <div class="footer-content">
            <div class="footer-links">
              <a href="#Home">Home</a>
              <a href="#Features">Features</a>
              <a href="#About">About</a>
              <a href="#Contact">Contact</a>
            </div>
            <div class="social-links">
              <a href="#">
                <i class="fab fa-facebook-f"></i>
              </a>
              <a href="#">
                <i class="fab fa-twitter"></i>
              </a>
              <a
                href="https://www.instagram.com/donat.efood?igsh=ejBreWdnM3I2ejM2"
                target="_blank"
              >
                <i class="fab fa-instagram"></i>
              </a>
              <a href="#">
                <i class="fab fa-linkedin-in"></i>
              </a>
            </div>
            <p>&copy; 2026 Food Waste Reduction System. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default ReceiverDashboard;
