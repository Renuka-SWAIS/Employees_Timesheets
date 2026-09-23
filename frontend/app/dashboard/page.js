"use client";

import { useEffect, useMemo, useState } from "react";

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

  // =====================================================
  // Admin - My Work Summary
  // =====================================================

  const myWork = useMemo(() => {

    if (!user || !timesheets) {
      return {
        totalHours: 0,
        workingDays: 0,
      };
    }

    const myEmployeeId = String(user.EmployeeID || "");

    const myTimesheets = timesheets.filter(
      (item) =>
        String(item.EmployeeID || "") === myEmployeeId
    );

    const totalHours = myTimesheets.reduce(
      (sum, item) =>
        sum + Number(item.HoursWorked || 0),
      0
    );

    const workingDays = new Set(
      myTimesheets
        .map((item) => item.WorkDate)
        .filter(Boolean)
    ).size;

    return {
      totalHours,
      workingDays,
    };

  }, [user, timesheets]);

  if (loading) {
    return <p>Loading Dashboard...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <MainLayout>

      {/* =====================================================
          Welcome Section
          ===================================================== */}

      <div
        style={{
          marginBottom: "20px",
          padding: "15px 20px",
          background: "#f8f9fa",
          borderRadius: "10px",
          border: "1px solid #e5e7eb",

          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >

        {/* User Information */}

        <div>
          <h2 style={{ margin: 0 }}>
            Welcome, {user?.EmployeeName}
          </h2>

          <p
            style={{
              marginTop: "8px",
              marginBottom: 0,
              color: "#666",
            }}
          >
            Role: {user?.RoleType}
          </p>
        </div>


        {/* Admin My Work */}

        {user?.RoleType === "Admin" && (
          <div
            style={{
              minWidth: "280px",
              padding: "14px 18px",
              background: "#ffffff",
              borderRadius: "10px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >

            <h3
              style={{
                margin: 0,
                marginBottom: "10px",
                fontSize: "17px",
                color: "#333",
              }}
            >
              My Work
            </h3>

            <div
              style={{
                display: "flex",
                gap: "28px",
              }}
            >

              <div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "#777",
                  }}
                >
                  My Hours
                </div>

                <div
                  style={{
                    fontSize: "22px",
                    fontWeight: "700",
                    color: "#2563eb",
                    marginTop: "3px",
                  }}
                >
                  {myWork.totalHours}
                </div>
              </div>


              <div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "#777",
                  }}
                >
                  Working Days
                </div>

                <div
                  style={{
                    fontSize: "22px",
                    fontWeight: "700",
                    color: "#2563eb",
                    marginTop: "3px",
                  }}
                >
                  {myWork.workingDays}
                </div>
              </div>

            </div>

          </div>
        )}

      </div>


      {/* =====================================================
          Team Overview
          ===================================================== */}

      <DashboardCards
        timesheets={timesheets}
      />


      {/* =====================================================
          Recent Team Timesheets
          ===================================================== */}

      <RecentTimesheets
        timesheets={timesheets}
      />

    </MainLayout>
  );
}