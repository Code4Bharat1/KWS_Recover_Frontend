import React, { useState } from "react";
import axios from "axios";

const UploadForm = () => {
  const [KWS_ID, setKWS_ID] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle file selection and generate preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePhoto(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!KWS_ID || !profilePhoto) {
      setMessage("Please fill all fields");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("KWS_ID", KWS_ID);
    formData.append("profilePhoto", profilePhoto);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setMessage(res.data.message);
      setKWS_ID("");
      setProfilePhoto(null);
      setPreview(null);
    } catch (err) {
      setMessage("Upload failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f7fa",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "#fff",
          padding: "40px 30px",
          borderRadius: "12px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
          width: "360px",
          gap: "20px",
        }}
      >
        <h2 style={{ textAlign: "center", color: "#333" }}>Upload Profile</h2>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label
            htmlFor="kws_id"
            style={{ marginBottom: "5px", color: "#555", fontWeight: "500" }}
          >
            KWS ID
          </label>
          <input
            id="kws_id"
            type="text"
            value={KWS_ID}
            onChange={(e) => setKWS_ID(e.target.value)}
            placeholder="Enter KWS ID"
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              outline: "none",
              fontSize: "14px",
              transition: "border 0.2s",
            }}
            onFocus={(e) => (e.target.style.border = "1px solid #007aff")}
            onBlur={(e) => (e.target.style.border = "1px solid #ccc")}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <label
            htmlFor="profile_photo"
            style={{ marginBottom: "5px", color: "#555", fontWeight: "500" }}
          >
            Profile Photo
          </label>
          <input
            id="profile_photo"
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            style={{
              padding: "6px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              outline: "none",
              cursor: "pointer",
            }}
          />
        </div>

        {preview && (
          <div
            style={{
              marginTop: "10px",
              textAlign: "center",
            }}
          >
            <p style={{ color: "#555", marginBottom: "5px" }}>Preview:</p>
            <img
              src={preview}
              alt="Preview"
              style={{
                width: "120px",
                height: "120px",
                objectFit: "cover",
                borderRadius: "12px",
                border: "1px solid #ccc",
                margin: "0 auto",
              }}
            />
          </div>
        )}

        <button
          type="submit"
          style={{
            padding: "12px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#007aff",
            color: "#fff",
            fontWeight: "600",
            fontSize: "16px",
            cursor: "pointer",
            transition: "background 0.3s, transform 0.2s",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#005ecb";
            e.target.style.transform = "scale(1.02)";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#007aff";
            e.target.style.transform = "scale(1)";
          }}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>

        {message && (
          <p
            style={{
              textAlign: "center",
              marginTop: "10px",
              color: message.includes("failed") ? "red" : "green",
              fontWeight: "500",
            }}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default UploadForm;
