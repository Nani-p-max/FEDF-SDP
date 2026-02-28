import { ADDONS } from '../PLANS.js';

function SelectionWorkflow({
  selectedPlan,activeAddons,toggleAddon,totalPrice,onConfirm,isProcessing,onBack,}) {
  return (
    <section className="workflow">
      <button onClick={onBack}>Back</button>
      <h2>Customize {selectedPlan.name} Plan</h2>

      <div className="options">
        {ADDONS.map((addon) => (
          <label key={addon.id} className="addon-item">
            <input
              type="checkbox"
              checked={activeAddons.includes(addon.id)}
              onChange={() => toggleAddon(addon.id)}
            />
            {addon.name} (+${addon.price})
          </label>
        ))}
      </div>

      <div className="summary-box">
        <h3>Order Summary</h3>
        <p>Base Plan: ${selectedPlan.price}</p>
        <p>Add-ons: ${totalPrice - selectedPlan.price}</p>
        <hr />
        <h4>Total: ${totalPrice}/mo</h4>

        <button className="confirm-btn" disabled={isProcessing} onClick={onConfirm}>
          {isProcessing ? 'Processing...' : 'Activate Subscription'}
        </button>
      </div>
    </section>
  );
}

export default SelectionWorkflow;
