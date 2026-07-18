"use client";

import { useState } from "react";

export default function EditProfileModal({
  employee,
  onClose,
  onSave,
}) {
  const [name, setName] = useState(employee.EmployeeName);
  const [department, setDepartment] = useState(employee.Department);
  const [designation, setDesignation] = useState(employee.Designation);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "30px",
          borderRadius: "12px",
          width: "450px",
          boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>
          Edit Profile
        </h2>

        <div style={{ marginBottom: "15px" }}>
          <label>Name</label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "5px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Department</label>

          <input
            type="text"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "5px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>Designation</label>

          <input
            type="text"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "5px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "10px 20px",
              border: "none",
              borderRadius: "8px",
              background: "#ccc",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>

          <button
            onClick={() =>
              onSave({
                EmployeeName: name,
                Department: department,
                Designation: designation,
              })
            }
            style={{
              padding: "10px 20px",
              border: "none",
              borderRadius: "8px",
              background: "#2563eb",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}