"use client";

import { useEffect, useState } from "react";
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../services/employee";

export default function useEmployee() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadEmployees() {
    try {
      setLoading(true);

      // Read logged in user
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      // Only Admin should call /employees
      if ((user.RoleType || user.role) !== "Admin") {
        setEmployees([]);
        return;
      }

      const data = await getEmployees();
      setEmployees(data);
    } catch (error) {
      console.error("Unable to load employees", error);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  }

  async function addEmployee(employee) {
    await createEmployee(employee);
    await loadEmployees();
  }

  async function editEmployee(id, employee) {
    await updateEmployee(id, employee);
    await loadEmployees();
  }

  async function removeEmployee(id) {
    await deleteEmployee(id);
    await loadEmployees();
  }

  useEffect(() => {
    loadEmployees();
  }, []);

  return {
    employees,
    loading,
    loadEmployees,
    addEmployee,
    editEmployee,
    removeEmployee,
  };
}