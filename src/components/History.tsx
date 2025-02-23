import React, { useState, useEffect } from "react";

interface HistoryProps {
  userId: string;
}

interface HistoryEntry {
  newsletterId: string;
  formattedTimestamp: string;
}

const History: React.FC<HistoryProps> = ({ userId }) => {
  const [historyList, setHistoryList] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const PAGE_SIZE = 10;

  useEffect(() => {
    // Fetch history from the backend API endpoint
    fetch(`http://localhost:3001/users/${userId}/history`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Erro ao buscar histórico.");
        }
        return res.json();
      })
      .then((data) => {
        let historyData = data.history;
        // If the returned history is a string, parse it to get an array.
        if (typeof historyData === "string") {
          try {
            historyData = JSON.parse(historyData);
          } catch (e) {
            console.error("Failed to parse history:", e);
            historyData = [];
          }
        }
        if (Array.isArray(historyData)) {
          setHistoryList(historyData);
        } else {
          setHistoryList([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Process each entry "newsletterId|timestamp" into an object
  const formattedEntries: HistoryEntry[] = historyList
    .slice()
    .reverse()
    .map((entry) => {
      const parts = entry.split("|");
      const newsletterId = parts[0];
      const timestamp = parts[1];
      const formattedTimestamp = new Date(timestamp).toLocaleString("pt-BR");
      return { newsletterId, formattedTimestamp };
    });

  // Calculate pagination indices
  const totalEntries = formattedEntries.length;
  const totalPages = Math.ceil(totalEntries / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const displayedEntries = formattedEntries.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="p-4 bg-white shadow rounded-lg max-w-md mx-auto my-4">
      <h2 className="text-xl font-bold mb-4">Histórico</h2>
      {loading ? (
        <p className="text-gray-500">Carregando...</p>
      ) : error ? (
        <p className="text-red-500">Erro: {error}</p>
      ) : totalEntries > 0 ? (
        <div>
          <ul className="divide-y divide-gray-200">
            {displayedEntries.map((entry, index) => (
              <li key={index} className="py-2">
                <p className="text-gray-700">
                  ID da Newsletter:{" "}
                  <span className="font-semibold">{entry.newsletterId}</span>
                </p>
                <p className="text-gray-500 text-sm">
                  {entry.formattedTimestamp}
                </p>
              </li>
            ))}
          </ul>
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="btn-primary h-8 w-8 !py-0 !px-0"
            >
              ←
            </button>
            <span className="mx-2">
              {currentPage} de {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="btn-primary h-8 w-8 !py-0 !px-0"
            >
              →
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">Nenhum histórico disponível.</p>
      )}
    </div>
  );
};

export default History;
