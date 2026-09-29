
import { apiRequest } from "./api";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getEmployees() {
  return apiRequest("/employees/");
}

export async function getEmployee(employeeId) {
  return apiRequest(`/employees/${employeeId}`);
}

export async function getEmployeeTimesheets(employeeId) {
  return apiRequest(`/timesheet/employee/${employeeId}`);
}

export async function createEmployee(data) {
  return apiRequest("/employees/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateEmployee(employeeId, data) {
  return apiRequest(`/employees/${employeeId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteEmployee(employeeId) {
  return apiRequest(`/employees/${employeeId}`, {
    method: "DELETE",
  });
}

export async function uploadEmployeePhoto(employeeId, file) {
  const token = localStorage.getItem("token");

  const formData = new FormData();
  formData.append("photo", file);

  const response = await fetch(
    `${API_URL}/employees/${employeeId}/photo`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Photo upload failed");
  }

  return data;
}
