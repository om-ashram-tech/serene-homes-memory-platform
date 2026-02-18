import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import "./residenttemp.css";

export default function ResidentTempPage() {
  const { token } = useParams();
  const [resident, setResident] = useState(null);
  const [media, setMedia] = useState([]);
  const [stories, setStories] = useState([]);
  const [tab, setTab] = useState("photos");
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/.netlify/functions/accessTemp?token=${token}`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Invalid or expired link");
          return;
        }

        setResident(data);

        // load media + stories (reuse your APIs)
        const mediaRes = await api.get(`/media?residentId=${data._id}`);
        setMedia(mediaRes.data || []);

        const storyRes = await api.get(`/stories?residentId=${data._id}`);
        setStories(storyRes.data || []);
      } catch {
        setError("Unable to load this private page.");
      }
    };

    if (token) load();
  }, [token]);

  if (error) {
    return (
      <div className="public-wrapper">
        <h2>{error}</h2>
      </div>
    );
  }

  if (!resident) {
    return <p className="loading">Loading…</p>;
  }

  const photos = media.filter((m) => m.type === "photo");
  const videos = media.filter((m) => m.type === "video");

  return (
    <div className="public-wrapper">
      {/* Privacy Banner */}
      <div className="privacy-banner">
        🔒 This is a private family memory page. Please respect privacy and do not
        share without permission.
      </div>

      {/* Profile Card */}
      <div className="profile-card">
        <img
          src={resident.profile_photo_url}
          alt={resident.name}
          className="profile-avatar"
        />
        <h2>{resident.name}</h2>
        <p className="meta">
          {resident.age && <>Age {resident.age}</>}
          
          {resident.age && resident.gender && " • "}
          
          {resident.gender}
          
          {(resident.age || resident.gender) && resident.year_of_admission && " • "}
          
          {resident.year_of_admission && (
            <>Year of Admission :  {resident.year_of_admission}</>
          )}
        </p>


      </div>

      {/* About */}
      <div className="about-card">
        <h3>About {resident.name}</h3>
        <p>
          {resident.short_bio ||
            "No biography has been added yet. You can describe this resident’s hobbies, interests, and special memories here."}
        </p>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={tab === "photos" ? "active" : ""}
          onClick={() => setTab("photos")}
        >
          Photos ({photos.length})
        </button>
        <button
          className={tab === "videos" ? "active" : ""}
          onClick={() => setTab("videos")}
        >
          Videos ({videos.length})
        </button>
        <button
          className={tab === "stories" ? "active" : ""}
          onClick={() => setTab("stories")}
        >
          Stories ({stories.length})
        </button>
      </div>

      {/* Content */}
      <div className="tab-content">
        {tab === "photos" && (
          <div className="media-grid">
            {photos.map((p) => (
              <img
                key={p._id}
                src={p.url}
                alt=""
                style={{
                  width: "100%",
                  // maxWidth: "160px",   // ✅ LIMIT SIZE
                  aspectRatio: "1 / 1",
                  objectFit: "cover",
                  borderRadius: "14px",
                }}
              />

            ))}
          </div>
        )}

        {tab === "videos" && (
          <div className="media-grid">
            {videos.map((v) => (
              <video key={v._id} src={v.url} controls />
            ))}
          </div>
        )}

        {tab === "stories" && (
          <div className="story-list">
            {stories.map((s) => (
              <div key={s._id} className="story-card">
                <h4>{s.title}</h4>
                <p>{s.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
