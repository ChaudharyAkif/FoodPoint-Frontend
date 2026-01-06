// context/AuthContext.tsx
import { 
  createContext, 
  useState, 
  useEffect, 
  useContext, 
  useMemo, 
  useCallback, 
  useRef 
} from "react";
import type { ReactNode } from "react";
import { loginApi } from "../api/auth.api";
import { type AuthContextType, type User } from "../types/auth.types";
import Loader from "../components/ScreenLoader/Loader";

// ==================== STORAGE KEYS ====================
const STORAGE_KEYS = {
  TOKEN: 'token',
  ROLE: 'role',
  USER: 'user',
} as const;

// ==================== STORAGE UTILITY FUNCTIONS ====================

/**
 * Get stored user with error handling
 */
const getStoredUser = (): User | null => {
  try {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error parsing stored user:', error);
    return null;
  }
};

/**
 * Get stored token
 */
const getStoredToken = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.TOKEN);
};

/**
 * Get stored role
 */
const getStoredRole = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.ROLE);
};

/**
 * Get all auth data at once (BATCH OPERATION - FASTER!)
 */
const getStoredAuthData = () => {
  const token = getStoredToken();
  const role = getStoredRole();
  const user = getStoredUser();
  return { token, role, user };
};

/**
 * Set all auth data at once (BATCH OPERATION - FASTER!)
 */
const setStoredAuthData = (token: string, role: string, user: User): void => {
  localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  localStorage.setItem(STORAGE_KEYS.ROLE, role);
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

/**
 * Clear all auth data (BATCH OPERATION - FASTER!)
 */
const clearStoredAuthData = (): void => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.ROLE);
  localStorage.removeItem(STORAGE_KEYS.USER);
};

/**
 * Check if stored auth data is valid
 */
const isAuthDataValid = (): boolean => {
  const { token, role, user } = getStoredAuthData();
  
  // All should exist together or none should exist
  const hasAll =  !!token && !!role && !!user;
  const hasNone = !token && !role && !user;
  
  return hasAll || hasNone;
};

/**
 * Repair corrupted auth data
 */
const repairAuthData = (): void => {
  if (!isAuthDataValid()) {
    console.warn('Auth data corrupted, clearing all...');
    clearStoredAuthData();
  }
};

/**
 * Check if user is authenticated
 */
const checkAuthentication = (): boolean => {
  return !!getStoredToken();
};

// ==================== CONTEXT CREATION ====================

// Create context with default null value
export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

// ==================== AUTH PROVIDER ====================

export const AuthProvider = ({ children }: AuthProviderProps) => {
  // State
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Refs for optimization
  const isInitialized = useRef(false);
  const authDataCache = useRef<{
    token: string | null;
    role: string | null;
    user: User | null;
  }>({
    token: null,
    role: null,
    user: null,
  });

  // ==================== INITIALIZATION ====================
  useEffect(() => {
    // Prevent double initialization
    if (isInitialized.current) return;

    const initializeAuth = () => {
      try {
        // Repair corrupted data if any
        repairAuthData();

        // Get all auth data in one go (FASTER!)
        const authData = getStoredAuthData();

        // Cache the data in ref (for fast access)
        authDataCache.current = authData;

        // Update state only if data exists
        if (authData.role) setRole(authData.role);
        if (authData.user) setUser(authData.user);

        isInitialized.current = true;
      } catch (error) {
        console.error("Error initializing auth:", error);
        clearStoredAuthData();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // ==================== LOGIN FUNCTION ====================
  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await loginApi({ email, password });
      const { token, role: userRole, user: userData } = res.data;

      // Save to localStorage in ONE batch operation (FASTER!)
      setStoredAuthData(token, userRole, userData);

      // Update cache
      authDataCache.current = { token, role: userRole, user: userData };

      // Update state
      setRole(userRole);
      setUser(userData);

      // return res.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }, []);

  // ==================== LOGOUT FUNCTION ====================
  const logout = useCallback(() => {
    // Clear localStorage in ONE batch operation (FASTER!)
    clearStoredAuthData();

    // Clear cache
    authDataCache.current = { token: null, role: null, user: null };

    // Update state
    setUser(null);
    setRole(null);
  }, []);

  // ==================== HELPER FUNCTIONS ====================

  /**
   * Get token from cache (VERY FAST - no localStorage access)
   */
  const getToken = useCallback((): string | null => {
    return authDataCache.current.token || getStoredToken();
  }, []);

  /**
   * Get role from cache (VERY FAST - no localStorage access)
   */
  const getRoleFromCache = useCallback((): string | null => {
    return authDataCache.current.role || role;
  }, [role]);

  /**
   * Check if authenticated (using cache)
   */
  const isAuthenticated = useCallback((): boolean => {
    return !!(authDataCache.current.token || getStoredToken());
  }, []);

  /**
   * Update user data
   */
  const updateUser = useCallback((newUser: User) => {
    setUser(newUser);
    authDataCache.current.user = newUser;
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
  }, []);

  /**
   * Refresh auth data from storage
   */
  const refreshAuthData = useCallback(() => {
    const authData = getStoredAuthData();
    authDataCache.current = authData;
    if (authData.role) setRole(authData.role);
    if (authData.user) setUser(authData.user);
  }, []);

  // ==================== MEMOIZED CONTEXT VALUE ====================
  const value = useMemo<AuthContextType>(
    () => ({
      user,
      role,
      isLoading,
      login,
      logout,
      getToken,
      getRole: getRoleFromCache,
      isAuthenticated,
      updateUser,
      refreshAuthData,
    }),
    [
      user,
      role,
      isLoading,
      login,
      logout,
      getToken,
      getRoleFromCache,
      isAuthenticated,
      updateUser,
      refreshAuthData,
    ]
  );

  return (
    <AuthContext.Provider value={value}>
      {isLoading ? <Loader /> : children}
    </AuthContext.Provider>
  );
};

// ==================== CUSTOM HOOK ====================

/**
 * useAuth hook - Use this in components
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// ==================== EXPORTED HELPER FUNCTIONS ====================
// These can be used directly without the hook (e.g., in API interceptors)

/**
 * Get token from storage
 */
export const getToken = (): string | null => {
  return getStoredToken();
};

/**
 * Get role from storage
 */
export const getRole = (): string | null => {
  return getStoredRole();
};

/**
 * Get user from storage
 */
export const getUserData = (): User | null => {
  return getStoredUser();
};

/**
 * Get all auth data from storage
 */
export const getAuthData = () => {
  return getStoredAuthData();
};

/**
 * Check authentication status
 */
export const isUserAuthenticated = (): boolean => {
  return checkAuthentication();
};

/**
 * Clear all authentication data
 */
export const clearAuthData = (): void => {
  clearStoredAuthData();
};

// ==================== TYPE AUGMENTATION ====================
// Add these to your auth.types.ts file if they don't exist

declare module "../types/auth.types" {
  export interface AuthContextType {
    user: User | null;
    role: string | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<{ token: string; role: string; user: User }>;
    logout: () => void;
    getToken: () => string | null;
    getRole: () => string | null;
    isAuthenticated: () => boolean;
    updateUser: (user: User) => void;
    refreshAuthData: () => void;
  }
}