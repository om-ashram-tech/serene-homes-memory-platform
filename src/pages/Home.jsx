// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const styles = {
    homeActions: {
      display: "flex",
      gap: "14px",
      marginTop: "22px",
      flexWrap: "wrap",
    },

    // Primary Button
    primaryBtn: {
      padding: "12px 18px",
      borderRadius: "10px",
      textDecoration: "none",
      background: "#7a0000",
      color: "#ffffff",
      fontWeight: 600,
      border: "none",
      cursor: "pointer",
      transition: "all 0.3s ease",
      display: "inline-block",
      transform: "translateY(0)",
      minWidth: "140px",
      textAlign: "center",
      flex: "1", // ✅ Makes it responsive
    },

    // Secondary Button
    secondaryBtn: {
      padding: "12px 18px",
      borderRadius: "10px",
      textDecoration: "none",
      background: "#ffffff",
      color: "#7a0000",
      fontWeight: 600,
      border: "2px solid #7a0000",
      cursor: "pointer",
      transition: "all 0.3s ease",
      display: "inline-block",
      transform: "translateY(0)",
      minWidth: "140px",
      textAlign: "center",
      flex: "1", // ✅ Makes it responsive
    },

    brand: {
      color: "#7a0000",
    },
  };

  const handleHover = (e, hover) => {
    const btn = e.currentTarget; // ✅ safer than e.target
    if (hover) {
      btn.style.transform = "translateY(-3px) scale(1.05)";
      btn.style.boxShadow = "0 8px 18px rgba(0,0,0,0.15)";
    } else {
      btn.style.transform = "translateY(0) scale(1)";
      btn.style.boxShadow = "none";
    }
  };

  const handlePress = (e, press) => {
    const btn = e.currentTarget;
    btn.style.transform = press
      ? "scale(0.96)"
      : "translateY(-3px) scale(1.05)";
  };

  return (
    <section
      className="home"
      style={{
        minHeight: "100vh",
        background: "#f3ece6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
      }}
    >
      <div
        className="hero-card"
        style={{
          background: "#efe6df",
          padding: "40px",
          borderRadius: "18px",
          maxWidth: "650px",
          width: "100%",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ fontSize: "clamp(24px, 5vw, 34px)", marginBottom: "20px" }}>
          Welcome to <span style={styles.brand}>OMASHRAM,</span>
        </h1>

        <p style={{ fontSize: "clamp(14px, 4vw, 16px)", lineHeight: "1.6", color: "#333" }}>
          Serene Homes is a warm and caring old age home where every resident's
          life story is cherished. Each resident has a private memory space with
          photos, videos, and written memories, accessible only to their family
          and close friends.
        </p>

        <p style={{ fontSize: "clamp(14px, 4vw, 16px)", lineHeight: "1.6", color: "#333" }}>
          For visitors and family members: please use the QR code provided by
          our staff to access your loved one's private page.
        </p>

        <div style={styles.homeActions}>
          <Link
            to="/admin/login"
            style={styles.primaryBtn}
            onMouseEnter={(e) => handleHover(e, true)}
            onMouseLeave={(e) => handleHover(e, false)}
            onMouseDown={(e) => handlePress(e, true)}
            onMouseUp={(e) => handlePress(e, false)}
          >
            Admin Login
          </Link>

          <Link
            to="/visitor/login"
            style={styles.secondaryBtn}
            onMouseEnter={(e) => handleHover(e, true)}
            onMouseLeave={(e) => handleHover(e, false)}
            onMouseDown={(e) => handlePress(e, true)}
            onMouseUp={(e) => handlePress(e, false)}
          >
            Visitor Login
          </Link>
        </div>
      </div>
    </section>
  );
}
