"use client";

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
          {timesheets.map((item) => (
            <tr key={item.EntryID}>
              <td>
                {item.WorkDate
                  ? item.WorkDate.split("T")[0]
                  : "-"}
              </td>

              <td>{item.Project}</td>

              <td>{item.TaskDescription}</td>

              <td>{item.HoursWorked}</td>

              <td>{item.Remarks || "-"}</td>

              {!readOnly && (
                <td
                  style={{
                    display: "flex",
                    gap: "10px",
                  }}
                >
                  <button
                    onClick={() => onEdit(item)}
                    style={{
                      background: "#2563eb",
                      color: "#fff",
                      border: "none",
                      padding: "8px 14px",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onDelete(item)}
                    style={{
                      background: "#dc2626",
                      color: "#fff",
                      border: "none",
                      padding: "8px 14px",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}