import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../pages/dashboard.css";
import logo from "../assets/logo.png";

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/admin/login");
  };

  const navItem = (path, icon, label) => {
    const isActive = location.pathname === path;

    return (
      <button
        className={`sidebar-btn ${isActive ? "active" : ""}`}
        onClick={() => navigate(path)}
      >
        <span className="icon">{icon}</span>
        {label}
      </button>
    );
  };

  return (
    <div className="page-wrapper">

      {/* HEADER */}
      <header className="admin-navbar">
        <div className="admin-navbar-inner">

          <div className="admin-brand">
            <a 
  href="https://omashram.org/" 
  target="_blank" 
  rel="noopener noreferrer"
>
  <img 
    src={logo} 
    alt="OMASHRAM TRUST" 
    className="admin-logo" 
  />
</a>

            
          </div>

          <button className="logout-btn" onClick={logout}>
            Logout
          </button>

        </div>
      </header>

      {/* MAIN LAYOUT */}
      <div className="layout-container">

        <aside className="sidebar">
          {navItem("/admin/dashboard", "🏠", "Dashboard")}
          {navItem("/admin/residents-list", "👥", "Residents")}
          {navItem("/admin/create-resident", "➕", "Add Resident")}
        </aside>

        <main className="content">
          <div className="content-inner">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}
