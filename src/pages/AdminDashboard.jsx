import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import AdminLayout from "../layouts/AdminLayout";

export default function AdminDashboard() {
  const [totalResidents, setTotalResidents] = useState(0);
  const [visitorPin, setVisitorPin] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [pendingPin, setPendingPin] = useState(null);
  const [savingPin, setSavingPin] = useState(false);
  const [pinError, setPinError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await api.get("/residents");
        setTotalResidents(res.data.length);
      } catch (err) {
        console.error("Failed to load residents count", err);
      }
    };

    loadStats();
  }, []);

  const generatePin = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  const onChangePinClick = () => {
    const newPin = generatePin();
    setPendingPin(newPin);
    setPinError("");
    setShowPopup(true);
  };

  const confirmChangePin = async () => {
    try {
      setSavingPin(true);
      setPinError("");

      // 🔗 REAL BACKEND UPDATE
      await api.post("/updateVisitorPin", { pin: pendingPin });

      setVisitorPin(pendingPin);
      setPendingPin(null);
      setShowPopup(false);
    } catch (err) {
      console.error("Failed to update PIN:", err);
      setPinError("Failed to update PIN. Please try again.");
    } finally {
      setSavingPin(false);
    }
  };

  const cancelChangePin = () => {
    setPendingPin(null);
    setPinError("");
    setShowPopup(false);
  };

  return (
    <AdminLayout>
      <h1>Welcome, Admin</h1>
      <p className="subtext">Manage residents and their memory spaces</p>

      {/* Visitor PIN Card */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <h3>Visitor Access PIN</h3>

          {visitorPin ? (
            <p style={{ fontSize: 22, fontWeight: 700, letterSpacing: 2 }}>
              {visitorPin}
            </p>
          ) : (
            <p style={{ color: "#777" }}>Not set</p>
          )}

          <button
            onClick={onChangePinClick}
            style={{
              marginTop: 10,
              padding: "8px 14px",
              borderRadius: 8,
              border: "none",
              background: "#7a0000",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Change PIN
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div
          className="stat-card clickable"
          onClick={() => navigate("/admin/residents-list")}
        >
          <h3>Total Residents</h3>
          <p>{totalResidents}</p>
        </div>

        <div className="stat-card">
          <h3>Active Pages</h3>
          <p>{totalResidents}</p>
        </div>

        {/* <div className="stat-card">
          <h3>QR Scans Today</h3>
          <p>-nil-</p>
        </div> */}

        <div className="stat-card">
          <h3>Staff Accounts</h3>
          <p>1</p>
        </div>
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <div style={overlayStyle}>
          <div style={popupStyle}>
            <h3 style={{ marginBottom: 10, color: "#7a0000" }}>
              Confirm PIN Change
            </h3>

            <p style={{ marginBottom: 14 }}>
              New Visitor PIN:{" "}
              <strong style={{ letterSpacing: 2 }}>{pendingPin}</strong>
            </p>

            <p style={{ fontSize: 14, color: "#555", marginBottom: 12 }}>
              This will replace the previous PIN.
            </p>

            {pinError && (
              <p style={{ color: "#b00000", fontSize: 13, marginBottom: 10 }}>
                {pinError}
              </p>
            )}

            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button
                onClick={confirmChangePin}
                style={confirmBtnStyle}
                disabled={savingPin}
              >
                {savingPin ? "Saving..." : "Confirm"}
              </button>

              <button
                onClick={cancelChangePin}
                style={cancelBtnStyle}
                disabled={savingPin}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

/* ===== Inline Styles for Popup ===== */

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.35)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 2000,
};

const popupStyle = {
  background: "#ffffff",
  padding: "22px 24px",
  borderRadius: 12,
  width: "100%",
  maxWidth: 340,
  textAlign: "center",
  boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
};

const confirmBtnStyle = {
  padding: "8px 16px",
  borderRadius: 8,
  border: "none",
  background: "#7a0000",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer",
  opacity: 1,
};

const cancelBtnStyle = {
  padding: "8px 16px",
  borderRadius: 8,
  border: "1px solid #ccc",
  background: "#fff",
  color: "#333",
  cursor: "pointer",
};
