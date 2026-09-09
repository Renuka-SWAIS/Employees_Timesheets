"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import MainLayout from "../../components/layout/MainLayout";
import EmployeeToolbar from "../../components/employees/EmployeeToolbar";
import EmployeeTable from "../../components/employees/EmployeeTable";
import EmployeeModal from "../../components/employees/EmployeeModal";
import EmployeeForm from "../../components/employees/EmployeeForm";

import useEmployee from "../../hooks/useEmployee";

export default function EmployeesPage() {
  const router = useRouter();

  const [authorized, setAuthorized] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user?.RoleType === "Admin") {
      setAuthorized(true);
    } else {
      setAuthorized(false);
    }
  }, []);

  const {
    employees,
    loading,
    loadEmployees,
    addEmployee,
    editEmployee,
    removeEmployee,
  } = useEmployee();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState("");

  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const departments = [
    ...new Set(
      employees
        .map((emp) => emp.Department)
        .filter(Boolean)
    ),
  ];

  const roles = [
    ...new Set(
      employees
        .map((emp) => emp.RoleType)
        .filter(Boolean)
    ),
  ];

  const filteredEmployees = useMemo(() => {
    return employees
      .filter((emp) => {
        const matchesSearch =
          emp.EmployeeName?.toLowerCase().includes(search.toLowerCase()) ||
          emp.EmployeeCode?.toLowerCase().includes(search.toLowerCase()) ||
          emp.EmailID?.toLowerCase().includes(search.toLowerCase());

        const matchesDepartment =
          department === "" || emp.Department === department;

        const matchesRole =
          role === "" || emp.RoleType === role;

        const matchesStatus =
          status === "" || emp.Status === status;

        return (
          matchesSearch &&
          matchesDepartment &&
          matchesRole &&
          matchesStatus
        );
      })
      .sort((a, b) => {
        const codeA =
          parseInt(
            String(a.EmployeeCode || "").replace(/\D/g, ""),
            10
          ) || 0;

        const codeB =
          parseInt(
            String(b.EmployeeCode || "").replace(/\D/g, ""),
            10
          ) || 0;

        return codeA - codeB;
      });
  }, [employees, search, department, role, status]);

  if (authorized === null) {
    return null;
  }

  if (!authorized) {
    return (
      <MainLayout>
        <div
          style={{
            maxWidth: "700px",
            margin: "100px auto",
            background: "#fff",
            padding: "40px",
            borderRadius: "12px",
            textAlign: "center",
            boxShadow: "0 6px 20px rgba(0,0,0,.08)",
          }}
        >
          <h1
            style={{
              color: "#dc2626",
              marginBottom: "15px",
            }}
          >
            🔒 Access Denied
          </h1>

          <p
            style={{
              fontSize: "17px",
              color: "#555",
              marginBottom: "30px",
            }}
          >
            You do not have permission to access Employee Management.
            <br />
            Only administrators can view and manage employees.
          </p>

          <button
            onClick={() => router.push("/dashboard")}
            style={{
              background: "#2563eb",
              color: "#fff",
              border: "none",
              padding: "12px 22px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            ← Back to Dashboard
          </button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>

      <h1 style={{ marginBottom: "10px" }}>
        Employee Management
      </h1>

      <p
        style={{
          marginBottom: "10px",
          color: "#666",
        }}
      >
        View all employees registered in SWAIS.
      </p>

      <h3
        style={{
          marginBottom: "25px",
          color: "#2563eb",
        }}
      >
        Total Employees: {filteredEmployees.length}
      </h3>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "20px",
        }}
      >
        <button
          onClick={() => {
            setEditingEmployee(null);
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
          + Add Employee
        </button>
      </div>

      <EmployeeToolbar
        search={search}
        setSearch={setSearch}
        department={department}
        setDepartment={setDepartment}
        departments={departments}
        role={role}
        setRole={setRole}
        roles={roles}
        status={status}
        setStatus={setStatus}
        onRefresh={loadEmployees}
      />

      <EmployeeTable
        employees={filteredEmployees}
        loading={loading}
        onViewEmployee={setSelectedEmployee}
        onEditEmployee={(employee) => {
          setEditingEmployee(employee);
          setShowForm(true);
        }}
        onDeleteEmployee={async (employeeId) => {
          const confirmDelete = window.confirm(
            "Are you sure you want to delete this employee?"
          );

          if (!confirmDelete) return;

          await removeEmployee(employeeId);
        }}
        onViewTimesheets={(employee) => {
          router.push(`/employees/${employee.EmployeeID}/timesheets`);
        }}
      />

      <EmployeeModal
        employee={selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
      />

      <EmployeeForm
        open={showForm}
        employee={editingEmployee}
        onClose={() => {
          setShowForm(false);
          setEditingEmployee(null);
        }}
        onSave={async (data) => {
          if (editingEmployee) {
            await editEmployee(
              editingEmployee.EmployeeID,
              data
            );
          } else {
            await addEmployee(data);
          }

          setShowForm(false);
          setEditingEmployee(null);
        }}
      />

    </MainLayout>
  );
}