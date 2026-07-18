const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  console.log("JWT Token:", token);

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",

      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),

      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "API Request Failed");
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}