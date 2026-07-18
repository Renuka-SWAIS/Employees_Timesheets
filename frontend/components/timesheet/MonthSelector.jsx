"use client";

export default function MonthSelector({
  month,
  setMonth,
}) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <select
      value={month}
      onChange={(e) => setMonth(e.target.value)}
      style={{
        padding: "10px",
        borderRadius: "8px",
        border: "1px solid #ccc",
        cursor: "pointer",
      }}
    >
      {months.map((m) => (
        <option key={m} value={m}>
          {m}
        </option>
      ))}
    </select>
  );
}