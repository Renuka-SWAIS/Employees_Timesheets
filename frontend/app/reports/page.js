"use client";

import { useEffect, useMemo, useState } from "react";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import MainLayout from "../../components/layout/MainLayout";
import { apiRequest } from "../../services/api";

export default function ReportsPage() {
  // ==========================================
  // COMMON DATA
  // ==========================================
  const [employees, setEmployees] = useState([]);
  const [timesheets, setTimesheets] = useState([]);
  const [tasks, setTasks] = useState([]);

  // ==========================================
  // REPORT TYPE
  // ==========================================
  const [reportType, setReportType] = useState("unfilled");

  // ==========================================
  // UNFILLED DATE REPORT
  // ==========================================
  const [employeeId, setEmployeeId] = useState("all");

  // ==========================================
  // TASK REPORT
  // ==========================================
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [taskDropdownOpen, setTaskDropdownOpen] = useState(false);
  const [taskEmployeeId, setTaskEmployeeId] = useState("active");

  // ==========================================
  // DATE FILTERS
  // ==========================================
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // ==========================================
  // REPORT STATE
  // ==========================================
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  // ==========================================
  // LOAD EMPLOYEES
  // ==========================================
  async function loadEmployees() {
    try {
      const data = await apiRequest("/employees/");
      setEmployees(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Unable to load employees:", err);
    }
  }

  // ==========================================
  // LOAD TIMESHEETS
  // ==========================================
  async function loadTimesheets() {
    try {
      const data = await apiRequest("/timesheet/");
      setTimesheets(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Unable to load timesheets:", err);
    }
  }

  // ==========================================
  // LOAD TASKS
  // ==========================================
  async function loadTasks() {
    try {
      const data = await apiRequest("/tasks/");
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Unable to load tasks:", err);
    }
  }

  // ==========================================
  // INITIAL DATA LOAD
  // ==========================================
  useEffect(() => {
    async function loadData() {
      setLoading(true);

      await Promise.all([
        loadEmployees(),
        loadTimesheets(),
        loadTasks(),
      ]);

      setLoading(false);
    }

    loadData();
  }, []);

  // ==========================================
  // EMPLOYEE HELPERS
  // ==========================================
  function getEmployeeId(employee) {
    return (
      employee.EmployeeID ||
      employee.employeeid ||
      employee.EmployeeId
    );
  }

  function getEmployeeName(employee) {
    return (
      employee.EmployeeName ||
      employee.employeename ||
      "Unknown Employee"
    );
  }

  function getEmployeeStatus(employee) {
    return (
      employee.Status ||
      employee.status ||
      employee.StatusType ||
      employee.statustype ||
      employee.EmployeeStatus ||
      employee.employeestatus ||
      ""
    );
  }

  // ==========================================
  // TASK HELPERS
  // ==========================================
  function getTaskId(task) {
    return (
      task.TaskID ||
      task.taskid ||
      task.TaskId ||
      task.id
    );
  }

  function getTaskName(task) {
    return (
      task.TaskName ||
      task.taskname ||
      task.Name ||
      task.name ||
      `Task ${getTaskId(task)}`
    );
  }

  // ==========================================
  // TASK DROPDOWN
  // ==========================================
  function toggleTask(taskId) {
    setSelectedTasks((prev) => {
      const id = String(taskId);

      if (
        prev.some(
          (item) => String(item) === id
        )
      ) {
        return prev.filter(
          (item) =>
            String(item) !== id
        );
      }

      return [...prev, taskId];
    });
  }

  // ==========================================
  // SELECT ALL TASKS
  // ==========================================
  function selectAllTasks() {
    setSelectedTasks([]);
    setTaskDropdownOpen(false);
  }

  // ==========================================
  // UNFILLED DATES REPORT
  // ==========================================
  const unfilledReport = useMemo(() => {
    if (
      reportType !== "unfilled" ||
      !generated ||
      !fromDate ||
      !toDate
    ) {
      return [];
    }

    const start = new Date(
      `${fromDate}T00:00:00`
    );

    const end = new Date(
      `${toDate}T23:59:59`
    );

    if (start > end) {
      return [];
    }

    let selectedEmployees = employees;

    if (employeeId !== "all") {
      selectedEmployees =
        employees.filter(
          (employee) =>
            String(
              getEmployeeId(employee)
            ) === String(employeeId)
        );
    }

    const result = [];

    selectedEmployees.forEach((employee) => {
      const id = getEmployeeId(employee);

      const enteredDates = new Set();

      timesheets.forEach((item) => {
        const itemEmployeeId =
          item.EmployeeID ||
          item.employeeid ||
          item.EmployeeId;

        if (
          String(itemEmployeeId) !==
          String(id)
        ) {
          return;
        }

        if (!item.WorkDate) {
          return;
        }

        const workDate = new Date(
          item.WorkDate
        );

        if (
          workDate >= start &&
          workDate <= end
        ) {
          const dateKey =
            `${workDate.getFullYear()}-` +
            `${String(
              workDate.getMonth() + 1
            ).padStart(2, "0")}-` +
            `${String(
              workDate.getDate()
            ).padStart(2, "0")}`;

          enteredDates.add(dateKey);
        }
      });

      const current = new Date(start);

      while (current <= end) {
        const dateKey =
          `${current.getFullYear()}-` +
          `${String(
            current.getMonth() + 1
          ).padStart(2, "0")}-` +
          `${String(
            current.getDate()
          ).padStart(2, "0")}`;

        if (!enteredDates.has(dateKey)) {
          result.push({
            employeeId: id,
            employeeName:
              getEmployeeName(employee),
            date: new Date(current),
          });
        }

        current.setDate(
          current.getDate() + 1
        );
      }
    });

    return result;
  }, [
    reportType,
    generated,
    fromDate,
    toDate,
    employeeId,
    employees,
    timesheets,
  ]);

  // ==========================================
  // TASK REPORT
  // ==========================================
  const taskReport = useMemo(() => {
    if (
      reportType !== "task" ||
      !generated ||
      !fromDate ||
      !toDate
    ) {
      return [];
    }

    const start = new Date(
      `${fromDate}T00:00:00`
    );

    const end = new Date(
      `${toDate}T23:59:59`
    );

    if (start > end) {
      return [];
    }

    const result = [];

    timesheets.forEach((item) => {
      if (!item.WorkDate) {
        return;
      }

      const workDate = new Date(
        item.WorkDate
      );

      // Date filter
      if (
        workDate < start ||
        workDate > end
      ) {
        return;
      }

      // ========================================
      // EMPLOYEE ID
      // ========================================
      const itemEmployeeId =
        item.EmployeeID ||
        item.employeeid ||
        item.EmployeeId;

      // ========================================
      // EMPLOYEE FILTER
      // ========================================
      if (
        taskEmployeeId !== "active" &&
        taskEmployeeId !== "all" &&
        String(itemEmployeeId) !==
          String(taskEmployeeId)
      ) {
        return;
      }

      // ========================================
      // ACTIVE EMPLOYEES ONLY
      // ========================================
      if (taskEmployeeId === "active") {
        const employee = employees.find(
          (emp) =>
            String(
              getEmployeeId(emp)
            ) ===
            String(itemEmployeeId)
        );

        if (!employee) {
          return;
        }

        const status = String(
          getEmployeeStatus(employee)
        )
          .trim()
          .toLowerCase();

        if (
          status !== "active" &&
          status !== "active employee"
        ) {
          return;
        }
      }

      // ========================================
      // TASK ID
      // ========================================
      const itemTaskId =
        item.TaskID ||
        item.taskid ||
        item.TaskId;

      // ========================================
      // TASK FILTER
      // ========================================
      if (
        selectedTasks.length > 0 &&
        !selectedTasks.some(
          (id) =>
            String(id) ===
            String(itemTaskId)
        )
      ) {
        return;
      }

      // ========================================
      // EMPLOYEE DETAILS
      // ========================================
      const employee = employees.find(
        (emp) =>
          String(
            getEmployeeId(emp)
          ) ===
          String(itemEmployeeId)
      );

      // ========================================
      // TASK DETAILS
      // ========================================
      const task = tasks.find(
        (taskItem) =>
          String(
            getTaskId(taskItem)
          ) ===
          String(itemTaskId)
      );

      result.push({
        taskId: itemTaskId,

        taskName:
          task?.TaskName ||
          task?.taskname ||
          task?.Name ||
          task?.name ||
          item.Project ||
          "Unknown Task",

        employeeName: employee
          ? getEmployeeName(employee)
          : "Unknown Employee",

        workDate,

        hours:
          item.HoursWorked ??
          item.hoursworked ??
          item.Hours ??
          "",

        project:
          item.Project ||
          item.project ||
          "",

        remarks:
          item.Remarks ||
          item.remarks ||
          "",

        taskDescription:
          item.TaskDescription ||
          item.taskdescription ||
          "",
      });
    });

    return result.sort(
      (a, b) =>
        b.workDate - a.workDate
    );
  }, [
    reportType,
    generated,
    fromDate,
    toDate,
    taskEmployeeId,
    selectedTasks,
    timesheets,
    employees,
    tasks,
  ]);

  // ==========================================
  // GENERATE REPORT
  // ==========================================
  function handleGenerate() {
    if (!fromDate || !toDate) {
      alert(
        "Please select From Date and To Date."
      );
      return;
    }

    if (fromDate > toDate) {
      alert(
        "From Date cannot be after To Date."
      );
      return;
    }

    setGenerated(true);
    setTaskDropdownOpen(false);
  }

  // ==========================================
  // EXPORT REPORT TO PDF
  // ==========================================
  function handleExportPDF() {
    const doc = new jsPDF({
      orientation:
        reportType === "task"
          ? "landscape"
          : "portrait",
      unit: "mm",
      format: "a4",
    });

    const reportTitle =
      reportType === "unfilled"
        ? "Unfilled Dates Report"
        : "Task ID Report";

    // ========================================
    // PDF TITLE
    // ========================================
    doc.setFontSize(18);
    doc.setFont(undefined, "bold");
    doc.text(reportTitle, 14, 18);

    // ========================================
    // DATE RANGE
    // ========================================
    doc.setFontSize(10);
    doc.setFont(undefined, "normal");

    doc.text(
      `From Date: ${fromDate}    To Date: ${toDate}`,
      14,
      26
    );

    let tableHeaders = [];
    let tableRows = [];

    // ========================================
    // UNFILLED DATES PDF
    // ========================================
    if (reportType === "unfilled") {
      tableHeaders = [
        "Employee",
        "Unfilled Date",
      ];

      tableRows = unfilledReport.map(
        (row) => [
          row.employeeName,
          row.date.toLocaleDateString(
            "en-GB",
            {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }
          ),
        ]
      );
    }

    // ========================================
    // TASK REPORT PDF
    // ========================================
    if (reportType === "task") {
      tableHeaders = [
        "Task ID",
        "Task",
        "Employee",
        "Date",
        "Hours",
        "Project",
        "Remarks",
      ];

      tableRows = taskReport.map(
        (row) => [
          row.taskId || "",
          row.taskName || "",
          row.employeeName || "",
          row.workDate.toLocaleDateString(
            "en-GB",
            {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }
          ),
          row.hours ?? "",
          row.project || "",
          row.remarks ||
            row.taskDescription ||
            "",
        ]
      );
    }

    // ========================================
    // PDF TABLE
    // ========================================
    autoTable(doc, {
      startY: 32,
      head: [tableHeaders],
      body: tableRows,

      theme: "grid",

      styles: {
        fontSize:
          reportType === "task"
            ? 7
            : 9,
        cellPadding: 2.5,
        overflow: "linebreak",
        valign: "top",
      },

      headStyles: {
        fontStyle: "bold",
      },

      columnStyles:
        reportType === "task"
          ? {
              0: { cellWidth: 38 },
              1: { cellWidth: 45 },
              2: { cellWidth: 32 },
              3: { cellWidth: 25 },
              4: { cellWidth: 18 },
              5: { cellWidth: 30 },
              6: { cellWidth: 55 },
            }
          : {
              0: { cellWidth: 80 },
              1: { cellWidth: 45 },
            },
    });

    // ========================================
    // DOWNLOAD PDF
    // ========================================
    const fileName =
      reportType === "unfilled"
        ? `Unfilled_Dates_Report_${fromDate}_to_${toDate}.pdf`
        : `Task_ID_Report_${fromDate}_to_${toDate}.pdf`;

    doc.save(fileName);
  }

  // ==========================================
  // REPORT TYPE CHANGE
  // ==========================================
  function handleReportTypeChange(e) {
    setReportType(e.target.value);

    setGenerated(false);

    setFromDate("");
    setToDate("");

    setEmployeeId("all");

    setTaskEmployeeId("active");

    setSelectedTasks([]);

    setTaskDropdownOpen(false);
  }

  // ==========================================
  // RETURN UI
  // ==========================================
  return (
    <MainLayout>
      <div className="reports-page">

        {/* ======================================
            PAGE TITLE
        ====================================== */}
        <h1
          className="reports-title"
          style={{
            fontSize: "32px",
            fontWeight: "700",
            marginBottom: "25px",
          }}
        >
          Reports
        </h1>

        {/* ======================================
            FILTER CARD
        ====================================== */}
        <div
          className="reports-filter-card"
          style={{
            background: "#ffffff",
            padding: "25px",
            borderRadius: "14px",
            boxShadow:
              "0 4px 14px rgba(0,0,0,0.08)",
            marginBottom: "25px",
          }}
        >

          {/* ====================================
              REPORT TYPE
          ==================================== */}
          <div
            className="report-type-container"
            style={{
              maxWidth: "350px",
              marginBottom: "25px",
            }}
          >
            <label
              style={{
                display: "block",
                fontWeight: "600",
                marginBottom: "8px",
              }}
            >
              Report Type
            </label>

            <select
              value={reportType}
              onChange={
                handleReportTypeChange
              }
              style={{
                width: "100%",
                padding: "11px",
                border:
                  "1px solid #cbd5e1",
                borderRadius: "8px",
                background: "#fff",
                boxSizing: "border-box",
              }}
            >
              <option value="unfilled">
                Unfilled Dates
              </option>

              <option value="task">
                Report by Task ID
              </option>
            </select>
          </div>

          {/* ====================================
              UNFILLED DATES FILTER
          ==================================== */}
          {reportType === "unfilled" && (
            <div
              className="reports-filter-grid"
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(3, minmax(200px, 1fr))",
                gap: "20px",
                alignItems: "end",
              }}
            >

              {/* Employee */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontWeight: "600",
                    marginBottom: "8px",
                  }}
                >
                  Employee
                </label>

                <select
                  value={employeeId}
                  onChange={(e) =>
                    setEmployeeId(
                      e.target.value
                    )
                  }
                  style={{
                    width: "100%",
                    padding: "11px",
                    border:
                      "1px solid #cbd5e1",
                    borderRadius: "8px",
                    background: "#fff",
                    boxSizing: "border-box",
                  }}
                >
                  <option value="all">
                    All Employees
                  </option>

                  {employees.map(
                    (employee) => {
                      const id =
                        getEmployeeId(
                          employee
                        );

                      return (
                        <option
                          key={id}
                          value={id}
                        >
                          {getEmployeeName(
                            employee
                          )}
                        </option>
                      );
                    }
                  )}
                </select>
              </div>

              <DateInput
                label="From Date"
                value={fromDate}
                onChange={setFromDate}
              />

              <DateInput
                label="To Date"
                value={toDate}
                onChange={setToDate}
              />
            </div>
          )}

          {/* ====================================
              TASK REPORT FILTER
          ==================================== */}
          {reportType === "task" && (
            <>

              <div
                className="task-filter-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(2, minmax(250px, 1fr))",
                  gap: "20px",
                  marginBottom: "20px",
                }}
              >

                {/* TASK DROPDOWN */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontWeight: "600",
                      marginBottom: "8px",
                    }}
                  >
                    Task ID
                  </label>

                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                    }}
                  >

                    {/* Dropdown Button */}
                    <button
                      className="task-dropdown-button"
                      type="button"
                      onClick={() =>
                        setTaskDropdownOpen(
                          !taskDropdownOpen
                        )
                      }
                      style={{
                        width: "100%",
                        padding:
                          "11px 14px",
                        border:
                          "1px solid #cbd5e1",
                        borderRadius: "8px",
                        background:
                          "#ffffff",
                        cursor: "pointer",
                        textAlign: "left",
                        display: "flex",
                        justifyContent:
                          "space-between",
                        alignItems:
                          "center",
                        fontSize: "14px",
                        boxSizing: "border-box",
                        minWidth: "0",
                      }}
                    >
                      <span
                        style={{
                          minWidth: "0",
                          overflowWrap:
                            "break-word",
                        }}
                      >
                        {selectedTasks.length ===
                        0
                          ? "All Tasks"
                          : `${selectedTasks.length} Task${
                              selectedTasks.length >
                              1
                                ? "s"
                                : ""
                            } Selected`}
                      </span>

                      <span
                        style={{
                          flexShrink: 0,
                          marginLeft: "8px",
                        }}
                      >
                        {taskDropdownOpen
                          ? "▲"
                          : "▼"}
                      </span>
                    </button>

                    {/* Dropdown List */}
                    {taskDropdownOpen && (
                      <div
                        className="task-dropdown-list"
                        style={{
                          position:
                            "absolute",
                          top:
                            "calc(100% + 5px)",
                          left: 0,
                          right: 0,
                          background:
                            "#ffffff",
                          border:
                            "1px solid #cbd5e1",
                          borderRadius:
                            "8px",
                          boxShadow:
                            "0 8px 20px rgba(0,0,0,0.12)",
                          zIndex: 1000,
                          maxHeight:
                            "280px",
                          overflowY:
                            "auto",
                          width: "100%",
                          boxSizing:
                            "border-box",
                        }}
                      >

                        {/* All Tasks */}
                        <button
                          type="button"
                          onClick={
                            selectAllTasks
                          }
                          style={{
                            width: "100%",
                            padding:
                              "10px 12px",
                            border: "none",
                            borderBottom:
                              "1px solid #e2e8f0",
                            background:
                              selectedTasks.length ===
                              0
                                ? "#eff6ff"
                                : "#ffffff",
                            color:
                              selectedTasks.length ===
                              0
                                ? "#2563eb"
                                : "#1e293b",
                            fontWeight:
                              "600",
                            cursor:
                              "pointer",
                            textAlign:
                              "left",
                          }}
                        >
                          {selectedTasks.length ===
                          0
                            ? "✓ "
                            : ""}
                          All Tasks
                        </button>

                        {/* Task List */}
                        {tasks.map(
                          (task) => {
                            const id =
                              getTaskId(
                                task
                              );

                            const isSelected =
                              selectedTasks.some(
                                (
                                  selectedId
                                ) =>
                                  String(
                                    selectedId
                                  ) ===
                                  String(
                                    id
                                  )
                              );

                            return (
                              <label
                                key={id}
                                style={{
                                  display:
                                    "flex",
                                  alignItems:
                                    "flex-start",
                                  gap: "10px",
                                  padding:
                                    "10px 12px",
                                  cursor:
                                    "pointer",
                                  background:
                                    isSelected
                                      ? "#f8fafc"
                                      : "#ffffff",
                                  borderBottom:
                                    "1px solid #f1f5f9",
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={
                                    isSelected
                                  }
                                  onChange={() =>
                                    toggleTask(
                                      id
                                    )
                                  }
                                  style={{
                                    marginTop:
                                      "3px",
                                    cursor:
                                      "pointer",
                                    flexShrink:
                                      0,
                                  }}
                                />

                                <span
                                  style={{
                                    fontSize:
                                      "13px",
                                    lineHeight:
                                      "1.4",
                                    overflowWrap:
                                      "anywhere",
                                  }}
                                >
                                  <strong>
                                    {id}
                                  </strong>

                                  {" - "}

                                  {getTaskName(
                                    task
                                  )}
                                </span>
                              </label>
                            );
                          }
                        )}
                      </div>
                    )}
                  </div>

                  <small
                    style={{
                      display: "block",
                      marginTop: "6px",
                      color: "#64748b",
                      lineHeight: "1.4",
                    }}
                  >
                    Select one or multiple
                    tasks, or choose All
                    Tasks.
                  </small>
                </div>

                {/* EMPLOYEE */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontWeight: "600",
                      marginBottom: "8px",
                    }}
                  >
                    Employee
                  </label>

                  <select
                    value={
                      taskEmployeeId
                    }
                    onChange={(e) =>
                      setTaskEmployeeId(
                        e.target.value
                      )
                    }
                    style={{
                      width: "100%",
                      padding: "11px",
                      border:
                        "1px solid #cbd5e1",
                      borderRadius: "8px",
                      background:
                        "#fff",
                      boxSizing:
                        "border-box",
                      minWidth: "0",
                    }}
                  >
                    <option value="active">
                      All Active Employees
                    </option>

                    {employees.map(
                      (employee) => {
                        const id =
                          getEmployeeId(
                            employee
                          );

                        const status =
                          getEmployeeStatus(
                            employee
                          );

                        return (
                          <option
                            key={id}
                            value={id}
                          >
                            {getEmployeeName(
                              employee
                            )}{" "}
                            (
                            {status ||
                              "Unknown"}
                            )
                          </option>
                        );
                      }
                    )}
                  </select>

                  <small
                    style={{
                      display: "block",
                      marginTop: "6px",
                      color: "#64748b",
                      lineHeight: "1.4",
                    }}
                  >
                    Inactive employees are
                    also available for
                    selection.
                  </small>
                </div>
              </div>

              {/* DATE FILTERS */}
              <div
                className="date-filter-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(2, minmax(200px, 1fr))",
                  gap: "20px",
                }}
              >
                <DateInput
                  label="From Date"
                  value={fromDate}
                  onChange={setFromDate}
                />

                <DateInput
                  label="To Date"
                  value={toDate}
                  onChange={setToDate}
                />
              </div>
            </>
          )}

          {/* GENERATE BUTTON */}
          <button
            className="generate-report-btn"
            onClick={handleGenerate}
            disabled={loading}
            style={{
              marginTop: "22px",
              background: "#2563eb",
              color: "#ffffff",
              border: "none",
              padding: "11px 24px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              boxSizing: "border-box",
            }}
          >
            {loading
              ? "Loading..."
              : "Generate Report"}
          </button>
        </div>

        {/* ======================================
            UNFILLED REPORT RESULT
        ====================================== */}
        {reportType === "unfilled" &&
          generated && (
            <div
              className="report-result-card"
              style={{
                background: "#ffffff",
                borderRadius: "14px",
                boxShadow:
                  "0 4px 14px rgba(0,0,0,0.08)",
                overflow: "hidden",
              }}
            >
              <div
                className="report-result-header"
                style={{
                  padding: "20px 25px",
                  borderBottom:
                    "1px solid #e2e8f0",
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "center",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                <h2
                  style={{
                    margin: 0,
                    fontSize: "20px",
                  }}
                >
                  Unfilled Dates
                </h2>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      background: "#fff7ed",
                      color: "#c2410c",
                      padding: "7px 14px",
                      borderRadius: "20px",
                      fontWeight: "700",
                    }}
                  >
                    {unfilledReport.length}{" "}
                    Unfilled
                  </span>

                  <button
                    type="button"
                    onClick={handleExportPDF}
                    disabled={
                      unfilledReport.length ===
                      0
                    }
                    style={{
                      background:
                        "#16a34a",
                      color: "#ffffff",
                      border: "none",
                      padding:
                        "8px 14px",
                      borderRadius: "8px",
                      cursor:
                        unfilledReport.length ===
                        0
                          ? "not-allowed"
                          : "pointer",
                      fontWeight: "600",
                      opacity:
                        unfilledReport.length ===
                        0
                          ? 0.5
                          : 1,
                    }}
                  >
                    📄 Export PDF
                  </button>
                </div>
              </div>

              {unfilledReport.length ===
              0 ? (
                <EmptyMessage text="No unfilled dates found for the selected criteria." />
              ) : (
                <ReportTable
                  headers={[
                    "Employee",
                    "Unfilled Date",
                  ]}
                  rows={unfilledReport.map(
                    (row) => [
                      row.employeeName,
                      row.date.toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      ),
                    ]
                  )}
                />
              )}
            </div>
          )}

        {/* ======================================
            TASK REPORT RESULT
        ====================================== */}
        {reportType === "task" &&
          generated && (
            <div
              className="report-result-card"
              style={{
                background: "#ffffff",
                borderRadius: "14px",
                boxShadow:
                  "0 4px 14px rgba(0,0,0,0.08)",
                overflow: "hidden",
              }}
            >
              <div
                className="report-result-header"
                style={{
                  padding: "20px 25px",
                  borderBottom:
                    "1px solid #e2e8f0",
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "center",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                <h2
                  style={{
                    margin: 0,
                    fontSize: "20px",
                  }}
                >
                  Task Report
                </h2>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      background: "#eff6ff",
                      color: "#2563eb",
                      padding: "7px 14px",
                      borderRadius: "20px",
                      fontWeight: "700",
                    }}
                  >
                    {taskReport.length}{" "}
                    Entries
                  </span>

                  <button
                    type="button"
                    onClick={handleExportPDF}
                    disabled={
                      taskReport.length ===
                      0
                    }
                    style={{
                      background:
                        "#16a34a",
                      color: "#ffffff",
                      border: "none",
                      padding:
                        "8px 14px",
                      borderRadius: "8px",
                      cursor:
                        taskReport.length ===
                        0
                          ? "not-allowed"
                          : "pointer",
                      fontWeight: "600",
                      opacity:
                        taskReport.length ===
                        0
                          ? 0.5
                          : 1,
                    }}
                  >
                    📄 Export PDF
                  </button>
                </div>
              </div>

              {taskReport.length ===
              0 ? (
                <EmptyMessage text="No task entries found for the selected criteria." />
              ) : (
                <ReportTable
                  headers={[
                    "Task ID",
                    "Task",
                    "Employee",
                    "Date",
                    "Hours",
                    "Project",
                    "Remarks",
                  ]}
                  rows={taskReport.map(
                    (row) => [
                      row.taskId,
                      row.taskName,
                      row.employeeName,
                      row.workDate.toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      ),
                      row.hours,
                      row.project,
                      row.remarks ||
                        row.taskDescription,
                    ]
                  )}
                />
              )}
            </div>
          )}
      </div>
    </MainLayout>
  );
}

// ==========================================
// DATE INPUT COMPONENT
// ==========================================
function DateInput({
  label,
  value,
  onChange,
}) {
  return (
    <div style={{ minWidth: 0 }}>
      <label
        style={{
          display: "block",
          fontWeight: "600",
          marginBottom: "8px",
        }}
      >
        {label}
      </label>

      <input
        type="date"
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        style={{
          width: "100%",
          maxWidth: "100%",
          minWidth: "0",
          padding: "10px",
          border:
            "1px solid #cbd5e1",
          borderRadius: "8px",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}

// ==========================================
// EMPTY MESSAGE
// ==========================================
function EmptyMessage({ text }) {
  return (
    <div
      style={{
        padding: "35px",
        textAlign: "center",
        color: "#64748b",
      }}
    >
      {text}
    </div>
  );
}

// ==========================================
// REPORT TABLE
// ==========================================
function ReportTable({
  headers,
  rows,
}) {
  return (
    <div className="report-table-wrapper">
      <table className="report-table">
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

