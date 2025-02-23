import React, { useEffect, useState } from "react";

interface Newsletter {
  title: string;
  views: number;
}

interface User {
  email: string;
  streak: number;
  highscore: number;
}

const Metrics: React.FC = () => {
  const [mostViewedNewsletter, setMostViewedNewsletter] =
    useState<Newsletter | null>(null);
  const [highestStreakUser, setHighestStreakUser] = useState<User | null>(null);
  const [highestHighscoreUser, setHighestHighscoreUser] = useState<User | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Fetch metrics data from the backend
  const fetchMetrics = async () => {
    try {
      setLoading(true);

      // Fetch most viewed newsletter
      const newsletterResponse = await fetch(
        "http://localhost:3001/statistics/most-viewed-newsletter"
      );
      if (!newsletterResponse.ok) {
        throw new Error(
          `Erro ao buscar o newsletter mais visualizado: ${newsletterResponse.status}`
        );
      }
      const newsletterData: Newsletter = await newsletterResponse.json();
      setMostViewedNewsletter(newsletterData);

      // Fetch user with highest streak
      const streakResponse = await fetch(
        "http://localhost:3001/statistics/highest-streak-user"
      );
      if (!streakResponse.ok) {
        throw new Error(
          `Erro ao buscar o usuário com maior sequência: ${streakResponse.status}`
        );
      }
      const streakData: User = await streakResponse.json();
      setHighestStreakUser(streakData);

      // Fetch user with highest highscore
      const highscoreResponse = await fetch(
        "http://localhost:3001/statistics/highest-highscore-user"
      );
      if (!highscoreResponse.ok) {
        throw new Error(
          `Erro ao buscar o usuário com maior pontuação: ${highscoreResponse.status}`
        );
      }
      const highscoreData: User = await highscoreResponse.json();
      setHighestHighscoreUser(highscoreData);
    } catch (err: any) {
      setError(err.message || "Erro ao buscar métricas");
    } finally {
      setLoading(false);
    }
  };

  // Fetch metrics on component mount
  useEffect(() => {
    fetchMetrics();
  }, []);

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Métricas</h2>
      {loading ? (
        <p>Carregando...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="space-y-4">
          {/* Most Viewed Newsletter */}
          <div className="pl-4 pb-4 border rounded-md bg-gray-50">
            <h3 className="font-semibold text-lg">
              Newsletter mais visualizado
            </h3>
            {mostViewedNewsletter ? (
              <p className="text-gray-700">
                <span className="font-medium">Título:</span>{" "}
                {mostViewedNewsletter.title} <br />
                <span className="font-medium">Visualizações:</span>{" "}
                {mostViewedNewsletter.views}
              </p>
            ) : (
              <p className="text-gray-500">Nenhum dado disponível</p>
            )}
          </div>

          {/* User with Highest Streak */}
          <div className="pl-4 pb-4 border rounded-md bg-gray-50">
            <h3 className="font-semibold text-lg">
              Usuário com maior sequência
            </h3>
            {highestStreakUser ? (
              <p className="text-gray-700">
                <span className="font-medium">Email:</span>{" "}
                {highestStreakUser.email} <br />
                <span className="font-medium">Sequência:</span>{" "}
                {highestStreakUser.streak}
              </p>
            ) : (
              <p className="text-gray-500">Nenhum dado disponível</p>
            )}
          </div>

          {/* User with Highest Highscore */}
          <div className="pl-4 pb-4 border rounded-md bg-gray-50">
            <h3 className="font-semibold text-lg">
              Usuário com maior pontuação
            </h3>
            {highestHighscoreUser ? (
              <p className="text-gray-700">
                <span className="font-medium">Email:</span>{" "}
                {highestHighscoreUser.email} <br />
                <span className="font-medium">Pontuação:</span>{" "}
                {highestHighscoreUser.highscore}
              </p>
            ) : (
              <p className="text-gray-500">Nenhum dado disponível</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Metrics;
