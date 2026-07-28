"use client";

import { useEffect, useState } from "react";

import MainLayout from "../../components/layout/MainLayout";
import LeaveForm from "../../components/leaves/LeaveForm";

import {
  getMyLeaves,
  createLeave,
  updateLeave,
  deleteLeave,
} from "../../services/leave";

import {
  getEmployees,
} from "../../services/employee";

export default function LeavesPage() {

  const [leaves, setLeaves] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState(null);

  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // ================================
  // Load User + Leaves
  // ================================
  useEffect(() => {

    const storedUser = localStorage.getItem("user");

    if (storedUser) {

      const parsedUser = JSON.parse(storedUser);

      setUser(parsedUser);

      const admin =
        parsedUser.RoleType === "Admin";

      setIsAdmin(admin);

      if (admin) {
        loadEmployees();
      }
    }

    loadLeaves();

  }, []);

  // ================================
  // Load Employees
  // ================================
  async function loadEmployees() {

    try {

      const data = await getEmployees();

      setEmployees(data);

    } catch (err) {

      console.error(err);

    }

  }

  // ================================
  // Load Leaves
  // ================================
  async function loadLeaves() {

    try {

      setLoading(true);

      const data = await getMyLeaves();

      setLeaves(data);

    } catch (err) {

      console.error(err);

      alert(err.message);

    } finally {

      setLoading(false);

    }

  }

  // ================================
  // Save Leave
  // ================================
  async function handleSave(formData) {

    try {

      if (selected) {

        await updateLeave(
          selected.LeaveID,
          formData
        );

      } else {

        const employeeId = isAdmin
          ? formData.EmployeeID
          : user.EmployeeID;

        await createLeave(
          employeeId,
          formData
        );

      }

      await loadLeaves();

      setShowForm(false);
      setSelected(null);

    } catch (err) {

      console.error(err);

      alert(err.message);

    }

  }

  // ================================
  // Delete Leave
  // ================================
  async function handleDelete(leaveId) {

    const ok = confirm(
      "Are you sure you want to delete this leave?"
    );

    if (!ok) return;

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

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
        }}
      >

        <h1>
          {user === null
            ? "Employee Leaves"
            : isAdmin
            ? "All Employee Leaves"
            : "Employee Leaves"}
        </h1>

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
            fontWeight: "600",
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

            {isAdmin && (
              <th style={thStyle}>
                Employee
              </th>
            )}

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
              <td
                colSpan={isAdmin ? 7 : 6}
                style={tdStyle}
              >
                Loading...
              </td>
            </tr>

          ) : leaves.length === 0 ? (

            <tr>
              <td
                colSpan={isAdmin ? 7 : 6}
                style={tdStyle}
              >
                No Leave Records
              </td>
            </tr>

          ) : (

            leaves.map((leave) => (

              <tr key={leave.LeaveID}>

                {isAdmin && (
                  <td style={tdStyle}>
                    <div style={{fontWeight:"600"}}>
                      {leave.EmployeeName}
                    </div>
                    <div
                      style={{
                        fontSize:"12px",
                        color:"#6b7280",
                      }}
                    >
                      {leave.EmployeeCode}
                    </div>
                  </td>
                )}

                <td style={tdStyle}>
                  {leave.FromDate}
                </td>

                <td style={tdStyle}>
                  {leave.ToDate}
                </td>

                <td style={tdStyle}>
                  {leave.LeaveType}
                </td>

                <td style={tdStyle}>
                  {leave.TotalDays}
                </td>

                <td style={tdStyle}>
                  {leave.Reason}
                </td>

                <td style={tdStyle}>

                  <button
                    onClick={() => {
                      setSelected(leave);
                      setShowForm(true);
                    }}
                    style={{
                      background:"#2563eb",
                      color:"#fff",
                      border:"none",
                      padding:"6px 12px",
                      borderRadius:"6px",
                      cursor:"pointer",
                      marginRight:"8px",
                    }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(leave.LeaveID)
                    }
                    style={{
                      background:"#dc2626",
                      color:"#fff",
                      border:"none",
                      padding:"6px 12px",
                      borderRadius:"6px",
                      cursor:"pointer",
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
        employees={employees}
        isAdmin={isAdmin}
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