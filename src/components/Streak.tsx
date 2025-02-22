import React, { useState, useEffect } from "react";

const Streak: React.FC = () => {
  const [streak, setStreak] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Retrieve the logged-in user from localStorage.
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      setError("User data not found in localStorage.");
      return;
    }

    let user;
    try {
      user = JSON.parse(userStr);
    } catch (err) {
      setError("Error parsing user data.");
      return;
    }
    const userId = user.id;

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

    // Call once immediately and then set an interval to poll.
    fetchStreak();
    const intervalId = setInterval(() => {
      fetchStreak();
    }, 5000); // Poll every 5 seconds (adjust as needed)

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="p-4  rounded shadow my-4">
      <h2 className="text-xl font-bold mb-2">Current Streak</h2>
      {error && <p className="text-red-500">{error}</p>}
      {streak !== null ? (
        <p className="text-lg text-gray-700">{streak}</p>
      ) : (
        <p className="text-gray-500">Loading...</p>
      )}
    </div>
  );
};

export default Streak;
