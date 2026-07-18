import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function MainLayout({ children }) {
  return (
    <div className="dashboard">

      <Sidebar />

      <div className="main">

        <Navbar />

        {children}

      </div>

    </div>
  );
}