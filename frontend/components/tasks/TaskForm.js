"use client";

import { useEffect, useState } from "react";

const initialState = {
  TaskCode: "",
  TaskName: "",
  StartDate: "",
  EndDate: "",
  ApprovedHours: "",
};

export default function TaskForm({
  open,
  onClose,
  onSave,
  editData,
}) {
  const [form, setForm] = useState(initialState);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editData) {
      setForm({
        TaskCode: editData.TaskCode || "",
        TaskName: editData.TaskName || "",
        StartDate: editData.StartDate
          ? editData.StartDate.split("T")[0]
          : "",
        EndDate: editData.EndDate
          ? editData.EndDate.split("T")[0]
          : "",
        ApprovedHours:
          editData.ApprovedHours ?? "",
      });
    } else {
      setForm(initialState);
    }
  }, [editData]);

  if (!open) return null;

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (saving) return;

    if (!form.TaskCode.trim()) {
      alert("Task Code is required.");
      return;
    }

    if (!form.TaskName.trim()) {
      alert("Task Name is required.");
      return;
    }

    if (!form.StartDate) {
      alert("Start Date is required.");
      return;
    }

    if (!form.EndDate) {
      alert("End Date is required.");
      return;
    }

    if (
      new Date(form.EndDate) <
      new Date(form.StartDate)
    ) {
      alert("End Date cannot be before Start Date.");
      return;
    }

    const approvedHours = Number(form.ApprovedHours);

    if (!form.ApprovedHours || approvedHours <= 0) {
      alert("Approved Hours must be greater than zero.");
      return;
    }

    try {
      setSaving(true);

      await onSave({
        TaskCode: form.TaskCode.trim(),
        TaskName: form.TaskName.trim(),
        StartDate: form.StartDate,
        EndDate: form.EndDate,
        ApprovedHours: approvedHours,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>

        {/* Header */}
        <div style={headerStyle}>
          <h2 style={titleStyle}>
            {editData ? "Edit Task" : "Add Task"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            style={closeBtn}
            disabled={saving}
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>

          <div style={fieldStyle}>
            <label style={labelStyle}>
              Task Code
            </label>

            <input
              type="text"
              name="TaskCode"
              value={form.TaskCode}
              onChange={handleChange}
              placeholder="Enter Task Code"
              style={inputStyle}
              disabled={saving}
              required
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>
              Task Name
            </label>

            <input
              type="text"
              name="TaskName"
              value={form.TaskName}
              onChange={handleChange}
              placeholder="Enter Task Name"
              style={inputStyle}
              disabled={saving}
              required
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>
              Start Date
            </label>

            <input
              type="date"
              name="StartDate"
              value={form.StartDate}
              onChange={handleChange}
              style={inputStyle}
              disabled={saving}
              required
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>
              End Date
            </label>

            <input
              type="date"
              name="EndDate"
              value={form.EndDate}
              onChange={handleChange}
              style={inputStyle}
              disabled={saving}
              required
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>
              Approved Hours
            </label>

            <input
              type="number"
              name="ApprovedHours"
              value={form.ApprovedHours}
              onChange={handleChange}
              placeholder="Enter approved hours"
              min="0.25"
              step="0.25"
              style={inputStyle}
              disabled={saving}
              required
            />
          </div>

          {/* Buttons */}
          <div style={buttonContainerStyle}>

            <button
              type="button"
              onClick={onClose}
              style={{
                ...cancelBtn,
                opacity: saving ? 0.6 : 1,
              }}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              style={{
                ...saveBtn,
                opacity: saving ? 0.7 : 1,
                cursor: saving
                  ? "not-allowed"
                  : "pointer",
              }}
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editData
                ? "Update"
                : "Save"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}

/* =========================
   Styles
========================= */

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0, 0, 0, 0.45)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,

  padding: "20px",
  boxSizing: "border-box",

  overflowY: "auto",
};

const modalStyle = {
  width: "600px",
  maxWidth: "100%",

  maxHeight: "calc(100vh - 40px)",

  background: "#fff",

  borderRadius: "12px",

  padding: "25px",

  boxSizing: "border-box",

  overflowY: "auto",

  boxShadow:
    "0 20px 40px rgba(0, 0, 0, 0.2)",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",

  marginBottom: "20px",
};

const titleStyle = {
  margin: 0,
  fontSize: "26px",
  fontWeight: "700",
};

const closeBtn = {
  width: "36px",
  height: "36px",

  border: "none",
  borderRadius: "8px",

  background: "#f3f4f6",

  fontSize: "24px",
  lineHeight: "1",

  cursor: "pointer",
};

const fieldStyle = {
  marginBottom: "16px",
};

const labelStyle = {
  display: "block",

  fontSize: "15px",
  fontWeight: "600",

  marginBottom: "7px",
};

const inputStyle = {
  width: "100%",

  height: "46px",

  padding: "0 12px",

  border: "1px solid #d1d5db",

  borderRadius: "8px",

  fontSize: "15px",

  outline: "none",

  boxSizing: "border-box",
};

const buttonContainerStyle = {
  display: "flex",

  justifyContent: "flex-end",

  alignItems: "center",

  gap: "10px",

  marginTop: "25px",

  paddingTop: "18px",

  borderTop: "1px solid #e5e7eb",

  position: "sticky",

  bottom: 0,

  background: "#fff",

  zIndex: 2,
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