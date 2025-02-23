import React, { useEffect, useState } from "react";

interface User {
  email: string;
  highscore: number;
}

const Leaderboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Fetch leaderboard data from the backend
  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3001/leaderboard");
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data: User[] = await response.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch leaderboard");
    } finally {
      setLoading(false);
    }
  };

  // Fetch leaderboard on component mount
  useEffect(() => {
    fetchLeaderboard();
  }, []);

  // Render the leaderboard
  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Leaderboard</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Email</th>
              <th>Highscore</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={user.email}
                className={index % 2 === 0 ? "even-row" : ""}
              >
                <td>{index + 1}</td>
                <td>{user.email}</td>
                <td>{user.highscore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Leaderboard;
