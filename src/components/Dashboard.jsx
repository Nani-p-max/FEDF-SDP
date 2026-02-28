function DashboardView({ subscription, onBrowse }) {
  if (!subscription) {
    return (
      <p>
        You have no active subscription.{' '}
        <button onClick={onBrowse}>Browse plans</button>
      </p>
    );
  }

  return (
    <section className="dashboard">
      <h2>Your Subscription</h2>
      <div className="status-badge">Active</div>
      <p><strong>Plan:</strong> {subscription.name}</p>
      <p><strong>Billing:</strong> ${subscription.total}/mo</p>
      <p><strong>Activated on:</strong> {subscription.date}</p>
      <p><strong>Features:</strong> {subscription.storage} Storage, {subscription.users} Users</p>
    </section>
  );
}

export default DashboardView;