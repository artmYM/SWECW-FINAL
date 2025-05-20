import React, { useEffect, useState } from "react";
import BaseDashboard from "./BaseDashboard";

const SubmitTimesheet = ({ user }) => {
  const [draftTimesheets, setDraftTimesheets] = useState([]);
  const [message, setMessage] = useState("");

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
    <BaseDashboard title="Submit Timesheets" user={user}>
      <h2>My Draft Timesheets</h2>
      {message && <p>{message}</p>}
      {draftTimesheets.length === 0 ? (
        <p>No draft timesheets found.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Timesheet ID</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Week Start Date</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Total Hours</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Status</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {draftTimesheets.map((ts) => (
              <tr key={ts.timesheet_id}>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {ts.timesheet_id}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {ts.week_start_date.slice(0, 10)}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {ts.total_hours || 0}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {ts.status}
                </td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  <button
                    onClick={() =>
                      handleSubmitTimesheet(ts.timesheet_id, ts.week_start_date)
                    }
                  >
                    Submit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </BaseDashboard>
  );
};

export default SubmitTimesheet;
