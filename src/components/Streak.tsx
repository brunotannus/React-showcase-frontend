import React, { useState, useEffect } from "react";

interface StreakProps {
  onAvatarChange?: (newAvatarUrl: string) => void;
  userId: string;
}

const Streak: React.FC<StreakProps> = ({ onAvatarChange, userId }) => {
  const [streak, setStreak] = useState<number | null>(null);
  const [highscore, setHighscore] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  // Array of avatars with their unlock highscore requirement and image endpoints.
  const avatars = [
    {
      id: "avatar1",
      unlockScore: 0,
      image: "/resources/images/avatars/avatar1.png",
      desc: "Avatar padrão",
    },
    {
      id: "avatar2",
      unlockScore: 2,
      image: "/resources/images/avatars/avatar2.png",
      desc: "Desbloqueado em highscore 2",
    },
    {
      id: "avatar3",
      unlockScore: 5,
      image: "/resources/images/avatars/avatar3.png",
      desc: "Desbloqueado em highscore 5",
    },
  ];

  const handleAvatarChange = async (avatar: any) => {
    if (highscore >= avatar.unlockScore) {
      await fetch(`http://localhost:3001/users/${userId}/avatar`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ avatar: avatar.image }),
      });
      setSelectedAvatar(avatar.id);
      // This signals the parent to trigger a re-fetch in UserToolbar.
      if (onAvatarChange) {
        onAvatarChange(avatar.image);
      }
    }
  };

  useEffect(() => {
    // Function to fetch the current avatar from the backend.
    const fetchAvatar = async () => {
      try {
        const res = await fetch(
          `http://localhost:3001/users/${userId}/avatar-id`
        );
        if (!res.ok) {
          throw new Error(`Error fetching avatar: ${res.status}`);
        }
        const data = await res.json();
        setSelectedAvatar(data.avatarId);
      } catch (err: any) {
        setError(err.message || "Error fetching avatar.");
      }
    };

    // Function to fetch the current streak from the backend.
    const fetchStreak = async () => {
      try {
        const res = await fetch(`http://localhost:3001/users/${userId}/streak`);
        if (!res.ok) {
          throw new Error(`Error fetching streak: ${res.status}`);
        }
        const data = await res.json();
        setStreak(data.streak);
      } catch (err: any) {
        setError(err.message || "Error fetching streak.");
      }
    };

    // Function to fetch a user's highscore from the backend.
    const fetchHighscore = async () => {
      try {
        const res = await fetch(
          `http://localhost:3001/users/${userId}/highscore`
        );
        if (!res.ok) {
          throw new Error(`Error fetching highscore: ${res.status}`);
        }
        const data = await res.json();
        setHighscore(data.highscore);
      } catch (err: any) {
        setError(err.message || "Error fetching highscore.");
      }
    };

    // Call once immediately and then set an interval to poll.
    fetchStreak();
    fetchHighscore();
    fetchAvatar();
    const intervalId = setInterval(() => {
      fetchStreak();
      fetchHighscore();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [userId]);

  return (
    <div className="p-4 bg-white shadow rounded-lg max-w-md mx-auto my-4">
      <h2 className="text-xl font-bold mb-2">Streak</h2>
      {error && <p className="text-red-500">{error}</p>}
      {streak !== null ? (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 justify-center">
            <img
              src="/resources/images/flame.png"
              alt="Fire"
              className="w-12 h-12"
            />
            <p className="text-3xl text-neutral-800">{streak}</p>
          </div>
          <p className="text-gray-400 text-sm text-center mb-2">
            Highscore: <span className="font-bold">{highscore}</span>
          </p>
          {/* Display motivational message for each streak interval */}
          {streak < 2 && (
            <p className="text-gray-300 text-center italic text-sm">
              Você está começando uma jornada incrível! Cada esforço conta,
              então não desanime. Continue praticando e logo os resultados
              aparecerão!
            </p>
          )}
          {streak >= 2 && streak < 4 && (
            <p className="text-gray-300 text-center italic text-sm">
              Ótimo progresso! Você já demonstrou habilidade e dedicação.
              Mantenha o foco, pois grandes conquistas estão a caminho!
            </p>
          )}
          {streak >= 4 && (
            <p className="text-gray-300 text-center italic text-sm">
              Incrível! Seu desempenho é excepcional e você está dominando o
              jogo. Continue brilhando e desafiando seus limites!
            </p>
          )}
          <h2 className="text-xl font-bold mb-2 mt-4">Avatars</h2>
          <div className="flex flex-col gap-4 justify-center px-2">
            {avatars.map((avatar) => {
              // Determine whether the avatar is unlocked.
              const unlocked = highscore >= avatar.unlockScore;
              // If locked, apply greyed-out styling and remove interactivity.
              const avatarClasses = `w-16 h-16 transition-opacity duration-200 ${
                unlocked ? "cursor-pointer" : "opacity-30 cursor-not-allowed"
              }`;
              return (
                <div
                  key={avatar.id}
                  className="flex items-center gap-4 bg-gray-100 p-2 rounded-lg"
                >
                  <img
                    src={avatar.image}
                    alt={avatar.id}
                    className={avatarClasses}
                    onClick={() => unlocked && handleAvatarChange(avatar)}
                  />
                  {selectedAvatar === avatar.id ? (
                    <span className="text-green-500 text-sm mt-1">Em uso</span>
                  ) : unlocked ? (
                    <span className="text-neutral-800 text-sm mt-1">
                      {avatar.desc}
                    </span>
                  ) : (
                    <span className="text-red-300 text-sm mt-1">
                      Highscore {avatar.unlockScore} necessário
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <p className="text-gray-500">Loading...</p>
      )}
    </div>
  );
};

export default Streak;
