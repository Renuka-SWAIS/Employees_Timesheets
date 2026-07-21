"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const menuItems = [
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
    name: "Settings",
    path: "/settings",
    icon: "⚙️",
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

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
  <span className="sidebar-subtitle"><b>Employee Timesheet</b></span>
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