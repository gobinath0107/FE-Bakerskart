import { useLocation, useNavigate } from "react-router-dom";
import { logoutAdmin, toggleTheme } from "../features/user/userSlice";
import { useDispatch } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { BsSunFill, BsMoonFill } from "react-icons/bs";

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
  };

  const handleTheme = () => {
    dispatch(toggleTheme());
  };

  return (
    <header className="h-16 bg-base-100 border-b border-base-300 flex items-center justify-between px-4 shadow-sm">
      <button className="md:hidden btn btn-ghost" onClick={toggleSidebar}>
        ☰
      </button>
      <h1 className="text-xl font-semibold">{currentPage.toUpperCase()}</h1>
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <label className="swap swap-rotate">
          <input type="checkbox" onChange={handleTheme} />
          <BsSunFill className="swap-on h-4 w-4" />
          <BsMoonFill className="swap-off h-4 w-4" />
        </label>

        <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
};

export default AdminNavbar;
