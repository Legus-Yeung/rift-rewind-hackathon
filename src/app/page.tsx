import data from "../../data/mockData.json";
import ChampionsTable from "./_components/championTable";
import ChampionWinRateChart from "./_components/barChart";
import WinRateOverTimeChart from "./_components/lineChart";
import ChampionPieChart from "./_components/pieChart";

export default function ChampionsPage() {
  const champions = data.championStats;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold mb-6">Champion Stats</h1>
      {/*table*/}
      <div className="ChampTable">
        <ChampionsTable />
      </div>
      
      {/*Bar Chart*/}
      <div className="mt-10 w-3/4">
        <ChampionWinRateChart />
      </div>

      {/*Line Chart*/}
      <div className="mt-10 w-3/4">
        <WinRateOverTimeChart />
      </div>
      
      {/*Pie Chart*/}
      <div className="mt-10 w-3/4">
        <ChampionPieChart />
      </div>
    </div>
  );
}
