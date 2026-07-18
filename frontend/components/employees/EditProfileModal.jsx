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

  const handleSave = () => {
    onSave({
      EmployeeName: name,
      Department: department,
      Designation: designation,
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
      }}
    >
      <div
        style={{
          background: "#fff",
          width: 450,
          borderRadius: 12,
          padding: 25,
          boxShadow: "0 5px 20px rgba(0,0,0,.2)",
        }}
      >
        <h2
          style={{
            marginBottom: 20,
          }}
        >
          Edit Profile
        </h2>

        <div style={{ marginBottom: 15 }}>
          <label>Name</label>

          <input
            type="text"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            style={{
              width: "100%",
              padding: 10,
              marginTop: 5,
              borderRadius: 8,
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div style={{ marginBottom: 15 }}>
          <label>Department</label>

          <input
            type="text"
            value={department}
            onChange={(e) =>
              setDepartment(e.target.value)
            }
            style={{
              width: "100%",
              padding: 10,
              marginTop: 5,
              borderRadius: 8,
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label>Designation</label>

          <input
            type="text"
            value={designation}
            onChange={(e) =>
              setDesignation(e.target.value)
            }
            style={{
              width: "100%",
              padding: 10,
              marginTop: 5,
              borderRadius: 8,
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "10px 20px",
              border: "none",
              borderRadius: 8,
              background: "#ddd",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            style={{
              padding: "10px 20px",
              border: "none",
              borderRadius: 8,
              background: "#2563eb",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}