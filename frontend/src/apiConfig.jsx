const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
 register: `${API_BASE_URL}/api/auth/register`,
 login: `${API_BASE_URL}/api/auth/login`,
 validate: `${API_BASE_URL}/api/auth/validate`,
 matches: `${API_BASE_URL}/api/matches`,
 users: `${API_BASE_URL}/api/users`,
 friends: `${API_BASE_URL}/api/friends`,
 bets: `${API_BASE_URL}/api/bets`,
 logout: `${API_BASE_URL}/api/auth/logout`
};