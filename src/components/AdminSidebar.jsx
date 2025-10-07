import { NavLink } from "react-router-dom";

const AdminSidebar = ({ isOpen, setIsOpen }) => {
  const navLinks = [
    { name: "Users", path: "/admin/users" },
    { name: "Admins", path: "/admin/admins" },
    { name: "Orders", path: "/admin/orders" },
    { name: "Products", path: "/admin/products" },
    { name: "Category", path: "/admin/category" }
  ];

  return (
    <>
      {/* Desktop */}
      <aside className="hidden md:flex md:flex-col w-64 bg-base-200 shadow-lg">
        <div className="p-4 flex items-center gap-2 border-b border-base-300 h-16">
          <img src="/design3.jpeg" alt="App Logo" className="w-10 h-10 rounded-full" />
          <span className="text-xl font-bold">BakersKart</span>
        </div>
        <nav className="flex-1 p-4">
          <ul className="menu gap-2">
            {navLinks.map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `rounded-lg ${isActive ? "bg-primary text-white" : ""}`
                  }
                >
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Mobile */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-base-200 shadow-lg transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-200 md:hidden z-50`}
      >
        <div className="p-4 flex justify-between items-center border-b border-base-300">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold">BakersKart</span>
          </div>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setIsOpen(false)}
          >
            ✕
          </button>
        </div>
        <nav className="p-4">
          <ul className="menu gap-2">
            {navLinks.map((link) => (
              <li key={link.path}>
                <NavLink to={link.path} onClick={() => setIsOpen(false)}>
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default AdminSidebar;
