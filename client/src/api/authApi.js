import { BASE_URL, handleResponse } from './apiClient';

export const registerUser = async (data) => {
  try {
    console.log("Sending registration request to:", `${BASE_URL}/auth/register`);
    
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    console.log("Response status:", response.status);
    
    const result = await handleResponse(response);
    console.log("Raw registration response:", result);
    
    if (result.success && result.data && result.data.token && result.data.user) {
      console.log("Registration successful!");
      return result.data; 
    } else {
      console.log("Unexpected response structure:", result);
      throw new Error(result.error || 'Registration failed - unexpected response');
    }
    
  } catch (error) {
    console.error("Registration API error:", error);
    throw new Error(error.message || 'Registration failed');
  }
};

export const loginUser = async (data) => {
  try {
    console.log("Sending login request to:", `${BASE_URL}/auth/login`);
    
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    console.log("Login response status:", response.status);
    
    const result = await handleResponse(response);
    console.log("Raw login response:", result);
    
    if (result.success && result.data && result.data.token && result.data.user) {
      console.log("Login successful!");
      return result.data; 
    } else {
      console.log("Unexpected response structure:", result);
      throw new Error(result.error || 'Login failed - unexpected response');
    }
    
  } catch (error) {
    console.error("Login API error:", error);
    throw new Error(error.message || 'Login failed');
  }
};