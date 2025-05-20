import React, { useState } from 'react';
import './TimesheetEntry.css';
import BaseDashboard from './dashboards/BaseDashboard';

const TimesheetEntry = ({ user }) => {
  const [entry, setEntry] = useState({
    date: '',
    hours: '',
    task: ''
  });

  // Hardwire the timesheet_id as 1 for the prototype.
  const hardwiredTimesheetId = 1;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEntry({ ...entry, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const entryData = {
      // Use the hardwired timesheet ID instead of the user ID.
      timesheet_id: hardwiredTimesheetId,
      date: entry.date,
      hours: entry.hours,
      task: entry.task,
      comments: "" // optional for now
    };

    fetch("http://localhost:3001/api/timesheet_entries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(entryData)
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);
        setEntry({ date: '', hours: '', task: '' });
      })
      .catch((err) => {
        console.error("Submission error:", err);
        alert("Something went wrong. Check the console.");
      });
  };

  return (
    <BaseDashboard user={user}>
    <div className="entry-page">
      <div className="entry-container">
        <div className="entry-header">New Entry</div>
        <div className="entry-underline"></div>
        <form className="entry-form" onSubmit={handleSubmit}>
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={entry.date}
            onChange={handleChange}
            required
          />

          <label htmlFor="hours">Hours Worked:</label>
          <input
            type="number"
            id="hours"
            name="hours"
            min="1"
            value={entry.hours}
            onChange={handleChange}
            required
          />

          <label htmlFor="task">Task Description:</label>
          <textarea
            id="task"
            name="task"
            value={entry.task}
            onChange={handleChange}
            required
          />

          <button type="submit" className="submit-entry-btn">
            Submit Entry
          </button>
        </form>
      </div>
    </div>
    </BaseDashboard>
  );
};

export default TimesheetEntry;
