export default function RecentTimesheets({ timesheets }) {

  return (

    <div className="tableCard">

      <h2>Recent Timesheets</h2>

      <table>

        <thead>

          <tr>

            <th>Date</th>

            <th>Project</th>

            <th>Hours</th>

            <th>Remarks</th>

          </tr>

        </thead>

        <tbody>

          {timesheets.slice(0, 5).map((item) => (

            <tr key={item.EntryID}>

              <td>{item.WorkDate}</td>

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