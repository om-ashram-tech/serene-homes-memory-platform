import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./visitorLanding.css";

export default function VisitorLanding() {
  const [residents, setResidents] = useState([]);
  const navigate = useNavigate();

  // 🔒 Route guard: block access if not logged in
  useEffect(() => {
    if (!localStorage.getItem("visitorAuth")) {
      navigate("/visitor/login");
    }
  }, [navigate]);

  // 📥 Load residents
  useEffect(() => {
    const loadResidents = async () => {
      try {
        const res = await api.get("/residents");
        setResidents(res.data);
      } catch (err) {
        console.error("Failed to load residents", err);
      }
    };

    loadResidents();
  }, []);

  return (
    <div className="vis-page">
      <header className="vis-header">
        <h2>Residents</h2>
        <p className="vis-subtext">
          Tap on a resident to view their memory page
        </p>
      </header>

      <div className="vis-grid">
        {residents.length === 0 ? (
          <p className="vis-empty">No residents available</p>
        ) : (
          residents.map((r) => (
            <div
              key={r._id}
              className="vis-card"
              // ✅ Redirect to ResidentTempPage using public_token
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
            </div>
          ))
        )}
      </div>
    </div>
  );
}
