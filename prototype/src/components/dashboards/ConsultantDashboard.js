import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import BaseDashboard from "./BaseDashboard";
import './ConsultantDashboard.css';

const SubmitTimesheet = ({ user }) => {
  const [draftTimesheets, setDraftTimesheets] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Fetch draft timesheets on load
  useEffect(() => {
    fetch("http://localhost:3001/api/timesheets?status=draft")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Server responded with ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setDraftTimesheets(data);
      })
      .catch((err) => {
        console.error("Error fetching draft timesheets:", err);
        setMessage("Error fetching draft timesheets.");
      });
  }, [user]);

  // Submit timesheet (change status to "submitted")
  const handleSubmitTimesheet = (id, weekStartDate) => {
    const payload = {
      timesheet: {
        week_start_date: weekStartDate,
        status: "submitted"
      },
      entries: [] 
    };

    fetch(`http://localhost:3001/api/timesheets/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then((res) => {
        if (!res.ok) {
          return res.text().then((text) => {
            throw new Error(text);
          });
        }
        return res.json();
      })
      .then((data) => {
        setMessage(`Timesheet ${id} submitted successfully.`);
        setDraftTimesheets((prev) => prev.filter((ts) => ts.timesheet_id !== id));
      })
      .catch((err) => {
        console.error("Error submitting timesheet:", err);
        setMessage("Error submitting timesheet.");
      });
  };

  return (
    <BaseDashboard user={user}>
      <div className="consultant-dashboard">

      <div className="timesheet-card-wrapper">
        <div className="header-row">
          <h2>Your Draft Timesheets</h2>
          <button className="new-timesheet-btn" onClick={() => navigate('/TimesheetEntry')}>
              New Timesheet
          </button>
        </div>
        {message && <p>{message}</p>}
        {draftTimesheets.length === 0 ? (
          <p>No draft timesheets found.</p>
        ) : (
          <table className="timesheet-table">
          <thead>
          <tr>
            <th>Timesheet ID</th>
            <th>Week Start Date</th>
            <th>Total Hours</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
          <tbody>
            {draftTimesheets.map((ts) => (
            <tr key={ts.timesheet_id}>
              <td>
                {ts.timesheet_id}
              </td>
              <td>
                {ts.week_start_date.slice(0, 10)}
              </td>
              <td>
                {ts.total_hours || 0}
              </td>
              <td>
                {ts.status}
              </td>
              <td>
                  <button className="consultant-edit-btn" onClick={() => handleSubmitTimesheet(ts.timesheet_id, ts.week_start_date)}>
                    Submit
                  </button>
                </td>
              </tr>     
            ))}
          </tbody>
        </table>
      )}
      </div>
      </div>
    </BaseDashboard>
  );
};

export default SubmitTimesheet;