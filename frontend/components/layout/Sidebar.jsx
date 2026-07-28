"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    const role = user?.RoleType;

    if (role === "Admin") {
      setMenuItems([
        {
          name: "Dashboard",
          path: "/dashboard",
          icon: "📊",
        },
        {
          name: "Timesheets",
          path: "/timesheet",
          icon: "📝",
        },
        {
          name: "Employees",
          path: "/employees",
          icon: "👥",
        },
        {
          name: "Tasks",
          path: "/tasks",
          icon: "📋",
        },
        {
          name: "Leaves",
          path: "/leaves",
          icon: "🌴",
        },
        {
          name: "Settings",
          path: "/settings",
          icon: "⚙️",
        },
      ]);
    } else {
      setMenuItems([
        {
          name: "Dashboard",
          path: "/dashboard",
          icon: "📊",
        },
        {
          name: "Timesheets",
          path: "/timesheet",
          icon: "📝",
        },
        {
          name: "Leaves",
          path: "/leaves",
          icon: "🌴",
        },
        {
          name: "Settings",
          path: "/settings",
          icon: "⚙️",
        },
      ]);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    router.replace("/login");
    router.refresh();
  };

  return (
    <aside className="sidebar">
      <div>
        <div className="sidebar-logo">
          <h1>SWAIS</h1>

          <span className="sidebar-subtitle">
            <b>Employee Timesheet</b>
          </span>
        </div>

        <nav className="sidebar-menu">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={pathname === item.path ? "active" : ""}
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      <button
        type="button"
        className="logout"
        onClick={handleLogout}
      >
        Logout
      </button>
    </aside>
  );
}