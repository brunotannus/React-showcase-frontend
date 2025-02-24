import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Leaderboard from "../components/Leaderboard";
import Statistics from "../components/Statistics";
import Metrics from "../components/Metrics";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Define tab names as constants to avoid hardcoding
  const TABS = {
    LEADERBOARD: "leaderboard",
    STATISTICS: "statistics",
    METRICS: "metrics",
  };

  const [activeTab, setActiveTab] = useState<string>(TABS.LEADERBOARD);

  // Function to render content based on the active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case TABS.LEADERBOARD:
        return <Leaderboard />;
      case TABS.STATISTICS:
        return <Statistics />;
      case TABS.METRICS:
        return <Metrics />;
      default:
        return <p className="text-gray-500">Nenhum conteúdo disponível.</p>;
    }
  };

  // Helper function to determine button styles
  const getButtonClass = (tabName: string) =>
    `m-2 rounded w-[140px] ${
      activeTab === tabName ? "btn-primary" : "btn-primary-inactive"
    }`;

  return (
    <div className="flex flex-col items-center">
      {/* Header Section */}
      <div className="w-full flex flex-col items-center p-4">
        {/* Back Button */}
        <div className="w-full flex">
          <button
            onClick={() => navigate("/dashboard")}
            className="btn-toolbar"
            aria-label="Voltar para o dashboard do usuário"
          >
            ← Retornar
          </button>
        </div>

        {/* Title and Logo */}
        <div className="my-8 flex-start flex flex-col items-center py-2">
          <div className="mb-4 overflow-hidden rounded h-20 w-20 shadow-md border-0">
            <img
              src="/resources/images/mug.png"
              alt="Logo do Admin Dashboard"
              className="w-full h-full"
            />
          </div>
          <h1>Admin Dashboard</h1>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="w-[95%] mx-auto">
        {/* Tab Buttons */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setActiveTab(TABS.LEADERBOARD)}
            className={getButtonClass(TABS.LEADERBOARD)}
          >
            Ranking
          </button>
          <button
            onClick={() => setActiveTab(TABS.STATISTICS)}
            className={getButtonClass(TABS.STATISTICS)}
          >
            Estatísticas
          </button>
          <button
            onClick={() => setActiveTab(TABS.METRICS)}
            className={getButtonClass(TABS.METRICS)}
          >
            Métricas
          </button>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;
