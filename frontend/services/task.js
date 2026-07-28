import { apiRequest } from "./api";

// ==========================================
// Get All Tasks
// ==========================================
export async function getTasks() {
  return apiRequest("/tasks/");
}

// ==========================================
// Get Single Task
// ==========================================
export async function getTask(taskId) {
  return apiRequest(`/tasks/${taskId}`);
}

// ==========================================
// Create Task
// ==========================================
export async function createTask(data) {
  return apiRequest("/tasks/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ==========================================
// Update Task
// ==========================================
export async function updateTask(taskId, data) {
  return apiRequest(`/tasks/${taskId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// ==========================================
// Delete Task
// ==========================================
export async function deleteTask(taskId) {
  return apiRequest(`/tasks/${taskId}`, {
    method: "DELETE",
  });
}