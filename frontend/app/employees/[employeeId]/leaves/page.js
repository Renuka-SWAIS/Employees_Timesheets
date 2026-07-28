"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import MainLayout from "../../../../components/layout/MainLayout";
import LeaveForm from "../../../../components/leaves/LeaveForm";

import {
  getAllLeaves,
  createLeave,
  updateLeave,
  deleteLeave,
} from "../../../../services/leave";

import { getEmployee } from "../../../../services/employee";

export default function EmployeeLeavesPage() {
  const { employeeId } = useParams();
  const router = useRouter();

  const [employee, setEmployee] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState(null);

  async function loadEmployee() {
    try {
      const data = await getEmployee(employeeId);
      setEmployee(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function loadLeaves() {
    try {
      setLoading(true);

      const data = await getAllLeaves(employeeId);

      setLeaves(data);
    } catch (err) {
      console.error(err);
      alert("Unable to load leaves.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (employeeId) {
      loadEmployee();
      loadLeaves();
    }
  }, [employeeId]);

  async function handleSave(formData) {
    try {
      if (selected) {
        await updateLeave(selected.LeaveID, formData);
      } else {
        await createLeave(employeeId, formData);
      }

      await loadLeaves();

      setShowForm(false);
      setSelected(null);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  async function handleDelete(leaveId) {
    if (!confirm("Delete this leave?")) return;

    try {
      await deleteLeave(leaveId);

      await loadLeaves();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  return (
    <MainLayout>

      <button
        onClick={() => router.push("/employees")}
        style={{
          background: "#2563eb",
          color: "#fff",
          border: "none",
          padding: "10px 18px",
          borderRadius: "8px",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        ← Back to Employees
      </button>

      <h1
        style={{
          fontSize: "38px",
          fontWeight: "700",
          marginBottom: "20px",
        }}
      >
        {employee
          ? `${employee.EmployeeName} Leaves`
          : "Employee Leaves"}
      </h1>

      {employee && (
        <div
          style={{
            background: "#fff",
            borderRadius: "18px",
            padding: "30px 35px",
            marginBottom: "30px",
            boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
            display: "flex",
            alignItems: "center",
            gap: "35px",
          }}
        >
          <div
            style={{
              width: "140px",
              display: "flex",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <img
              src={
                employee.PhotoURL
                  ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${employee.PhotoURL}`
                  : "/profile.png"
              }
              alt={employee.EmployeeName}
              onError={(e) => {
                e.target.src = "/profile.png";
              }}
              style={{
                width: "110px",
                height: "110px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "4px solid #2563eb",
              }}
            />
          </div>

          <div style={{ flex: 1 }}>
            <h2
              style={{
                marginBottom: "20px",
                color: "#1e3a8a",
              }}
            >
              {employee.EmployeeName}
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2,minmax(250px,1fr))",
                gap: "18px 60px",
              }}
            >
              <div>
                <b>Employee Code</b>
                <div>{employee.EmployeeCode}</div>
              </div>

              <div>
                <b>Role</b>
                <div>{employee.RoleType}</div>
              </div>

              <div>
                <b>Email</b>
                <div>{employee.EmailID}</div>
              </div>

              <div>
                <b>Department</b>
                <div>{employee.Department}</div>
              </div>

              <div>
                <b>Designation</b>
                <div>{employee.Designation}</div>
              </div>

              <div>
                <b>Status</b>
                <div>{employee.Status}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <h2>Total Leaves : {leaves.length}</h2>

        <button
          onClick={() => {
            setSelected(null);
            setShowForm(true);
          }}
          style={{
            background: "#2563eb",
            color: "#fff",
            border: "none",
            padding: "10px 18px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          + Add Leave
        </button>
      </div>
            <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#fff",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <thead
          style={{
            background: "#2563eb",
            color: "#fff",
          }}
        >
          <tr>
            <th style={thStyle}>From Date</th>
            <th style={thStyle}>To Date</th>
            <th style={thStyle}>Leave Type</th>
            <th style={thStyle}>Total Days</th>
            <th style={thStyle}>Reason</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6" style={tdStyle}>
                Loading...
              </td>
            </tr>
          ) : leaves.length === 0 ? (
            <tr>
              <td colSpan="6" style={tdStyle}>
                No Leave Records
              </td>
            </tr>
          ) : (
            leaves.map((leave) => (
              <tr key={leave.LeaveID}>
                <td style={tdStyle}>{leave.FromDate}</td>
                <td style={tdStyle}>{leave.ToDate}</td>
                <td style={tdStyle}>{leave.LeaveType}</td>
                <td style={tdStyle}>{leave.TotalDays}</td>
                <td style={tdStyle}>{leave.Reason}</td>

                <td style={tdStyle}>
                  <button
                    onClick={() => {
                      setSelected(leave);
                      setShowForm(true);
                    }}
                    style={{
                      background: "#2563eb",
                      color: "#fff",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      marginRight: "8px",
                    }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(leave.LeaveID)}
                    style={{
                      background: "#dc2626",
                      color: "#fff",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <LeaveForm
        open={showForm}
        editData={selected}
        onClose={() => {
          setShowForm(false);
          setSelected(null);
        }}
        onSave={handleSave}
      />
    </MainLayout>
  );
}

const thStyle = {
  padding: "14px",
  textAlign: "left",
};

const tdStyle = {
  padding: "14px",
  borderBottom: "1px solid #e5e7eb",
};