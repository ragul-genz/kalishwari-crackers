const AUTH_KEY = 'kalishwari_admin_auth';

export const isAdminAuthenticated = () => {
  // Clear any legacy localStorage auth to enforce session-based login
  localStorage.removeItem(AUTH_KEY);
  return sessionStorage.getItem(AUTH_KEY) === 'true';
};

export const setAdminAuthenticated = (status) => {
  localStorage.removeItem(AUTH_KEY);
  if (status) {
    sessionStorage.setItem(AUTH_KEY, 'true');
  } else {
    sessionStorage.removeItem(AUTH_KEY);
  }
};

