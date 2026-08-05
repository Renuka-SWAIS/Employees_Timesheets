"use client";

import { useEffect, useState } from "react";
import { getTasks } from "../../services/task";

const initialState = {
  WorkDate: "",
  Month: new Date().getMonth() + 1,
  Year: new Date().getFullYear(),

  TaskID: "",

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
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

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

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  useEffect(() => {
    async function loadTasks() {
      try {
        const data = await getTasks();
        setTasks(data);
      } catch (err) {
        console.error(err);
      }
    }

    loadTasks();
  }, []);

  useEffect(() => {
    const task = tasks.find(
      (t) => String(t.TaskID) === String(form.TaskID)
    );

    setSelectedTask(task || null);
  }, [form.TaskID, tasks]);

  if (!open) return null;

  function validateHours(hours) {
    if (!hours) return false;

    const text = hours.toString().trim();

    if (!/^\d+(\.\d{2})?$/.test(text)) {
      return false;
    }

    const parts = text.split(".");
    const hrs = Number(parts[0]);

    if (hrs > 24) {
      return false;
    }

    if (parts.length === 2) {
      const mins = Number(parts[1]);

      if (mins < 0 || mins > 59) {
        return false;
      }
    }

    return true;
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.WorkDate) {
      alert("Date is required.");
      return;
    }

    if (!form.TaskID) {
      alert("Please select a task.");
      return;
    }

    if (!form.TaskDescription.trim()) {
      alert("Task Details are required.");
      return;
    }

    if (form.TaskDescription.trim().length < 10) {
      alert("Task Details must be at least 10 characters.");
      return;
    }

    if (!validateHours(form.HoursWorked)) {
      alert(
        "Invalid Hours.\n\nExamples:\n1\n1.25\n1.59\n0.50\n\nMinutes cannot be greater than 59."
      );
      return;
    }

    const payload = {
      WorkDate: form.WorkDate,
      Month: new Date(form.WorkDate).getMonth() + 1,
      Year: new Date(form.WorkDate).getFullYear(),

      TaskID: form.TaskID,

      Project: selectedTask?.TaskName || "",
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
        padding: "20px",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: "600px",
          maxWidth: "100%",
          height: "calc(100vh - 40px)",
          maxHeight: "800px",
          background: "#fff",
          borderRadius: "12px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "25px 30px 15px 30px",
            flexShrink: 0,
            background: "#fff",
          }}
        >
          <h2
            style={{
              margin: 0,
            }}
          >
            {editData ? "Edit Timesheet" : "Add Timesheet"}
          </h2>
        </div>

        {/* Scrollable Form Content */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "10px 30px 20px 30px",
            boxSizing: "border-box",
          }}
        >
          <form id="timesheet-form" onSubmit={handleSubmit}>

            {/* Date */}
            <label style={labelStyle}>
              Date
            </label>

            <input
              type="date"
              name="WorkDate"
              value={form.WorkDate}
              onChange={handleChange}
              style={inputStyle}
              required
            />

            {/* Task */}
            <label style={labelStyle}>
              Task
            </label>

            <select
              name="TaskID"
              value={form.TaskID}
              onChange={(e) => {
                const task = tasks.find(
                  (t) =>
                    String(t.TaskID) ===
                    String(e.target.value)
                );

                setForm((prev) => ({
                  ...prev,
                  TaskID: e.target.value,
                  Project: task
                    ? task.TaskName
                    : "",
                }));
              }}
              style={inputStyle}
              required
            >
              <option value="">Select Task</option>

              {tasks.map((task) => (
                <option
                  key={task.TaskID}
                  value={task.TaskID}
                >
                  {task.TaskCode} - {task.TaskName}
                </option>
              ))}
            </select>

            {/* Selected Task Information */}
            {selectedTask && (
              <div
                style={{
                  background: "#f8fafc",
                  border: "1px solid #dbeafe",
                  borderRadius: "8px",
                  padding: "15px",
                  marginBottom: "18px",
                }}
              >
                <div>
                  <b>Approved Hours :</b>{" "}
                  {selectedTask.ApprovedHours}
                </div>

                <div>
                  <b>Hours Spent :</b>{" "}
                  {selectedTask.HoursSpent}
                </div>

                <div>
                  <b>Remaining Hours :</b>{" "}
                  {selectedTask.RemainingHours}
                </div>
              </div>
            )}

            {/* Task Details */}
            <label style={labelStyle}>
              Task Details
            </label>

            <textarea
              rows={4}
              name="TaskDescription"
              value={form.TaskDescription}
              onChange={handleChange}
              placeholder="Enter Task Details"
              style={inputStyle}
              required
            />

            {/* Hours */}
            <label style={labelStyle}>
              Hours
            </label>

            <input
              type="text"
              inputMode="decimal"
              pattern="^\d+(\.\d{0,2})?$"
              name="HoursWorked"
              value={form.HoursWorked}
              onChange={handleChange}
              placeholder="Examples: 1, 0.25, 0.50, 1.59"
              style={inputStyle}
              required
            />

            <div
              style={{
                marginTop: "-8px",
                marginBottom: "15px",
                fontSize: "12px",
                color: "#6b7280",
                lineHeight: "18px",
              }}
            >
              Examples:
              <br />
              • 1 = 1 Hour
              <br />
              • 0.25 = 25 Minutes
              <br />
              • 0.50 = 50 Minutes
              <br />
              • 1.25 = 1 Hour 25 Minutes
              <br />
              • 1.59 = 1 Hour 59 Minutes
              <br />

              <span
                style={{
                  color: "#dc2626",
                  fontWeight: 600,
                }}
              >
                Minutes must be between 00 and 59 only.
              </span>
            </div>

            {/* Remarks */}
            <label style={labelStyle}>
              Remarks
            </label>

            <textarea
              rows={3}
              name="Remarks"
              value={form.Remarks}
              onChange={handleChange}
              placeholder="Enter Remarks"
              style={inputStyle}
            />
          </form>
        </div>

        {/* Fixed Buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: "10px",
            padding: "15px 30px",
            borderTop: "1px solid #e5e7eb",
            background: "#fff",
            flexShrink: 0,
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
            form="timesheet-form"
            style={saveBtn}
          >
            {editData ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

const labelStyle = {
  fontWeight: "600",
  display: "block",
  marginBottom: "6px",
};

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