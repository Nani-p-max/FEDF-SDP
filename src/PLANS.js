
export const PLANS = [
  { 
    id: 'free', 
    name: 'Spark', 
    price: 0, 
    storage: '2GB', 
    users: 1, 
    badge: 'Free Forever',
    description: 'Hobbyist basics' 
  },
  { 
    id: 'basic', 
    name: 'Lumina', 
    price: 12, 
    storage: '20GB', 
    users: 1, 
    badge: null,
    description: 'Freelancer essential'
  },
  { 
    id: 'pro', 
    name: 'Velocity', 
    price: 29, 
    storage: '100GB', 
    users: 5, 
    badge: 'Most Popular',
    description: 'Team collaboration'
  },
  { 
    id: 'business', 
    name: 'Apex', 
    price: 79, 
    storage: '500GB', 
    users: 20, 
    badge: 'Best Value',
    description: 'Business scale'
  },
  { 
    id: 'ent', 
    name: 'Titan', 
    price: 199, 
    storage: '2TB', 
    users: 100, 
    badge: 'Enterprise',
    description: 'Global infrastructure'
  },
  { 
    id: 'custom', 
    name: 'Zenith', 
    price: 0, 
    storage: 'Unlimited', 
    users: 'Unlimited', 
    badge: 'Contact Us',
    description: 'Custom solutions'
  }
];

export const ADDONS = [
  { id: 'support', name: '24/7 Priority Support', price: 10 },
  { id: 'security', name: 'Advanced Security Bundle', price: 15 },
  { id: 'cloud-sync', name: 'Real-time Cloud Sync', price: 5 },
  { id: 'analytics', name: 'AI Advanced Analytics', price: 20 }
];


export const simulateApi = (data) => 
  new Promise((res) => 
    setTimeout(() => 
      res(data), 1200));