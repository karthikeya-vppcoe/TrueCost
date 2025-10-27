// authService.ts - Simple authentication service with mock data and session persistence

import { User } from '../types';

// Mock user database
const MOCK_USERS = [
  {
    email: 'user@truecost.com',
    password: 'password123',
    name: 'John Doe',
    role: 'user' as const
  },
  {
    email: 'admin@truecost.com',
    password: 'password',
    name: 'Admin User',
    role: 'admin' as const
  }
];

const SESSION_KEY = 'truecost_session';

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SignupData extends AuthCredentials {
  fullName: string;
}

// Validate user credentials
export const validateCredentials = (email: string, password: string): User | null => {
  const user = MOCK_USERS.find(u => u.email === email && u.password === password);
  if (user) {
    return {
      name: user.name,
      email: user.email,
      role: user.role
    };
  }
  return null;
};

// Register new user (mock implementation)
export const registerUser = (data: SignupData): User => {
  // In a real app, this would make an API call to register the user
  // For now, we'll just create a user object
  return {
    name: data.fullName,
    email: data.email,
    role: 'user'
  };
};

// Save session to localStorage
export const saveSession = (user: User): void => {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Failed to save session:', error);
  }
};

// Load session from localStorage
export const loadSession = (): User | null => {
  try {
    const sessionData = localStorage.getItem(SESSION_KEY);
    if (sessionData) {
      return JSON.parse(sessionData);
    }
  } catch (error) {
    console.error('Failed to load session:', error);
  }
  return null;
};

// Clear session from localStorage
export const clearSession = (): void => {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (error) {
    console.error('Failed to clear session:', error);
  }
};

// Check if user exists (for preventing duplicate registrations)
export const userExists = (email: string): boolean => {
  return MOCK_USERS.some(u => u.email === email);
};
