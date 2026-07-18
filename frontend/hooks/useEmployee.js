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

      const data = await getEmployees();
      setEmployees(data);
    } catch (error) {
      console.error("Unable to load employees", error);
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