import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Layout({ children }) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <div className="app-root">

      {/* SHOW ONLY ON PUBLIC PAGES */}
      {!isAdmin && (
        <header className="header">
          <div className="brand">
            <span className="brand-title">Serene Homes</span>
            <span className="brand-subtitle">Private Memory Spaces</span>
          </div>
          <nav className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/admin/login">Admin Login</Link>
          </nav>
        </header>
      )}

      <main className="main">{children}</main>

      {/* FOOTER ONLY FOR PUBLIC */}
      {!isAdmin && (
        <footer className="footer">
          Serene Homes &copy; {new Date().getFullYear()} · Caring with dignity.
        </footer>
      )}

    </div>
  );
}
