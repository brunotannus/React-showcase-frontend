import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

interface UserToolbarProps {
  avatarChangeCounter: number;
  userId: string;
}

interface RoleResponse {
  role: string;
}

interface EmailResponse {
  email: string;
}

const UserToolbar: React.FC<UserToolbarProps> = ({
  avatarChangeCounter,
  userId,
}) => {
  console.log("UserToolbar component rendered");
  console.log("Props received:", { userId, avatarChangeCounter });

  const [localAvatarUrl, setLocalAvatarUrl] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string>("");
  const avatarContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Fetch user email from backend
  const fetchUserEmail = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/users/${userId}/email`
      );
      if (!response.ok) {
        throw new Error("Erro ao buscar o email do usuário.");
      }
      const data: EmailResponse = await response.json();
      setEmail(data.email);
    } catch (err) {
      console.error(err instanceof Error ? err.message : "Erro desconhecido.");
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login"); // Use React Router's navigate instead of window.location.href
  };

  // Handle avatar click
  const handleAvatarClick = () => {
    setShowModal(true);
    if (!email) {
      fetchUserEmail();
    }
  };

  // Close modal when clicking outside
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

  // Fetch data on mount and when avatarChangeCounter changes
  useEffect(() => {
    // Fetch avatar from backend
    const fetchAvatar = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/users/${userId}/avatar`
        );
        console.log("Avatar fetch response:", response);

        if (!response.ok) {
          throw new Error("Erro ao buscar o avatar.");
        }

        const blob = await response.blob();
        console.log("Avatar blob:", blob);

        const avatarBlobUrl = URL.createObjectURL(blob);
        console.log("Avatar Blob URL:", avatarBlobUrl);

        setLocalAvatarUrl(avatarBlobUrl);
      } catch (err) {
        console.error(
          err instanceof Error ? err.message : "Erro desconhecido."
        );
      }
    };

    // Fetch user role from backend
    const fetchRole = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/users/${userId}/role`
        );
        if (!response.ok) {
          throw new Error("Erro ao buscar o papel do usuário.");
        }
        const data: RoleResponse = await response.json();
        setUserRole(data.role);
      } catch (err) {
        console.error(
          err instanceof Error ? err.message : "Erro desconhecido."
        );
      }
    };
    fetchAvatar();
    fetchRole();
  }, [userId, avatarChangeCounter]);

  useEffect(() => {
    console.log("localAvatarUrl updated:", localAvatarUrl);
  }, [localAvatarUrl]);

  return (
    <div className="flex gap-1 justify-end items-center">
      {userRole === "admin" && (
        <button
          onClick={() => navigate("/admin")}
          className="btn-toolbar h-8"
          aria-label="Ir para o painel de administração"
        >
          Admin
        </button>
      )}
      <button
        onClick={handleLogout}
        className="btn-toolbar h-8 mr-2"
        aria-label="Sair da conta"
      >
        Logout
      </button>
      <div ref={avatarContainerRef} className="relative">
        {localAvatarUrl && (
          <img
            src={localAvatarUrl}
            alt="Avatar do usuário"
            className="avatar cursor-pointer h-12 w-12"
            onClick={handleAvatarClick}
          />
        )}
        {showModal && (
          <div
            className="absolute z-50 top-full left-0 bg-gray-50 p-4 shadow rounded-md -translate-x-[85%]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end mb-2">
              <button
                className="bg-red-200 rounded-full text-neutral-800 text-xs h-7 w-7 hover:bg-red-300 transition-colors"
                onClick={() => setShowModal(false)}
                aria-label="Fechar modal"
              >
                ✖
              </button>
            </div>
            <img
              src={localAvatarUrl}
              alt="Avatar grande do usuário"
              className="w-24 h-24 rounded-full block mx-auto mb-6"
            />
            <p className="text-center font-semibold text-neutral-800">
              {email || "Carregando email..."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserToolbar;
