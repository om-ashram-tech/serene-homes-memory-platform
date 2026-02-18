import React, { useState } from "react";
import api from "../api";
import AdminLayout from "../layouts/AdminLayout";
import { useNavigate } from "react-router-dom";

/* ✅ Cloudinary Config (kept as you wrote) */
const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET;


export default function CreateResident() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    age: "",
    gender: "",
    roomNumber: "",
    yearOfAdmission: "",     // ✅ NEW
    catchyPhrase: "",        // ✅ NEW
    shortBio: "",
    profilePhotoUrl: "",
    profilePhotoFile: null,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ✅ Upload to Cloudinary */
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!res.ok) throw new Error("Cloudinary upload failed");

    const data = await res.json();
    return data.secure_url;
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // ✅ Required validation
      if (
        !form.firstName.trim() ||
        !form.lastName.trim() ||
        !form.gender ||
        !form.catchyPhrase.trim()
      ) {
        setMessage("Please fill all required fields.");
        setLoading(false);
        return;
      }

      if (!form.profilePhotoFile) {
        setMessage("Profile photo is required.");
        setLoading(false);
        return;
      }

      // ✅ Validate Year
      if (form.yearOfAdmission) {
        const year = Number(form.yearOfAdmission);
        const currentYear = new Date().getFullYear();

        if (year < 1900 || year > currentYear) {
          setMessage("Please enter a valid admission year.");
          setLoading(false);
          return;
        }
      }

      // ✅ Upload image
      const photoUrl = await uploadToCloudinary(form.profilePhotoFile);

      // ✅ Clean full name properly
      const fullName = [
        form.firstName,
        form.middleName,
        form.lastName,
      ]
        .filter(Boolean)
        .join(" ")
        .trim();

      // ✅ SEND EXACT FIELD NAMES YOUR BACKEND EXPECTS
      await api.post("/residents", {
        name: fullName,
        age: form.age ? Number(form.age) : null,
        gender: form.gender,
        shortBio: form.shortBio || "",
        roomNumber: form.roomNumber || "",
        yearOfAdmission: form.yearOfAdmission
          ? Number(form.yearOfAdmission)
          : null,
        catchyPhrase: form.catchyPhrase || "",
        profilePhotoUrl: photoUrl,
        extraPhotos: [],
      });


      setShowSuccess(true);

    } catch (err) {
      console.error("Create resident failed:", err);
      setMessage(
        err?.response?.data?.message ||
        "Failed to create resident."
      );
    } finally {
      setLoading(false);
    }
  };



  return (
    <AdminLayout>
      <div style={styles.page}>
        <div style={styles.card}>
          <h1 style={styles.title}>Add New Resident</h1>
          <p style={styles.subtitle}>
            Fill in the information below to create a new memory profile.
          </p>

          <form onSubmit={submit} style={styles.form}>
            
            {/* NAME ROW */}
            <div style={styles.nameRow}>
              <div style={styles.field}>
                <label style={styles.label}>First Name *</label>
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                  placeholder="First name"
                  style={styles.input}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Middle Name</label>
                <input
                  name="middleName"
                  value={form.middleName}
                  onChange={handleChange}
                  placeholder="Middle name"
                  style={styles.input}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Last Name *</label>
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                  placeholder="Last name"
                  style={styles.input}
                />
              </div>
            </div>

            {/* AGE + GENDER */}
            <div style={styles.row}>
              <div style={styles.field}>
                <label style={styles.label}>Age</label>
                <input
                  type="number"
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  placeholder="78"
                  style={styles.input}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Gender*</label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  required
                  style={styles.select}
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* ROOM NUMBER (kept)
            <label style={styles.label}>Room Number *</label>
            <input
              name="roomNumber"
              value={form.roomNumber}
              onChange={handleChange}
              placeholder="Example: 204"
              style={styles.input}
            /> */}

            {/* YEAR OF ADMISSION */}
            <label style={styles.label}>Year of Admission</label>
            <input
              type="number"
              name="yearOfAdmission"
              value={form.yearOfAdmission}
              onChange={handleChange}
              placeholder="Example: 2022"
              style={styles.input}
            />

            {/* CATCHY PHRASE */}
            <label style={styles.label}>Catchy Phrase</label>
            <input
              name="catchyPhrase"
              value={form.catchyPhrase}
              onChange={handleChange}
              required
              placeholder="Example: A heart full of wisdom and kindness"
              style={styles.input}
            />

            {/* SHORT BIO */}
            <label style={styles.label}>Short Bio</label>
            <textarea
              name="shortBio"
              value={form.shortBio}
              onChange={handleChange}
              placeholder="Write a short description..."
              style={styles.textarea}
            />

            {/* PROFILE PHOTO */}
            <label style={styles.label}>Profile Photo *</label>
            <input
              type="file"
              accept="image/*"
              style={styles.input}
              onChange={(e) =>
                setForm({ ...form, profilePhotoFile: e.target.files[0] })
              }
            />

            {form.profilePhotoFile && (
              <img
                src={URL.createObjectURL(form.profilePhotoFile)}
                alt="Preview"
                style={styles.previewImage}
              />
            )}

            {message && <p style={styles.message}>{message}</p>}

            <button type="submit" style={styles.submitBtn} disabled={loading}>
              {loading ? "Creating..." : "Create Resident"}
            </button>
          </form>
        </div>
      </div>

      {showSuccess && (
        <div style={styles.overlay}>
          <div style={styles.popup}>
            <h2 style={{ marginBottom: "16px", color: "#7a0000" }}>
              Resident Created Successfully!
            </h2>
            <p style={{ marginBottom: "24px", color: "#555" }}>
              The new resident profile has been added.
            </p>
            <button
              style={styles.popupBtn}
              onClick={() => {
                setShowSuccess(false);
                navigate("/admin/residents-list");
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


/* ------------------------- STYLES ------------------------- */

const styles = {
  page: {
    display: "flex",
    justifyContent: "center",
  },
  card: {
    width: "800px",
    background: "white",
    padding: "40px",
    borderRadius: "20px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  },
  title: {
    margin: 0,
    fontSize: "28px",
    fontWeight: "700",
    color: "#072629",
  },
  subtitle: {
    marginTop: "8px",
    marginBottom: "24px",
    color: "#555",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  nameRow: {
    display: "flex",
    gap: "16px",
    marginBottom: "18px",
  },
  row: {
    display: "flex",
    gap: "16px",
    marginBottom: "18px",
    alignItems: "flex-end",
  },
  field: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  label: {
    marginBottom: "6px",
    fontWeight: "600",
    color: "#333",
    marginTop: "12px",
  },
  input: {
    padding: "14px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    fontSize: "16px",
    height: "52px",
    boxSizing: "border-box",
  },
  select: {
    padding: "14px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    fontSize: "16px",
    height: "52px",
    background: "white",
    boxSizing: "border-box",
  },
  textarea: {
    padding: "14px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    minHeight: "100px",
    fontSize: "16px",
    marginBottom: "18px",
  },
  submitBtn: {
    background: "#7a0000",
    color: "white",
    padding: "16px",
    border: "none",
    borderRadius: "16px",
    fontSize: "18px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "12px",
  },
  previewImage: {
    marginTop: "12px",
    width: "120px",
    height: "120px",
    borderRadius: "12px",
    objectFit: "cover",
    border: "2px solid #ddd",
  },
  message: {
    marginBottom: "16px",
    color: "#7a0000",
    fontWeight: "600",
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },

  popup: {
    background: "white",
    padding: "40px",
    borderRadius: "20px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
    textAlign: "center",
    width: "400px",
  },

  popupBtn: {
    background: "#7a0000",
    color: "white",
    padding: "12px 24px",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },

};
