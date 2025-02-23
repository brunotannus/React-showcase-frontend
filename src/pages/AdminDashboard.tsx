import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Leaderboard from "../components/Leaderboard";
import Statistics from "../components/Statistics";
import Metrics from "../components/Metrics";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("leaderboard");

  // Function to render content based on the active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "leaderboard":
        return <Leaderboard />;
      case "statistics":
        return <Statistics />;
      case "metrics":
        return <Metrics />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Header Section */}
      <div className="w-full flex flex-col items-center p-4">
        <div className="w-full flex">
          <button
            onClick={() => navigate("/dashboard")}
            className="btn-toolbar"
          >
            ← Retornar
          </button>
        </div>
        {/* Title and Logo */}
        <div className="my-8 flex-start flex flex-col items-center py-2">
          <div className="mb-4 overflow-hidden rounded h-20 w-20 shadow-md border-0">
            <img
              src="/resources/images/mug.png"
              alt="Mug"
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
            onClick={() => setActiveTab("leaderboard")}
            className={`m-2 rounded w-[140px] ${
              activeTab === "leaderboard"
                ? "btn-primary"
                : "btn-primary-inactive"
            }`}
          >
            Ranking
          </button>
          <button
            onClick={() => setActiveTab("statistics")}
            className={`m-2 rounded w-[140px] ${
              activeTab === "statistics"
                ? "btn-primary"
                : "btn-primary-inactive"
            }`}
          >
            Estatísticas
          </button>
          <button
            onClick={() => setActiveTab("metrics")}
            className={`m-2 rounded w-[140px] ${
              activeTab === "metrics" ? "btn-primary" : "btn-primary-inactive"
            }`}
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
