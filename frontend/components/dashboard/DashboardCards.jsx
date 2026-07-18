"use client";

import StatCard from "./StatCard";

export default function DashboardCards({ timesheets }) {

  // Total Hours
  const totalHours = timesheets.reduce(
    (sum, item) => sum + Number(item.HoursWorked || 0),
    0
  );

  // Unique working days
  const totalDays = new Set(
    timesheets.map((item) => item.WorkDate)
  ).size;

  // Current date
  const today = new Date();

  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();

  // Dates already filled for current month
  const completedDays = new Set(
    timesheets
      .filter((item) => {
        const workDate = new Date(item.WorkDate);

        return (
          workDate.getFullYear() === currentYear &&
          workDate.getMonth() + 1 === currentMonth
        );
      })
      .map((item) => new Date(item.WorkDate).getDate())
  );

  // Count missing dates from 1st until today
  let pendingEntries = 0;

  for (let day = 1; day <= currentDay; day++) {
    if (!completedDays.has(day)) {
      pendingEntries++;
    }
  }

  // Unique projects
  const totalProjects = new Set(
    timesheets.map((item) => item.Project)
  ).size;

  return (
    <div className="cards">

      <StatCard
        title="Total Hours"
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
  );
}