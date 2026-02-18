// src/pages/ResidentAdminPage.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

import api from "../api.js";
import Tabs from "../components/Tabs.jsx";
import AdminLayout from "../layouts/AdminLayout";

const extractPublicId = (url) => {
  if (!url.includes("cloudinary.com")) return "";
  const parts = url.split("/upload/");
  if (parts.length < 2) return "";
  return parts[1].split(".")[0];
};

/* ✅ Cloudinary */
const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET;


/* ✅ Upload with Progress (Image + Video) */
const uploadToCloudinary = (file, onProgress) => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const xhr = new XMLHttpRequest();

    xhr.open(
      "POST",
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`
    );

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent);
      }
    };

    xhr.onload = () => {
      const data = JSON.parse(xhr.responseText);
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve({
          url: data.secure_url,
          publicId: data.public_id,
        });
      } else {
        console.error("Cloudinary error:", data);
        reject(new Error("Upload failed"));
      }
    };

    xhr.onerror = () => reject(new Error("Upload failed"));

    xhr.send(formData);
  });
};

export default function ResidentAdminPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedMediaId, setSelectedMediaId] = useState(null);
  const [showProfileSuccessPopup, setShowProfileSuccessPopup] = useState(false);



  const fileInputRef = useRef(null);

  const [resident, setResident] = useState(null);
  const [tab, setTab] = useState("photos");
  const [media, setMedia] = useState([]);
  const [stories, setStories] = useState([]);
  const [msg, setMsg] = useState("");

  const [uploadProgress, setUploadProgress] = useState(0);

  const [mediaForm, setMediaForm] = useState({
    url: "",
    title: "",
    description: "",
    file: null,
  });

  const [storyForm, setStoryForm] = useState({
    title: "",
    content: "",
    authorName: "",
  });
  const [profileForm, setProfileForm] = useState({
    bio: "",
    catchyPhrase: "",
    file: null,
  });

const profileFileRef = useRef(null);


  // ---------------- LOAD DATA ----------------

    const loadResident = async () => {
    const res = await api.get("/residents");
    const found = res.data.find((r) => r._id === id);
    setResident(found);

    setProfileForm((prev) => ({
      ...prev,
      bio: found?.short_bio || "",
      catchyPhrase: found?.catchy_phrase || "",
    }));
  };


  const loadMedia = async () => {
    const res = await api.get("/media", { params: { residentId: id } });
    setMedia(res.data);
  };

  const loadStories = async () => {
    const res = await api.get("/stories", { params: { residentId: id } });
    setStories(res.data);
  };

  useEffect(() => {
    loadResident();
    loadMedia();
    loadStories();
  }, [id]);

  // ---------------- ADD MEDIA ----------------

  const submitMedia = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      let uploaded = null;

      if (mediaForm.file) {
        setUploadProgress(0);
        uploaded = await uploadToCloudinary(mediaForm.file, setUploadProgress);
      }

      if (!uploaded && !mediaForm.url) {
        alert("Please upload file or enter URL");
        return;
      }

      await api.post("/media", {
        residentId: id,
        type: tab === "videos" ? "video" : "photo",
        url: uploaded ? uploaded.url : mediaForm.url,
        publicId: uploaded
          ? uploaded.publicId
          : extractPublicId(mediaForm.url),
        title: mediaForm.title,
        description: mediaForm.description,
      });

      setMediaForm({ url: "", title: "", description: "", file: null });
      if (fileInputRef.current) fileInputRef.current.value = "";

      setUploadProgress(0);
      await loadMedia();
      setShowSuccessPopup(true);

    } catch (err) {
      console.error(err);
      setMsg("Failed to add media ❌");
      setUploadProgress(0);
    }
  };

  // ---------------- ADD STORY ----------------

  const submitStory = async (e) => {
    e.preventDefault();
    setMsg("");

    if (!storyForm.content) {
      alert("Story content required");
      return;
    }

    try {
      await api.post("/stories", { ...storyForm, residentId: id });
      setStoryForm({ title: "", content: "", authorName: "" });
      await loadStories();
      setMsg("Story added successfully ✅");
    } catch (err) {
      console.error(err);
      setMsg("Failed to add story ❌");
    }
  };

  // ---------------- DELETE MEDIA ----------------

  const deleteMedia = (mediaId) => {
    setSelectedMediaId(mediaId);
    setShowDeletePopup(true);
  };
  if (!resident) return <p className="loading">Loading...</p>;
  const confirmDeleteMedia = async () => {
    try {
      await api.delete("/media", {
        data: { id: selectedMediaId },
      });

      await loadMedia();
      setShowDeletePopup(false);
      setSelectedMediaId(null);
    } catch (err) {
      console.error("Delete failed", err);
    }
  };



  

  // ---------------- DELETE STORY ----------------
  const deleteStory = async (storyId) => {
    if (!window.confirm("Delete this story permanently?")) return;

    try {
      await api.delete("/stories", {
        data: { id: storyId },
      });

      await loadStories(); // refresh list
    } catch (err) {
      console.error("Story delete failed", err);
      alert("Failed to delete story");
    }
  };

  // ---------------- UPDATE PROFILE ----------------
  const updateProfile = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      let uploaded = null;

      if (profileForm.file) {
        uploaded = await uploadToCloudinary(profileForm.file);
      }

      await api.put("/residents", {
        id: resident._id,
        short_bio: profileForm.bio,
        catchy_phrase: profileForm.catchyPhrase,
        profile_photo_url: uploaded
          ? uploaded.url
          : resident.profile_photo_url,
      });

      await loadResident();
      setProfileForm({ bio: profileForm.bio, file: null });
      if (profileFileRef.current) profileFileRef.current.value = "";

      setShowProfileSuccessPopup(true);

    } catch (err) {
      console.error(err);
      setMsg("Failed to update profile ❌");
    }
  };



  return (
    <AdminLayout>
      <section className="resident-admin">
        <div className="card">
          <h2>Manage {resident.name}</h2>

          {msg && <p className="success">{msg}</p>}

          <Tabs
            tabs={[
              { key: "profile", label: "Profile" },
              { key: "photos", label: "Photos" },
              { key: "videos", label: "Videos" },
              { key: "stories", label: "Stories" },
            ]}
            active={tab}
            onChange={setTab}
          />

          {/* ---------------- PROFILE ---------------- */}
          {tab === "profile" && (
            <div className="grid-2">
              <div>
                <h3>Edit Profile</h3>

                <form className="form" onSubmit={updateProfile}>
                  <label>Change Profile Photo</label>
                  <input
                    ref={profileFileRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        file: e.target.files[0],
                      })
                    }
                  />

                  <label>Bio</label>
                  <textarea
                    value={profileForm.bio}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, bio: e.target.value })
                    }
                  />
                  <label>Catchy Phrase</label>
                    <input
                      type="text"
                      value={profileForm.catchyPhrase}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          catchyPhrase: e.target.value,
                        })
                      }
                      placeholder="Example: A heart full of wisdom and kindness"
                    />


                  <button className="primary-btn" type="submit">
                    Update Profile
                  </button>
                </form>
              </div>

              <div>
                <h3>Current Profile</h3>

                {resident.profile_photo_url && (
                  <img
                    src={resident.profile_photo_url}
                    alt=""
                    style={{
                      width: "180px",
                      height: "180px",
                      objectFit: "cover",
                      borderRadius: "12px",
                      marginBottom: "10px",
                    }}
                  />
                )}
                {/* ✅ ADD THIS */}
                {resident.catchy_phrase && (
                  <p
                    style={{
                      fontStyle: "italic",
                      color: "#7a0000",
                      marginBottom: "8px",
                    }}
                  >
                    "{resident.catchy_phrase}"
                  </p>
                )}

                <p>{resident.short_bio || "No bio added yet."}</p>
              </div>
            </div>
          )}


          {/* ---------------- PHOTOS ---------------- */}
          {tab === "photos" && (
            <div className="grid-2">
              <div>
                <h3>Add Photo</h3>

                <form className="form" onSubmit={submitMedia}>
                  <label>
                    Upload Photo
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setMediaForm({
                          ...mediaForm,
                          file: e.target.files[0],
                        })
                      }
                    />
                  </label>

                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div style={{ marginTop: "8px" }}>
                      <div style={{ fontSize: "12px" }}>
                        Uploading: {uploadProgress}%
                      </div>
                      <div
                        style={{
                          height: "6px",
                          background: "#ddd",
                          borderRadius: "4px",
                        }}
                      >
                        <div
                          style={{
                            width: `${uploadProgress}%`,
                            height: "100%",
                            background: "#4caf50",
                            borderRadius: "4px",
                            transition: "width 0.2s",
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <label>Title</label>
                  <input
                    value={mediaForm.title}
                    onChange={(e) =>
                      setMediaForm({ ...mediaForm, title: e.target.value })
                    }
                  />

                  <label>Description</label>
                  <textarea
                    value={mediaForm.description}
                    onChange={(e) =>
                      setMediaForm({
                        ...mediaForm,
                        description: e.target.value,
                      })
                    }
                  />

                  <button className="primary-btn" type="submit">
                    Add Photo
                  </button>
                </form>
              </div>


              <div style={{ marginTop: "24px" }}>
                <h3>Existing Photos</h3>

                <div
                  className="photo-grid"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "16px",
                  }}
                >
                  {media
                    .filter((m) => m.type === "photo")
                    .map((m) => (
                      <div key={m._id} className="photo-card">
                        <div
                          style={{
                            width: "100%",
                            aspectRatio: "1 / 1",
                            borderRadius: "12px",
                            overflow: "hidden",
                            background: "#000",
                          }}
                        >
                          <img
                            src={m.url}
                            alt=""
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </div>

                        <button
                          onClick={() => deleteMedia(m._id)}
                          style={{
                            marginTop: "8px",
                            background: "#b00000",
                            color: "white",
                            border: "none",
                            padding: "6px 12px",
                            borderRadius: "6px",
                            cursor: "pointer",
                          }}
                        >
                          🗑 Delete
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* ---------------- VIDEOS ---------------- */}
          {/* ---------------- VIDEOS ---------------- */}
          {tab === "videos" && (
            <>
              {/* ADD VIDEO FORM (LEFT COLUMN) */}
              <div className="grid-2">
                <div>
                  <h3>Add Video</h3>

                  <form className="form" onSubmit={submitMedia}>
                    <label>
                      Upload Video
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="video/*"
                        onChange={(e) =>
                          setMediaForm({
                            ...mediaForm,
                            file: e.target.files[0],
                          })
                        }
                      />
                    </label>

                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <div style={{ marginTop: "8px" }}>
                        <div style={{ fontSize: "12px" }}>
                          Uploading: {uploadProgress}%
                        </div>
                        <div
                          style={{
                            height: "6px",
                            background: "#ddd",
                            borderRadius: "4px",
                          }}
                        >
                          <div
                            style={{
                              width: `${uploadProgress}%`,
                              height: "100%",
                              background: "#4caf50",
                              borderRadius: "4px",
                            }}
                          />
                        </div>
                      </div>
                    )}

                    <label>Title</label>
                    <input
                      value={mediaForm.title}
                      onChange={(e) =>
                        setMediaForm({ ...mediaForm, title: e.target.value })
                      }
                    />

                    <label>Description</label>
                    <textarea
                      value={mediaForm.description}
                      onChange={(e) =>
                        setMediaForm({
                          ...mediaForm,
                          description: e.target.value,
                        })
                      }
                    />

                    <button className="primary-btn" type="submit">
                      Add Video
                    </button>
                  </form>
                </div>
              </div>

              {/* EXISTING VIDEOS — FULL WIDTH */}
              <div style={{ marginTop: "28px" }}>
                <h3>Existing Videos</h3>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "16px",
                  }}
                >
                  {media
                    .filter((m) => m.type === "video")
                    .map((m) => (
                      <div key={m._id}>
                        <div
                          style={{
                            width: "100%",
                            aspectRatio: "1 / 1",
                            background: "#000",
                            borderRadius: "12px",
                            overflow: "hidden",
                          }}
                        >
                          <video
                            src={m.url}
                            controls
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </div>

                        <button
                          onClick={() => deleteMedia(m._id)}
                          style={{
                            marginTop: "8px",
                            background: "#b00000",
                            color: "white",
                            border: "none",
                            padding: "6px 12px",
                            borderRadius: "6px",
                            cursor: "pointer",
                          }}
                        >
                          🗑 Delete
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            </>
          )}


          {/* ---------------- STORIES ---------------- */}
          {tab === "stories" && (
            <div className="grid-2">
              <div>
                <h3>Add Story</h3>

                <form className="form" onSubmit={submitStory}>
                  <label>Title</label>
                  <input
                    value={storyForm.title}
                    onChange={(e) =>
                      setStoryForm({ ...storyForm, title: e.target.value })
                    }
                  />

                  <label>Author Name</label>
                  <input
                    value={storyForm.authorName}
                    onChange={(e) =>
                      setStoryForm({
                        ...storyForm,
                        authorName: e.target.value,
                      })
                    }
                  />

                  <label>Content*</label>
                  <textarea
                    required
                    value={storyForm.content}
                    onChange={(e) =>
                      setStoryForm({
                        ...storyForm,
                        content: e.target.value,
                      })
                    }
                  />

                  <button className="primary-btn" type="submit">
                    Add Story
                  </button>
                </form>
              </div>

              <div>
                <h3>Existing Stories</h3>
                <ul className="simple-list">
                  {stories.map((s) => (
                    <li key={s._id}>
                      <strong>{s.title || "Memory"}</strong> –{" "}
                      {s.authorName || "Anonymous"}
                      <br />

                      <button
                        onClick={() => deleteStory(s._id)}
                        style={{
                          marginTop: "0px",
                          background: "#b00000",
                          color: "white",
                          border: "none",
                          padding: "4px 10px",
                          borderRadius: "6px",
                          cursor: "pointer",
                          marginBottom: "10px",
                        }}
                      >
                        🗑 Delete
                      </button>

                    </li>
                  ))}
                </ul>
              </div>
              
            </div>
          )}
          
          

        </div>
      </section>
      {showSuccessPopup && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "30px 40px",
              borderRadius: "12px",
              width: "360px",
              textAlign: "center",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            }}
          >
            <h3 style={{ color: "#2e7d32", marginBottom: "10px" }}>
               Media Added Successfully
            </h3>

            <p style={{ fontSize: "14px", marginBottom: "20px" }}>
              The media has been uploaded successfully.
            </p>

            <button
              onClick={() => {
                setShowSuccessPopup(false);
                navigate("/admin/residents");
              }}
              style={{
                background: "#b00000",
                color: "white",
                border: "none",
                padding: "8px 20px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
      {/* DELETE CONFIRM MODAL */}
      {showDeletePopup && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "30px 40px",
              borderRadius: "12px",
              width: "360px",
              textAlign: "center",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            }}
          >
            <h3 style={{ color: "#b00000", marginBottom: "10px" }}>
              ⚠ Delete Permanently?
            </h3>

            <p style={{ fontSize: "14px", marginBottom: "20px" }}>
              This action cannot be undone.
            </p>

            <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
              <button
                onClick={() => setShowDeletePopup(false)}
                style={{
                  background: "#ccc",
                  border: "none",
                  padding: "8px 20px",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>

              <button
                onClick={confirmDeleteMedia}
                style={{
                  background: "#b00000",
                  color: "white",
                  border: "none",
                  padding: "8px 20px",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PROFILE SUCCESS MODAL */}
      {showProfileSuccessPopup && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "30px 40px",
              borderRadius: "12px",
              width: "360px",
              textAlign: "center",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            }}
          >
            <h3 style={{ color: "#2e7d32", marginBottom: "10px" }}>
               Profile Updated Successfully
            </h3>

            <p style={{ fontSize: "14px", marginBottom: "20px" }}>
              The profile information has been updated.
            </p>

            <button
              onClick={() => setShowProfileSuccessPopup(false)}
              style={{
                background: "#b00000",
                color: "white",
                border: "none",
                padding: "8px 20px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}



    </AdminLayout>
  );
}
