import React, { useState, useEffect } from "react";

const defaultSimulatedDate = "2025-02-20";
const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

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
  // Initialize state from localStorage or default
  const [simulatedDate, setSimulatedDate] = useState<string>(() => {
    return localStorage.getItem("simulatedDate") || defaultSimulatedDate;
  });

  // Persist simulatedDate changes
  useEffect(() => {
    localStorage.setItem("simulatedDate", simulatedDate);
  }, [simulatedDate]);

  // The postNewsletter function that sends the simulated date to the backend
  const postNewsletter = async (date: Date) => {
    try {
      const response = await fetch("http://localhost:3001/newsletters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Sending the formatted date as string (or convert as needed)
        body: JSON.stringify({ date: formatDateString(date) }),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      if (onNewslettersChange) {
        onNewslettersChange();
      }
    } catch (error: any) {
      console.error(error.message || "Failed to post newsletter");
    }
  };

  const checkStreak = async (userId: string, dateToCheck: string) => {
    try {
      const response = await fetch(
        `http://localhost:3001/users/${userId}/check-streak`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ date: dateToCheck }),
        }
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      console.log(data.message);
    } catch (err: any) {
      console.error(err.message || "Failed to check streak");
    }
  };

  // Handler for Next Day button
  const handleNextDay = async () => {
    // Tell the backend to check if a streak was redeemed the previous day (except Sundays)
    // If not, reset the streak
    const userString = localStorage.getItem("user");
    if (!userString) {
      throw new Error("No user found in localStorage.");
    }
    const user = JSON.parse(userString);
    await checkStreak(user.id, simulatedDate);

    const currentDate = parseLocalDate(simulatedDate);
    currentDate.setDate(currentDate.getDate() + 1);
    const newSimulatedDate = formatDateString(currentDate);
    setSimulatedDate(newSimulatedDate);

    // Posts a newsletter on a new day
    if (
      currentDate.getTime() >= parseLocalDate("2025-02-21").getTime() &&
      currentDate.getTime() <= parseLocalDate("2025-02-28").getTime() &&
      currentDate.getDay() !== 0 // Not Sunday
    ) {
      postNewsletter(currentDate);
    }
  };

  // Deletes future newsletters from the backend—invoked on reset
  const deleteFutureNewsletters = async (date: string) => {
    try {
      const response = await fetch("http://localhost:3001/newsletters", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date,
        }),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
    } catch (error: any) {
      console.error(error.message || "Failed to delete future newsletters");
    }
  };

  // Deletes user history from the backend—invoked on reset
  const deleteHistory = async () => {
    try {
      const userString = localStorage.getItem("user");
      if (!userString) {
        console.error("No logged in user found in localStorage.");
        return;
      }
      const user = JSON.parse(userString);
      const response = await fetch(
        `http://localhost:3001/users/${user.id}/history`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      console.log("User history deleted successfully");
    } catch (error: any) {
      console.error(error.message || "Failed to delete user history");
    }
  };

  // Deletes user progress from the backend—invoked on reset
  const deleteUserProgress = async () => {
    try {
      const userString = localStorage.getItem("user");
      if (!userString) {
        console.error("No logged in user found in localStorage.");
        return;
      }
      const user = JSON.parse(userString);
      const response = await fetch(
        `http://localhost:3001/users/${user.id}/progress`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
    } catch (error: any) {
      console.error(error.message || "Failed to delete user progress");
    }
  };

  // Handler for Reset button
  const handleReset = async () => {
    setSimulatedDate(defaultSimulatedDate);
    await deleteFutureNewsletters(defaultSimulatedDate);
    await deleteHistory();
    await deleteUserProgress();
    if (onNewslettersChange) {
      onNewslettersChange();
    }
    if (onReset) {
      onReset();
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
          ({weekDays[localSimulatedDate.getDay()]})
        </span>
      </label>
      <div className="flex items-center">
        <button
          onClick={handleNextDay}
          className="ml-4 px-4 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          Próximo dia
        </button>
        <button
          onClick={handleReset}
          className="ml-2 px-4 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default TimeMachine;
