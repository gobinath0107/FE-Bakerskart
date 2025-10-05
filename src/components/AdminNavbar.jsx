import { useLocation, useNavigate } from "react-router-dom";
import { logoutAdmin } from "../features/user/userSlice";
import { useDispatch } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";


const AdminNavbar = ({ toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  
  const currentPage = location.pathname.split("/")[2] || "Dashboard";

  const handleLogout = () => {
    navigate('/admin/login');
    dispatch(logoutAdmin());
    queryClient.removeQueries();
  }

  return (
    <header className="h-16 bg-base-100 border-b border-base-300 flex items-center justify-between px-4 shadow-sm">
      <button className="md:hidden btn btn-ghost" onClick={toggleSidebar}>
        ☰
      </button>
      <h1 className="text-xl font-semibold">{currentPage.toUpperCase()}</h1>
      <div className="flex items-center gap-4">
        <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
};

export default AdminNavbar;
