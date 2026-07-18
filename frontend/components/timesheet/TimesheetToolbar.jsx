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
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "25px",
        gap: "15px",
        flexWrap: "wrap",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "15px",
          alignItems: "center",
        }}
      >
        <button
          onClick={onAdd}
          style={{
            padding: "10px 18px",
            border: "none",
            borderRadius: "8px",
            background: "#2563eb",
            color: "#fff",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          + Add Entry
        </button>

        <MonthSelector
          month={month}
          setMonth={setMonth}
        />
      </div>

      <div
        style={{
          display: "flex",
          gap: "10px",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="Search project..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            width: "220px",
          }}
        />

        <button
          onClick={onRefresh}
          style={{
            padding: "10px 18px",
            border: "none",
            borderRadius: "8px",
            background: "#16a34a",
            color: "white",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Refresh
        </button>
      </div>
    </div>
  );
}