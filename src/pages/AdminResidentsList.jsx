// src/pages/AdminResidentsList.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./residentsList.css";
import AdminLayout from "../layouts/AdminLayout";

export default function AdminResidentsList() {
  const navigate = useNavigate();

  const [residents, setResidents] = useState([]);
  const [search, setSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  // ---- LOAD RESIDENTS ----
  const loadResidents = async () => {
    try {
      const res = await api.get("/residents");
      setResidents(res.data);
    } catch (err) {
      alert("Failed to load residents");
    }
  };

  useEffect(() => {
    loadResidents();
  }, []);

  // ---- FILTER (name only, case-insensitive) ----
  const filtered = residents.filter((r) =>
    (r.name || "").toLowerCase().includes(search.toLowerCase())
  );

  // ---- SUGGESTIONS (startsWith) ----
  const suggestions =
    search.trim().length === 0
      ? []
      : residents.filter((r) =>
          (r.name || "")
            .toLowerCase()
            .startsWith(search.trim().toLowerCase())
        );

  // ---- DELETE ----
  const deleteResident = async (id) => {
    if (!window.confirm("Are you sure you want to delete this resident?"))
      return;

    try {
      await api.delete(`/residents?id=${id}`);
      loadResidents();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const handleSearchClick = () => {
    setShowSuggestions(false);
  };

  return (
    <AdminLayout>
      <div className="reslist-page">
        <div className="reslist-inner">

          {/* HEADER */}
          <div className="reslist-header">
            <div className="reslist-title-bg">
              <h2>Residents</h2>
            </div>
            <button
              className="add-btn"
              onClick={() => navigate("/admin/create-resident")}
            >
              + Add Resident
            </button>
          </div>

          {/* SEARCH BAR */}
          <div className="search-row">
            <div className="search-wrapper">
              <input
                className={`search-input ${
                  search.trim().length > 0 ? "search-has-text" : ""
                }`}
                type="text"
                placeholder="Search resident name..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setShowSuggestions(true);
                }}
              />

              {showSuggestions && suggestions.length > 0 && (
                <ul className="suggestions-box">
                  {suggestions.map((s) => (
                    <li
                      key={s._id}
                      onClick={() => {
                        setSearch(s.name);
                        setShowSuggestions(false);
                      }}
                    >
                      {s.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button className="search-btn" onClick={handleSearchClick}>
              Search
            </button>
          </div>

          {/* RESIDENT GRID */}
          <div className="residents-grid">
            {filtered.length === 0 ? (
              <p className="empty">No residents found</p>
            ) : (
              filtered.map((r) => (
                <div className="resident-card" key={r._id}>
                  <div className="card-left">
                    {r.profile_photo_url ? (
                      <img
                        src={r.profile_photo_url}
                        alt={r.name}
                        className="avatar"
                      />
                    ) : (
                      <div className="avatar placeholder">
                        {(r.name || "?")[0]}
                      </div>
                    )}
                  </div>

                  <div className="card-info">
                    <h3>{r.name}</h3>

                    <div className="actions">
                      <button
                        className="view-btn"
                        onClick={() =>
                          navigate(`/admin/residents/view/${r._id}`)
                        }
                      >
                        👁 View
                      </button>

                      <button
                        className="manage-btn"
                        onClick={() =>
                          navigate(`/admin/residents/${r._id}`)
                        }
                      >
                        ⚙ Manage
                      </button>

                      

                      <button
                        className="delete-btn"
                        onClick={() => deleteResident(r._id)}
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </AdminLayout>
  );
}
