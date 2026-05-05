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
  const [stats, setStats] = useState({ totalUsers: 0, totalPosts: 0, accepted: 0, available: 0 });
  const [monthlyData, setMonthlyData] = useState([]);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const fetchStats = () => {
    API.get("/admin/stats")
      .then(res => setStats(res.data))
      .catch(() => console.error("Failed to load stats"));
  };

  const fetchMonthly = () => {
    API.get("/admin/monthly-posts")
      .then(res => setMonthlyData(res.data))
      .catch(() => console.error("Monthly data failed"));
  };

  const fetchUsers = () => {
    setLoading(true);
    API.get("/admin/users")
      .then(res => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const fetchPosts = () => {
    setLoading(true);
    API.get("/admin/posts")
      .then(res => {
        setPosts(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      navigate("/");
      return;
    }

    fetchStats();
    fetchMonthly();
    setLoading(false);

    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeTab === "users") fetchUsers();
    if (activeTab === "posts") fetchPosts();
    if (activeTab === "dashboard") {
      fetchStats();
      fetchMonthly();
    }
  }, [activeTab]);

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await API.delete(`/admin/users/${id}`);
        fetchUsers();
        fetchStats();
      } catch {
        alert("Failed to delete user");
      }
    }
  };

  const handleDeletePost = async (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await API.delete(`/admin/posts/${id}`);
        fetchPosts();
        fetchStats();
      } catch {
        alert("Failed to delete post");
      }
    }
  };

  const chartData = [
    { name: "Accepted", value: stats.accepted || 0 },
    { name: "Available", value: stats.available || 0 }
  ];

  const COLORS = ["#4CAF50", "#FF9800"];

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPosts = posts.filter(p => 
    p.food_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`admin-layout ${isSidebarOpen ? "sidebar-open" : ""}`}>
      {/* Mobile Toggle Button */}
      <button className="mobile-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        <i className={`fas ${isSidebarOpen ? "fa-times" : "fa-bars"}`}></i>
      </button>

      {/* Sidebar Overlay */}
      {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-logo">
          <i className="fas fa-hand-holding-heart"></i>
          <span>Food Admin</span>
        </div>
        <nav className="sidebar-nav">
          <button className={activeTab === "dashboard" ? "active" : ""} onClick={() => { setActiveTab("dashboard"); setIsSidebarOpen(false); }}>
            <i className="fas fa-th-large"></i> Dashboard
          </button>
          <button className={activeTab === "users" ? "active" : ""} onClick={() => { setActiveTab("users"); setIsSidebarOpen(false); }}>
            <i className="fas fa-users"></i> Manage Users
          </button>
          <button className={activeTab === "posts" ? "active" : ""} onClick={() => { setActiveTab("posts"); setIsSidebarOpen(false); }}>
            <i className="fas fa-utensils"></i> Food Records
          </button>
          {/* <button onClick={() => navigate("/")}>
            <i className="fas fa-home"></i> Back to Site
          </button> */}
          <button className="sidebar-logout" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header-flex">
          <h2 className="admin-header">
            {activeTab === "dashboard" ? "Dashboard Overview" : 
             activeTab === "users" ? "User Management" : "Donation Records"}
            {loading && <span className="loading-spinner"> (Updating...)</span>}
          </h2>
          <div className="header-actions">
            {(activeTab === "users" || activeTab === "posts") && (
              <div className="admin-search">
                <i className="fas fa-search"></i>
                <input 
                  type="text" 
                  placeholder="Search..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            )}
            <button className="refresh-btn" onClick={() => {
              if (activeTab === "dashboard") { fetchStats(); fetchMonthly(); }
              if (activeTab === "users") fetchUsers();
              if (activeTab === "posts") fetchPosts();
            }}>
              <i className="fas fa-sync-alt"></i> Refresh
            </button>
          </div>
        </header>

        {activeTab === "dashboard" && (
          <div className="dashboard-content">
            <div className="admin-stats-grid">
              <div className="stat-card">
                <div className="stat-icon users-icon"><i className="fas fa-users"></i></div>
                <div className="stat-info">
                  <h4>Total Users</h4>
                  <h2>{stats.totalUsers || 0}</h2>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon posts-icon"><i className="fas fa-utensils"></i></div>
                <div className="stat-info">
                  <h4>Total Posts</h4>
                  <h2>{stats.totalPosts || 0}</h2>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon accepted-icon"><i className="fas fa-check-circle"></i></div>
                <div className="stat-info">
                  <h4>Accepted</h4>
                  <h2>{stats.accepted || 0}</h2>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon available-icon"><i className="fas fa-clock"></i></div>
                <div className="stat-info">
                  <h4>Available</h4>
                  <h2>{stats.available || 0}</h2>
                </div>
              </div>
            </div>

            <div className="charts-section">
              <div className="chart-card">
                <h5>Food Status Analytics</h5>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip contentStyle={{backgroundColor: '#1a1a2e', border: 'none'}} />
                    <Bar dataKey="value" fill="#00d4ff" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="chart-card">
                <h5>Food Distribution</h5>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={chartData} dataKey="value" nameKey="name" outerRadius={80} stroke="none">
                      {chartData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{backgroundColor: '#1a1a2e', border: 'none'}} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="chart-card mt-4">
              <h5>Monthly Donation Trend</h5>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip contentStyle={{backgroundColor: '#1a1a2e', border: 'none'}} />
                  <Line type="monotone" dataKey="posts" stroke="#00d4ff" strokeWidth={3} dot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="table-card">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Contact</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td>#{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td><span className={`role-badge ${user.role}`}>{user.role}</span></td>
                    <td>{user.contact}</td>
                    <td>
                      <button className="delete-btn" onClick={() => handleDeleteUser(user.id)}>
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "posts" && (
          <div className="table-card">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Food Item</th>
                  <th>Donor</th>
                  <th>Quantity</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.map(post => (
                  <tr key={post.id}>
                    <td>#{post.id}</td>
                    <td>{post.food_name}</td>
                    <td>{post.donor_name}</td>
                    <td>{post.quantity}</td>
                    <td><span className={`status-badge ${post.status}`}>{post.status}</span></td>
                    <td>
                      <button className="delete-btn" onClick={() => handleDeletePost(post.id)}>
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;