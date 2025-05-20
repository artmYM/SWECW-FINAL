import React, { useEffect, useState } from "react";
import BaseDashboard from "./dashboards/BaseDashboard";
import './EditTimesheet.css';

const EditTimesheetManager = ({ user }) => {
  const [entries, setEntries] = useState([]);
  const [message, setMessage] = useState("");
  // State for filtering by week start date
  const [filterDate, setFilterDate] = useState("");

  const fetchFilteredEntries = () => {
    if (!filterDate) {
      setEntries([]);
      return;
    }
    fetch(`http://localhost:3001/api/timesheet-entries/filter?week_start_date=${filterDate}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Server responded with ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) {
          console.error("Unexpected data format returned from API.");
        } else {
          setEntries(data);
        }
      })
      .catch((err) =>
        console.error("Error fetching filtered timesheet entries:", err)
      );
  };

  // Handler to update editable fields in entries
  const handleEntryChange = (index, field, value) => {
    const updatedEntries = [...entries];
    updatedEntries[index] = { ...updatedEntries[index], [field]: value };
    setEntries(updatedEntries);
  };

  // entry error check
  const validateEntry = (entry) => {
    const hours = parseFloat(entry.hours_worked);
    if (isNaN(hours) || hours < 0 || hours > 24) {
      return "Hours worked must be a number between 0 and 24.";
    }

    if (!entry.task_description || entry.task_description.trim() === "") {
      return "Task description cannot be empty.";
    }

    if (filterDate) {
      const weekDate = new Date(filterDate);
      const entryDate = new Date(entry.entry_date);
      const diffDays = Math.abs((entryDate - weekDate) / (1000 * 60 * 60 * 24));
      if (diffDays > 7) {
        return "Entry date must be within 7 days of the selected week start date.";
      }
    }
    return null;
  };

  const updateEntry = (index) => {
    const entry = entries[index];
    if (!entry.entry_id) {
      console.error("Entry ID is undefined for index", index);
      return;
    }
    const error = validateEntry(entry);
    if (error) {
      setMessage(error);
      return;
    }

    const payload = {
      entry_date: entry.entry_date,
      hours_worked: entry.hours_worked,
      task_description: entry.task_description,
    };

    fetch(`http://localhost:3001/api/timesheet-entries/${entry.entry_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
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
        console.log("Entry updated successfully:", data.message);
        setMessage(`Entry ${entry.entry_id} updated successfully.`);
      })
      .catch((err) => {
        console.error("Error updating entry:", err);
        setMessage("Error updating entry.");
      });
  };

  // Handler to update the entire timesheet with validation for each entry.
  const handleUpdate = () => {
    for (let i = 0; i < entries.length; i++) {
      const error = validateEntry(entries[i]);
      if (error) {
        setMessage(`Error in entry ${entries[i].entry_id}: ${error}`);
        return;
      }
    }
    const payload = { entries };
    fetch(`http://localhost:3001/api/timesheets/1`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
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
        setMessage(data.message || "Timesheet updated successfully.");
      })
      .catch((err) => {
        console.error("Error updating timesheet:", err);
        setMessage("Error updating timesheet.");
      });
  };

  // format a date string to YYYY-MM-DD
  const formatDate = (dateStr) => (dateStr ? dateStr.substring(0, 10) : "");

  return (
    <BaseDashboard user={user}>
      <div className="edit-timesheet-wrapper">
        <h2>Filter Timesheet Entries by Week Start Date</h2>
        <p><strong>Select Week Start Date:</strong></p>

        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />
        <button onClick={fetchFilteredEntries}>
          Refresh Entries
        </button>

        <h3>Timesheet Entries</h3>

        {entries.length === 0 ? (
          <p>No entries found for the selected week.</p>
        ) : (
          <table className="edit-timesheet-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Hours Worked</th>
                <th>Task Description</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <tr key={entry.entry_id}>
                  <td>
                    <input
                      type="date"
                      value={formatDate(entry.entry_date)}
                      onChange={(e) =>
                        handleEntryChange(index, "entry_date", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      step="0.01"
                      value={entry.hours_worked}
                      onChange={(e) =>
                        handleEntryChange(index, "hours_worked", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <textarea
                      value={entry.task_description}
                      onChange={(e) =>
                        handleEntryChange(index, "task_description", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <button onClick={() => updateEntry(index)}>Update</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {message && <p className="edit-timesheet-message">{message}</p>}
      </div>
    </BaseDashboard>

  );
};

export default EditTimesheetManager;