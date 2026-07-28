import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

export const metadata = {
  title: "SWAIS Employee Timesheet",
  description: "Employee Timesheet Management System",
};

export default function RootLayout({ children }) {

  console.log(
    "CLIENT ID:",
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
  );

  return (
    <html lang="en">
      <body>
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
        >
          <AuthProvider>
            {children}
          </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}