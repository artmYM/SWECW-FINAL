import React from "react";
import BaseDashboard from "./BaseDashboard";

const AccountantDashboard = ({user}) => {
  return (
    <BaseDashboard title="Accountant Dashboard" user = {user}>
      <section>
        <h2>Payroll Summary</h2>
        <p>View employee work hours and generate payroll reports.</p>
        <button>Generate Payroll</button>
      </section>
    </BaseDashboard>
  );
};

export default AccountantDashboard;
