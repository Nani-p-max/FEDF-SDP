function PlanCard({ plan, onSelect }) {
  return (
    <article className="plan-card">
      <h2>{plan.name}</h2>
      <p>{plan.description}</p>
      <p>${plan.price}/month</p>
      <p>Storage: {plan.storage}</p>
      <p>Users: {plan.users}</p>
      <button onClick={() => onSelect(plan.id)}>Choose Plan</button>
    </article>
  );
}

export default PlanCard;