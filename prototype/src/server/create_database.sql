-- Script for creating the database schema for the timesheet application in MYSQL XAMPP local server.

-- Create the Users table with a role field for access control.
CREATE TABLE Users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('consultant', 'manager', 'admin', 'finance') NOT NULL
);

-- Create the Timesheets table.
-- Each timesheet is linked to the consultant who created it (user_id).
-- A manager (manager_id) can be linked when the timesheet is approved.
CREATE TABLE Timesheets (
  timesheet_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  week_start_date DATE NOT NULL,
  status ENUM('draft', 'submitted', 'approved', 'rejected') DEFAULT 'draft',
  manager_id INT,
  CONSTRAINT fk_user
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
  CONSTRAINT fk_manager
    FOREIGN KEY (manager_id) REFERENCES Users(user_id)
);

-- Create the TimesheetEntries table.
-- Each entry is linked to a timesheet.
-- This table holds individual work entries (e.g., hours worked, task details).
CREATE TABLE TimesheetEntries (
  entry_id INT AUTO_INCREMENT PRIMARY KEY,
  timesheet_id INT NOT NULL,
  entry_date DATE NOT NULL,
  hours_worked DECIMAL(4,2) NOT NULL,
  task_description TEXT,
  CONSTRAINT fk_timesheet
    FOREIGN KEY (timesheet_id) REFERENCES Timesheets(timesheet_id)
);
