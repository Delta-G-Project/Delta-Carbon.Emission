'use server';

import { cookies } from 'next/headers';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.ather-carbon.com/v1';

export async function loginAction(email, password) {
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { success: false, error: errorData.message || 'Login failed' };
    }

    const data = await response.json();
    // Return success to proceed to OTP
    return { success: true, data };
  } catch (error) {
    console.error('Login action error:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function verifyOTPAction(email, otp) {
  try {
    const response = await fetch(`${BASE_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
    });

    if (!response.ok) {
      return { success: false, error: 'Invalid OTP' };
    }

    const data = await response.json();
    
    // Set Secure HttpOnly Session Cookie upon success
    // Using strict samesite and secure flag for production-grade security
    const cookieStore = await cookies();
    cookieStore.set('auth_token', data.token || 'placeholder_token_for_now', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 86400, // 24 hours
    });

    return { success: true };
  } catch (error) {
    console.error('Verify OTP error:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function resendOTPAction(email) {
  try {
    const response = await fetch(`${BASE_URL}/auth/resend-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      return { success: false, error: 'Failed to resend OTP' };
    }

    return { success: true };
  } catch (error) {
    console.error('Resend OTP error:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('auth_token');
  return { success: true };
}
