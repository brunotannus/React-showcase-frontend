import React, { useState, useEffect } from "react";
import NewsletterCard from "../components/NewsletterCard";
import TimeMachine from "../components/TimeMachine";
import History from "../components/History";

export interface Newsletter {
  id: number; // assuming the ID is numerical from the backend (or use string if you have it as string)
  date: Date;
  title: string;
  motivationalText: string;
  content: string;
  image: string;
}

const UserDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("newsletters");
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Function to fetch newsletters from the backend
  const fetchNewsletters = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3001/newsletters");
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data: Newsletter[] = await response.json();
      setNewsletters(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch newsletters");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchNewsletters();
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case "newsletters":
        return (
          <div className="mx-4 flex flex-col gap-6">
            <h2>Edições</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {newsletters.map((item) => (
                <NewsletterCard
                  key={item.id}
                  id={item.id.toString()}
                  image={item.image}
                  date={item.date}
                />
              ))}
            </div>
          </div>
        );
      case "history":
        return <History />;
      case "userDetails":
        return (
          <div className="p-4 border border-gray-200 rounded">
            <h2 className="text-2xl font-bold mb-2">User Details & Streak</h2>
            <p>User streak and details will be displayed here (coming soon).</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex w-full">
        <TimeMachine onNewslettersChange={fetchNewsletters} />
      </div>
      <div className="w-[95%] mx-auto p-4">
        <div className="w-full flex justify-end">
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
            className="btn-logout"
          >
            Logout
          </button>
        </div>
        <div className="my-8 flex-start flex flex-col items-center py-2">
          <div className="mb-4 overflow-hidden rounded h-20 w-20 shadow-md border-0">
            <img
              src="/resources/images/mug.png"
              alt="Mug"
              className="w-full h-full"
            />
          </div>
          <h1>the news Case</h1>
        </div>
        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center mb-6">
          <button
            onClick={() => setActiveTab("newsletters")}
            className={`m-2 rounded w-[140px] ${
              activeTab === "newsletters"
                ? "btn-primary"
                : "btn-primary-inactive"
            }`}
          >
            Newsletters
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`m-2 rounded w-[140px] ${
              activeTab === "history" ? "btn-primary" : "btn-primary-inactive"
            }`}
          >
            Histórico
          </button>
          <button
            onClick={() => setActiveTab("userDetails")}
            className={`m-2 rounded w-[140px] ${
              activeTab === "userDetails"
                ? "btn-primary"
                : "btn-primary-inactive"
            }`}
          >
            Streaks
          </button>
        </div>
        {/* Tab Content */}
        <div>{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default UserDashboard;
