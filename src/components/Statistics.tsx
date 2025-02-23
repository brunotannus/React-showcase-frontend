import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF8042"];

const Statistics: React.FC = () => {
  // Define the custom hook inside the component
  const useStatistics = (endpoint: string) => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
          const response = await fetch(`http://localhost:3001${endpoint}`);
          if (!response.ok) throw new Error("Failed to fetch data");
          const result = await response.json();
          setData(result);
        } catch (err: any) {
          setError(err.message || "Error fetching data");
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, [endpoint]);

    return { data, loading, error };
  };

  // Fetch statistics using the custom hook
  const { data: userDistribution, loading: loadingUserDist } = useStatistics(
    "/statistics/user-distribution"
  );
  const { data: campaignEffectiveness, loading: loadingCampaignEff } =
    useStatistics("/statistics/campaign-effectiveness");

  // Filter out empty strings from user distribution
  const filteredUserDistribution = userDistribution?.filter(
    (item: any) => item.source !== ""
  );

  // Filter out null or empty campaigns from campaign effectiveness
  const filteredCampaignEffectiveness = campaignEffectiveness?.filter(
    (item: any) => item.campaign && item.campaign.trim() !== ""
  );

  // Render charts conditionally based on loading state
  return (
    <div className="flex flex-col gap-6 p-4 bg-white rounded shadow-md mb-6">
      {/* User Distribution by UTM Source */}
      <div className="flex flex-col items-center rounded-md border border-gray-300">
        <h3>Distribuição de usuários por UTM source</h3>
        <p className="text-sm text-gray-400 italic">
          Esse gráfico mostra o número de subscritos para cada origem de sua
          subscrição (e.g., Facebook, Google).
        </p>
        {loadingUserDist ? (
          <p>Carregando...</p>
        ) : (
          <div className="flex justify-center my-10">
            <PieChart width={400} height={300}>
              <Pie
                data={filteredUserDistribution}
                dataKey="user_count"
                nameKey="source"
                cx="50%"
                cy="50%"
                outerRadius={100}
              >
                {filteredUserDistribution?.map((_: any, index: any) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend layout="vertical" align="right" verticalAlign="middle" />
            </PieChart>
          </div>
        )}
      </div>

      {/* Campaign Effectiveness */}
      <div className="flex flex-col items-center rounded-md border border-gray-300">
        <h3>Efetividade de campanha</h3>
        <p className="text-sm text-gray-400 italic">
          Esse gráfico exibe o highscore médio dos subscritos agrupados por sua
          campanha de origem.
        </p>
        {loadingCampaignEff ? (
          <p>Carregando...</p>
        ) : (
          <div className="flex justify-center my-10">
            <BarChart
              width={700}
              height={400}
              data={filteredCampaignEffectiveness}
              margin={{ bottom: 30 }}
            >
              <XAxis
                dataKey="campaign"
                tick={{ fontSize: 10 }}
                interval={0}
                angle={-30}
                textAnchor="end"
              />
              <YAxis />
              <Tooltip />
              <Legend verticalAlign="top" height={36} />
              <Bar
                dataKey="average_highscore"
                name="Highscore médio"
                fill="#FFCE04"
              />
            </BarChart>
          </div>
        )}
      </div>
    </div>
  );
};

export default Statistics;
