"use client";

export default function RecentTimesheets({ timesheets }) {
  return (
    <div className="tableCard">
      <h2>Recent Timesheets</h2>

      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Employee</th>
            <th>Project</th>
            <th>Hours</th>
            <th>Remarks</th>
          </tr>
        </thead>

        <tbody>
          {timesheets.slice(0, 5).map((item) => (
            <tr key={item.EntryID}>
              <td>
                <div>{item.WorkDate}</div>

                <div
                  style={{
                    fontSize: "12px",
                    color: "#64748b",
                    marginTop: "4px",
                  }}
                >
                  {new Date(item.WorkDate).toLocaleDateString("en-US", {
                    weekday: "short",
                  })}
                </div>
              </td>

              <td>
                <div>{item.EmployeeName || "Unknown"}</div>

                {item.EmployeeCode && (
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#64748b",
                      marginTop: "4px",
                    }}
                  >
                    {item.EmployeeCode}
                  </div>
                )}
              </td>

              <td>{item.Project}</td>

              <td>{item.HoursWorked}</td>

              <td>{item.Remarks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}