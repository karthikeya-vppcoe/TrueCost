// authService.ts - Authentication service with MongoDB API integration and local fallback

import { User } from '../types';

const SESSION_KEY = 'truecost_session';

// Base URL for API calls (empty string means same origin in production, works for Vercel)
const API_BASE = '/api';

// Mock user fallback (used when API is unavailable, e.g. during local dev without a server)
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

// Mutable mock DB for registrations when API is unavailable
const REGISTERED_MOCK_USERS = [...MOCK_USERS];

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SignupData extends AuthCredentials {
  fullName: string;
}

// Validate user credentials – tries MongoDB API first, falls back to mock data
export const validateCredentials = async (email: string, password: string): Promise<User | null> => {
  try {
    const response = await fetch(`${API_BASE}/users?action=login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const user = await response.json() as User;
      return user;
    }

    if (response.status === 401) {
      return null;
    }

    // Non-auth error → fall through to mock
    throw new Error(`API responded with ${response.status}`);
  } catch (error) {
    console.warn('MongoDB API unavailable, using mock authentication:', error);
    const user = REGISTERED_MOCK_USERS.find(u => u.email === email && u.password === password);
    if (user) {
      return { name: user.name, email: user.email, role: user.role };
    }
    return null;
  }
};

// Register new user – tries MongoDB API first, falls back to mock
export const registerUser = async (data: SignupData): Promise<User> => {
  try {
    const response = await fetch(`${API_BASE}/users?action=register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: data.email, password: data.password, fullName: data.fullName }),
    });

    if (response.ok) {
      const user = await response.json() as User;
      return user;
    }

    const errorData = await response.json() as { error?: string };
    throw new Error(errorData.error ?? 'Registration failed');
  } catch (error) {
    if (error instanceof Error && error.message !== 'Registration failed' && !error.message.includes('API responded')) {
      // Network/connection error – use mock fallback
      console.warn('MongoDB API unavailable, using mock registration:', error);
      REGISTERED_MOCK_USERS.push({
        email: data.email,
        password: data.password,
        name: data.fullName,
        role: 'user',
      });
      return { name: data.fullName, email: data.email, role: 'user' };
    }
    throw error;
  }
};

// Check if user exists – tries API first, falls back to mock
export const userExists = async (email: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE}/users?email=${encodeURIComponent(email)}`);
    return response.ok;
  } catch {
    return REGISTERED_MOCK_USERS.some(u => u.email === email);
  }
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
