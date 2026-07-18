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
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "25px",
        gap: "15px",
        flexWrap: "wrap",
      }}
    >
      {/* Search Box */}
      <input
        type="text"
        placeholder="Search Employee..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "10px",
          width: "300px",
          borderRadius: "8px",
          border: "1px solid #ccc",
        }}
      />

      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        {/* Department Filter */}
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "8px",
          }}
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
          style={{
            padding: "10px",
            borderRadius: "8px",
          }}
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
          style={{
            padding: "10px",
            borderRadius: "8px",
          }}
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          style={{
            padding: "10px 20px",
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Refresh
        </button>
      </div>
    </div>
  );
}