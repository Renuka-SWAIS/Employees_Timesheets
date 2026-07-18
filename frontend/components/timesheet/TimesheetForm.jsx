"use client";

import { useEffect, useState } from "react";

const initialState = {
  WorkDate: "",
  Month: new Date().getMonth() + 1,
  Year: new Date().getFullYear(),
  Project: "",
  TaskDescription: "",
  HoursWorked: "",
  Remarks: "",
};

export default function TimesheetForm({
  open,
  onClose,
  onSave,
  editData,
}) {
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (editData) {
      setForm({
        ...editData,
        WorkDate: editData.WorkDate
          ? editData.WorkDate.split("T")[0]
          : "",
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
      [name]:
        name === "HoursWorked"
          ? Number(value)
          : value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.WorkDate) {
      alert("Work Date is required");
      return;
    }

    if (!form.Project.trim()) {
      alert("Project is required");
      return;
    }

    if (!form.TaskDescription.trim()) {
      alert("Task Description is required");
      return;
    }

    if (form.TaskDescription.trim().length < 10) {
      alert("Task Description must be at least 10 characters.");
      return;
    }

    if (
      Number(form.HoursWorked) < 0.5 ||
      Number(form.HoursWorked) > 24
    ) {
      alert("Hours Worked must be between 0.5 and 24.");
      return;
    }

    const payload = {
      WorkDate: form.WorkDate,
      Month: new Date(form.WorkDate).getMonth() + 1,
      Year: new Date(form.WorkDate).getFullYear(),
      Project: form.Project,
      TaskDescription: form.TaskDescription,
      HoursWorked: Number(form.HoursWorked),
      Remarks: form.Remarks,
    };

    onSave(payload);
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
          width: "600px",
          background: "#fff",
          borderRadius: "12px",
          padding: "30px",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>
          {editData ? "Edit Timesheet" : "Add Timesheet"}
        </h2>

        <form onSubmit={handleSubmit}>

          <input
            type="date"
            name="WorkDate"
            value={form.WorkDate}
            onChange={handleChange}
            style={inputStyle}
            required
          />

          <input
            type="text"
            name="Project"
            placeholder="Project Name"
            value={form.Project}
            onChange={handleChange}
            style={inputStyle}
            required
          />

          <textarea
            name="TaskDescription"
            placeholder="Task Description"
            value={form.TaskDescription}
            onChange={handleChange}
            rows={4}
            style={inputStyle}
            required
          />

          <input
            type="number"
            name="HoursWorked"
            placeholder="Hours Worked"
            value={form.HoursWorked}
            onChange={handleChange}
            step="0.5"
            min="0.5"
            max="24"
            style={inputStyle}
            required
          />

          <textarea
            name="Remarks"
            placeholder="Remarks"
            value={form.Remarks}
            onChange={handleChange}
            rows={3}
            style={inputStyle}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
              marginTop: "20px",
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
              {editData ? "Update" : "Save"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "15px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  fontSize: "15px",
  outline: "none",
  boxSizing: "border-box",
};

const saveBtn = {
  background: "#2563eb",
  color: "#fff",
  border: "none",
  padding: "10px 20px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
};

const cancelBtn = {
  background: "#6b7280",
  color: "#fff",
  border: "none",
  padding: "10px 20px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
};