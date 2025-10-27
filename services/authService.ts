// authService.ts - Simple authentication service with mock data and session persistence

import { User } from '../types';

// Mock user database - mutable to allow new registrations
const MOCK_USERS: Array<{
  email: string;
  password: string;
  name: string;
  role: 'user' | 'admin';
}> = [
  {
    email: 'user@truecost.com',
    password: 'password123',
    name: 'John Doe',
    role: 'user'
  },
  {
    email: 'admin@truecost.com',
    password: 'password',
    name: 'Admin User',
    role: 'admin'
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
  // Add the new user to the mock database
  MOCK_USERS.push({
    email: data.email,
    password: data.password,
    name: data.fullName,
    role: 'user'
  });
  
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
      const parsed = JSON.parse(sessionData);
      // Validate the parsed data has required User fields
      if (parsed && typeof parsed.name === 'string' && 
          typeof parsed.email === 'string' && 
          (parsed.role === 'user' || parsed.role === 'admin')) {
        return parsed as User;
      }
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
