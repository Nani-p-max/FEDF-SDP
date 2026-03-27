import { memo } from 'react';
import './Dashboard.css';

const DashboardView = memo(function DashboardView({ subscription, onBrowse }) {
  if (!subscription) {
    return (
        <div className="no-subscription">
          <p>You have no active subscription.</p>
          <button onClick={() => onBrowse((nav) => nav('/browse'))}>Browse Plans</button>
        </div>
    );
  }

  return (
      <div className="dashboard-container">
        <section className="dashboard">
      <h2>Your Subscription</h2>
      <div className="status-badge">Active</div>
      <p><strong>Plan:</strong> {subscription.name}</p>
      <p><strong>Billing:</strong> ${subscription.total}/mo</p>
      <p><strong>Activated on:</strong> {subscription.date}</p>
      <p><strong>Features:</strong> {subscription.storage} Storage, {subscription.users} Users</p>
          <button onClick={() => onBrowse((nav) => nav('/browse'))}>Browse More Plans</button>
        </section>
      </div>
  );
});

export default DashboardView;