import React from "react";
import Sidebar from "../Sidebar";
import './BaseDashboard.css';

const BaseDashboard = ({ children, title, user }) => {
  if (!user) return <h1>Loading...</h1>;

  return (
    <div className="dashboard-container">
      <Sidebar user={user} />
      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>{title}</h1>
        </header>
        {children}
      </main>
    </div>
  );
};

export default BaseDashboard;
