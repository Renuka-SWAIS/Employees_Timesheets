"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function LoginPage() {
  const router = useRouter();

  const handleSuccess = async (credentialResponse) => {
    try {
      console.log("Google Credential:", credentialResponse);

      const response = await fetch(`${API_URL}/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          credential: credentialResponse.credential,
        }),
      });

      console.log("Response Status:", response.status);

      const data = await response.json();

      console.log("Backend Response:", data);

      if (!response.ok) {
        alert(data.detail || "Login Failed");
        return;
      }

      // Support both access_token and token
      const token = data.access_token || data.token;

      if (!token) {
        console.error("JWT Token not found in response!");
        alert("Backend did not return a JWT token.");
        return;
      }

      // Save Token
      localStorage.setItem("token", token);

      console.log("Saved Token:", localStorage.getItem("token"));

      // Save User
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      alert(
        `Welcome ${
          data.user?.EmployeeName || "User"
        }`
      );

      router.push("/dashboard");

    } catch (error) {
      console.error("Login Error:", error);
      alert("Unable to connect to backend.");
    }
  };

  const handleError = () => {
    console.error("Google Login Failed");
    alert("Google Login Failed!");
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-logo">
          <h1>SWAIS</h1>
          <p className="employee-title">
            Employee Timesheet
          </p>
        </div>

        <div className="login-content">
          <h2>Welcome Back</h2>

          <p>
            Sign in with your Google account to continue.
          </p>

          <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
          />
        </div>

        <div className="login-footer">
          © 2026 SWAIS
        </div>

      </div>
    </div>
  );
}