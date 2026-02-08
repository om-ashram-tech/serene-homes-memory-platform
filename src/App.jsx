// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

import AdminResidentsList from "./pages/AdminResidentsList.jsx";
import AdminCreateResident from "./pages/AdminCreateResident.jsx";
import AdminViewResident from "./pages/AdminViewResident.jsx";
import ResidentAdminPage from "./pages/ResidentAdminPage.jsx";

import PublicResidentPage from "./pages/PublicResidentPage.jsx";
import ResidentTempPage from "./pages/ResidentTempPage.jsx";

import Layout from "./components/Layout.jsx";
import VisitorLogin from "./pages/VisitorLogin";
import VisitorLanding from "./pages/VisitorLanding";

export default function App() {
  return (
    <Routes>
      {/* ===== PUBLIC PAGES (WITH SERENE HOMES HEADER) ===== */}
      <Route
        path="/"
        element={
          <Layout>
            <Home />
          </Layout>
        }
      />

      <Route path="/resident/:token" element={<PublicResidentPage />} />
      <Route path="/temp/:token" element={<ResidentTempPage />} />


      {/* ===== ADMIN PAGES (NO PUBLIC HEADER) ===== */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/residents-list" element={<AdminResidentsList />} />
      <Route path="/admin/create-resident" element={<AdminCreateResident />} />
      <Route path="/admin/residents/view/:id" element={<AdminViewResident />} />
      <Route path="/admin/residents/:id" element={<ResidentAdminPage />} />

      {/* ===== VISITOR FLOW ===== */}
      <Route path="/visitor/login" element={<VisitorLogin />} />
      <Route path="/visitors" element={<VisitorLanding />} />
    </Routes>
  );
}
