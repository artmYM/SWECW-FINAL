import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import AdminDashboard from "./components/dashboards/AdminDashboard";
import ManagerDashboard from "./components/dashboards/ManagerDashboard";
import ConsultantDashboard from "./components/dashboards/ConsultantDashboard";
import TimesheetEntry from "./components/TimesheetEntry";
import EditTimesheet from "./components/EditTimesheet";
import EditTimesheetManager from "./components/EditTimesheetManager";
import AddUsers from "./components/AddUsers";
import SubmitTimesheet from "./components/dashboards/SubmitTimesheet";

const PageLayout = ({ children }) => {
  const location = useLocation();

  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

function App() {
  const getUser = () => {
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("userRole");

    if (username && role) {
      return { name: username, role };
    }

    return null;
  };

  const user = getUser();
  return (
    <Router>
      <PageLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/timesheetEntry" element={<TimesheetEntry user={{ name: "consultant", role: "consultant" }}/>} />
          <Route path="/editTimesheet" element={<EditTimesheet user={{ name: "consultant", role: "consultant" }}/>} />
          <Route path="/editTimesheetManager" element={<EditTimesheetManager user={{ name: "manager", role: "manager" }}/>} />
          <Route path="/addUsers" element={<AddUsers user={{ name: "admin", role: "admin" }} />}/>

          <Route
            path="/managerDashboard"
            element={<ManagerDashboard user={{ name: "manager", role: "manager" }} />}
          />
          <Route
            path="/adminDashboard"
            element={<AdminDashboard user={{ name: "admin", role: "admin" }} />}
          />
          <Route
            path="/consultantDashboard"
            element={<ConsultantDashboard user={{ name: "consultant", role: "consultant" }} />}
          />
          <Route
            path="/submit-timesheet"
            element={<SubmitTimesheet user={{ name: "consultant", role: "consultant" }} />}
          />
        </Routes>
      </PageLayout>
    </Router>
  );
}

export default App;