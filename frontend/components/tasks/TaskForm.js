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

  useEffect(() => {

    if (editData) {

      setForm({
        ...editData,
        StartDate: editData.StartDate
          ? editData.StartDate.split("T")[0]
          : "",

        EndDate: editData.EndDate
          ? editData.EndDate.split("T")[0]
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
      [name]: value,
    }));

  }

  function handleSubmit(e) {

    e.preventDefault();

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
      alert(
        "End Date cannot be before Start Date."
      );
      return;
    }

    if (
      Number(form.ApprovedHours) <= 0
    ) {
      alert(
        "Approved Hours must be greater than zero."
      );
      return;
    }

    onSave({
      TaskCode: form.TaskCode,
      TaskName: form.TaskName,
      StartDate: form.StartDate,
      EndDate: form.EndDate,
      ApprovedHours: Number(form.ApprovedHours),
    });
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
          {editData
            ? "Edit Task"
            : "Add Task"}
        </h2>

        <form onSubmit={handleSubmit}>


                 <label>Task Code</label>

          <input
            type="text"
            name="TaskCode"
            value={form.TaskCode}
            onChange={handleChange}
            style={inputStyle}
            required
          />

          <label>Task Name</label>

          <input
            type="text"
            name="TaskName"
            value={form.TaskName}
            onChange={handleChange}
            style={inputStyle}
            required
          />

          <label>Start Date</label>

          <input
            type="date"
            name="StartDate"
            value={form.StartDate}
            onChange={handleChange}
            style={inputStyle}
            required
          />

          <label>End Date</label>

          <input
            type="date"
            name="EndDate"
            value={form.EndDate}
            onChange={handleChange}
            style={inputStyle}
            required
          />

          <label>Approved Hours</label>

          <input
            type="number"
            name="ApprovedHours"
            value={form.ApprovedHours}
            onChange={handleChange}
            min="1"
            step="0.25"
            style={inputStyle}
            required
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