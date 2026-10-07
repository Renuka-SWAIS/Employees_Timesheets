
"use client";

import { useEffect, useMemo, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import MainLayout from "../../../../components/layout/MainLayout";

import TimesheetToolbar from "../../../../components/timesheet/TimesheetToolbar";

import TimesheetTable from "../../../../components/timesheet/TimesheetTable";

import TimesheetForm from "../../../../components/timesheet/TimesheetForm";

import DeleteModal from "../../../../components/timesheet/DeleteModal";

import {
  getEmployeeTimesheets,
  updateTimesheet,
  deleteTimesheet,
  createTimesheet,
} from "../../../../services/timesheet";

import { getEmployee } from "../../../../services/employee";

export default function EmployeeTimesheetsPage() {
  const { employeeId } = useParams();

  const router = useRouter();

  const [employee, setEmployee] = useState(null);

  const [timesheets, setTimesheets] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [month, setMonth] = useState(
    new Date().toLocaleString("default", {
      month: "long",
    })
  );

  const [showForm, setShowForm] = useState(false);

  const [showDelete, setShowDelete] = useState(false);

  const [selected, setSelected] = useState(null);

  // =====================================================
  // Load Employee
  // =====================================================
  async function loadEmployee() {
    try {
      const data = await getEmployee(employeeId);

      setEmployee(data);
    } catch (err) {
      console.error(err);
    }
  }

  // =====================================================
  // Load Employee Timesheets
  // =====================================================
  async function loadTimesheets() {
    try {
      setLoading(true);

      const data = await getEmployeeTimesheets(employeeId);

      setTimesheets(data);
    } catch (err) {
      console.error(err);

      alert("Unable to load employee timesheets.");
    } finally {
      setLoading(false);
    }
  }

  // =====================================================
  // Initial Load
  // =====================================================
  useEffect(() => {
    if (employeeId) {
      loadEmployee();

      loadTimesheets();
    }
  }, [employeeId]);

  // =====================================================
  // Filter Timesheets
  // =====================================================
  const filteredTimesheets = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return timesheets.filter((item) => {
      if (!item.WorkDate) {
        return false;
      }

      const workDate = new Date(item.WorkDate);

      // -------------------------------------------------
      // Do not display future-date timesheets
      // -------------------------------------------------
      const today = new Date();

      today.setHours(0, 0, 0, 0);

      const entryDate = new Date(
        workDate.getFullYear(),
        workDate.getMonth(),
        workDate.getDate()
      );

      if (entryDate > today) {
        return false;
      }

      // -------------------------------------------------
      // Month Filter
      // -------------------------------------------------
      const matchesMonth =
        workDate.toLocaleString("default", {
          month: "long",
        }) === month;

      if (!matchesMonth) {
        return false;
      }

      // -------------------------------------------------
      // No Search
      // -------------------------------------------------
      if (!searchText) {
        return true;
      }

      const day = String(
        workDate.getDate()
      ).padStart(2, "0");

      const dayNumber = String(
        workDate.getDate()
      );

      const monthNumber = String(
        workDate.getMonth() + 1
      ).padStart(2, "0");

      const monthNumberWithoutZero = String(
        workDate.getMonth() + 1
      );

      const year = String(
        workDate.getFullYear()
      );

      const dateDDMM =
        `${day}/${monthNumber}`;

      const dateDM =
        `${dayNumber}/${monthNumberWithoutZero}`;

      const dateDDMMYYYY =
        `${day}/${monthNumber}/${year}`;

      const dateDMY =
        `${dayNumber}/${monthNumberWithoutZero}/${year}`;

      const dateISO =
        `${year}-${monthNumber}-${day}`;

      // -------------------------------------------------
      // Day Search
      // -------------------------------------------------
      if (/^\d{1,2}$/.test(searchText)) {
        if (searchText === "02") {
          return dayNumber === "2";
        }

        if (searchText.length === 2) {
          return day === searchText;
        }

        return day.includes(searchText);
      }

      // -------------------------------------------------
      // DD/MM or D/M Search
      // -------------------------------------------------
      if (
        /^\d{1,2}\/\d{1,2}$/.test(
          searchText
        )
      ) {
        return (
          dateDDMM === searchText ||
          dateDM === searchText
        );
      }

      // -------------------------------------------------
      // DD/MM/YYYY or D/M/YYYY Search
      // -------------------------------------------------
      if (
        /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(
          searchText
        )
      ) {
        return (
          dateDDMMYYYY === searchText ||
          dateDMY === searchText
        );
      }

      // -------------------------------------------------
      // YYYY-MM-DD Search
      // -------------------------------------------------
      if (
        /^\d{4}-\d{1,2}-\d{1,2}$/.test(
          searchText
        )
      ) {
        return dateISO === searchText;
      }

      // -------------------------------------------------
      // Project / Task Search
      // -------------------------------------------------
      const matchesProject =
        item.Project?.toLowerCase().includes(
          searchText
        );

      const matchesTask =
        item.TaskDescription?.toLowerCase().includes(
          searchText
        );

      return (
        matchesProject ||
        matchesTask
      );
    });
  }, [timesheets, search, month]);

  // =====================================================
  // Unique Dates Entered
  // =====================================================
  const uniqueDatesCount = useMemo(() => {
    return new Set(
      filteredTimesheets.map((item) =>
        new Date(
          item.WorkDate
        ).toLocaleDateString()
      )
    ).size;
  }, [filteredTimesheets]);

  // =====================================================
  // Unfilled Dates
  //
  // Previous months:
  //   Check the complete month.
  //
  // Current month:
  //   Check only from 1st until today.
  //
  // Future months:
  //   0 unfilled dates.
  // =====================================================
  const unfilledDates = useMemo(() => {
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const currentYear =
      today.getFullYear();

    const currentMonthIndex =
      today.getMonth();

    const monthIndex = new Date(
      `${month} 1, ${currentYear}`
    ).getMonth();

    // -------------------------------------------------
    // Future month
    // -------------------------------------------------
    if (
      monthIndex > currentMonthIndex
    ) {
      return [];
    }

    // -------------------------------------------------
    // Number of days in selected month
    // -------------------------------------------------
    const daysInMonth = new Date(
      currentYear,
      monthIndex + 1,
      0
    ).getDate();

    // -------------------------------------------------
    // For current month:
    // only count until today.
    //
    // For previous months:
    // count the complete month.
    // -------------------------------------------------
    const lastDay =
      monthIndex === currentMonthIndex
        ? today.getDate()
        : daysInMonth;

    // -------------------------------------------------
    // Dates already entered
    // -------------------------------------------------
    const enteredDates = new Set(
      timesheets
        .filter((item) => {
          if (!item.WorkDate) {
            return false;
          }

          const date = new Date(
            item.WorkDate
          );

          return (
            date.getFullYear() ===
              currentYear &&
            date.getMonth() ===
              monthIndex
          );
        })
        .map((item) => {
          const date = new Date(
            item.WorkDate
          );

          return date.getDate();
        })
    );

    // -------------------------------------------------
    // Build unfilled dates
    // -------------------------------------------------
    const dates = [];

    for (
      let day = 1;
      day <= lastDay;
      day++
    ) {
      if (!enteredDates.has(day)) {
        dates.push(
          new Date(
            currentYear,
            monthIndex,
            day
          )
        );
      }
    }

    return dates;
  }, [timesheets, month]);

  // =====================================================
  // Date Search
  // =====================================================
  const isDateSearch = useMemo(() => {
    const searchText =
      search.trim();

    if (!searchText) {
      return false;
    }

    return /^[0-9\/-]+$/.test(
      searchText
    );
  }, [search]);

  // =====================================================
  // Save Timesheet
  // =====================================================
  async function handleSave(formData) {
    try {
      if (selected) {
        await updateTimesheet(
          selected.EntryID,
          formData
        );
      } else {
        formData.EmployeeID =
          employeeId;

        await createTimesheet(
          formData
        );
      }

      await loadTimesheets();

      setShowForm(false);

      setSelected(null);
    } catch (err) {
      console.error(err);

      alert(
        "Unable to save timesheet."
      );
    }
  }

  // =====================================================
  // Delete Timesheet
  // =====================================================
  async function handleDelete() {
    try {
      await deleteTimesheet(
        selected.EntryID
      );

      await loadTimesheets();

      setShowDelete(false);

      setSelected(null);
    } catch (err) {
      console.error(err);

      alert(
        "Unable to delete timesheet."
      );
    }
  }

  return (
    <MainLayout>

      {/* =====================================================
          Navigation Buttons
          ===================================================== */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "20px",
        }}
      >

        <button
          onClick={() =>
            router.push("/employees")
          }
          style={{
            background: "#2563eb",
            color: "#fff",
            border: "none",
            padding: "10px 18px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          ← Back to Employees
        </button>

        <button
          onClick={() =>
            router.push(
              `/employees/${employeeId}/leaves`
            )
          }
          style={{
            background: "#16a34a",
            color: "#fff",
            border: "none",
            padding: "10px 18px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          🍃 View Leaves
        </button>

      </div>

      {/* =====================================================
          Page Title
          ===================================================== */}
      <h1
        style={{
          fontSize: "38px",
          fontWeight: "700",
          marginBottom: "20px",
        }}
      >
        {employee
          ? `${employee.EmployeeName} Timesheets`
          : "Employee Timesheets"}
      </h1>

      {/* =====================================================
          Employee Profile
          ===================================================== */}
      {employee && (
        <div
          className="employee-profile-card"
          style={{
            background: "#fff",
            borderRadius: "18px",
            padding: "30px 35px",
            marginBottom: "30px",
            boxShadow:
              "0 6px 18px rgba(0,0,0,0.08)",
            display: "flex",
            alignItems: "center",
            gap: "35px",
          }}
        >

          <div
            style={{
              width: "140px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexShrink: 0,
            }}
          >

            <img
              src={
                employee.PhotoURL
                  ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${employee.PhotoURL}`
                  : "/profile.png"
              }
              alt={employee.EmployeeName}
              onError={(e) => {
                e.target.src =
                  "/profile.png";
              }}
              style={{
                width: "110px",
                height: "110px",
                borderRadius: "50%",
                objectFit: "cover",
                objectPosition: "center",
                border:
                  "4px solid #2563eb",
                background: "#f8fafc",
                display: "block",
              }}
            />

          </div>

          <div
            className="employee-profile-details"
            style={{
              flex: 1,
            }}
          >

            <h2
              style={{
                margin: 0,
                marginBottom: "20px",
                fontSize: "32px",
                fontWeight: "700",
                color: "#1e3a8a",
              }}
            >
              {employee.EmployeeName}
            </h2>

            <div
              className="employee-profile-grid"
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(2, minmax(250px, 1fr))",
                columnGap: "60px",
                rowGap: "18px",
              }}
            >

              <div>
                <div
                  style={{
                    fontWeight: 700,
                  }}
                >
                  Employee Code
                </div>

                <div>
                  {employee.EmployeeCode}
                </div>
              </div>

              <div>
                <div
                  style={{
                    fontWeight: 700,
                  }}
                >
                  Role
                </div>

                <div>
                  {employee.RoleType}
                </div>
              </div>

              <div>
                <div
                  style={{
                    fontWeight: 700,
                  }}
                >
                  Email
                </div>

                <div>
                  {employee.EmailID}
                </div>
              </div>

              <div>
                <div
                  style={{
                    fontWeight: 700,
                  }}
                >
                  Department
                </div>

                <div>
                  {employee.Department}
                </div>
              </div>

              <div>
                <div
                  style={{
                    fontWeight: 700,
                  }}
                >
                  Designation
                </div>

                <div>
                  {employee.Designation}
                </div>
              </div>

              <div>
                <div
                  style={{
                    fontWeight: 700,
                    marginBottom: "5px",
                  }}
                >
                  Status
                </div>

                <span
                  style={{
                    display: "inline-block",
                    background:
                      employee.Status ===
                      "Active"
                        ? "#DCFCE7"
                        : "#FEE2E2",
                    color:
                      employee.Status ===
                      "Active"
                        ? "#15803D"
                        : "#B91C1C",
                    padding: "6px 16px",
                    borderRadius: "20px",
                    fontWeight: "600",
                  }}
                >
                  {employee.Status}
                </span>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* =====================================================
          Summary Cards
          ===================================================== */}
      <div
        style={{
          display: "flex",
          gap: "15px",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >

        {/* Unique Dates */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "12px",
            background: "#eff6ff",
            border:
              "1px solid #bfdbfe",
            borderRadius: "12px",
            padding: "12px 20px",
          }}
        >

          <span
            style={{
              fontSize: "15px",
              fontWeight: "600",
              color: "#475569",
            }}
          >
            Unique Dates Entered
          </span>

          <span
            style={{
              fontSize: "22px",
              fontWeight: "700",
              color: "#2563eb",
            }}
          >
            {uniqueDatesCount}
          </span>

        </div>

        {/* Unfilled Dates */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "12px",
            background: "#fff7ed",
            border:
              "1px solid #fed7aa",
            borderRadius: "12px",
            padding: "12px 20px",
          }}
        >

          <span
            style={{
              fontSize: "15px",
              fontWeight: "600",
              color: "#475569",
            }}
          >
            Unfilled Dates
          </span>

          <span
            style={{
              fontSize: "22px",
              fontWeight: "700",
              color: "#ea580c",
            }}
          >
            {unfilledDates.length}
          </span>

        </div>

      </div>

      {/* =====================================================
          Unfilled Dates List
          ===================================================== */}
      {unfilledDates.length > 0 && (
        <div
          style={{
            background: "#fff7ed",
            border:
              "1px solid #fed7aa",
            borderRadius: "12px",
            padding: "16px 20px",
            marginBottom: "20px",
          }}
        >

          <div
            style={{
              fontWeight: "700",
              color: "#9a3412",
              marginBottom: "10px",
            }}
          >
            Unfilled Dates
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
            }}
          >

            {unfilledDates.map(
              (date) => (
                <span
                  key={date.toISOString()}
                  style={{
                    background:
                      "#ffffff",
                    border:
                      "1px solid #fdba74",
                    borderRadius: "8px",
                    padding:
                      "6px 10px",
                    fontSize: "14px",
                    color: "#9a3412",
                    fontWeight: "600",
                  }}
                >
                  {date.toLocaleDateString(
                    "en-GB",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }
                  )}
                </span>
              )
            )}

          </div>

        </div>
      )}

      {/* =====================================================
          Toolbar
          ===================================================== */}
      <TimesheetToolbar
        search={search}
        setSearch={setSearch}
        month={month}
        setMonth={setMonth}
        onRefresh={loadTimesheets}
        onAdd={() => {
          setSelected(null);

          setShowForm(true);
        }}
      />

      {/* =====================================================
          Search Result
          ===================================================== */}
      {filteredTimesheets.length === 0 &&
      search.trim() ? (
        <div
          style={{
            marginTop: "20px",
            padding: "20px 24px",
            background: "#fff7ed",
            border:
              "1px solid #fed7aa",
            borderRadius: "10px",
            color: "#c2410c",
            fontSize: "15px",
            fontWeight: "600",
          }}
        >

          {isDateSearch ? (
            <>
              No timesheet entries
              found for{" "}
              <strong>
                "{search}"
              </strong>
              .
              <br />
              Please enter a date
              with timesheet
              entries.
            </>
          ) : (
            <>
              No timesheet entries
              found for{" "}
              <strong>
                "{search}"
              </strong>
              .
            </>
          )}

        </div>
      ) : (
        <TimesheetTable
          loading={loading}
          timesheets={
            filteredTimesheets
          }
          onEdit={(row) => {
            setSelected(row);

            setShowForm(true);
          }}
          onDelete={(row) => {
            setSelected(row);

            setShowDelete(true);
          }}
        />
      )}

      {/* =====================================================
          Timesheet Form
          ===================================================== */}
      <TimesheetForm
        open={showForm}
        editData={selected}
        isAdmin={true}
        onClose={() => {
          setShowForm(false);

          setSelected(null);
        }}
        onSave={handleSave}
      />

      {/* =====================================================
          Delete Modal
          ===================================================== */}
      <DeleteModal
        open={showDelete}
        onClose={() => {
          setShowDelete(false);

          setSelected(null);
        }}
        onConfirm={handleDelete}
      />

    </MainLayout>
  );
}

