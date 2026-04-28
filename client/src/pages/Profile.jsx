import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    contact: "",
    location: "",
    photo: ""
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    API.get("/user/profile", {
      headers: { Authorization: token }
    })
      .then((res) => setUser(res.data))
      .catch((err) => {
        console.error(err);
        setError("Failed to load profile");
      });
  }, [navigate]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (limit to 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError("Image size must be less than 2MB");
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      setError("Please select a valid image file");
      return;
    }

    setIsUploading(true);
    setError("");

    const reader = new FileReader();
    reader.onloadend = () => {
      // Compress image if it's too large
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Calculate new dimensions (max 300px)
        let { width, height } = img;
        const maxSize = 300;
        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);

        // Check if compressed image is still too large
        if (compressedDataUrl.length > 1024 * 1024) { // 1MB limit
          setError("Compressed image is still too large. Please choose a smaller image.");
          setIsUploading(false);
          return;
        }

        setUser((prevUser) => ({ ...prevUser, photo: compressedDataUrl }));
        setError(""); // Clear any previous errors
        setIsUploading(false);
      };
      img.src = reader.result;
    };
    reader.onerror = () => {
      setError("Failed to read image file");
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    try {
      const token = localStorage.getItem("token");
      console.log("Submitting profile update:", { ...user, photo: user.photo ? "data:image/..." : null });

      const response = await API.put("/user/profile", user, {
        headers: { Authorization: token }
      });

      console.log("Profile update response:", response);
      setSuccess("Profile updated successfully.");
      navigate("/donor");

      // Dispatch custom event to update navbar profile photo
      window.dispatchEvent(new CustomEvent("profileUpdated"));
    } catch (err) {
      console.error("Profile update error:", err);
      console.error("Error response:", err.response?.data);
      setError(err.response?.data?.error || "Unable to update profile. Please try again.");
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        <h2>My Profile</h2>
        <p>Edit your profile details below.</p>

        {success && <div className="success-message">{success}</div>}
        {error && <div className="error-message">{error}</div>}

        <div className="profile-avatar">
          <img
            src={user.photo || "https://via.placeholder.com/150?text=Profile"}
            alt="Profile"
            className="avatar-img"
          />
          <div className="file-input-container">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              id="profile-photo-input"
              disabled={isUploading}
            />
            <label htmlFor="profile-photo-input" className="file-input-label">
              {isUploading ? "Processing..." : "Choose Photo"}
            </label>
          </div>
          {user.photo && (
            <button type="button" className="remove-photo-btn" onClick={() => setUser((prev) => ({ ...prev, photo: "" }))}>
              Remove Photo
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          <label>Name</label>
          <input name="name" value={user.name} onChange={handleChange} required />

          <label>Email</label>
          <input name="email" value={user.email} onChange={handleChange} required type="email" />

          <label>Contact</label>
          <input name="contact" value={user.contact || ""} onChange={handleChange} />

          <label>Location</label>
          <input name="location" value={user.location || ""} onChange={handleChange} />

          <button type="submit">Save Changes</button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
