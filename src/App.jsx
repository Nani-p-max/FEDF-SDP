import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import './App.css';
import { PLANS, ADDONS, simulateApi } from './PLANS.js';
import { NavLink } from 'react-router-dom';
import PlanCard from './components/PlanCard.jsx';
import DashboardView from './components/Dashboard.jsx';
import SelectionWorkflow from './components/SelectedWorkflow.jsx';

const BrowseView = ({ onChoose }) => (
  <div className="plans-grid">
    {PLANS.map((plan) => (
      <PlanCard key={plan.id} plan={plan} onSelect={onChoose} />
    ))}
  </div>
);

const DetailsWrapper = ({ activeAddons, toggleAddon, isProcessing, onPurchase }) => {
  const { planId } = useParams();
  const navigate = useNavigate();
  
  const selectedPlan = PLANS.find((p) => p.id === planId);

  if (!selectedPlan) return <Navigate to="/browse" />;

  const addonsTotal = activeAddons.reduce((sum, addonId) => {
    const addon = ADDONS.find((item) => item.id === addonId);
    return sum + (addon ? addon.price : 0);
  }, 0);
  
  const totalPrice = selectedPlan.price + addonsTotal;

  return (
    <SelectionWorkflow
      selectedPlan={selectedPlan}
      activeAddons={activeAddons}
      toggleAddon={toggleAddon}
      totalPrice={totalPrice}
      onConfirm={() => onPurchase(selectedPlan, totalPrice)}
      isProcessing={isProcessing}
      onBack={() => navigate('/browse')}
    />
  );
};

function App() {
  const [activeAddons, setActiveAddons] = useState([]);
  const [activeSubscription, setActiveSubscription] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const toggleAddon = (addonId) => {
    setActiveAddons((prev) =>
      prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]
    );
  };

  const handlePurchase = async (plan, total, navigate) => {
    setIsProcessing(true);
    const result = await simulateApi({
      ...plan,
      addons: activeAddons,
      total: total,
      date: new Date().toLocaleDateString(),
    });
    setActiveSubscription(result);
    setIsProcessing(false);
    navigate('/dashboard');
  };

  const Navbar = () => {
    return (
      <nav className="main-nav">
        <div className="nav-logo">NexusStream</div>
        <div className="nav-links">
          <NavLink to="/browse" className={({ isActive }) => isActive ? 'active-link' : ''}>
            Browse Plans
          </NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active-link' : ''}>
            My Subscription
          </NavLink>
        </div>
      </nav>
    );
  };
  return (
    <Router>
      <div className="app">
        <header>
           <Navbar />
          <p>From your first spark of an idea to global dominance, our tiers grow with you.</p>
          <h1>Subscription Plans</h1>
        </header>
       
        <Routes>
         
          <Route 
            path="/browse" 
            element={
              <BrowseView onChoose={(id) => window.location.pathname = `/details/${id}`} /> 
            } 
          />

          <Route 
            path="/details/:planId" 
            element={
              <DetailsConsumer 
                activeAddons={activeAddons}
                toggleAddon={toggleAddon}
                isProcessing={isProcessing}
                onPurchase={handlePurchase}
              />
            } 
          />

          <Route 
            path="/dashboard" 
            element={
              <DashboardView 
                subscription={activeSubscription} 
                onBrowse={(nav) => nav('/browse')} 
              />
            } 
          />

          <Route path="*" element={<Navigate to="/browse" />} />
        </Routes>
      </div>
    </Router>
  );
}

const DetailsConsumer = (props) => {
  const navigate = useNavigate();
  return <DetailsWrapper {...props} onPurchase={(plan, total) => props.onPurchase(plan, total, navigate)} />;
};

export default App;