"use client";

import { useEffect, useRef, useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import EditProfileModal from "../../components/employees/EditProfileModal";

const API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:2006";

export default function SettingsPage() {
  const fileInputRef = useRef(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [profile, setProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);

  // ==============================
  // Load Logged In User
  // ==============================
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      setProfileLoading(false);
      return;
    }

    try {
      const user = JSON.parse(storedUser);

      console.log("Logged User:", user);

      setProfile(user);

      setIsAdmin(
        (user.RoleType || user.role || "").toLowerCase() === "admin"
      );
    } catch (error) {
      console.error("Failed to load user profile:", error);
      setProfile(null);
    } finally {
      setProfileLoading(false);
    }
  }, []);

  // ==============================
  // Upload Photo
  // ==============================
  async function uploadPhoto(event) {
    const file = event.target.files?.[0];

    if (!file || !profile?.EmployeeID) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Not authenticated. Please login again.");
      return;
    }

    const formData = new FormData();
    formData.append("photo", file);

    try {
      const response = await fetch(
        `${API_URL}/employees/${profile.EmployeeID}/photo`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.detail || "Photo upload failed"
        );
      }

      const updatedUser = {
        ...profile,
        PhotoURL: result.PhotoURL,
      };

      setProfile(updatedUser);

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      alert("Photo uploaded successfully");
    } catch (error) {
      console.error("Photo upload error:", error);
      alert(error.message || "Photo upload failed");
    } finally {
      // Allow selecting the same file again
      event.target.value = "";
    }
  }

  // ==============================
  // Save Profile
  // ==============================
  async function saveProfile(data) {
    if (!profile?.EmployeeID) {
      alert("Employee ID not found");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Not authenticated. Please login again.");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/employees/${profile.EmployeeID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.detail || "Unable to update profile"
        );
      }

      const updatedUser = {
        ...profile,
        ...result.employee,
      };

      setProfile(updatedUser);

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      setShowEditModal(false);

      alert("Profile Updated Successfully");
    } catch (error) {
      console.error("Profile update error:", error);
      alert(error.message || "Update failed");
    }
  }

  // ==============================
  // Loading
  // ==============================
  if (profileLoading) {
    return (
      <MainLayout>
        <div
          style={{
            padding: 40,
            textAlign: "center",
          }}
        >
          Loading Profile...
        </div>
      </MainLayout>
    );
  }

  // ==============================
  // Profile Not Found
  // ==============================
  if (!profile) {
    return (
      <MainLayout>
        <div
          style={{
            padding: 40,
            textAlign: "center",
          }}
        >
          Profile Not Found
        </div>
      </MainLayout>
    );
  }

  // ==============================
  // Profile Page
  // ==============================
  return (
    <MainLayout>
      <div
        style={{
          padding: 30,
        }}
      >
        <h1>
          ⚙️ {isAdmin ? "Admin Profile" : "Employee Profile"}
        </h1>

        <p
          style={{
            color: "#666",
            marginBottom: 30,
          }}
        >
          Manage your profile information.
        </p>

        <div
          style={{
            background: "#fff",
            borderRadius: 15,
            padding: 35,
            maxWidth: 700,
            margin: "auto",
            boxShadow: "0 4px 12px rgba(0,0,0,.08)",
          }}
        >
          {/* Profile Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 25,
              marginBottom: 35,
            }}
          >
            <img
              src={
                profile.PhotoURL
                  ? `${API_URL}${profile.PhotoURL}?t=${Date.now()}`
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      profile.EmployeeName ||
                        profile.Name ||
                        "User"
                    )}`
              }
              alt="profile"
              style={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                objectFit: "cover",
                border: "4px solid #2563eb",
              }}
            />

            <div>
              <h2>
                {profile.EmployeeName || profile.Name}
              </h2>

              <p>
                {profile.Designation ||
                  profile.Role ||
                  "-"}
              </p>

              <span
                style={{
                  background: "#dcfce7",
                  padding: "6px 15px",
                  borderRadius: 20,
                  fontWeight: 600,
                }}
              >
                {profile.Status || "Active"}
              </span>
            </div>
          </div>

          {/* Profile Information */}
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <tbody>
              {!isAdmin && (
                <tr>
                  <td>
                    <b>Employee Code</b>
                  </td>

                  <td>
                    {profile.EmployeeCode || "-"}
                  </td>
                </tr>
              )}

              <tr>
                <td>
                  <b>Email</b>
                </td>

                <td>
                  {profile.EmailID ||
                    profile.Email ||
                    "-"}
                </td>
              </tr>

              <tr>
                <td>
                  <b>Department</b>
                </td>

                <td>
                  {profile.Department || "-"}
                </td>
              </tr>

              <tr>
                <td>
                  <b>Designation</b>
                </td>

                <td>
                  {profile.Designation || "-"}
                </td>
              </tr>

              <tr>
                <td>
                  <b>Role</b>
                </td>

                <td>
                  {profile.RoleType ||
                    profile.Role ||
                    "-"}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Hidden Photo Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{
              display: "none",
            }}
            onChange={uploadPhoto}
          />

          {/* Action Buttons */}
          <div
            style={{
              display: "flex",
              gap: 15,
              marginTop: 35,
            }}
          >
            <button
              onClick={() =>
                fileInputRef.current?.click()
              }
              style={{
                padding: "12px 22px",
                background: "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              Upload Photo
            </button>

            <button
              onClick={() => setShowEditModal(true)}
              style={{
                padding: "12px 22px",
                background: "#0f766e",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Edit Profile Modal */}
        {showEditModal && (
          <EditProfileModal
            employee={profile}
            onClose={() => setShowEditModal(false)}
            onSave={saveProfile}
          />
        )}
      </div>
    </MainLayout>
  );
}