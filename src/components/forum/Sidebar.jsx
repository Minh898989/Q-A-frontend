import React from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const tabs = [
    { to: "post", label: "Bài viết" },
    { to: "group", label: "Nhóm" },
  ];

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-300 p-4">
      <nav className="flex flex-col space-y-2">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `text-left px-4 py-2 rounded-md font-medium focus:outline-none transition-all ${
                isActive
                  ? "bg-indigo-600 text-white"
                  : "text-gray-700 hover:bg-gray-200"
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
