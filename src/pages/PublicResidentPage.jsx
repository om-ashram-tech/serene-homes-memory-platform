// src/pages/PublicResidentPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function PublicResidentPage() {
  const { token } = useParams();

  const [resident, setResident] = useState(null);
  const [tab, setTab] = useState("photos");
  const [media, setMedia] = useState({ photos: [], videos: [], stories: [] });
  const [error, setError] = useState("");
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    loadResident();
  }, [token]);

  const loadResident = async () => {
    try {
      const res = await fetch(`/.netlify/functions/accessTemp?token=${token}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid or expired link.");
        return;
      }

      setResident(data);
      loadMedia(data._id);
    } catch {
      setError("Unable to load this private memory page.");
    }
  };

  const loadMedia = async (id) => {
    try {
      const res = await fetch(`/.netlify/functions/media?residentId=${id}`);
      const all = await res.json();

      setMedia({
        photos: all.filter((m) => m.type === "photo"),
        videos: all.filter((m) => m.type === "video"),
        stories: all.filter((m) => m.type === "story"),
      });
    } catch {
      console.error("Media load failed");
    }
  };

  if (error) {
    return (
      <div style={styles.center}>
        <h2>{error}</h2>
        <p>Please contact the care home for access.</p>
      </div>
    );
  }

  if (!resident) {
    return <p style={styles.center}>Loading memory page…</p>;
  }

  return (
    <div style={styles.page}>
      {/* Privacy Banner */}
      <div style={styles.banner}>
        🔒 This is a private family memory page.  
        Please do not screenshot or share.
      </div>

      {/* Profile */}
      <div style={styles.profile}>
        <img
          src={resident.profile_photo_url}
          alt={resident.name}
          style={styles.avatar}
        />

        <h1 style={styles.name}>{resident.name}</h1>

        <p style={styles.meta}>
          {resident.gender || "--"}

          {resident.year_of_admission && (
            <> • Since {resident.year_of_admission}</>
          )}

          
        </p>

      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        {["photos", "videos", "stories"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={tab === t ? styles.tabActive : styles.tab}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)} (
            {media[t].length})
          </button>
        ))}
      </div>

      {/* MEDIA GRID */}
      <div style={styles.mediaGrid}>
        {/* PHOTOS */}
        {tab === "photos" &&
          media.photos.map((p) => (
            <div
              key={p._id}
              style={styles.mediaCard}
              onClick={() => setLightbox(p.url)}
            >
              <img src={p.url} alt="" style={styles.mediaItem} />
            </div>
          ))}

        {/* VIDEOS */}
        {tab === "videos" &&
          media.videos.map((v) => (
            <div key={v._id} style={styles.mediaCard}>
              <video
                style={styles.mediaItem}
                controls
                controlsList="nodownload noremoteplayback"
              >
                <source src={v.url} />
              </video>
            </div>
          ))}

        {/* STORIES */}
        {tab === "stories" &&
          media.stories.map((s) => (
            <div key={s._id} style={styles.storyCard}>
              <h4 style={styles.storyTitle}>{s.title}</h4>
              <p style={styles.storyText}>{s.content}</p>
            </div>
          ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div style={styles.lightbox} onClick={() => setLightbox(null)}>
          <img src={lightbox} style={styles.lightboxImg} alt="" />
        </div>
      )}
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const styles = {
  page: {
    minHeight: "100vh",
    background: "#fff7f1",
    padding: "16px",
    paddingBottom: "60px",
  },

  banner: {
    background: "#fff3cd",
    color: "#856404",
    padding: "12px",
    borderRadius: "12px",
    textAlign: "center",
    fontSize: "14px",
    marginBottom: "18px",
  },

  profile: {
    background: "#ffffff",
    borderRadius: "18px",
    padding: "20px",
    textAlign: "center",
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
    marginBottom: "20px",
  },

  avatar: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: "12px",
  },

  name: {
    margin: 0,
    fontSize: "22px",
    fontWeight: "700",
    color: "#7a0000",
  },

  meta: {
    fontSize: "14px",
    color: "#666",
    marginTop: "4px",
  },

  bio: {
    marginTop: "14px",
    fontSize: "15px",
    color: "#444",
    lineHeight: "1.6",
  },

  tabs: {
    display: "flex",
    justifyContent: "space-around",
    marginBottom: "14px",
  },

  tab: {
    padding: "8px 12px",
    borderRadius: "20px",
    border: "1px solid #ccc",
    background: "#fff",
    fontSize: "13px",
  },

  tabActive: {
    padding: "8px 12px",
    borderRadius: "20px",
    background: "#7a0000",
    color: "#fff",
    fontSize: "13px",
    border: "none",
  },

  /* ✅ FIXED GRID */
  mediaGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "12px",
  },

  mediaCard: {
    width: "100%",
    aspectRatio: "1 / 1",
    background: "#000",
    borderRadius: "12px",
    overflow: "hidden",
  },

  mediaItem: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  storyCard: {
    background: "#ffffff",
    padding: "14px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
    gridColumn: "1 / -1",
  },

  storyTitle: {
    margin: 0,
    fontSize: "16px",
    fontWeight: "600",
  },

  storyText: {
    marginTop: "6px",
    fontSize: "14px",
    color: "#444",
    lineHeight: "1.6",
  },

  lightbox: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.8)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },

  lightboxImg: {
    maxWidth: "90%",
    maxHeight: "90%",
    borderRadius: "12px",
  },

  center: {
    textAlign: "center",
    padding: "40px",
  },
};
