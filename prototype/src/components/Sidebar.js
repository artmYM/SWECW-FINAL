import React from "react";
import { Link } from "react-router-dom";
import './Sidebar.css';

const Sidebar = ({ user }) => {
  const username = localStorage.getItem("username") || "User";

  const getDashboardPath = () => {
    switch (user.role.toLowerCase()) {
      case "consultant":
        return "/consultantDashboard";
      case "manager":
        return "/managerDashboard";
      case "admin":
        return "/adminDashboard";
      case "accountant":
        return "/payroll";
      default:
        return "/";
    }
  };

  const menuItems = [
    { label: "New Timesheet", path: "/timesheetEntry", roles: ["consultant"] },
    { label: "All Timesheets", path: "/managerdashboard?status=all", roles: ["manager"] },
    { label: "Pending Timesheets", path: "/managerdashboard?status=submitted", roles: ["manager"] },
    { label: "Approved Timesheets", path: "/managerdashboard?status=approved", roles: ["manager"] },
    { label: "Rejected Timesheets", path: "/managerdashboard?status=rejected", roles: ["manager"] },
    { label: "Edit Timesheet", path: "/editTimesheet", roles: ["consultant"] },
    { label: "Edit Timesheet", path: "/editTimesheetManager", roles: ["manager"] },
    { label: "Payroll Processing", path: "/payroll", roles: ["accountant"] },
    { label: "Add Users", path: "/addUsers", roles: ["admin"] },
    /*{ label: "Settings", path: "/settings", roles: ["consultant", "manager", "accountant", "admin"] },*/
  ];

  return (
    <aside className="sidebar">
      <Link to={getDashboardPath()} className="sidebar-greeting">
        Hello, {username}
      </Link>
      <nav>
        <ul>
          {menuItems.map((item) =>
            item.roles.includes(user.role.toLowerCase()) ? (
              <li key={item.path}>
                <Link to={item.path}>
                  {item.label}
                </Link>
              </li>
            ) : null
          )}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;