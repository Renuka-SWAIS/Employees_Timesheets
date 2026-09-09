"use client";

import { useState } from "react";

export default function EditProfileModal({
  employee,
  onClose,
  onSave,
}) {
  const [name, setName] = useState(
    employee.EmployeeName || ""
  );

  const [department, setDepartment] = useState(
    employee.Department || ""
  );

  const [designation, setDesignation] = useState(
    employee.Designation || ""
  );

  const handleSave = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Name is required.");
      return;
    }

    if (!department.trim()) {
      alert("Department is required.");
      return;
    }

    if (!designation.trim()) {
      alert("Designation is required.");
      return;
    }

    onSave({
      EmployeeName: name.trim(),
      Department: department.trim(),
      Designation: designation.trim(),
    });
  };

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
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          background: "#fff",
          width: "450px",
          maxWidth: "100%",
          borderRadius: "12px",
          padding: "25px",
          boxShadow: "0 5px 20px rgba(0,0,0,.2)",
          boxSizing: "border-box",
        }}
      >
        <form onSubmit={handleSave}>
          <h2
            style={{
              margin: "0 0 20px 0",
              color: "#111827",
            }}
          >
            Edit Profile
          </h2>

          {/* NAME */}
          <div style={{ marginBottom: "15px" }}>
            <label
              style={{
                display: "block",
                fontWeight: "600",
                marginBottom: "5px",
                color: "#111827",
              }}
            >
              Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Enter name"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                boxSizing: "border-box",
                fontSize: "14px",
                outline: "none",
              }}
            />
          </div>

          {/* DEPARTMENT */}
          <div style={{ marginBottom: "15px" }}>
            <label
              style={{
                display: "block",
                fontWeight: "600",
                marginBottom: "5px",
                color: "#111827",
              }}
            >
              Department
            </label>

            <input
              type="text"
              value={department}
              onChange={(e) =>
                setDepartment(e.target.value)
              }
              placeholder="Enter department"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                boxSizing: "border-box",
                fontSize: "14px",
                outline: "none",
              }}
            />
          </div>

          {/* DESIGNATION */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontWeight: "600",
                marginBottom: "5px",
                color: "#111827",
              }}
            >
              Designation
            </label>

            <input
              type="text"
              value={designation}
              onChange={(e) =>
                setDesignation(e.target.value)
              }
              placeholder="Enter designation"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                boxSizing: "border-box",
                fontSize: "14px",
                outline: "none",
              }}
            />
          </div>

          {/* BUTTONS */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
            }}
          >
            {/* CANCEL */}
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "10px 20px",
                border: "none",
                borderRadius: "8px",
                background: "#ddd",
                color: "#111827",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Cancel
            </button>

            {/* SAVE */}
            <button
              type="submit"
              style={{
                padding: "10px 20px",
                border: "none",
                borderRadius: "8px",
                background: "#2563eb",
                color: "#fff",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}