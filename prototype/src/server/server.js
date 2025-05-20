const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

// MySQL connection setup
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: '',
  database: 'timesheets'
});

connection.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log("Connected to MySQL database.");
});

//Login backend
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM Users WHERE username = ? AND password = ?';
  connection.query(query, [username, password], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length > 0) {
      const user = results[0];
      return res.json({ role: user.role });
    } else {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  });
});

// Get submitted timesheets for approval
app.get("/api/timesheets/pending", (req, res) => {
  const query = `
    SELECT t.timesheet_id, u.username AS consultant, t.week_start_date, 
           t.status, SUM(e.hours_worked) AS total_hours
    FROM Timesheets t
    JOIN Users u ON t.user_id = u.user_id
    JOIN TimesheetEntries e ON t.timesheet_id = e.timesheet_id
    WHERE t.status = 'submitted'
    GROUP BY t.timesheet_id;
  `;
  connection.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Get timesheets by status (or all)
app.get("/api/timesheets", (req, res) => {
  const status = req.query.status;

  const baseQuery = `
    SELECT t.timesheet_id, u.username AS consultant, t.week_start_date, 
           t.status, SUM(e.hours_worked) AS total_hours
    FROM Timesheets t
    JOIN Users u ON t.user_id = u.user_id
    JOIN TimesheetEntries e ON t.timesheet_id = e.timesheet_id
  `;

  const query = status && status !== "all"
    ? baseQuery + " WHERE t.status = ? GROUP BY t.timesheet_id"
    : baseQuery + " GROUP BY t.timesheet_id";

  const params = status && status !== "all" ? [status] : [];

  connection.query(query, params, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Fetch all users
app.get("/api/users", (req, res) => {
  connection.query("SELECT user_id, username, role FROM users", (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      res.status(500).send("Server error");
    } else {
      res.json(results);
    }
  });
});

// Add a new user
app.post("/api/users", (req, res) => {
  const { username, role, password } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ message: "Username, password, and role are required." });
  }

  const query = "INSERT INTO Users (username, password, role) VALUES (?, ?, ?)";
  connection.query(query, [username, password, role], (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ message: "Username already exists." });
      }
      console.error("Error inserting user:", err);
      return res.status(500).json({ message: "Internal server error." });
    }

    res.status(201).json({
      user_id: result.insertId,
      username,
      role
    });
  });
});

// GET endpoint to filter timesheet entries by week start date
app.get("/api/timesheet-entries/filter", (req, res) => {
  const weekStartDate = req.query.week_start_date;
  if (!weekStartDate) {
    return res.status(400).json({ error: "week_start_date query parameter is required." });
  }
  
  const query = `
    SELECT t.timesheet_id, t.week_start_date, 
           e.entry_date, e.hours_worked, e.task_description, e.entry_id
    FROM TimesheetEntries e
    JOIN Timesheets t ON e.timesheet_id = t.timesheet_id
    WHERE t.week_start_date = ?
  `;
  
  connection.query(query, [weekStartDate], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET detailed timesheet entries for a given timesheet ID
app.get("/api/timesheets/:id", (req, res) => {
  const id = req.params.id;
  const query = `
    SELECT entry_date, hours_worked, task_description, entry_id
    FROM TimesheetEntries
    WHERE timesheet_id = ?;
  `;
  connection.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});


// PUT endpoint for updating a single timesheet entry
app.put("/api/timesheet-entries/:entryId", (req, res) => {
  const entryId = req.params.entryId;
  const { entry_date, hours_worked, task_description } = req.body;
  
  // Format the date to YYYY-MM-DD
  const formattedEntryDate = new Date(entry_date).toISOString().substring(0, 10);
  const query = `
    UPDATE TimesheetEntries 
    SET entry_date = ?, hours_worked = ?, task_description = ? 
    WHERE entry_id = ?
  `;
  
  connection.query(query, [formattedEntryDate, hours_worked, task_description, entryId], (err, result) => {
    if (err) {
      console.error("Error updating entry:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Entry updated successfully." });
  });
});


// PUT endpoint for editing a timesheet and its entries
app.put("/api/timesheets/:id", (req, res) => {
  const timesheetId = req.params.id;
  const { timesheet, entries } = req.body;
  
  // Format the week start date from the timesheet
  const formattedWeekStartDate = timesheet.week_start_date.substring(0, 10);
  
  // Update the Timesheets record (week_start_date and status)
  const updateTimesheetQuery = "UPDATE Timesheets SET week_start_date = ?, status = ? WHERE timesheet_id = ?";
  connection.query(updateTimesheetQuery, [formattedWeekStartDate, timesheet.status, timesheetId], (err, result) => {
    if (err) {
      console.error("Error updating Timesheet:", err);
      return res.status(500).json({ error: err.message });
    }
    
    // If no entries are provided, finish here.
    if (!entries || entries.length === 0) {
      return res.json({ message: "Timesheet updated successfully." });
    }
    
    let updatedCount = 0;
    
    // Update each entry individually
    entries.forEach((entry) => {
      const formattedEntryDate = entry.entry_date.substring(0, 10);
      const updateEntryQuery = "UPDATE TimesheetEntries SET entry_date = ?, hours_worked = ?, task_description = ? WHERE entry_id = ?";
      
      connection.query(updateEntryQuery, [formattedEntryDate, entry.hours_worked, entry.task_description, entry.entry_id], (err, result) => {
        if (err) {
          console.error(`Error updating entry ${entry.entry_id}:`, err);
        }
        updatedCount++;
        if (updatedCount === entries.length) {
          res.json({ message: "Timesheet updated successfully." });
        }
      });
    });
  });
});



// Delete a user
app.delete("/api/users/:id", (req, res) => {
  const userId = req.params.id;

  const query = "DELETE FROM Users WHERE user_id = ?";
  connection.query(query, [userId], (err, result) => {
    if (err) {
      console.error("Error deleting user:", err);
      return res.status(500).json({ message: "Internal server error." });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "User deleted successfully." });
  });
});

// Get timesheet entries for selected timesheet
app.get("/api/timesheet_entries", (req, res) => {
  const timesheetId = req.query.timesheet_id;
  if (!timesheetId) {
    return res.status(400).json({ error: "Missing timesheet_id parameter" });
  }

  const query = `
    SELECT entry_date AS date, task_description AS activity, hours_worked AS hours, comments
    FROM TimesheetEntries
    WHERE timesheet_id = ?;
  `;

  connection.query(query, [timesheetId], (err, results) => {
    if (err) {
      console.error("Error fetching entries:", err);
      return res.status(500).json({ error: "Failed to fetch entries" });
    }

    res.json(results);
  });
});

// Approve timesheet
app.put("/api/timesheets/:id/approve", (req, res) => {
  const id = req.params.id;
  const query = `UPDATE Timesheets SET status = 'approved' WHERE timesheet_id = ?`;
  connection.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Timesheet approved." });
  });
});

// Reject timesheet
app.put("/api/timesheets/:id/reject", (req, res) => {
  const id = req.params.id;
  const query = `UPDATE Timesheets SET status = 'rejected' WHERE timesheet_id = ?`;
  connection.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Timesheet rejected." });
  });
});

// Submit a new timesheet entry
app.post("/api/timesheet_entries", (req, res) => {
  const { timesheet_id, date, hours, task } = req.body;

  const query = `
    INSERT INTO TimesheetEntries (timesheet_id, entry_date, hours_worked, task_description)
    VALUES (?, ?, ?, ?)
  `;

  connection.query(query, [timesheet_id, date, hours, task], (err, result) => {
    if (err) {
      console.error("Error inserting timesheet entry:", err);
      return res.status(500).json({ message: "Failed to submit entry." });
    }

    res.status(201).json({ message: "Entry submitted!" });
  });
});

// Start the server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
