// src/pages/AdminViewResident.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api.js";
import AdminLayout from "../layouts/AdminLayout";

export default function AdminViewResident() {
  const { id } = useParams();
  const [resident, setResident] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("photos");

  // ✅ REAL DATA FROM BACKEND
  const [media, setMedia] = useState([]);
  const [stories, setStories] = useState([]);

  useEffect(() => {
    const loadResident = async () => {
      try {
        const res = await api.get(`/residents?id=${id}`);
        setResident(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load resident details.");
      } finally {
        setLoading(false);
      }
    };

    const loadMedia = async () => {
      try {
        const res = await api.get("/media", {
          params: { residentId: id },
        });
        setMedia(res.data);
      } catch (err) {
        console.error("Failed to load media", err);
      }
    };

    const loadStories = async () => {
      try {
        const res = await api.get("/stories", {
          params: { residentId: id },
        });
        setStories(res.data);
      } catch (err) {
        console.error("Failed to load stories", err);
      }
    };

    loadResident();
    loadMedia();
    loadStories();
  }, [id]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const scrollToBottom = () =>
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });

  if (loading)
    return (
      <div style={styles.centerWrap}>
        <p style={styles.loading}>Loading memory page…</p>
      </div>
    );

  if (error || !resident)
    return (
      <div style={styles.centerWrap}>
        <h2 style={styles.error}>{error || "Resident not found."}</h2>
        <p>Please go back to the residents list.</p>
      </div>
    );

  // Subline text
  // Subline text
  const infoBits = [];

  if (resident.age) infoBits.push(`Age ${resident.age}`);

  if (resident.gender) {
    let genderText = resident.gender;

    // Add year of admission next to gender
    if (resident.year_of_admission) {
      genderText += ` • Year of Admission : ${resident.year_of_admission}`;
    }

    infoBits.push(genderText);
  }

 

  const infoLine = infoBits.join(" • ");


  // ✅ COUNTS
  const photosCount = media.filter((m) => m.type === "photo").length;
  const videosCount = media.filter((m) => m.type === "video").length;
  const storiesCount = stories.length;

  const renderTabContent = () => {
    // ---------------- PHOTOS ----------------
    if (activeTab === "photos") {
      const photos = media.filter((m) => m.type === "photo");

      if (!photos.length)
        return <p style={styles.emptyText}>No photos added yet.</p>;

      return (
        <div style={styles.grid}>
          {photos.map((p) => (
            <div key={p._id} style={styles.card}>
              <img src={p.url} alt={p.title} style={styles.thumbMedia} />
            </div>
          ))}
        </div>
      );
    }

    // ---------------- VIDEOS ----------------
    if (activeTab === "videos") {
      const videos = media.filter((m) => m.type === "video");

      if (!videos.length)
        return <p style={styles.emptyText}>No videos added yet.</p>;

      return (
        <div style={styles.grid}>
          {videos.map((v) => (
            <div key={v._id} style={styles.card}>
              <video src={v.url} controls style={styles.thumbMedia} />
            </div>
          ))}
        </div>
      );
    }

    // ---------------- STORIES ----------------
    if (!stories.length)
      return <p style={styles.emptyText}>No stories added yet.</p>;

    return (
      <div style={styles.storyList}>
        {stories.map((s) => (
          <div key={s._id} style={styles.storyCard}>
            <h4 style={styles.storyTitle}>{s.title}</h4>
            <p style={styles.storyContent}>{s.content}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <AdminLayout>
      <div style={styles.page}>
        <div style={styles.privacyBanner}>
          🔒 This is a private family memory page. Please respect privacy and do
          not share without permission.
        </div>

        <div style={styles.container}>
          <section style={styles.profileSection}>
            <div style={styles.profilePhotoWrap}>
              {resident.profile_photo_url ? (
                <img
                  src={resident.profile_photo_url}
                  alt={resident.name}
                  style={styles.profilePhoto}
                />
              ) : (
                <div style={styles.profilePlaceholder}>
                  {resident.name?.charAt(0) || "R"}
                </div>
              )}
            </div>
            <h1 style={styles.name}>{resident.name}</h1>
            {infoLine && <p style={styles.subline}>{infoLine}</p>}
          </section>

          <section style={styles.bioCard}>
            <h3 style={styles.bioTitle}>About {resident.name?.split(" ")[0]}</h3>
            <p style={styles.bioText}>
              {resident.short_bio ||
                "No biography has been added yet. You can describe this resident’s hobbies, interests, and special memories here."}
            </p>
          </section>

          <section style={styles.tabsSection}>
            <button
              style={{
                ...styles.tabButton,
                ...(activeTab === "photos" ? styles.tabActive : {}),
              }}
              onClick={() => setActiveTab("photos")}
            >
              Photos ({photosCount})
            </button>
            <button
              style={{
                ...styles.tabButton,
                ...(activeTab === "videos" ? styles.tabActive : {}),
              }}
              onClick={() => setActiveTab("videos")}
            >
              Videos ({videosCount})
            </button>
            <button
              style={{
                ...styles.tabButton,
                ...(activeTab === "stories" ? styles.tabActive : {}),
              }}
              onClick={() => setActiveTab("stories")}
            >
              Stories ({storiesCount})
            </button>
          </section>

          <section style={styles.contentSection}>{renderTabContent()}</section>

          <p style={styles.bottomPrivacyNote}>
            For privacy, please do not screenshot or share without permission.
          </p>
        </div>

        <div style={styles.scrollControls}>
          <button onClick={scrollToTop} style={styles.scrollBtn}>↑</button>
          <button onClick={scrollToBottom} style={styles.scrollBtn}>↓</button>
        </div>
      </div>
    </AdminLayout>
  );
}


// ---------------- STYLES ----------------
const styles = {
  page: { width: "100%", position: "relative" },

  container: {
    maxWidth: "100%",
    margin: "0 auto",
    backgroundColor: "#fff",
    borderRadius: "18px",
    padding: "16px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
  },

  centerWrap: {
    minHeight: "60vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },

  loading: { fontSize: "16px", color: "#777" },
  error: { color: "#b00", marginBottom: "8px" },

  privacyBanner: {
    margin: "0 auto 12px",
    backgroundColor: "#fff4e6",
    padding: "8px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    textAlign: "center",
    color: "#8a4b08",
    border: "1px solid #ffd9a8",
  },

  profileSection: { textAlign: "center", marginBottom: "16px" },

  profilePhotoWrap: { display: "flex", justifyContent: "center" },

  profilePhoto: {
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    objectFit: "cover",
  },

  profilePlaceholder: {
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    backgroundColor: "#ffe3cf",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "36px",
    color: "#a66a3f",
    fontWeight: "bold",
  },

  name: { fontSize: "20px", margin: "6px 0 4px", fontWeight: "700" },
  subline: { fontSize: "13px", color: "#666" },

  bioCard: {
    backgroundColor: "#f9f4ff",
    borderRadius: "14px",
    padding: "12px",
    marginBottom: "16px",
  },

  bioTitle: { margin: "0 0 6px", fontSize: "15px" },
  bioText: { margin: 0, fontSize: "14px", lineHeight: 1.5 },

  tabsSection: {
    display: "flex",
    justifyContent: "space-around",
    borderBottom: "1px solid #eee",
    marginBottom: "12px",
  },

  tabButton: {
    background: "transparent",
    border: "none",
    padding: "8px",
    fontSize: "13px",
    cursor: "pointer",
    color: "#777",
  },

  tabActive: { color: "#4b3b73", fontWeight: "600" },

  contentSection: { minHeight: "120px" },

  /* ✅ MOBILE GRID */
  grid: {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
  gap: "12px",
},

card: {
  width: "100%",
  aspectRatio: "1 / 1",          // ✅ FORCE SQUARE
  borderRadius: "14px",
  overflow: "hidden",
  backgroundColor: "#000",
  cursor: "pointer",

  transition: "transform 0.25s ease, box-shadow 0.25s ease",
},

thumbMedia: {
  width: "100%",
  height: "100%",
  objectFit: "cover",
},

  storyList: { display: "flex", flexDirection: "column", gap: "10px" },

  storyCard: {
    backgroundColor: "#fafafa",
    borderRadius: "12px",
    padding: "10px",
  },

  storyTitle: { margin: "0 0 4px", fontSize: "14px" },
  storyContent: { margin: 0, fontSize: "13px", color: "#555" },

  emptyText: {
    fontSize: "13px",
    color: "#888",
    textAlign: "center",
    marginTop: "10px",
  },

  bottomPrivacyNote: {
    marginTop: "20px",
    fontSize: "12px",
    textAlign: "center",
    color: "#777",
    fontStyle: "italic",
  },

  scrollControls: {
    position: "fixed",
    right: "14px",
    bottom: "30px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },

  scrollBtn: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    border: "none",
    backgroundColor: "#f0e2ff",
    color: "#4b3b73",
    fontWeight: "bold",
    cursor: "pointer",
  },
};
