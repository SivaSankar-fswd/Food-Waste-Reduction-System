import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { getFoodImage } from "../utils/foodImages";
import { getEnglishLocation } from "../utils/locationHelper";
import "./FoodDetails.css";


function FoodDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const role = localStorage.getItem("role");

  useEffect(() => {
    API.get(`/food/${id}`)
      .then((res) => {
        setFood(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching food details:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="details-loading">
        <div className="spinner"></div>
        <p>Loading donation details...</p>
      </div>
    );
  }

  if (!food) {
    return (
      <div className="container mt-5 text-center">
        <h2>Donation not found</h2>
        <button className="btn btn-primary mt-3" onClick={() => navigate(-1)}>Back</button>
      </div>
    );
  }

  return (
    <div className="food-details-page">
      <div className="details-container">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
        
        <div className="details-header-section">
          <img src={food.photo || getFoodImage(food.food_name)} alt={food.food_name} className="details-hero-img" />
          <div className="header-overlay">
            <h1>{food.food_name}</h1>
            <span className={`status-pill ${food.status}`}>{food.status}</span>
          </div>
        </div>

        <div className="details-grid-content">
          <div className="details-main">
            <section className="info-card">
              <h3> Donated Item Info</h3>
              <div className="info-row">
                <strong>▣ Quantity:</strong>
                <span>{food.quantity}</span>
              </div>
              <div className="info-row align-items-center">
                <strong>📍 Location:</strong>
                {food.latitude && food.longitude ? (
                  <button 
                    className="direction-btn"
                    onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${food.latitude},${food.longitude}`, "_blank")}
                  >
                    Get Direction
                  </button>
                ) : (
                  <span>{getEnglishLocation(food.location)}</span>
                )}

              </div>
              <div className="info-row">
                <strong>◵ Best Before:</strong>
                <span>{new Date(food.expiry_date).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' })}</span>
              </div>
              <div className="info-row">
                <strong>▤ Posted on:</strong>
                <span>{new Date(food.posted_date).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' })}</span>
              </div>
            </section>

            <section className="info-card">
              <h3> Contact Details</h3>
              <div className="info-row">
                <strong>✆ Phone Number:</strong>
                <span>{food.contact}</span>
              </div>
              <a href={`tel:${food.contact}`} className="call-now-btn">Call Donor Now</a>
            </section>
          </div>

          <div className="details-side">
            {food.status === "accepted" ? (
              <section className="info-card accepted-info">
                <h3> Donation Accepted</h3>
                <div className="info-row">
                  <strong>Receiver:</strong>
                  <span>{food.receiver_name}</span>
                </div>
                <div className="info-row">
                  <strong>Contact:</strong>
                  <span>{food.receiver_contact}</span>
                </div>
                {food.accepted_date && (
                  <div className="info-row">
                    <strong>Date:</strong>
                    <span>{new Date(food.accepted_date).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                  </div>
                )}
              </section>
            ) : (
                role === "receiver" && (
                  <section className="info-card action-card">
                    <h3>Interested?</h3>
                    <p>Help reduce food waste by accepting this donation.</p>
                    <button 
                      className="btn-accept-large"
                      onClick={() => {
                        API.put(`/food/update-status/${food.id}`, {
                          status: "accepted",
                          receiver_id: localStorage.getItem("userId")
                        }).then(() => {
                           window.location.reload();
                        }).catch(() => alert("Failed to accept donation"));
                      }}
                    >
                      Accept Donation
                    </button>
                  </section>
                )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FoodDetails;
