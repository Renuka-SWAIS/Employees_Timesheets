"use client";

import { useEffect, useState } from "react";

import MainLayout from "../../components/layout/MainLayout";
import DashboardCards from "../../components/dashboard/DashboardCards";
import RecentTimesheets from "../../components/dashboard/RecentTimesheets";

import useTimesheet from "../../hooks/useTimesheet";

export default function Dashboard() {

  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const { timesheets, loading, error } = useTimesheet();

  if (loading) {
    return <p>Loading Dashboard...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <MainLayout>

      <div
        style={{
          marginBottom: "20px",
          padding: "15px 20px",
          background: "#f8f9fa",
          borderRadius: "10px",
          border: "1px solid #e5e7eb",
        }}
      >
        <h2 style={{ margin: 0 }}>
          Welcome, {user?.EmployeeName}
        </h2>

        <p style={{ marginTop: "8px", color: "#666" }}>
          Role: {user?.RoleType}
        </p>
      </div>

      <DashboardCards
        timesheets={timesheets}
      />

      <RecentTimesheets
        timesheets={timesheets}
      />

    </MainLayout>
  );
}