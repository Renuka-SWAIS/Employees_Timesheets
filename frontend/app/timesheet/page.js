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

  const role = user?.RoleType || user?.role;

  const isAdmin =
    String(role || "").trim().toLowerCase() === "admin";

  // ==========================================
  // Selected Month Timesheets
  // ==========================================
  const monthTimesheets = useMemo(() => {
    const currentYear = new Date().getFullYear();

    return timesheets.filter((item) => {
      if (!item.WorkDate) return false;

      const date = new Date(item.WorkDate);

      return (
        date.getFullYear() === currentYear &&
        date.toLocaleString("default", {
          month: "long",
        }) === month
      );
    });
  }, [timesheets, month]);

  // ==========================================
  // Filter Timesheets
  // ==========================================
  const filteredTimesheets = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return monthTimesheets
      .filter((item) => {
        if (!searchText) {
          return true;
        }

        const matchesSearch =
          item.Project?.toLowerCase().includes(searchText) ||
          item.TaskDescription?.toLowerCase().includes(searchText);

        return matchesSearch;
      })
      .sort((a, b) => {
        return new Date(b.WorkDate) - new Date(a.WorkDate);
      });
  }, [monthTimesheets, search]);

  // ==========================================
  // Unique Dates Entered
  // ==========================================
  const uniqueDatesCount = useMemo(() => {
    const uniqueDates = new Set();

    monthTimesheets.forEach((item) => {
      if (item.WorkDate) {
        const date = new Date(item.WorkDate);

        uniqueDates.add(
          `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
        );
      }
    });

    return uniqueDates.size;
  }, [monthTimesheets]);

  // ==========================================
  // Unfilled Dates
  // ==========================================
  const unfilledDates = useMemo(() => {
    const now = new Date();

    const currentYear = now.getFullYear();
    const currentMonthIndex = now.getMonth();

    const monthIndex = new Date(
      `${month} 1, ${currentYear}`
    ).getMonth();

    // ==========================================
    // Future month
    // No dates are considered unfilled yet
    // ==========================================
    if (monthIndex > currentMonthIndex) {
      return [];
    }

    // ==========================================
    // Find total days in selected month
    // ==========================================
    const daysInMonth = new Date(
      currentYear,
      monthIndex + 1,
      0
    ).getDate();

    // ==========================================
    // Determine last date that should be checked
    // ==========================================
    let lastDayToCheck = daysInMonth;

    // Current month:
    // Only check from 1st of the month until today.
    if (monthIndex === currentMonthIndex) {
      lastDayToCheck = now.getDate();
    }

    // ==========================================
    // Dates where employee entered at least
    // one timesheet
    // ==========================================
    const enteredDates = new Set();

    monthTimesheets.forEach((item) => {
      if (!item.WorkDate) return;

      const date = new Date(item.WorkDate);

      // Only consider dates inside the selected month
      if (
        date.getFullYear() === currentYear &&
        date.getMonth() === monthIndex
      ) {
        enteredDates.add(date.getDate());
      }
    });

    // ==========================================
    // Find missing dates
    // ==========================================
    const missingDates = [];

    for (let day = 1; day <= lastDayToCheck; day++) {
      if (!enteredDates.has(day)) {
        missingDates.push(
          new Date(currentYear, monthIndex, day)
        );
      }
    }

    return missingDates;
  }, [monthTimesheets, month]);

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

      {/* ==========================================
          Summary
      ========================================== */}
      <div
        style={{
          display: "flex",
          gap: "15px",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >
        {/* Unique Dates */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "12px",
            background: "#eff6ff",
            border: "1px solid #bfdbfe",
            borderRadius: "12px",
            padding: "12px 20px",
          }}
        >
          <span
            style={{
              fontSize: "15px",
              fontWeight: "600",
              color: "#475569",
            }}
          >
            Unique Dates Entered
          </span>

          <span
            style={{
              fontSize: "22px",
              fontWeight: "700",
              color: "#2563eb",
            }}
          >
            {uniqueDatesCount}
          </span>
        </div>

        {/* Unfilled Dates */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "12px",
            background: "#fff7ed",
            border: "1px solid #fed7aa",
            borderRadius: "12px",
            padding: "12px 20px",
          }}
        >
          <span
            style={{
              fontSize: "15px",
              fontWeight: "600",
              color: "#475569",
            }}
          >
            Unfilled Dates
          </span>

          <span
            style={{
              fontSize: "22px",
              fontWeight: "700",
              color: "#ea580c",
            }}
          >
            {unfilledDates.length}
          </span>
        </div>
      </div>

      {/* ==========================================
          Unfilled Dates List
      ========================================== */}
      {unfilledDates.length > 0 && (
        <div
          style={{
            background: "#fff7ed",
            border: "1px solid #fed7aa",
            borderRadius: "12px",
            padding: "16px 20px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              fontWeight: "700",
              color: "#9a3412",
              marginBottom: "10px",
            }}
          >
            Unfilled Dates
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
            }}
          >
            {unfilledDates.map((date) => (
              <span
                key={date.toISOString()}
                style={{
                  background: "#ffffff",
                  border: "1px solid #fdba74",
                  borderRadius: "8px",
                  padding: "6px 10px",
                  fontSize: "14px",
                  color: "#9a3412",
                  fontWeight: "600",
                }}
              >
                {date.toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ==========================================
          Toolbar
      ========================================== */}
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

      {/* ==========================================
          Timesheet Table
      ========================================== */}
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

      {/* ==========================================
          Timesheet Form
      ========================================== */}
      <TimesheetForm
        open={showForm}
        editData={selected}
        isAdmin={isAdmin}
        onClose={() => {
          setShowForm(false);
          setSelected(null);
        }}
        onSave={handleSave}
      />

      {/* ==========================================
          Delete Modal
      ========================================== */}
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