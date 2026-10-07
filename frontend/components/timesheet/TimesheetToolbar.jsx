"use client";

import MonthSelector from "./MonthSelector";

export default function TimesheetToolbar({
  search,
  setSearch,
  month,
  setMonth,
  onRefresh,
  onAdd,
}) {
  return (
    <div
      className="timesheet-toolbar"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "16px",
        flexWrap: "wrap",
        marginBottom: "20px",
      }}
    >
      {/* Left Side */}

      <div
        className="timesheet-toolbar-left"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={onAdd}
          className="timesheet-add-btn"
          style={{
            background: "#2563eb",
            color: "#fff",
            border: "none",
            padding: "10px 16px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          + Add Entry
        </button>

        <MonthSelector
          month={month}
          setMonth={setMonth}
        />
      </div>

      {/* Right Side */}

      <div
        className="timesheet-toolbar-right"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="Search project, task or date..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="timesheet-search"
          style={{
            width: "280px",
            padding: "10px 14px",
            border: "1px solid #cbd5e1",
            borderRadius: "8px",
            outline: "none",
            fontSize: "14px",
            background: "#fff",
          }}
        />

        <button
          onClick={onRefresh}
          className="timesheet-refresh-btn"
          style={{
            background: "#f1f5f9",
            color: "#334155",
            border: "1px solid #cbd5e1",
            padding: "10px 16px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Refresh
        </button>
      </div>
    </div>
  );
}