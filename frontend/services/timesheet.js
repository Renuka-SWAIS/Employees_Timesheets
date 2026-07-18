import { apiRequest } from "./api";

// Get all timesheets
export async function getTimesheets() {
  return apiRequest("/timesheet/");
}

// NEW - Get timesheets of one employee (Admin)
export async function getEmployeeTimesheets(employeeId) {
  return apiRequest(`/timesheet/employee/${employeeId}`);
}

// Get a single timesheet
export async function getTimesheet(entryId) {
  return apiRequest(`/timesheet/${entryId}`);
}

// Create a new timesheet
export async function createTimesheet(data) {
  return apiRequest("/timesheet/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Update an existing timesheet
export async function updateTimesheet(entryId, data) {
  return apiRequest(`/timesheet/${entryId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// Delete a timesheet
export async function deleteTimesheet(entryId) {
  return apiRequest(`/timesheet/${entryId}`, {
    method: "DELETE",
  });
}