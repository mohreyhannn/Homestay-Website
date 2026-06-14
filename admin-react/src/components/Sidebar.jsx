import {
  LayoutDashboard,
  BedDouble,
  CalendarDays,
  Settings,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const menuItems = [
  {
    name: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Bookings",
    path: "/bookings",
    icon: CalendarDays,
  },
  {
    name: "Rooms",
    path: "/rooms",
    icon: BedDouble,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-indigo-950 text-white p-6 hidden md:flex flex-col">
      <div className="text-2xl font-bold mb-10">ALGAMAS Admin</div>

      <nav className="space-y-3">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-xl transition ${
                  isActive
                    ? "bg-indigo-800 shadow-md font-semibold border-l-4 border-white"
                    : "hover:bg-indigo-800 hover:translate-x-1"
                }`
              }
            >
              <Icon size={20} />
              {item.name}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}