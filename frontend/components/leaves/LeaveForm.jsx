"use client";

import { useEffect, useState } from "react";

const initialState = {
  EmployeeID: "",
  FromDate: "",
  ToDate: "",
  LeaveType: "Casual Leave",
  Reason: "",
};

export default function LeaveForm({
  open,
  onClose,
  onSave,
  editData,
  employees = [],
  isAdmin = false,
}) {
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (editData) {
      setForm({
        EmployeeID: editData.EmployeeID || "",
        FromDate: editData.FromDate
          ? editData.FromDate.split("T")[0]
          : "",
        ToDate: editData.ToDate
          ? editData.ToDate.split("T")[0]
          : "",
        LeaveType: editData.LeaveType || "Casual Leave",
        Reason: editData.Reason || "",
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

    if (isAdmin && !form.EmployeeID) {
      alert("Please select an employee.");
      return;
    }

    if (!form.FromDate) {
      alert("From Date is required");
      return;
    }

    if (!form.ToDate) {
      alert("To Date is required");
      return;
    }

    if (new Date(form.ToDate) < new Date(form.FromDate)) {
      alert("To Date cannot be before From Date.");
      return;
    }

    if (!form.Reason.trim()) {
      alert("Reason is required");
      return;
    }

    onSave({
      EmployeeID: form.EmployeeID,
      FromDate: form.FromDate,
      ToDate: form.ToDate,
      LeaveType: form.LeaveType,
      Reason: form.Reason,
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
        padding: "20px",
        boxSizing: "border-box",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          width: "600px",
          maxWidth: "100%",
          maxHeight: "calc(100vh - 40px)",
          background: "#fff",
          borderRadius: "12px",
          padding: "30px",
          boxSizing: "border-box",
          overflowY: "auto",
        }}
      >
        <h2
          style={{
            marginBottom: "20px",
          }}
        >
          {editData ? "Edit Leave" : "Apply Leave"}
        </h2>

        <form onSubmit={handleSubmit}>

          {/* ============================= */}
          {/* Employee - Admin Only */}
          {/* ============================= */}

          {isAdmin && (
            <>
              <label
                style={{
                  fontWeight: "600",
                  display: "block",
                  marginBottom: "6px",
                }}
              >
                Employee
              </label>

              <select
                name="EmployeeID"
                value={form.EmployeeID}
                onChange={handleChange}
                style={inputStyle}
                required
              >
                <option value="">
                  Select Employee
                </option>

                {employees.map((emp) => (
                  <option
                    key={emp.EmployeeID}
                    value={emp.EmployeeID}
                  >
                    {emp.EmployeeName} ({emp.EmployeeCode})
                  </option>
                ))}
              </select>
            </>
          )}

          {/* ============================= */}
          {/* From Date */}
          {/* ============================= */}

          <label
            style={{
              fontWeight: "600",
              display: "block",
              marginBottom: "6px",
            }}
          >
            From Date
          </label>

          <input
            type="date"
            name="FromDate"
            value={form.FromDate}
            onChange={handleChange}
            style={inputStyle}
            required
          />

          {/* ============================= */}
          {/* To Date */}
          {/* ============================= */}

          <label
            style={{
              fontWeight: "600",
              display: "block",
              marginBottom: "6px",
            }}
          >
            To Date
          </label>

          <input
            type="date"
            name="ToDate"
            value={form.ToDate}
            onChange={handleChange}
            style={inputStyle}
            required
          />

          {/* ============================= */}
          {/* Leave Type */}
          {/* ============================= */}

          <label
            style={{
              fontWeight: "600",
              display: "block",
              marginBottom: "6px",
            }}
          >
            Leave Type
          </label>

          <select
            name="LeaveType"
            value={form.LeaveType}
            onChange={handleChange}
            style={inputStyle}
          >
            <option>Casual Leave</option>
            <option>Sick Leave</option>
            <option>Earned Leave</option>
            <option>Work From Home</option>
            <option>Comp Off</option>
            <option>Other</option>
          </select>

          {/* ============================= */}
          {/* Reason */}
          {/* ============================= */}

          <label
            style={{
              fontWeight: "600",
              display: "block",
              marginBottom: "6px",
            }}
          >
            Reason
          </label>

          <textarea
            rows={4}
            name="Reason"
            value={form.Reason}
            onChange={handleChange}
            placeholder="Enter reason for leave"
            style={inputStyle}
            required
          />

          {/* ============================= */}
          {/* Buttons */}
          {/* ============================= */}

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
              marginTop: "20px",
              paddingTop: "15px",
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
              {editData ? "Update" : "Apply"}
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