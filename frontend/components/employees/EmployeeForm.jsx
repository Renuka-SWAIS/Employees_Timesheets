"use client";

import { useEffect, useState } from "react";

const initialState = {
  EmployeeCode: "",
  EmployeeName: "",
  EmailID: "",
  RoleType: "User",
  Department: "",
  Designation: "",
  Status: "Active",
};

export default function EmployeeForm({
  open,
  onClose,
  onSave,
  employee,
}) {
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (employee) {
      setForm({
        EmployeeCode: employee.EmployeeCode || "",
        EmployeeName: employee.EmployeeName || "",
        EmailID: employee.EmailID || "",
        RoleType: employee.RoleType || "User",
        Department: employee.Department || "",
        Designation: employee.Designation || "",
        Status: employee.Status || "Active",
      });
    } else {
      setForm(initialState);
    }
  }, [employee]);

  if (!open) return null;

  function handleChange(e) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.EmployeeCode.trim()) {
      alert("Employee Code is required");
      return;
    }

    if (!form.EmployeeName.trim()) {
      alert("Employee Name is required");
      return;
    }

    if (!form.EmailID.trim()) {
      alert("Email is required");
      return;
    }

    onSave(form);
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.45)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
      }}
    >
      <div
        style={{
          width: 600,
          background: "#fff",
          borderRadius: 12,
          padding: 25,
        }}
      >
        <h2>
          {employee ? "Edit Employee" : "Add Employee"}
        </h2>

        <form onSubmit={handleSubmit}>

          <input
            name="EmployeeCode"
            placeholder="Employee Code"
            value={form.EmployeeCode}
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            name="EmployeeName"
            placeholder="Employee Name"
            value={form.EmployeeName}
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            name="EmailID"
            placeholder="Email"
            value={form.EmailID}
            onChange={handleChange}
            style={inputStyle}
          />

          <select
            name="RoleType"
            value={form.RoleType}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>

          <input
            name="Department"
            placeholder="Department"
            value={form.Department}
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            name="Designation"
            placeholder="Designation"
            value={form.Designation}
            onChange={handleChange}
            style={inputStyle}
          />

          <select
            name="Status"
            value={form.Status}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 10,
              marginTop: 20,
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={cancelBtn}
            >
              Cancel
            </button>

            <button
              type="submit"
              style={saveBtn}
            >
              {employee ? "Update Employee" : "Save Employee"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "12px",
  borderRadius: "8px",
  border: "1px solid #ccc",
};

const saveBtn = {
  background: "#2563eb",
  color: "#fff",
  border: "none",
  padding: "10px 20px",
  borderRadius: "8px",
  cursor: "pointer",
};

const cancelBtn = {
  background: "#6b7280",
  color: "#fff",
  border: "none",
  padding: "10px 20px",
  borderRadius: "8px",
  cursor: "pointer",
};