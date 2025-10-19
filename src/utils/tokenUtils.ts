/**
 * Token management utilities for handling JWT tokens and refresh tokens
 */

export interface TokenInfo {
  accessToken: string;
  refreshToken: string;
  expiresAt?: Date;
}

export interface TokenRefreshResponse {
  access_token: string;
  message?: string;
}

/**
 * Get stored tokens from localStorage
 */
export const getStoredTokens = (): TokenInfo | null => {
  try {
    const accessToken = localStorage.getItem('jwt-access-token');
    const refreshToken = localStorage.getItem('jwt-refresh-token');
    
    if (!accessToken || !refreshToken) {
      return null;
    }
    
    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    console.error('Error getting stored tokens:', error);
    return null;
  }
};

/**
 * Store tokens in localStorage
 */
export const storeTokens = (tokens: TokenInfo): void => {
  try {
    localStorage.setItem('jwt-access-token', tokens.accessToken);
    localStorage.setItem('jwt-refresh-token', tokens.refreshToken);
    
    if (tokens.expiresAt) {
      localStorage.setItem('token-expires-at', tokens.expiresAt.toISOString());
    }
  } catch (error) {
    console.error('Error storing tokens:', error);
  }
};

/**
 * Clear all stored tokens
 */
export const clearTokens = (): void => {
  try {
    localStorage.removeItem('jwt-access-token');
    localStorage.removeItem('jwt-refresh-token');
    localStorage.removeItem('token-expires-at');
  } catch (error) {
    console.error('Error clearing tokens:', error);
  }
};

/**
 * Check if token is expired (basic check without decoding JWT)
 */
export const isTokenExpired = (): boolean => {
  try {
    const expiresAt = localStorage.getItem('token-expires-at');
    if (!expiresAt) {
      return false; // Assume not expired if no expiration date
    }
    
    const expirationDate = new Date(expiresAt);
    const now = new Date();
    
    // Add 5 minute buffer before actual expiration
    const bufferTime = 5 * 60 * 1000; // 5 minutes in milliseconds
    return now.getTime() > (expirationDate.getTime() - bufferTime);
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return false;
  }
};

/**
 * Refresh access token using refresh token
 */
export const refreshAccessToken = async (): Promise<TokenRefreshResponse | null> => {
  try {
    const tokens = getStoredTokens();
    if (!tokens) {
      throw new Error('No refresh token available');
    }
    
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    
    const response = await fetch(`${API_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh_token: tokens.refreshToken,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Token refresh failed: ${response.statusText}`);
    }
    
    const data: TokenRefreshResponse = await response.json();
    
    // Update stored access token
    if (data.access_token) {
      localStorage.setItem('jwt-access-token', data.access_token);
    }
    
    return data;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
};

/**
 * Get authorization header with current token
 */
export const getAuthHeader = (): { Authorization: string } | null => {
  try {
    const accessToken = localStorage.getItem('jwt-access-token');
    if (!accessToken) {
      return null;
    }
    
    return {
      Authorization: `Bearer ${accessToken}`,
    };
  } catch (error) {
    console.error('Error getting auth header:', error);
    return null;
  }
};

/**
 * Decode JWT token payload (without verification)
 * Note: This is for display purposes only, not for security validation
 */
export const decodeTokenPayload = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Get token expiration time
 */
export const getTokenExpiration = (token: string): Date | null => {
  try {
    const payload = decodeTokenPayload(token);
    if (!payload || !payload.exp) {
      return null;
    }
    
    return new Date(payload.exp * 1000);
  } catch (error) {
    console.error('Error getting token expiration:', error);
    return null;
  }
};

/**
 * Check if token will expire soon (within next 5 minutes)
 */
export const isTokenExpiringSoon = (token: string): boolean => {
  try {
    const expiration = getTokenExpiration(token);
    if (!expiration) {
      return false;
    }
    
    const now = new Date();
    const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);
    
    return expiration <= fiveMinutesFromNow;
  } catch (error) {
    console.error('Error checking if token is expiring soon:', error);
    return false;
  }
};
