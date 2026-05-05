import toast from 'react-hot-toast';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.ather-carbon.com/v1';

export const apiClient = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
    credentials: 'include', // Enforce sending secure HttpOnly cookies across the application
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      // Return custom error format or throw
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'API request failed');
    }
    return await response.json();
  } catch (error) {
    console.error(`[apiClient] Error fetching ${endpoint}:`, error);

    // Global Network Error handling
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      toast.error('Unable to connect to the server. Please check your internet connection or try again later.', {
        duration: 5000,
        position: 'top-center',
      });
      // Return a structured error object instead of throwing, so the app doesn't crash with a red screen
      return { success: false, error: 'Network Error', data: null };
    }

    throw error;
  }
};
