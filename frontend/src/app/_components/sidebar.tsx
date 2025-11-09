import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LogOut,
  User,
  Bookmark,
  LayoutDashboard,
  FileText,
} from "lucide-react";

const Sidebar: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const location = useLocation();
  const pathname = location.pathname;

  const links = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={18} />,
      to: "/dashboard/candidate",
    },
    {
      name: "My Applications",
      icon: <FileText size={18} />,
      to: "/dashboard/candidate/applications",
    },
    {
      name: "Bookmarks",
      icon: <Bookmark size={18} />,
      to: "/dashboard/candidate/saved",
    },
    {
      name: "Edit Profile",
      icon: <User size={18} />,
      to: "/dashboard/candidate/profile",
    },
  ];

  return (
    <aside className="min-h-screen w-64 bg-[#f3edff] dark:bg-[#1a1a1a] p-5">
      <nav className="flex flex-col gap-4">
        {links.map((link) => (
          <Link
            key={link.name}
            to={link.to}
            className={`flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-all hover:bg-[#d8c4ff] dark:hover:bg-[#2a2a2a] ${
              pathname === link.to
                ? "bg-[#cbb2ff] text-black dark:bg-[#333] dark:text-white"
                : "text-gray-700 dark:text-gray-300"
            }`}
          >
            {link.icon} {link.name}
          </Link>
        ))}
        <button
          onClick={onLogout}
          className="flex items-center gap-3 p-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-100 dark:hover:bg-red-900"
        >
          <LogOut size={18} /> Logout
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
