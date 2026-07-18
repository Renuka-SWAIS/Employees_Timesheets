"use client";

export default function EmployeeTable({
  employees = [],
  loading,
  onViewEmployee,
  onEditEmployee,
  onDeleteEmployee,
  onViewTimesheets,
}) {
  if (loading) {
    return <h3>Loading Employees...</h3>;
  }

  if (employees.length === 0) {
    return <h3>No Employees Found</h3>;
  }

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr style={{ background: "#2563eb", color: "#fff" }}>
            <th style={th}>Code</th>
            <th style={th}>Name</th>
            <th style={th}>Email</th>
            <th style={th}>Department</th>
            <th style={th}>Designation</th>
            <th style={th}>Role</th>
            <th style={th}>Status</th>
            <th style={th}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((emp) => (
            <tr key={emp.EmployeeID}>
              <td style={td}>{emp.EmployeeCode}</td>

              <td style={td}>{emp.EmployeeName}</td>

              <td style={td}>{emp.EmailID}</td>

              <td style={td}>{emp.Department}</td>

              <td style={td}>{emp.Designation}</td>

              <td style={td}>{emp.RoleType}</td>

              <td style={td}>
                <span
                  style={{
                    background:
                      emp.Status === "Active"
                        ? "#DCFCE7"
                        : "#FEE2E2",

                    color:
                      emp.Status === "Active"
                        ? "#15803D"
                        : "#B91C1C",

                    padding: "6px 12px",
                    borderRadius: "20px",
                    fontWeight: "600",
                  }}
                >
                  {emp.Status}
                </span>
              </td>

              <td style={td}>
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    style={viewBtn}
                    onClick={() => onViewEmployee(emp)}
                  >
                    View
                  </button>

                  <button
                    style={timesheetBtn}
                    onClick={() =>
                      onViewTimesheets &&
                      onViewTimesheets(emp)
                    }
                  >
                    Timesheets
                  </button>

                  <button
                    style={editBtn}
                    onClick={() =>
                      onEditEmployee &&
                      onEditEmployee(emp)
                    }
                  >
                    Edit
                  </button>

                  <button
                    style={deleteBtn}
                    onClick={() => {
                      if (
                        window.confirm(
                          `Delete ${emp.EmployeeName}?`
                        )
                      ) {
                        onDeleteEmployee &&
                          onDeleteEmployee(emp.EmployeeID);
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
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
  borderBottom: "1px solid #eee",
};

const viewBtn = {
  background: "#2563eb",
  color: "#fff",
  border: "none",
  padding: "8px 14px",
  borderRadius: "6px",
  cursor: "pointer",
};

const timesheetBtn = {
  background: "#16a34a",
  color: "#fff",
  border: "none",
  padding: "8px 14px",
  borderRadius: "6px",
  cursor: "pointer",
};

const editBtn = {
  background: "#f59e0b",
  color: "#fff",
  border: "none",
  padding: "8px 14px",
  borderRadius: "6px",
  cursor: "pointer",
};

const deleteBtn = {
  background: "#dc2626",
  color: "#fff",
  border: "none",
  padding: "8px 14px",
  borderRadius: "6px",
  cursor: "pointer",
};