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

  /* --------------------------------
     LOAD EDIT DATA
  -------------------------------- */
  useEffect(() => {
    if (editData) {
      setForm({
        ...editData,
        WorkDate: editData.WorkDate
          ? editData.WorkDate.split("T")[0]
          : "",
      });
    } else {
      setForm({
        ...initialState,
        Month: new Date().getMonth() + 1,
        Year: new Date().getFullYear(),
      });
    }
  }, [editData]);

  /* --------------------------------
     LOAD TASKS
  -------------------------------- */
  useEffect(() => {
    async function loadTasks() {
      try {
        const data = await getTasks();
        setTasks(data);
      } catch (err) {
        console.error("Failed to load tasks:", err);
      }
    }

    loadTasks();
  }, []);

  /* --------------------------------
     SELECTED TASK
  -------------------------------- */
  useEffect(() => {
    const task = tasks.find(
      (t) => String(t.TaskID) === String(form.TaskID)
    );

    setSelectedTask(task || null);
  }, [form.TaskID, tasks]);

  /* --------------------------------
     LOCK BACKGROUND SCROLL
  -------------------------------- */
  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;
    const originalPosition = document.body.style.position;
    const originalWidth = document.body.style.width;

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.position = originalPosition;
      document.body.style.width = originalWidth;
    };
  }, [open]);

  if (!open) return null;

  /* --------------------------------
     HANDLE CHANGE
  -------------------------------- */
  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  /* --------------------------------
     HOURS VALIDATION
  -------------------------------- */
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

  /* --------------------------------
     SUBMIT
  -------------------------------- */
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
        "Invalid Hours.\n\n" +
          "Examples:\n" +
          "1\n" +
          "1.25\n" +
          "1.59\n" +
          "0.50\n\n" +
          "Minutes cannot be greater than 59."
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
    <>
      {/* =========================================
          FULL SCREEN OVERLAY
          BACKGROUND CANNOT SCROLL
      ========================================= */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,

          width: "100%",
          height: "100dvh",

          background: "rgba(0,0,0,0.45)",

          zIndex: 99999,

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          padding: "12px",

          boxSizing: "border-box",

          overflow: "hidden",

          overscrollBehavior: "none",
        }}
      >
        {/* =========================================
            MODAL
        ========================================= */}
        <div
          style={{
            position: "relative",

            width: "600px",
            maxWidth: "100%",

            /*
             * IMPORTANT:
             * Modal height is based on viewport.
             */
            height: "calc(100dvh - 24px)",

            maxHeight: "calc(100dvh - 24px)",

            minHeight: 0,

            background: "#ffffff",

            borderRadius: "12px",

            boxSizing: "border-box",

            display: "flex",

            flexDirection: "column",

            overflow: "hidden",

            boxShadow:
              "0 20px 50px rgba(0,0,0,0.25)",

            overscrollBehavior: "contain",
          }}
        >
          {/* =========================================
              HEADER
          ========================================= */}
          <div
            style={{
              flex: "0 0 auto",

              padding: "18px 30px 14px 30px",

              background: "#ffffff",

              borderBottom:
                "1px solid #f1f5f9",

              boxSizing: "border-box",

              zIndex: 20,
            }}
          >
            <h2
              style={{
                margin: 0,

                fontSize: "22px",

                fontWeight: "700",

                color: "#111827",
              }}
            >
              {editData
                ? "Edit Timesheet"
                : "Add Timesheet"}
            </h2>
          </div>

          {/* =========================================
              ONLY THIS SECTION SCROLLS
          ========================================= */}
          <div
            style={{
              flex: "1 1 0",

              minHeight: 0,

              overflowY: "auto",

              overflowX: "hidden",

              WebkitOverflowScrolling: "touch",

              overscrollBehavior: "contain",

              padding:
                "16px 30px 24px 30px",

              boxSizing: "border-box",

              scrollbarWidth: "thin",
            }}
          >
            <form
              id="timesheet-form"
              onSubmit={handleSubmit}
            >
              {/* DATE */}
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

              {/* TASK */}
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
                <option value="">
                  Select Task
                </option>

                {tasks.map((task) => (
                  <option
                    key={task.TaskID}
                    value={task.TaskID}
                  >
                    {task.TaskCode} -{" "}
                    {task.TaskName}
                  </option>
                ))}
              </select>

              {/* SELECTED TASK INFORMATION */}
              {selectedTask && (
                <div
                  style={{
                    background: "#f8fafc",

                    border:
                      "1px solid #dbeafe",

                    borderRadius: "8px",

                    padding: "15px",

                    marginBottom: "18px",

                    lineHeight: "24px",

                    fontSize: "14px",

                    boxSizing: "border-box",
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

              {/* TASK DETAILS */}
              <label style={labelStyle}>
                Task Details
              </label>

              <textarea
                rows={4}
                name="TaskDescription"
                value={form.TaskDescription}
                onChange={handleChange}
                placeholder="Enter Task Details"
                style={{
                  ...inputStyle,
                  resize: "vertical",
                }}
                required
              />

              {/* HOURS */}
              <label style={labelStyle}>
                Hours
              </label>

              <input
                type="text"
                inputMode="decimal"
                pattern="^\\d+(\\.\\d{0,2})?$"
                name="HoursWorked"
                value={form.HoursWorked}
                onChange={handleChange}
                placeholder="Examples: 1, 0.25, 0.50, 1.59"
                style={inputStyle}
                required
              />

              {/* HOURS HELP */}
              <div
                style={{
                  marginTop: "-8px",

                  marginBottom: "18px",

                  fontSize: "12px",

                  color: "#6b7280",

                  lineHeight: "18px",
                }}
              >
                <div>Examples:</div>

                <div>• 1 = 1 Hour</div>

                <div>
                  • 0.25 = 25 Minutes
                </div>

                <div>
                  • 0.50 = 50 Minutes
                </div>

                <div>
                  • 1.25 = 1 Hour 25 Minutes
                </div>

                <div>
                  • 1.59 = 1 Hour 59 Minutes
                </div>

                <span
                  style={{
                    display: "block",

                    marginTop: "2px",

                    color: "#dc2626",

                    fontWeight: "600",
                  }}
                >
                  Minutes must be between 00
                  and 59 only.
                </span>
              </div>

              {/* REMARKS */}
              <label style={labelStyle}>
                Remarks
              </label>

              <textarea
                rows={3}
                name="Remarks"
                value={form.Remarks}
                onChange={handleChange}
                placeholder="Enter Remarks"
                style={{
                  ...inputStyle,
                  resize: "vertical",
                }}
              />

              {/* EXTRA SPACE AT BOTTOM */}
              <div
                style={{
                  height: "20px",
                }}
              />
            </form>
          </div>

          {/* =========================================
              FOOTER
              NEVER PART OF SCROLL
          ========================================= */}
          <div
            style={{
              flex: "0 0 72px",

              height: "72px",

              minHeight: "72px",

              display: "flex",

              justifyContent: "flex-end",

              alignItems: "center",

              gap: "10px",

              padding: "10px 30px",

              borderTop:
                "1px solid #e5e7eb",

              background: "#ffffff",

              boxSizing: "border-box",

              zIndex: 50,

              boxShadow:
                "0 -4px 12px rgba(0,0,0,0.06)",
            }}
          >
            {/* CANCEL */}
            <button
              type="button"
              onClick={onClose}
              style={cancelBtn}
            >
              Cancel
            </button>

            {/* SAVE / UPDATE */}
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
    </>
  );
}

/* =========================================
   LABEL
========================================= */

const labelStyle = {
  fontWeight: "600",

  display: "block",

  marginBottom: "6px",

  fontSize: "15px",

  color: "#111827",
};

/* =========================================
   INPUT
========================================= */

const inputStyle = {
  width: "100%",

  padding: "12px",

  marginBottom: "15px",

  border: "1px solid #d1d5db",

  borderRadius: "8px",

  fontSize: "15px",

  outline: "none",

  boxSizing: "border-box",

  background: "#ffffff",

  color: "#111827",
};

/* =========================================
   SAVE BUTTON
========================================= */

const saveBtn = {
  background: "#2563eb",

  color: "#ffffff",

  border: "none",

  padding: "10px 20px",

  minWidth: "85px",

  minHeight: "40px",

  borderRadius: "8px",

  cursor: "pointer",

  fontWeight: "600",

  fontSize: "14px",

  flexShrink: 0,
};

/* =========================================
   CANCEL BUTTON
========================================= */

const cancelBtn = {
  background: "#6b7280",

  color: "#ffffff",

  border: "none",

  padding: "10px 20px",

  minWidth: "85px",

  minHeight: "40px",

  borderRadius: "8px",

  cursor: "pointer",

  fontWeight: "600",

  fontSize: "14px",

  flexShrink: 0,
};