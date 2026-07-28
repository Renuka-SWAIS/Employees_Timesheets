"use client";

export default function LeaveTable({
  loading,
  leaves,
  onEdit,
  onDelete,
}) {
  if (loading) {
    return (
      <div
        style={{
          background: "#fff",
          padding: "25px",
          borderRadius: "12px",
          textAlign: "center",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,.08)",
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead
          style={{
            background: "#2563eb",
            color: "#fff",
          }}
        >
          <tr>
            <th style={th}>From Date</th>
            <th style={th}>To Date</th>
            <th style={th}>Leave Type</th>
            <th style={th}>Total Days</th>
            <th style={th}>Reason</th>
            <th style={th}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {leaves.length === 0 ? (
            <tr>
              <td colSpan={6} style={td}>
                No Leave Records
              </td>
            </tr>
          ) : (
            leaves.map((leave) => (
              <tr key={leave.LeaveID}>
                <td style={td}>{leave.FromDate}</td>

                <td style={td}>{leave.ToDate}</td>

                <td style={td}>{leave.LeaveType}</td>

                <td style={td}>{leave.TotalDays}</td>

                <td style={td}>{leave.Reason}</td>

                <td style={td}>
                  <button
                    onClick={() => onEdit(leave)}
                    style={editBtn}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onDelete(leave)}
                    style={deleteBtn}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

const th = {
  padding: "14px",
  textAlign: "left",
};

const td = {
  padding: "14px",
  borderBottom: "1px solid #e5e7eb",
};

const editBtn = {
  background: "#2563eb",
  color: "#fff",
  border: "none",
  padding: "7px 12px",
  borderRadius: "6px",
  cursor: "pointer",
  marginRight: "8px",
};

const deleteBtn = {
  background: "#dc2626",
  color: "#fff",
  border: "none",
  padding: "7px 12px",
  borderRadius: "6px",
  cursor: "pointer",
};