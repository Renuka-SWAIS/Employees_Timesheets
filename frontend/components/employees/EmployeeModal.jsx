"use client";

import { useState } from "react";
import { uploadEmployeePhoto } from "../../services/employee";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function EmployeeModal({
  employee,
  onClose,
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  if (!employee) return null;

  async function handleUpload() {
    if (!selectedFile) {
      alert("Please select an image.");
      return;
    }

    try {
      setUploading(true);

      await uploadEmployeePhoto(
        employee.EmployeeID,
        selectedFile
      );

      alert("Photo uploaded successfully!");

      window.location.reload();

    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
      }}
    >
      <div
        style={{
          width: "520px",
          background: "#fff",
          padding: "30px",
          borderRadius: "12px",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>
          Employee Details
        </h2>

        {/* Employee Photo */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <img
            src={
              employee.PhotoURL
                ? `${API_URL}${employee.PhotoURL}`
                : "/default-avatar.png"
            }
            alt="Employee"
            style={{
              width: "130px",
              height: "130px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "3px solid #2563eb",
            }}
          />
        </div>

        <hr style={{ marginBottom: "20px" }} />

        <p><strong>Employee Code:</strong> {employee.EmployeeCode}</p>

        <p><strong>Name:</strong> {employee.EmployeeName}</p>

        <p><strong>Email:</strong> {employee.EmailID}</p>

        <p><strong>Department:</strong> {employee.Department}</p>

        <p><strong>Designation:</strong> {employee.Designation}</p>

        <p><strong>Role:</strong> {employee.RoleType}</p>

        <p><strong>Status:</strong> {employee.Status}</p>

        <hr style={{ margin: "20px 0" }} />

        <h3 style={{ marginBottom: "10px" }}>
          Upload Photo
        </h3>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files.length > 0) {
              setSelectedFile(e.target.files[0]);
            }
          }}
        />

        <div
          style={{
            marginTop: "15px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <button
            onClick={handleUpload}
            disabled={uploading}
            style={{
              background: "#16a34a",
              color: "#fff",
              border: "none",
              padding: "10px 20px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            {uploading ? "Uploading..." : "Upload Photo"}
          </button>

          <button
            onClick={onClose}
            style={{
              background: "#2563eb",
              color: "#fff",
              border: "none",
              padding: "10px 20px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}