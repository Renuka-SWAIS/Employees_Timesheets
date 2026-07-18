"use client";

import { useMemo, useState } from "react";

import MainLayout from "../../components/layout/MainLayout";
import EmployeeToolbar from "../../components/employees/EmployeeToolbar";
import EmployeeTable from "../../components/employees/EmployeeTable";
import EmployeeModal from "../../components/employees/EmployeeModal";
import EmployeeForm from "../../components/employees/EmployeeForm";

import useEmployee from "../../hooks/useEmployee";

export default function EmployeesPage() {
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
    return employees.filter((emp) => {
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
    });
  }, [employees, search, department, role, status]);

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
    window.location.href = `/employees/${employee.EmployeeID}/timesheets`;
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