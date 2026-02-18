import React from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Layout({ children }) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <div className="app-root">

      {/* PUBLIC HEADER ONLY */}
      {!isAdmin && (
        <header className="public-navbar">
          <div className="public-navbar-inner">

            {/* LEFT: Logo */}
            <div className="public-brand">
              <img src={logo} alt="OMASHRAM TRUST" className="public-logo" />
            </div>

            {/* RIGHT: Links */}
            <nav className="public-nav-links">
              <Link to="/">Home</Link>
              <Link to="/admin/login">Admin Login</Link>
            </nav>

          </div>
        </header>
      )}

      <main className="main">{children}</main>

      {/* {!isAdmin && (
        <footer className="footer">
          OMashram &copy; {new Date().getFullYear()} · Caring with dignity.
        </footer>
      )} */}

    </div>
  );
}
