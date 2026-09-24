
"use client";

export default function EmployeeToolbar({
  search,
  setSearch,
  status,
  setStatus,
  department,
  setDepartment,
  departments,
  role,
  setRole,
  roles,
  onRefresh,
}) {
  return (
    <div className="employee-toolbar">
      {/* Search Box */}
      <input
        type="text"
        placeholder="Search Employee..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="employee-search"
      />

      <div className="employee-filters">
        {/* Department Filter */}
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="employee-filter-select"
        >
          <option value="">All Departments</option>

          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>

        {/* Role Filter */}
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="employee-filter-select"
        >
          <option value="">All Roles</option>

          {roles.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="employee-filter-select"
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        {/* Refresh */}
        <button
          onClick={onRefresh}
          className="employee-refresh-btn"
        >
          Refresh
        </button>
      </div>
    </div>
  );
}

