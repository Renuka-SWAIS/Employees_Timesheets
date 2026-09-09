"use client";

import { useMemo, useState } from "react";

import MainLayout from "../../components/layout/MainLayout";

import TimesheetToolbar from "../../components/timesheet/TimesheetToolbar";
import TimesheetTable from "../../components/timesheet/TimesheetTable";
import TimesheetForm from "../../components/timesheet/TimesheetForm";
import DeleteModal from "../../components/timesheet/DeleteModal";

import useTimesheet from "../../hooks/useTimesheet";

export default function TimesheetPage() {
  const {
    timesheets,
    loading,
    addTimesheet,
    editTimesheet,
    removeTimesheet,
    loadTimesheets,
  } = useTimesheet();

  const [search, setSearch] = useState("");

  const [month, setMonth] = useState(
    new Date().toLocaleString("default", {
      month: "long",
    })
  );

  const [showForm, setShowForm] = useState(false);

  const [showDelete, setShowDelete] = useState(false);

  const [selected, setSelected] = useState(null);

  // ==========================================
  // Get logged-in user role
  // ==========================================
  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "null")
      : null;

  const role = user?.RoleType;

  const isAdmin = role === "Admin";

  // ==========================================
  // Filter Timesheets
  // ==========================================

  const filteredTimesheets = useMemo(() => {
  return timesheets
    .filter((item) => {
      const matchesSearch =
        item.Project?.toLowerCase().includes(
          search.toLowerCase()
        ) ||
        item.TaskDescription?.toLowerCase().includes(
          search.toLowerCase()
        );

      const matchesMonth =
        new Date(item.WorkDate).toLocaleString("default", {
          month: "long",
        }) === month;

      return matchesSearch && matchesMonth;
    })
    .sort((a, b) => {
      return new Date(b.WorkDate) - new Date(a.WorkDate);
    });
}, [timesheets, search, month]);
  // ==========================================
  // Check Current Month
  // ==========================================
  function isCurrentMonth(workDate) {
    if (!workDate) return false;

    const date = new Date(workDate);
    const now = new Date();

    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  }

  // ==========================================
  // Save Timesheet
  // ==========================================
  async function handleSave(formData) {
    try {
      if (selected) {
        // ==========================================
        // Employee cannot edit past month
        // Admin can edit past month
        // ==========================================
        if (
          !isAdmin &&
          !isCurrentMonth(selected.WorkDate)
        ) {
          alert(
            "Past month timesheets cannot be edited."
          );
          return;
        }

        await editTimesheet(
          selected.EntryID,
          formData
        );
      } else {
        await addTimesheet(formData);
      }

      setShowForm(false);
      setSelected(null);

      await loadTimesheets();
    } catch (err) {
      console.error(err);
      alert("Unable to save timesheet.");
    }
  }

  // ==========================================
  // Delete Timesheet
  // ==========================================
  async function handleDelete() {
    try {
      await removeTimesheet(selected.EntryID);

      setShowDelete(false);
      setSelected(null);

      await loadTimesheets();
    } catch (err) {
      console.error(err);
      alert("Unable to delete timesheet.");
    }
  }

  return (
    <MainLayout>
      <h1
        style={{
          marginBottom: "25px",
        }}
      >
        Employee Timesheet
      </h1>

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

      <TimesheetTable
        loading={loading}
        timesheets={filteredTimesheets}

        // ==========================================
        // Edit Timesheet
        // ==========================================
        onEdit={(row) => {
          // Admin can edit any month
          if (isAdmin) {
            setSelected(row);
            setShowForm(true);
            return;
          }

          // Employee can edit only current month
          if (!isCurrentMonth(row.WorkDate)) {
            alert(
              "Past month timesheets cannot be edited."
            );
            return;
          }

          setSelected(row);
          setShowForm(true);
        }}

        onDelete={(row) => {
          setSelected(row);
          setShowDelete(true);
        }}
      />

      <TimesheetForm
        open={showForm}
        editData={selected}
        onClose={() => {
          setShowForm(false);
          setSelected(null);
        }}
        onSave={handleSave}
      />

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