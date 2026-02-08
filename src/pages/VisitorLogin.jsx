import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function VisitorLogin() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!/^\d{4}$/.test(pin)) {
      setError("Please enter a valid 4-digit PIN");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/visitorLogin", { pin });

      if (res.data.success) {
        // ✅ Save visitor session
        localStorage.setItem("visitorAuth", "true");

        // 👉 Go to VisitorLanding.jsx
        navigate("/visitors");
      } else {
        setError("Invalid PIN");
      }
    } catch (err) {
      setError("Invalid PIN");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>Visitor Access</h2>
        <p style={styles.subtitle}>
          Enter the 4-digit PIN provided by the staff
        </p>

        <form onSubmit={submit}>
          <input
            type="password"
            maxLength={4}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="••••"
            style={styles.input}
          />

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Checking..." : "Enter"}
          </button>
        </form>

        {error && <p style={styles.error}>{error}</p>}

        <p style={styles.hint}>
          If you don’t have a PIN, please contact the reception.
        </p>
      </div>
    </div>
  );
}

/* ===== Inline Styles (Theme-Matched) ===== */

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#fffaf7", // matches your layout bg
    padding: 20,
  },
  card: {
    background: "#ffffff",
    padding: "32px 28px",
    borderRadius: 14,
    boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: 360,
    textAlign: "center",
  },
  title: {
    marginBottom: 6,
    color: "#7a0000",
    fontWeight: 700,
  },
  subtitle: {
    marginBottom: 22,
    color: "#555",
    fontSize: 14,
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #d3cfc7",
    fontSize: 16,
    outline: "none",
    marginBottom: 16,
    textAlign: "center",
    letterSpacing: 4,
  },
  button: {
    width: "100%",
    padding: "10px 0",
    borderRadius: 10,
    border: "none",
    background: "#7a0000",
    color: "#ffffff",
    fontWeight: 600,
    fontSize: 15,
    cursor: "pointer",
    transition: "0.2s ease",
  },
  error: {
    color: "#b00000",
    marginTop: 12,
    fontSize: 14,
  },
  hint: {
    marginTop: 16,
    fontSize: 12,
    color: "#777",
  },
};
