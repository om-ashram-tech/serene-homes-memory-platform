import React from "react";
import { useNavigate } from "react-router-dom";
import "../pages/dashboard.css";

export default function AdminLayout({ children }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/admin/login");
  };

  return (
    <div className="page-wrapper">
      {/* ADMIN HEADER */}
      <header className="top-header">
        <h2>OM ASHRAM — Admin Panel</h2>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </header>

      {/* MAIN LAYOUT */}
      <div className="layout-container">

        {/* SIDEBAR */}
        <aside className="sidebar">
          <button onClick={() => navigate("/admin/dashboard")}>🏠 Dashboard</button>
          <button onClick={() => navigate("/admin/residents-list")}>👥 Residents</button>
          <button onClick={() => navigate("/admin/create-resident")}>➕ Add Resident</button>
        </aside>

        {/* PAGE CONTENT */}
        <main className="content">
          <div className="content-inner">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}
