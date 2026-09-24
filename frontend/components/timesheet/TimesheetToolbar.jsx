
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
    <div className="timesheet-toolbar">
      <div className="timesheet-toolbar-left">
        <button
          onClick={onAdd}
          className="timesheet-add-btn"
        >
          + Add Entry
        </button>

        <MonthSelector
          month={month}
          setMonth={setMonth}
        />
      </div>

      <div className="timesheet-toolbar-right">
        <input
          type="text"
          placeholder="Search project..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="timesheet-search"
        />

        <button
          onClick={onRefresh}
          className="timesheet-refresh-btn"
        >
          Refresh
        </button>
      </div>
    </div>
  );
}

