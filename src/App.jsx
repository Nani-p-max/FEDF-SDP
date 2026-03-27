import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useParams, useLocation } from 'react-router-dom';
import './App.css';
import { PLANS, ADDONS, simulateApi } from './PLANS.js';
import { NavLink } from 'react-router-dom';
import PlanCard from './components/PlanCard.jsx';
import DashboardView from './components/Dashboard.jsx';
import SelectionWorkflow from './components/SelectedWorkflow.jsx';
import AuthPage from './components/AuthPage.jsx';
import { getCurrentUser, logoutUser, isAuthenticated } from './utils/authService.js';

const BrowseView = memo(({ navigate }) => (
  <div className="plans-grid">
    {PLANS.map((plan) => (
      <PlanCard key={plan.id} plan={plan} onSelect={(id) => navigate(`/details/${id}`)} />
    ))}
  </div>
));

const DetailsWrapper = memo(({ activeAddons, toggleAddon, isProcessing, onPurchase }) => {
  const { planId } = useParams();
  const navigate = useNavigate();
  
  const selectedPlan = useMemo(() => PLANS.find((p) => p.id === planId), [planId]);

  if (!selectedPlan) return <Navigate to="/browse" />;

  const { totalPrice } = useMemo(() => {
    const total = activeAddons.reduce((sum, addonId) => {
      const addon = ADDONS.find((item) => item.id === addonId);
      return sum + (addon ? addon.price : 0);
    }, 0);
    return { totalPrice: selectedPlan.price + total };
  }, [activeAddons, selectedPlan.price]);

  const handleConfirm = useCallback(() => onPurchase(selectedPlan, totalPrice), [onPurchase, selectedPlan, totalPrice]);
  const handleBack = useCallback(() => navigate('/browse'), [navigate]);

  return (
    <SelectionWorkflow
      selectedPlan={selectedPlan}
      activeAddons={activeAddons}
      toggleAddon={toggleAddon}
      totalPrice={totalPrice}
      onConfirm={handleConfirm}
      isProcessing={isProcessing}
      onBack={handleBack}
    />
  );
});

function AppContent() {
  const [activeAddons, setActiveAddons] = useState([]);
  const [activeSubscription, setActiveSubscription] = useState(() => {
    // Load subscription from localStorage
    const saved = localStorage.getItem('active_subscription');
    return saved ? JSON.parse(saved) : null;
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authState, setAuthState] = useState(0);
  const [, setForceUpdate] = useState({});
  const location = useLocation();

  // Get current user from localStorage (always fresh)
  const currentUser = getCurrentUser();
  const isUserLoggedIn = currentUser !== null;

  // Check on mount
  useEffect(() => {
    setIsLoading(false);
  }, []);

  // Force re-evaluate auth state when location changes (e.g., after login)
  useEffect(() => {
    setForceUpdate({});
  }, [location]);

  // Save subscription to localStorage whenever it changes
  useEffect(() => {
    if (activeSubscription) {
      localStorage.setItem('active_subscription', JSON.stringify(activeSubscription));
    } else {
      localStorage.removeItem('active_subscription');
    }
  }, [activeSubscription]);

  // Listen for storage changes to update auth state
  useEffect(() => {
    const handleStorageChange = () => {
      setAuthState(prev => prev + 1);
      setForceUpdate({});
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);


  const toggleAddon = useCallback((addonId) => {
    setActiveAddons((prev) =>
      prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]
    );
  }, []);

  const handlePurchase = useCallback(async (plan, total, navigate) => {
    // Check if user already has an active subscription
    if (activeSubscription) {
      const costDifference = total - activeSubscription.total;
      const costMessage = costDifference > 0 
        ? `increase of $${costDifference.toFixed(2)}/month` 
        : costDifference < 0 
        ? `reduction of $${Math.abs(costDifference).toFixed(2)}/month`
        : 'same price';

      const confirmed = window.confirm(
        `You already have an active subscription (${activeSubscription.name} - $${activeSubscription.total}/mo).\n\n` +
        `Switching to ${plan.name} ($${total}/mo) will be a ${costMessage}.\n\n` +
        `Do you want to renew/upgrade your plan?`
      );

      if (!confirmed) {
        return; // User cancelled
      }
    }

    // Proceed with purchase
    setIsProcessing(true);
    const result = await simulateApi({
      ...plan,
      addons: activeAddons,
      total: total,
      date: new Date().toLocaleDateString(),
    });
    setActiveSubscription(result);
    setIsProcessing(false);
    navigate('/browse');
  }, [activeSubscription, activeAddons]);

  const handleLogout = useCallback(() => {
    logoutUser();
    window.location.href = '/FEDF-SDP/'; // Hard refresh to reload everything
  }, []);

  const Navbar = memo(function Navbar({ isAuthenticated, user, onLogout }) {
    return (
      <nav className="main-nav">
        <div className="nav-logo">NexusStream</div>
        {isAuthenticated && (
          <div className="nav-links">
            <div className="nav-user-info">
              Welcome, <span className="username">{user?.username || user?.email}</span>
            </div>
            <NavLink to="/browse" className={({ isActive }) => isActive ? 'active-link' : ''}>
              Browse Plans
            </NavLink>
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active-link' : ''}>
              My Subscription
            </NavLink>
            <button className="logout-btn" onClick={onLogout}>
              Logout
            </button>
          </div>
        )}
      </nav>
    );
  });

  // ProtectedRoute component - not using useCallback to always get fresh values
  const ProtectedRoute = ({ element }) => {
    const latestUser = getCurrentUser();
    const isAuth = latestUser !== null;
    
    if (isLoading) {
      return <div className="loading">Loading...</div>;
    }
    return isAuth ? element : <Navigate to="/" />;
  };

  return (
    <div className="app">
      {isLoading === false && isUserLoggedIn && (
        <header>
          <Navbar isAuthenticated={true} user={currentUser} onLogout={handleLogout} />
          <p>From your first spark of an idea to global dominance, our tiers grow with you.</p>
          <h1>Subscription Plans</h1>
        </header>
      )}

      <Routes>
        {/* Auth Route */}
        <Route 
          path="/" 
          element={isUserLoggedIn ? <Navigate to="/browse" /> : <AuthPage />} 
        />

        {/* Protected Routes */}
        <Route 
          path="/browse" 
          element={<ProtectedRoute element={<BrowseViewConsumer />} />} 
        />

        <Route 
          path="/details/:planId" 
          element={
            <ProtectedRoute 
              element={
                <DetailsConsumer 
                  activeAddons={activeAddons}
                  toggleAddon={toggleAddon}
                  isProcessing={isProcessing}
                  onPurchase={handlePurchase}
                />
              } 
            />
          } 
        />

        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute 
              element={
                <DashboardView 
                  subscription={activeSubscription} 
                  onBrowse={(nav) => nav('/browse')} 
                />
              } 
            />
          } 
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to={isUserLoggedIn ? "/browse" : "/"} />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router basename="/FEDF-SDP/">
      <AppContent />
    </Router>
  );
}

const BrowseViewConsumer = () => {
  const navigate = useNavigate();
  return <BrowseView navigate={navigate} />;
};

const DetailsConsumer = (props) => {
  const navigate = useNavigate();
  return <DetailsWrapper {...props} onPurchase={(plan, total) => props.onPurchase(plan, total, navigate)} />;
};

export default App;