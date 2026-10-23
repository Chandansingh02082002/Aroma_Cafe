const TOKEN_KEY = "cafe_owner_token";
const OWNER_KEY = "cafe_owner";

export const saveAuth = (token, owner) => {
  if (!token) {
    throw new Error("The server did not return an authentication token.");
  }

  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(OWNER_KEY, JSON.stringify(owner || {}));
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const getOwner = () => {
  const owner = localStorage.getItem(OWNER_KEY);
  if (!owner) return null;

  try {
    return JSON.parse(owner);
  } catch (error) {
    console.warn("Stored owner profile was invalid; clearing it.");
    localStorage.removeItem(OWNER_KEY);
    return null;
  }
};

export const isAuthenticated = () => {
  return Boolean(getToken());
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(OWNER_KEY);
};
