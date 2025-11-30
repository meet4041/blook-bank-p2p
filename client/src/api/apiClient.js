const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

// Get authentication headers with JWT token
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

export const handleResponse = async (response) => {
  console.log("Handling response, status:", response.status);
  
  const text = await response.text();
  console.log("Raw response text:", text);
  
  if (!text) {
    throw new Error("Empty response from server");
  }

  let data;
  try {
    data = JSON.parse(text);
    console.log("Parsed response data:", data);
  } catch (parseError) {
    console.error("Failed to parse JSON response:", parseError);
    throw new Error("Invalid JSON response from server");
  }

  if (!response.ok) {
    console.error("API error response:", data);
    if (data.error) {
      throw new Error(data.error);
    } else if (data.message) {
      throw new Error(data.message);
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }

  return data;
};

export { BASE_URL };