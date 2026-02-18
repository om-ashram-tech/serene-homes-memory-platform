import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import logo from "../assets/logo.png";
import "./visitorLanding.css";

export default function VisitorLanding() {
  const [residents, setResidents] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("visitorAuth");
    navigate("/visitor/login");
  };

  // 🔐 Visitor authentication check
  useEffect(() => {
    if (!localStorage.getItem("visitorAuth")) {
      navigate("/visitor/login");
    }
  }, [navigate]);

  // 📦 Load residents
  useEffect(() => {
    const loadResidents = async () => {
      try {
        const res = await api.get("/residents");
        setResidents(res.data || []);
      } catch (err) {
        console.error("Failed to load residents", err);
      }
    };

    loadResidents();
  }, []);

  const totalResidents = residents.length;

  const maleCount = residents.filter(
    (r) => r.gender?.toLowerCase() === "male"
  ).length;

  const femaleCount = residents.filter(
    (r) => r.gender?.toLowerCase() === "female"
  ).length;

  return (
    <div className="vis-page">

      {/* 🔥 WEBSITE STYLE HEADER */}
      <div className="vis-navbar">
        <div className="vis-navbar-inner">

          {/* Logo → Redirects to Website */}
          <a
            href="https://omashram.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={logo}
              alt="OMASHRAM TRUST"
              className="vis-logo"
            />
          </a>

          {/* Logout Button */}
          <button className="vis-logout-btn" onClick={handleLogout}>
            Logout
          </button>

        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="vis-content">
        <div className="vis-header">
          <div className="vis-title-wrap">
            <h2>Residents</h2>
            <p className="vis-subtext">
              ✨ Every name carries a lifetime of memories — tap to explore their journey.
            </p>
          </div>

          <div className="vis-stats">
            <div className="stat-box">
              <span className="stat-num">{totalResidents}</span>
              <span className="stat-label">Total</span>
            </div>

            <div className="stat-box">
              <span className="stat-num">{maleCount}</span>
              <span className="stat-label">Male</span>
            </div>

            <div className="stat-box">
              <span className="stat-num">{femaleCount}</span>
              <span className="stat-label">Female</span>
            </div>
          </div>
        </div>

        <div className="vis-grid">
          {residents.length === 0 ? (
            <p className="vis-empty">No residents available</p>
          ) : (
            residents.map((r) => {
              const catchy = r.catchy_phrase || r.catchyPhrase || "";

              return (
                <div
                  key={r._id}
                  className="vis-card"
                  onClick={() => navigate(`/temp/${r.public_token}`)}
                >
                  {r.profile_photo_url ? (
                    <img
                      src={r.profile_photo_url}
                      alt={r.name}
                      className="vis-avatar"
                    />
                  ) : (
                    <div className="vis-avatar placeholder">
                      {(r.name || "?")[0]}
                    </div>
                  )}

                  <p className="vis-name">{r.name}</p>
                  {catchy && <p className="vis-catchy">{catchy}</p>}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
