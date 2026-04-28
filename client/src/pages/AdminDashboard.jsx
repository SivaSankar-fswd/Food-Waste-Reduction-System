import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid
} from "recharts";

function AdminDashboard() {

  const [stats, setStats] = useState({});
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    API.get("/admin/stats")
      .then(res => setStats(res.data))
      .catch(() => alert("Failed to load stats"));
    API.get("/admin/monthly-posts")
  .then(res => setMonthlyData(res.data))
  .catch(()=>console.log("Monthly data failed"));
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      navigate("/");
    }
  }, []);

  /* Chart Data */
  const chartData = [
    { name: "Accepted", value: stats.accepted || 0 },
    { name: "Available", value: stats.available || 0 }
  ];

  const COLORS = ["#4CAF50", "#FF9800"];

  return (
    <div className="admin-dashboard-container">
      <h2 className="admin-header">Admin Dashboard</h2>

      <div className="admin-stats-grid">
        <div className="stat-card">
          <h4>Total Users</h4>
          <h2>{stats.totalUsers}</h2>
        </div>

        <div className="stat-card">
          <h4>Total Posts</h4>
          <h2>{stats.totalPosts}</h2>
        </div>

        <div className="stat-card">
          <h4>Accepted</h4>
          <h2>{stats.accepted}</h2>
        </div>

        <div className="stat-card">
          <h4>Available</h4>
          <h2>{stats.available}</h2>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-card">
          <h5>Food Status Analytics</h5>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#4CAF50" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h5>Food Distribution</h5>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
              >
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-card mt-4" style={{ gridColumn: '1 / -1' }}>
        <h5>Monthly Donation Trend</h5>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="month" stroke="#ffffff" />
            <YAxis stroke="#ffffff" />
            <Tooltip 
              contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.2)' }}
            />
            <Line
              type="monotone"
              dataKey="posts"
              stroke="#00d4ff"
              strokeWidth={3}
              dot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
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
                <a href="#" ><i class="fab fa-facebook-f"></i></a>
                <a href="#"><i class="fab fa-twitter"></i></a>
                <a href="https://www.instagram.com/donat.efood?igsh=ejBreWdnM3I2ejM2" target="_blank"><i class="fab fa-instagram"></i></a>
                <a href="#"><i class="fab fa-linkedin-in"></i></a>
            </div>
            <p>&copy; 2026 Food Waste Reduction System. All rights reserved.</p>
        </div>
    </footer>
</div>

    </div>
  );
}

export default AdminDashboard;