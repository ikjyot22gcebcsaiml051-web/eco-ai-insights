import { useState, useEffect, useCallback } from "react";

const AUTH_STORAGE_KEY = "demo_auth_authenticated";

// Demo credentials - for demonstration purposes only
const DEMO_EMAIL = "ikjyotsaluja01@gmail.com";
const DEMO_PASSWORD = "1";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem(AUTH_STORAGE_KEY) === "true";
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage on mount
    const authState = localStorage.getItem(AUTH_STORAGE_KEY) === "true";
    setIsAuthenticated(authState);
    setLoading(false);
  }, []);

  const signIn = useCallback((email: string, password: string) => {
    // Validate against demo credentials
    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      localStorage.setItem(AUTH_STORAGE_KEY, "true");
      setIsAuthenticated(true);
      return { success: true, error: null };
    }
    return { success: false, error: "Invalid email or password" };
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setIsAuthenticated(false);
  }, []);

  return {
    isAuthenticated,
    loading,
    signIn,
    signOut,
  };
};
