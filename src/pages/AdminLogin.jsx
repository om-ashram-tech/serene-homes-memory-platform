// src/pages/AdminLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { setAuthToken } from "../api.js";
import Logo from "../assets/logo.png";
import "./adminLogin.css";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const maroon = "#7a0000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });
      setAuthToken(res.data.token);
      navigate("/admin/dashboard");
    } catch {
      setError("Invalid login credentials. Please try again.");
    }

    setLoading(false);
  };

  return (
    <>
      <div style={styles.page}>

        {/* TOP LOGO — moved higher & made bigger */}
        <img src={Logo} alt="Logo" style={styles.logo} />

        {/* GLASS CARD */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Admin Login</h2>

          <form onSubmit={handleSubmit} style={styles.form}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Email"
              required
            />

            <label style={styles.label}>Password</label>
            <input
              type="password"
              style={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              required
            />

            {error && <div style={styles.error}>{error}</div>}

            <button
              type="submit"
              style={{
                ...styles.button,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
              disabled={loading}
            >
              {loading ? <div className="spinner"></div> : "Login"}
            </button>
          </form>

          <p style={styles.footer}>
            © {new Date().getFullYear()} Serene Homes
          </p>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeScale {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  );
}

/* ---------------- STYLES ---------------- */

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",   // move elements higher
    paddingTop: "60px",             // extra top spacing
  },

  logo: {
    width: "350px",            // enlarged logo
    height: "auto",
    marginBottom: "30px",
    marginTop: "10px",         // push slightly up
    objectFit: "contain",
    animation: "fadeScale 0.8s ease",
  },

  card: {
    width: "420px",
    padding: "40px 30px",
    borderRadius: "20px",
    background: "rgba(255, 255, 255, 0.6)",
    boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
    backdropFilter: "blur(10px)",
    animation: "fadeInUp 0.7s ease",
  },

  cardTitle: {
    fontSize: "28px",
    textAlign: "center",
    fontWeight: "700",
    color: "#7a0000",      // MAROON TITLE
    marginBottom: "25px",
  },

  form: { marginTop: "10px" },

  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "8px",
    display: "block",
  },

  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid #cfcfcf",
    fontSize: "15px",
    marginBottom: "15px",
    outline: "none",
    transition: "0.2s",
  },

  button: {
    width: "100%",
    padding: "12px",
    fontSize: "16px",
    borderRadius: "10px",
    border: "none",
    color: "white",
    background: "#7a0000",
    fontWeight: "600",
    marginTop: "10px",
    transition: "0.25s",
  },

  error: {
    color: "red",
    fontSize: "14px",
    textAlign: "center",
    marginBottom: "10px",
  },

  footer: {
    marginTop: "20px",
    textAlign: "center",
    fontSize: "13px",
    color: "#666",
  },
};
