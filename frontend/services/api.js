const API_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL || ""
).trim().replace(/\/+$/, "");

export async function apiRequest(endpoint, options = {}) {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  const response = await fetch(
    `${API_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),
        ...(options.headers || {}),
      },
    }
  );

  if (response.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      const basePath =
        process.env.NODE_ENV === "production"
          ? "/employee-timesheet"
          : "";

      window.location.href = `${basePath}/login`;
    }

    throw new Error("Session expired. Please log in again.");
  }

  if (!response.ok) {
    const errorText = await response.text();

    let message = "API request failed";

    try {
      const errorData = JSON.parse(errorText);
      message = errorData.detail || errorData.message || message;
    } catch {
      message = errorText || message;
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}