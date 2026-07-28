"use client";

import { useEffect, useState } from "react";

import MainLayout from "../../components/layout/MainLayout";
import TaskForm from "../../components/tasks/TaskForm";

import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../../services/task";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState(null);

  async function loadTasks() {
    try {
      setLoading(true);

      const data = await getTasks();

      setTasks(data);
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function handleSave(formData) {
    try {
      if (selected) {
        await updateTask(selected.TaskID, formData);
      } else {
        await createTask(formData);
      }

      await loadTasks();

      setShowForm(false);
      setSelected(null);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  async function handleDelete(taskId) {
    const ok = confirm(
      "Are you sure you want to delete this task?"
    );

    if (!ok) return;

    try {
      await deleteTask(taskId);

      await loadTasks();
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
        <h1>Task Master</h1>

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
          + Add Task
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

            <th style={thStyle}>Task ID</th>

            <th style={thStyle}>Task Name</th>

            <th style={thStyle}>Start Date</th>

            <th style={thStyle}>End Date</th>

            <th style={thStyle}>Approved Hours</th>

            <th style={thStyle}>Hours Spent</th>

<th style={thStyle}>Remaining Hours</th>

            <th style={thStyle}>Actions</th>

          </tr>
        </thead>

        <tbody>


                 {loading ? (

            <tr>
              <td
                colSpan={8}
                style={tdStyle}
              >
                No Tasks Found
              </td>
            </tr>

          ) : tasks.length === 0 ? (

            <tr>
              <td
                colSpan={6}
                style={tdStyle}
              >
                No Tasks Found
              </td>
            </tr>

          ) : (

            tasks.map((task) => (

              <tr key={task.TaskID}>

                <td style={tdStyle}>
                  {task.TaskCode}
                </td>

                <td style={tdStyle}>
                  {task.TaskName}
                </td>

                <td style={tdStyle}>
                  {task.StartDate}
                </td>

                <td style={tdStyle}>
                  {task.EndDate}
                </td>

                <td style={tdStyle}>
                  {task.ApprovedHours}
                </td>
                 <td style={tdStyle}>
  {task.HoursSpent}
</td>

<td style={tdStyle}>
  {task.RemainingHours}
</td>

                <td style={tdStyle}>

                  <button
                    onClick={() => {
                      setSelected(task);
                      setShowForm(true);
                    }}
                    style={{
                      background: "#2563eb",
                      color: "#fff",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      marginRight: "8px",
                    }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(task.TaskID)
                    }
                    style={{
                      background: "#dc2626",
                      color: "#fff",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      cursor: "pointer",
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

      <TaskForm
        open={showForm}
        editData={selected}
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