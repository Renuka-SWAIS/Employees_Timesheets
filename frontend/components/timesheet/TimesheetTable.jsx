"use client";
import React from "react";
export default function TimesheetTable({
  timesheets = [],
  loading,
  onEdit,
  onDelete,
  readOnly = false,
}) {
  if (loading) {
    return <h3>Loading Timesheets...</h3>;
  }

  if (timesheets.length === 0) {
    return <h3>No Timesheet Entries Found</h3>;
  }

  /*
   * Group timesheets by WorkDate
   */
  const groupedTimesheets = timesheets.reduce((groups, item) => {
    const dateKey = item.WorkDate
      ? item.WorkDate.split("T")[0]
      : "unknown";

    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }

    groups[dateKey].push(item);

    return groups;
  }, {});

  /*
   * Format date without timezone issues
   */
  function formatDate(dateString) {
    if (!dateString || dateString === "unknown") {
      return {
        date: "-",
        day: "-",
      };
    }

    const [year, month, day] = dateString
      .split("-")
      .map(Number);

    const date = new Date(year, month - 1, day);

    return {
      date: date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      day: date.toLocaleDateString("en-US", {
        weekday: "short",
      }),
    };
  }

  /*
   * Calculate total hours for one date
   */
  function getTotalHours(entries) {
    return entries
      .reduce(
        (total, item) =>
          total + Number(item.HoursWorked || 0),
        0
      )
      .toFixed(2);
  }

  const columnCount = readOnly ? 5 : 6;

  return (
    <div className="tableCard">
      <h2 style={{ marginBottom: "20px" }}>
        Timesheet Entries
      </h2>

      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Project</th>
            <th>Task Description</th>
            <th>Hours</th>
            <th>Remarks</th>

            {!readOnly && <th>Actions</th>}
          </tr>
        </thead>

        <tbody>
          {Object.entries(groupedTimesheets).map(
            ([dateKey, entries]) => {
              const formattedDate =
                formatDate(dateKey);

              const totalHours =
                getTotalHours(entries);

              return (
                <React.Fragment key={dateKey}>
                  {/* ==========================
                      DATE GROUP HEADER
                  ========================== */}
                  <tr>
                    <td
                      colSpan={columnCount}
                      style={{
                        background: "#eff6ff",
                        borderTop:
                          "3px solid #2563eb",
                        borderBottom:
                          "1px solid #bfdbfe",
                        padding: "14px 16px",
                        fontWeight: "600",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent:
                            "space-between",
                          alignItems: "center",
                          gap: "15px",
                          flexWrap: "wrap",
                        }}
                      >
                        {/* Date + Day */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "20px",
                            }}
                          >
                            📅
                          </span>

                          <div>
                            <div
                              style={{
                                color: "#1e3a8a",
                                fontSize: "16px",
                                fontWeight: "700",
                              }}
                            >
                              {formattedDate.date}
                            </div>

                            <div
                              style={{
                                color: "#64748b",
                                fontSize: "13px",
                                marginTop: "2px",
                              }}
                            >
                              {formattedDate.day}
                            </div>
                          </div>
                        </div>

                        {/* Entry Count + Total */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            flexWrap: "wrap",
                          }}
                        >
                          <span
                            style={{
                              background: "#dbeafe",
                              color: "#1d4ed8",
                              padding:
                                "6px 12px",
                              borderRadius: "20px",
                              fontSize: "13px",
                              fontWeight: "600",
                              whiteSpace:
                                "nowrap",
                            }}
                          >
                            {entries.length}{" "}
                            {entries.length === 1
                              ? "Entry"
                              : "Entries"}
                          </span>

                          <span
                            style={{
                              background: "#dcfce7",
                              color: "#15803d",
                              padding:
                                "6px 12px",
                              borderRadius: "20px",
                              fontSize: "13px",
                              fontWeight: "600",
                              whiteSpace:
                                "nowrap",
                            }}
                          >
                            Total: {totalHours} hrs
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>

                  {/* ==========================
                      ENTRIES FOR THIS DATE
                  ========================== */}
                  {entries.map((item) => (
                    <tr key={item.EntryID}>
                      {/* Date */}
                      <td>
                        <div
                          style={{
                            fontWeight: "600",
                          }}
                        >
                          {formattedDate.date}
                        </div>

                        <div
                          style={{
                            fontSize: "12px",
                            color: "#64748b",
                            marginTop: "4px",
                          }}
                        >
                          {formattedDate.day}
                        </div>
                      </td>

                      {/* Project */}
                      <td>
                        {item.Project || "-"}
                      </td>

                      {/* Task Description */}
                      <td>
                        {item.TaskDescription || "-"}
                      </td>

                      {/* Hours */}
                      <td
                        style={{
                          fontWeight: "600",
                        }}
                      >
                        {item.HoursWorked ?? "-"}
                      </td>

                      {/* Remarks */}
                      <td>
                        {item.Remarks || "-"}
                      </td>

                      {/* Actions */}
                      {!readOnly && (
                        <td>
                          <div
                            style={{
                              display: "flex",
                              gap: "10px",
                              flexWrap: "wrap",
                            }}
                          >
                            <button
                              onClick={() =>
                                onEdit(item)
                              }
                              style={{
                                background:
                                  "#2563eb",
                                color: "#fff",
                                border: "none",
                                padding:
                                  "8px 14px",
                                borderRadius:
                                  "6px",
                                cursor:
                                  "pointer",
                              }}
                            >
                              Edit
                            </button>

                            <button
                              onClick={() =>
                                onDelete(item)
                              }
                              style={{
                                background:
                                  "#dc2626",
                                color: "#fff",
                                border: "none",
                                padding:
                                  "8px 14px",
                                borderRadius:
                                  "6px",
                                cursor:
                                  "pointer",
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </React.Fragment>
              );
            }
          )}
        </tbody>
      </table>
    </div>
  );
}