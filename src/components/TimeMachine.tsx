import { on } from "events";
import React, { useState, useEffect } from "react";

const DEFAULT_SIMULATED_DATE = "2025-02-20";
const WEEK_DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

// Utility functions
const parseLocalDate = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const formatDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

interface TimeMachineProps {
  onNewslettersChange?: () => void;
  onReset?: () => void;
}

const TimeMachine: React.FC<TimeMachineProps> = ({
  onNewslettersChange,
  onReset,
}) => {
  const [simulatedDate, setSimulatedDate] = useState<string>(() => {
    return localStorage.getItem("simulatedDate") || DEFAULT_SIMULATED_DATE;
  });

  // Persist simulatedDate changes
  useEffect(() => {
    localStorage.setItem("simulatedDate", simulatedDate);
  }, [simulatedDate]);

  // Fetch user data from localStorage
  const getUserFromLocalStorage = (): { id: string } | null => {
    const userString = localStorage.getItem("user");
    return userString ? JSON.parse(userString) : null;
  };

  // Post a newsletter for a specific date
  const postNewsletter = async (date: Date) => {
    try {
      const response = await fetch("http://localhost:3001/newsletters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: formatDateString(date) }),
      });
      if (!response.ok) {
        throw new Error(`Erro ao postar newsletter: ${response.status}`);
      }
      onNewslettersChange?.();
    } catch (error) {
      console.error("Erro ao postar newsletter:", error);
    }
  };

  // Check streak for a specific date
  const checkStreak = async (userId: string, dateToCheck: string) => {
    try {
      const response = await fetch(
        `http://localhost:3001/users/${userId}/check-streak`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ date: dateToCheck }),
        }
      );
      if (!response.ok) {
        throw new Error(`Erro ao verificar sequência: ${response.status}`);
      }
      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.error("Erro ao verificar sequência:", error);
    }
  };

  // Handler for Next Day button
  const handleNextDay = async () => {
    const user = getUserFromLocalStorage();
    if (!user) {
      console.error("Nenhum usuário encontrado no localStorage.");
      return;
    }

    await checkStreak(user.id, simulatedDate);

    const currentDate = parseLocalDate(simulatedDate);
    currentDate.setDate(currentDate.getDate() + 1);
    const newSimulatedDate = formatDateString(currentDate);
    setSimulatedDate(newSimulatedDate);

    if (
      currentDate >= parseLocalDate("2025-02-21") &&
      currentDate <= parseLocalDate("2025-02-28") &&
      currentDate.getDay() !== 0 // Not Sunday
    ) {
      postNewsletter(currentDate);
    }
    onReset?.();
  };

  // Handler for Reset button
  const handleReset = async () => {
    setSimulatedDate(DEFAULT_SIMULATED_DATE);
    try {
      await Promise.all([
        fetch("http://localhost:3001/newsletters", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ date: DEFAULT_SIMULATED_DATE }),
        }),
        fetch(
          `http://localhost:3001/users/${
            getUserFromLocalStorage()?.id
          }/history`,
          {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
          }
        ),
        fetch(
          `http://localhost:3001/users/${
            getUserFromLocalStorage()?.id
          }/progress`,
          {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
          }
        ),
      ]);
      console.log("Dados resetados com sucesso.");
      onNewslettersChange?.();
      onReset?.();
    } catch (error) {
      console.error("Erro ao resetar dados:", error);
    }
  };

  // Create a local Date object for display purposes
  const localSimulatedDate = parseLocalDate(simulatedDate);

  return (
    <div className="w-full p-4 bg-tn-yellow border-b border-gray-200 flex items-center justify-center">
      <label>
        Data de Hoje:
        <span className="font-semibold text-neutral-800 ml-2">
          {localSimulatedDate.toLocaleDateString("pt-BR")}
        </span>
        <span className="text-gray-500 ml-1 italic">
          ({WEEK_DAYS[localSimulatedDate.getDay()]})
        </span>
      </label>
      <div className="flex items-center">
        <button
          onClick={handleNextDay}
          className="ml-4 px-4 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          aria-label="Avançar para o próximo dia"
        >
          Próximo dia
        </button>
        <button
          onClick={handleReset}
          className="ml-2 px-4 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          aria-label="Resetar progresso e dados"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default TimeMachine;
