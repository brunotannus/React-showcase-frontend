import React, { useState, useEffect } from "react";
import NewsletterCard from "../components/NewsletterCard";
import TimeMachine from "../components/TimeMachine";
import History from "../components/History";
import Streak from "../components/Streak";
import UserToolbar from "../components/UserToolbar";

export interface Newsletter {
  id: number;
  date: string;
  title: string;
  motivationalText: string;
  content: string;
  image: string;
}

const TABS = {
  NEWSLETTERS: "newsletters",
  HISTORY: "history",
  USER_DETAILS: "userDetails",
};

const UserDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>(TABS.NEWSLETTERS);
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [avatarUpdateTrigger, setAvatarUpdateTrigger] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user.id;

  // Function to refetch the avatar image
  const handleAvatarChange = () => {
    setAvatarUpdateTrigger((prev) => prev + 1);
  };

  // Function to handle reset
  const handleReset = () => {
    setActiveTab(TABS.NEWSLETTERS);
  };

  // Fetch newsletters from the backend
  const fetchNewsletters = async () => {
    try {
      const response = await fetch("http://localhost:3001/newsletters");
      if (!response.ok) {
        throw new Error(`Erro ao buscar newsletters: ${response.status}`);
      }
      const data: Newsletter[] = await response.json();
      setNewsletters(data);
      setError(null); // Clear any previous errors
    } catch (err: any) {
      setError(err.message || "Falha ao buscar newsletters.");
    }
  };

  // Fetch newsletters on mount
  useEffect(() => {
    fetchNewsletters();
  }, []);

  // Helper function to determine button styles
  const getButtonClass = (tabName: string) =>
    `m-2 rounded w-[140px] ${
      activeTab === tabName ? "btn-primary" : "btn-primary-inactive"
    }`;

  // Render tab content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case TABS.NEWSLETTERS:
        return (
          <div className="mx-4 flex flex-col gap-6">
            <h2>Edições</h2>
            {error ? (
              <p className="text-red-500">{error}</p>
            ) : (
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
            )}
          </div>
        );
      case TABS.HISTORY:
        return <History userId={userId} />;
      case TABS.USER_DETAILS:
        return <Streak userId={userId} onAvatarChange={handleAvatarChange} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Time Machine Section */}
      <div className="flex w-full">
        <TimeMachine
          onNewslettersChange={fetchNewsletters}
          onReset={handleReset}
        />
      </div>

      {/* Main Content */}
      <div className="w-[95%] mx-auto p-4">
        {/* User Toolbar */}
        <UserToolbar
          avatarChangeCounter={avatarUpdateTrigger}
          userId={userId}
        />
        {/* Header Section */}
        <div className="my-8 flex-start flex flex-col items-center py-2">
          <div className="mb-4 overflow-hidden rounded h-20 w-20 shadow-md border-0">
            <img
              src="/resources/images/mug.png"
              alt="Avatar do usuário"
              className="w-full h-full"
            />
          </div>
          <h1>React Showcase News</h1>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap justify-center mb-6">
          <button
            onClick={() => setActiveTab(TABS.NEWSLETTERS)}
            className={getButtonClass(TABS.NEWSLETTERS)}
          >
            Newsletters
          </button>
          <button
            onClick={() => setActiveTab(TABS.HISTORY)}
            className={getButtonClass(TABS.HISTORY)}
          >
            Histórico
          </button>
          <button
            onClick={() => setActiveTab(TABS.USER_DETAILS)}
            className={getButtonClass(TABS.USER_DETAILS)}
          >
            Streak
          </button>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
};

export default UserDashboard;
