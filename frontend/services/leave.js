import { apiRequest } from "./api";

// ==========================================
// Get Logged-in User Leaves
// ==========================================
export async function getMyLeaves() {
  return apiRequest("/leaves/");
}

// ==========================================
// Get All Leaves (Admin)
// ==========================================
export async function getAllLeaves(employeeId) {
  if (employeeId) {
    return apiRequest(`/leaves/employee/${employeeId}`);
  }

  return apiRequest("/leaves/");
}

// ==========================================
// Create Leave
// ==========================================
export async function createLeave(employeeId, data) {
  return apiRequest(`/leaves/employee/${employeeId}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ==========================================
// Update Leave
// ==========================================
export async function updateLeave(leaveId, data) {
  return apiRequest(`/leaves/${leaveId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// ==========================================
// Delete Leave
// ==========================================
export async function deleteLeave(leaveId) {
  return apiRequest(`/leaves/${leaveId}`, {
    method: "DELETE",
  });
}