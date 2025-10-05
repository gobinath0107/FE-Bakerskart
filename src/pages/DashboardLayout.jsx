import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";

const DashboardLayout = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-screen bg-base-100">
      {/* Sidebar */}
      <AdminSidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <AdminNavbar toggleSidebar={() => setIsOpen(!isOpen)} />
        <main className="flex-1 overflow-y-auto p-6">
          {/* This will render the current page */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
