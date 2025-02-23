import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

interface UserToolbarProps {
  avatarUrl: number;
  userId: string;
}

const UserToolbar: React.FC<UserToolbarProps> = ({ avatarUrl, userId }) => {
  const [localAvatarUrl, setLocalAvatarUrl] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string>("");
  const avatarContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/users/${userId}/avatar`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch avatar");
        }
        const blob = await response.blob();
        const avatarBlobUrl = URL.createObjectURL(blob);
        setLocalAvatarUrl(avatarBlobUrl);
      } catch (err: any) {
        console.error(err.message || "Error fetching avatar");
      }
    };

    const getRole = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/users/${userId}/role`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch user role");
        }
        const data = await response.json();
        setUserRole(data.role);
      } catch (err: any) {
        console.error(err.message || "Error fetching user role");
      }
    };

    fetchAvatar();
    getRole();
  }, [userId, avatarUrl]);

  // Logout handler
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  // Function to retrieve the user email (called when the avatar is clicked)
  const fetchUserEmail = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/users/${userId}/email`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch email");
      }
      const data = await response.json();
      setEmail(data.email);
    } catch (err: any) {
      console.error(err.message || "Error fetching email");
    }
  };

  // When clicking on the avatar, show the modal and fetch email (if needed)
  const handleAvatarClick = () => {
    setShowModal(true);
    if (!email) {
      fetchUserEmail();
    }
  };

  // Close the modal when clicking outside of the avatar container
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        avatarContainerRef.current &&
        !avatarContainerRef.current.contains(e.target as Node)
      ) {
        setShowModal(false);
      }
    };

    if (showModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModal]);

  return (
    <div className="flex gap-1 justify-end items-center">
      {userRole === "admin" && ( // Show Admin button only for admin users
        <button onClick={() => navigate("/admin")} className="btn-toolbar h-8">
          Admin
        </button>
      )}
      <button onClick={handleLogout} className="btn-toolbar h-8 mr-2">
        Logout
      </button>
      <div ref={avatarContainerRef} className="relative">
        {localAvatarUrl && (
          <img
            src={localAvatarUrl}
            alt="User Avatar"
            className="avatar cursor-pointer h-12 w-12"
            onClick={handleAvatarClick}
          />
        )}
        {showModal && (
          <div
            className="absolute z-50 top-full left-0 bg-gray-50 p-4 shadow rounded-md -translate-x-[85%]"
            // Prevent clicks inside the modal from closing it
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end mb-2">
              <button
                className="bg-red-200 rounded-full text-neutral-800 text-xs h-7 w-7 hover:bg-red-300 transition-colors"
                onClick={() => setShowModal(false)}
              >
                ✖
              </button>
            </div>
            <img
              src={localAvatarUrl}
              alt="User Avatar Large"
              className="w-24 h-24 rounded-full block mx-auto mb-6"
            />
            <p className="text-center font-semibold text-neutral-800">
              {email}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserToolbar;
