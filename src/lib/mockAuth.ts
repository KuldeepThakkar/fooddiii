import type { User } from '../types';
import { STORAGE_KEYS, ADMIN_EMAIL, SESSION_EXPIRY_MS } from './constants';
import { simpleHash, generateUUID } from './utils';

/**
 * Get all users from localStorage
 */
export function getUsers(): User[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading users from localStorage:', error);
    return [];
  }
}

/**
 * Save users to localStorage
 */
export function saveUsers(users: User[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  } catch (error) {
    console.error('Error saving users to localStorage:', error);
  }
}

/**
 * Get current user session from localStorage
 */
export function getCurrentUser(): User | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!data) return null;
    
    const session = JSON.parse(data);
    const now = Date.now();
    
    // Check session expiry
    if (now - session.timestamp > SESSION_EXPIRY_MS) {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      return null;
    }
    
    return session.user;
  } catch (error) {
    console.error('Error reading current user from localStorage:', error);
    return null;
  }
}

/**
 * Save current user session to localStorage
 */
export function saveCurrentUser(user: User): void {
  try {
    const session = {
      user,
      timestamp: Date.now(),
    };
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(session));
  } catch (error) {
    console.error('Error saving current user to localStorage:', error);
  }
}

/**
 * Clear current user session from localStorage
 */
export function clearCurrentUser(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  } catch (error) {
    console.error('Error clearing current user from localStorage:', error);
  }
}

/**
 * Find user by email
 */
export function findUserByEmail(email: string): User | undefined {
  const users = getUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

/**
 * Create a new user
 */
export function createUser(name: string, email: string, password: string): User {
  const users = getUsers();
  
  // Check if email already exists
  if (findUserByEmail(email)) {
    throw new Error('Email already registered');
  }
  
  const hashedPassword = simpleHash(password);
  const role = email.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'user';
  
  const newUser: User = {
    id: generateUUID(),
    name,
    email: email.toLowerCase(),
    role,
    createdAt: new Date().toISOString(),
  };
  
  // Store user with hashed password (separate from user object for security)
  const userWithPassword = {
    ...newUser,
    passwordHash: hashedPassword,
  };
  
  users.push(userWithPassword);
  saveUsers(users);
  
  return newUser;
}

/**
 * Validate user credentials
 */
export function validateCredentials(email: string, password: string): User | null {
  const users = getUsers();
  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
  
  if (!user) {
    return null;
  }
  
  const userWithPassword = user as any;
  const hashedPassword = simpleHash(password);
  
  if (userWithPassword.passwordHash !== hashedPassword) {
    return null;
  }
  
  // Return user without password
  const { passwordHash, ...userWithoutPassword } = userWithPassword;
  return userWithoutPassword as User;
}

/**
 * Update user profile
 */
export function updateUserProfile(userId: string, updates: Partial<User>): User | null {
  const users = getUsers();
  const userIndex = users.findIndex((u) => u.id === userId);
  
  if (userIndex === -1) {
    return null;
  }
  
  const updatedUser = {
    ...users[userIndex],
    ...updates,
    id: userId, // Prevent ID changes
  };
  
  users[userIndex] = updatedUser;
  saveUsers(users);
  
  const { passwordHash, ...userWithoutPassword } = updatedUser as any;
  return userWithoutPassword as User;
}
