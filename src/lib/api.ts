const API_URL = 'http://localhost:3001/api';

const handleResponse = async (response: Response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
};

export const register = async (name: string, email: string, password: string) => {
  const response = await fetch(`${API_URL}/users/onboarding`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  return handleResponse(response);
};

export const login = async (email: string, password: string) => {
  const response = await fetch(`${API_URL}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await handleResponse(response);
  if (data.token) {
    localStorage.setItem('token', data.token);
  }
  return data;
};

export const googleAuth = async (userCredential: any) => {
  const user = userCredential.user;
  const response = await fetch(`${API_URL}/users/google-auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: user.displayName,
      email: user.email,
      uid: user.uid,
      photoURL: user.photoURL
    }),
  });
  const data = await handleResponse(response);
  if (data.token) {
    localStorage.setItem('token', data.token);
  }
  return data;
};

export const getCurrentUser = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }
  const response = await fetch(`${API_URL}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handleResponse(response);
};

export const logout = () => {
  localStorage.removeItem('token');
};

// Export all auth-related functions as a single object
export const auth = {
  register,
  login,
  googleAuth,
  getCurrentUser,
  logout,
};
