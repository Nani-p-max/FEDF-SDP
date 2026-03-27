// Authentication Service with LocalStorage
const USERS_KEY = 'app_users';
const CURRENT_USER_KEY = 'current_user';

// Initialize with demo user for testing
const initializeUsers = () => {
  const existingUsers = localStorage.getItem(USERS_KEY);
  if (!existingUsers) {
    const demoUsers = [
      {
        id: 1,
        username: 'demo',
        email: 'demo@example.com',
        password: 'demo123', // In real app, use hashed passwords
      },
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(demoUsers));
  }
};

// Register a new user
export const registerUser = (username, email, password) => {
  const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];

  // Check if user already exists
  if (users.some((user) => user.email === email || user.username === username)) {
    return { success: false, message: 'User already exists' };
  }

  // Validate inputs
  if (!username || !email || !password) {
    return { success: false, message: 'All fields are required' };
  }

  if (password.length < 6) {
    return { success: false, message: 'Password must be at least 6 characters' };
  }

  const newUser = {
    id: Date.now(),
    username,
    email,
    password, // In production, hash this!
  };

  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return { success: true, message: 'Registration successful! Please log in.' };
};

// Login user
export const loginUser = (email, password) => {
  const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];

  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return { success: false, message: 'Invalid email or password' };
  }

  // Store current user (without password)
  const { password: _, ...userWithoutPassword } = user;
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
  return { success: true, message: 'Login successful!', user: userWithoutPassword };
};

// Get current logged-in user
export const getCurrentUser = () => {
  const user = localStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
};

// Logout user
export const logoutUser = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return getCurrentUser() !== null;
};

// Initialize users on first load
initializeUsers();
