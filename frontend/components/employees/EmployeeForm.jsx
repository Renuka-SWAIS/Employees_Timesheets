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
        zIndex: 9999,
      }}
    >
      
<div
  style={{
    width: "600px",
    maxWidth: "100%",
    maxHeight: "calc(100vh - 40px)",
    background: "#fff",
    borderRadius: "12px",
    padding: "25px",
    boxSizing: "border-box",
    overflowY: "auto",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
  }}
>


      
        
<h2
  style={{
    margin: 0,
    marginBottom: "20px",
    fontSize: "26px",
    fontWeight: "700",
  }}
>
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
  alignItems: "center",
  gap: "10px",
  marginTop: "25px",
  paddingTop: "18px",
  borderTop: "1px solid #e5e7eb",
  background: "#fff",
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
  height: "46px",
  padding: "0 12px",
  marginBottom: "16px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  fontSize: "15px",
  outline: "none",
  boxSizing: "border-box",
};




const saveBtn = {
  minWidth: "100px",
  height: "42px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  padding: "0 20px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "14px",
};




const cancelBtn = {
  minWidth: "100px",
  height: "42px",
  background: "#6b7280",
  color: "#fff",
  border: "none",
  padding: "0 20px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "14px",
};
