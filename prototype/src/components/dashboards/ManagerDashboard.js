import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import BaseDashboard from "./BaseDashboard";
import './ManagerDashboard.css';

const ManagerDashboard = ({ user }) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const statusParam = queryParams.get("status") || "submitted";

  const [timesheets, setTimesheets] = useState([]);
  const [selectedTimesheet, setSelectedTimesheet] = useState(null);
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    // Fetch timesheets based on the status parameter (query in URL)
    // Default to "submitted" if no status is provided in the URL
    const endpoint = statusParam === "submitted"
      ? "http://localhost:3001/api/timesheets/pending"
      : `http://localhost:3001/api/timesheets?status=${statusParam}`;

    // Fetch timesheets from the API then format the data and set it to state
    fetch(endpoint)
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(ts => ({
          id: ts.timesheet_id,
          consultantName: ts.consultant,
          weekStart: ts.week_start_date,
          totalHours: ts.total_hours,
          status: ts.status
        }));
        setTimesheets(formatted);
      })
      .catch(err => console.error("Error fetching timesheets:", err)); // Error handling
  }, [statusParam]);

  /*
  const handleViewDetails = (timesheetId) => {
    fetch(`http://localhost:3001/api/timesheet_entries?timesheet_id=${timesheetId}`)
      .then(res => res.json())
      .then(data => {
        setEntries(data);
        const ts = timesheets.find(t => t.id === timesheetId);
        setSelectedTimesheet(ts);
      })
      .catch(err => console.error("Error fetching timesheet entries:", err));
  }; */

  const handleApprove = async (id) => {
    const res = await fetch(`http://localhost:3001/api/timesheets/${id}/approve`, {
      method: "PUT"
    });
    if (res.ok) {
      alert(`Approved timesheet ID: ${id}`);
      setTimesheets(prev => prev.filter(ts => ts.id !== id));
    } else {
      alert("Error approving timesheet");
    }
  };

  const handleReject = async (id) => {
    const res = await fetch(`http://localhost:3001/api/timesheets/${id}/reject`, {
      method: "PUT"
    });
    if (res.ok) {
      alert(`Rejected timesheet ID: ${id}`);
      setTimesheets(prev => prev.filter(ts => ts.id !== id));
    } else {
      alert("Error rejecting timesheet");
    }
  };

  const getTitle = () => {
    switch (statusParam) {
      case "approved": return "Approved Timesheets";
      case "rejected": return "Rejected Timesheets";
      case "all": return "All Timesheets";
      default: return "Pending Approvals";
    }
  };

  return (
    <BaseDashboard user={user}>
      <div className="manager-dashboard">
        <div className="manager-section">
          <div className="manager-row">
            <h2 className="section-title">{getTitle()}</h2>
            <p className="section-description">Approve or reject employee timesheets.</p>
            </div>
          {selectedTimesheet ? (
            <div className="details-view">
              <h2 className="section-title">Entries for {selectedTimesheet.consultantName}</h2>
              <button className="back-btn" onClick={() => {
                setSelectedTimesheet(null);
                setEntries([]);
              }}>
                ← Back to Timesheets
              </button>
              
              <ul>
                {entries.map((entry, index) => (
                  <li key={index}>
                    <strong>Date:</strong> {entry.date}<br />
                    <strong>Activity:</strong> {entry.activity}<br />
                    <strong>Hours:</strong> {entry.hours}<br />
                    <strong>Comments:</strong> {entry.comments}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <>
              

              <table className="manager-table">
                <thead>
                  <tr>
                    <th>Consultant</th>
                    <th>Week Starting</th>
                    <th>Total Hours</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {timesheets.map((ts) => (
                    <tr key={ts.id}>
                      <td>{ts.consultantName}</td>
                      <td>{ts.weekStart}</td>
                      <td>{ts.totalHours}</td>
                      <td>{ts.status}</td>
                      <td>
                        <button className="action-btn" onClick={() => handleApprove(ts.id)}>Approve</button>
                        <button className="action-btn" onClick={() => handleReject(ts.id)}>Reject</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </BaseDashboard>
  );
};

export default ManagerDashboard;