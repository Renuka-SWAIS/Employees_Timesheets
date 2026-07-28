"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import MainLayout from "../../../../components/layout/MainLayout";

import TimesheetToolbar from "../../../../components/timesheet/TimesheetToolbar";
import TimesheetTable from "../../../../components/timesheet/TimesheetTable";
import TimesheetForm from "../../../../components/timesheet/TimesheetForm";
import DeleteModal from "../../../../components/timesheet/DeleteModal";

import {
  getEmployeeTimesheets,
  updateTimesheet,
  deleteTimesheet,
  createTimesheet,
} from "../../../../services/timesheet";

import { getEmployee } from "../../../../services/employee";

export default function EmployeeTimesheetsPage() {
  const { employeeId } = useParams();
  const router = useRouter();

  const [employee, setEmployee] = useState(null);
  const [timesheets, setTimesheets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [month, setMonth] = useState(
    new Date().toLocaleString("default", {
      month: "long",
    })
  );

  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selected, setSelected] = useState(null);

  async function loadEmployee() {
    try {
      const data = await getEmployee(employeeId);
      setEmployee(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function loadTimesheets() {
    try {
      setLoading(true);

      const data = await getEmployeeTimesheets(employeeId);
      setTimesheets(data);
    } catch (err) {
      console.error(err);
      alert("Unable to load employee timesheets.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (employeeId) {
      loadEmployee();
      loadTimesheets();
    }
  }, [employeeId]);

  const filteredTimesheets = useMemo(() => {
    return timesheets.filter((item) => {
      const matchesSearch =
        item.Project?.toLowerCase().includes(search.toLowerCase()) ||
        item.TaskDescription?.toLowerCase().includes(search.toLowerCase());

      const matchesMonth =
        new Date(item.WorkDate).toLocaleString("default", {
          month: "long",
        }) === month;

      return matchesSearch && matchesMonth;
    });
  }, [timesheets, search, month]);

  async function handleSave(formData) {
    try {
      if (selected) {
        await updateTimesheet(selected.EntryID, formData);
      } else {
        formData.EmployeeID = employeeId;
        await createTimesheet(formData);
      }

      await loadTimesheets();

      setShowForm(false);
      setSelected(null);
    } catch (err) {
      console.error(err);
      alert("Unable to save timesheet.");
    }
  }

  async function handleDelete() {
    try {
      await deleteTimesheet(selected.EntryID);

      await loadTimesheets();

      setShowDelete(false);
      setSelected(null);
    } catch (err) {
      console.error(err);
      alert("Unable to delete timesheet.");
    }
  }

  return (
    <MainLayout>

      {/* Back Button */}

      <div
  style={{
    display: "flex",
    gap: "12px",
    marginBottom: "20px",
  }}
>
  <button
    onClick={() => router.push("/employees")}
    style={{
      background: "#2563eb",
      color: "#fff",
      border: "none",
      padding: "10px 18px",
      borderRadius: "8px",
      cursor: "pointer",
    }}
  >
    ← Back to Employees
  </button>

  <button
    onClick={() =>
      router.push(`/employees/${employeeId}/leaves`)
    }
    style={{
      background: "#16a34a",
      color: "#fff",
      border: "none",
      padding: "10px 18px",
      borderRadius: "8px",
      cursor: "pointer",
    }}
  >
    🍃 View Leaves
  </button>
</div>

      {/* Page Title */}

      <h1
        style={{
          fontSize: "38px",
          fontWeight: "700",
          marginBottom: "20px",
        }}
      >
        {employee
          ? `${employee.EmployeeName} Timesheets`
          : "Employee Timesheets"}
      </h1>
{/* Employee Profile Card */}

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
    {/* Employee Photo */}

    <div
      style={{
        width: "140px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
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
          objectPosition: "center",
          border: "4px solid #2563eb",
          background: "#f8fafc",
          display: "block",
        }}
      />
    </div>

    {/* Employee Details */}

    <div style={{ flex: 1 }}>
      <h2
        style={{
          margin: 0,
          marginBottom: "20px",
          fontSize: "32px",
          fontWeight: "700",
          color: "#1e3a8a",
        }}
      >
        {employee.EmployeeName}
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(250px, 1fr))",
          columnGap: "60px",
          rowGap: "18px",
        }}
      >
        <div>
          <div style={{ fontWeight: 700 }}>Employee Code</div>
          <div>{employee.EmployeeCode}</div>
        </div>

        <div>
          <div style={{ fontWeight: 700 }}>Role</div>
          <div>{employee.RoleType}</div>
        </div>

        <div>
          <div style={{ fontWeight: 700 }}>Email</div>
          <div>{employee.EmailID}</div>
        </div>

        <div>
          <div style={{ fontWeight: 700 }}>Department</div>
          <div>{employee.Department}</div>
        </div>

        <div>
          <div style={{ fontWeight: 700 }}>Designation</div>
          <div>{employee.Designation}</div>
        </div>

        <div>
          <div style={{ fontWeight: 700, marginBottom: "5px" }}>Status</div>

          <span
            style={{
              display: "inline-block",
              background:
                employee.Status === "Active"
                  ? "#DCFCE7"
                  : "#FEE2E2",
              color:
                employee.Status === "Active"
                  ? "#15803D"
                  : "#B91C1C",
              padding: "6px 16px",
              borderRadius: "20px",
              fontWeight: "600",
            }}
          >
            {employee.Status}
          </span>
        </div>
      </div>
    </div>
  </div>
)}

      {/* Total Entries */}

      <h2
        style={{
          color: "#2563eb",
          marginBottom: "20px",
        }}
      >
        Total Entries : {filteredTimesheets.length}
      </h2>

      {/* Toolbar */}

      <TimesheetToolbar
        search={search}
        setSearch={setSearch}
        month={month}
        setMonth={setMonth}
        onRefresh={loadTimesheets}
        onAdd={() => {
          setSelected(null);
          setShowForm(true);
        }}
      />

      {/* Timesheet Table */}

      <TimesheetTable
        loading={loading}
        timesheets={filteredTimesheets}
        onEdit={(row) => {
          setSelected(row);
          setShowForm(true);
        }}
        onDelete={(row) => {
          setSelected(row);
          setShowDelete(true);
        }}
      />

      {/* Add/Edit Form */}

      <TimesheetForm
        open={showForm}
        editData={selected}
        onClose={() => {
          setShowForm(false);
          setSelected(null);
        }}
        onSave={handleSave}
      />

      {/* Delete Modal */}

      <DeleteModal
        open={showDelete}
        onClose={() => {
          setShowDelete(false);
          setSelected(null);
        }}
        onConfirm={handleDelete}
      />

    </MainLayout>
  );
}