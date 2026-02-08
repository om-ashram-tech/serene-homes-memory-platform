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
    primaryBtn: {
      padding: '10px 18px',
      borderRadius: '10px',
      textDecoration: 'none',
      background: '#7a0000',   // same as header
      color: '#ffffff',
      fontWeight: 600,
      border: 'none',
      transition: '0.2s ease',
      cursor: 'pointer',
    },
    secondaryBtn: {
      padding: '10px 18px',
      borderRadius: '10px',
      textDecoration: 'none',
      background: '#ffffff',
      color: '#7a0000',        // same maroon
      fontWeight: 600,
      border: '2px solid #7a0000',
      transition: '0.2s ease',
      cursor: 'pointer',
    },
  };

  return (
    <section className="home">
      <div className="hero-card">
        <h1>Welcome to Serene Homes</h1>

        <p>
          Serene Homes is a warm and caring old age home where every resident&apos;s life
          story is cherished. Each resident has a private memory space with photos,
          videos, and written memories, accessible only to their family and close friends.
        </p>

        <p>
          For visitors and family members: please use the QR code provided by our staff
          to access your loved one&apos;s private page.
        </p>

        {/* Buttons */}
        <div style={styles.homeActions}>
          <Link className="primary-btn" to="/admin/login" style={styles.primaryBtn}>
            Admin Login
          </Link>

          <Link className="secondary-btn" to="/visitor/login" style={styles.secondaryBtn}>
            Visitor Login
          </Link>
        </div>
      </div>
    </section>
  );
}
