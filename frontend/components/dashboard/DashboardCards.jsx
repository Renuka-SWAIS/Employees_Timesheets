"use client";

import { useMemo } from "react";

import StatCard from "./StatCard";

export default function DashboardCards({
  timesheets,
  selectedMonth,
  setSelectedMonth,
}) {
  // =====================================================
  // Current Date
  // =====================================================
  const today = new Date();

  const selectedYear = selectedMonth.getFullYear();
  const selectedMonthIndex = selectedMonth.getMonth();

  // =====================================================
  // Month Navigation
  // =====================================================
  function goPreviousMonth() {
    setSelectedMonth(
      new Date(
        selectedYear,
        selectedMonthIndex - 1,
        1
      )
    );
  }

  function goNextMonth() {
    setSelectedMonth(
      new Date(
        selectedYear,
        selectedMonthIndex + 1,
        1
      )
    );
  }

  // =====================================================
  // Check Future Month
  // =====================================================
  const isFutureMonth =
    selectedYear > today.getFullYear() ||
    (
      selectedYear === today.getFullYear() &&
      selectedMonthIndex > today.getMonth()
    );

  // =====================================================
  // Team Working Hours - Selected Month
  // =====================================================
  const totalHours = useMemo(() => {
    if (!timesheets || isFutureMonth) {
      return 0;
    }

    return timesheets.reduce((sum, item) => {
      if (!item.WorkDate) {
        return sum;
      }

      const workDate = new Date(item.WorkDate);

      const sameMonth =
        workDate.getFullYear() === selectedYear &&
        workDate.getMonth() === selectedMonthIndex;

      if (!sameMonth) {
        return sum;
      }

      return sum + Number(item.HoursWorked || 0);
    }, 0);
  }, [
    timesheets,
    selectedYear,
    selectedMonthIndex,
    isFutureMonth,
  ]);

  // =====================================================
  // Unique Working Days - Selected Month
  // =====================================================
  const totalDays = useMemo(() => {
    if (!timesheets || isFutureMonth) {
      return 0;
    }

    return new Set(
      timesheets
        .filter((item) => {
          if (!item.WorkDate) {
            return false;
          }

          const workDate = new Date(item.WorkDate);

          return (
            workDate.getFullYear() === selectedYear &&
            workDate.getMonth() === selectedMonthIndex
          );
        })
        .map((item) => {
          const date = new Date(item.WorkDate);

          return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        })
    ).size;
  }, [
    timesheets,
    selectedYear,
    selectedMonthIndex,
    isFutureMonth,
  ]);

  // =====================================================
  // Current Month Information
  // =====================================================
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();

  // =====================================================
  // Dates Already Filled For Current Month
  // =====================================================
  const completedDays = new Set(
    timesheets
      .filter((item) => {
        if (!item.WorkDate) {
          return false;
        }

        const workDate = new Date(item.WorkDate);

        return (
          workDate.getFullYear() === currentYear &&
          workDate.getMonth() + 1 === currentMonth
        );
      })
      .map((item) => new Date(item.WorkDate).getDate())
  );

  // =====================================================
// Pending Entries - Selected Month
// =====================================================
let pendingEntries = 0;

if (!isFutureMonth) {
  const daysInSelectedMonth = new Date(
    selectedYear,
    selectedMonthIndex + 1,
    0
  ).getDate();

  const lastDay =
    selectedYear === currentYear &&
    selectedMonthIndex === currentMonth - 1
      ? currentDay
      : daysInSelectedMonth;

  for (let day = 1; day <= lastDay; day++) {
    if (!completedDays.has(day)) {
      pendingEntries++;
    }
  }
}

  // =====================================================
  // Unique Projects
  // =====================================================
  const totalProjects = new Set(
    timesheets
      .map((item) => item.Project)
      .filter(Boolean)
  ).size;

  // =====================================================
  // Month Display
  // =====================================================
  const monthDisplay = selectedMonth.toLocaleString(
    "default",
    {
      month: "long",
      year: "numeric",
    }
  );

  return (
    <div>

      {/* =====================================================
          Working Hours Month Selector
          ===================================================== */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          marginBottom: "15px",
          padding: "12px 16px",
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "10px",
          flexWrap: "wrap",
        }}
      >

        {/* Month Information */}
        <div>

          <div
            style={{
              fontSize: "13px",
              color: "#6b7280",
              marginBottom: "3px",
            }}
          >
            Team Working Hours
          </div>

          <div
            style={{
              fontSize: "18px",
              fontWeight: "700",
              color: "#111827",
            }}
          >
            {monthDisplay}
          </div>

        </div>

        {/* Month Controls */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >

          {/* Previous Month */}
          <button
            type="button"
            onClick={goPreviousMonth}
            style={{
              border: "1px solid #d1d5db",
              background: "#ffffff",
              borderRadius: "7px",
              padding: "7px 12px",
              cursor: "pointer",
              fontSize: "16px",
            }}
            title="Previous month"
          >
            ◀
          </button>

          {/* Current Month */}
          <button
            type="button"
            onClick={() =>
              setSelectedMonth(
                new Date(
                  today.getFullYear(),
                  today.getMonth(),
                  1
                )
              )
            }
            style={{
              border: "1px solid #d1d5db",
              background: "#ffffff",
              borderRadius: "7px",
              padding: "7px 14px",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "600",
            }}
          >
            Current Month
          </button>

          {/* Next Month */}
          <button
            type="button"
            onClick={goNextMonth}
            disabled={isFutureMonth}
            style={{
              border: "1px solid #d1d5db",
              background: isFutureMonth
                ? "#f3f4f6"
                : "#ffffff",
              color: isFutureMonth
                ? "#9ca3af"
                : "#111827",
              borderRadius: "7px",
              padding: "7px 12px",
              cursor: isFutureMonth
                ? "not-allowed"
                : "pointer",
              fontSize: "16px",
            }}
            title="Next month"
          >
            ▶
          </button>

        </div>

      </div>

      {/* =====================================================
          Dashboard Cards
          ===================================================== */}
      <div className="cards">

        <StatCard
          title={`Working Hours - ${monthDisplay}`}
          value={totalHours.toFixed(1)}
        />

        <StatCard
          title="Working Days"
          value={totalDays}
        />

        <StatCard
          title="Pending Entries"
          value={pendingEntries}
        />

        <StatCard
          title="Projects"
          value={totalProjects}
        />

      </div>

    </div>
  );
}