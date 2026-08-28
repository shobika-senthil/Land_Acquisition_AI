import { User, UserRole } from '../types';

const STORAGE_KEY = 'landlytics_auth';

export const authService = {
  getCurrentUser(): User | null {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return null;
      return JSON.parse(data);
    } catch {
      return null;
    }
  },

  login(email: string, _pass: string, role: UserRole = 'Administrator'): User {
    const user: User = {
      id: `usr-${Date.now().toString(36)}`,
      name: email.includes('@') 
        ? email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
        : 'Dr. Rajesh Sundaram, IAS',
      email: email || 'rajesh.sundaram@dolr.gov.in',
      role,
      department: 'Department of Land Resources (DoLR)',
      organization: 'Ministry of Rural Development',
      token: 'jwt_mock_token_landlytics',
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return user;
  },

  switchRole(role: UserRole): User | null {
    const current = this.getCurrentUser();
    if (!current) return null;
    const updated: User = { ...current, role };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  signup(name: string, email: string, role: UserRole, department: string): User {
    const user: User = {
      id: `usr-${Date.now().toString(36)}`,
      name: name || 'Officer',
      email: email || 'officer@gov.in',
      role: role || 'Project Officer',
      department: department || 'Department of Land Resources (DoLR)',
      organization: 'Government of India',
      token: 'jwt_mock_token_landlytics',
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return user;
  },

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
    // Clear any related session cache
    sessionStorage.clear();
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem(STORAGE_KEY);
  }
};
