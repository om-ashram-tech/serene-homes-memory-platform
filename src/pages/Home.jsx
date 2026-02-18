// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const styles = {
    homeActions: {
      display: 'flex',
      gap: '14px',
      marginTop: '22px',
      flexWrap: 'wrap',
    },

    // Primary Button
    primaryBtn: {
      padding: '10px 18px',
      borderRadius: '10px',
      textDecoration: 'none',
      background: '#7a0000',
      color: '#ffffff',
      fontWeight: 600,
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'inline-block',
      transform: 'translateY(0)',
      minWidth: '140px',
      textAlign: 'center',
    },

    // Secondary Button
    secondaryBtn: {
      padding: '10px 18px',
      borderRadius: '10px',
      textDecoration: 'none',
      background: '#ffffff',
      color: '#7a0000',
      fontWeight: 600,
      border: '2px solid #7a0000',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'inline-block',
      transform: 'translateY(0)',
      minWidth: '140px',
      textAlign: 'center',
    },

    // ✅ Only OMASHRAM text color
    brand: {
      color: '#7a0000',
    },
  };

  const handleHover = (e, hover) => {
    if (hover) {
      e.target.style.transform = 'translateY(-3px) scale(1.05)';
      e.target.style.boxShadow = '0 8px 18px rgba(0,0,0,0.15)';
    } else {
      e.target.style.transform = 'translateY(0) scale(1)';
      e.target.style.boxShadow = 'none';
    }
  };

  const handlePress = (e, press) => {
    e.target.style.transform = press
      ? 'scale(0.96)'
      : 'translateY(-3px) scale(1.05)';
  };

  return (
    <section className="home">
      <div className="hero-card">
        <h1>
          Welcome to <span style={styles.brand}>OMASHRAM,</span>
        </h1>

        <p>
          Serene Homes is a warm and caring old age home where every resident&apos;s life
          story is cherished. Each resident has a private memory space with photos,
          videos, and written memories, accessible only to their family and close friends.
        </p>

        <p>
          For visitors and family members: please use the QR code provided by our staff
          to access your loved one&apos;s private page.
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
