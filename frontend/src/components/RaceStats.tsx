import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,} from "recharts";
import { races, snails } from "../utils/raceData";

interface RaceStatsProps {
  wonBets: number;
  lostBets: number;
}

function RaceStats({ wonBets, lostBets }: RaceStatsProps) {
  const betResults = [
    { name: "Ganadas", value: wonBets },
    { name: "Perdidas", value: lostBets },
  ];

  const snailVictories = snails.map((snail) => ({
    name: snail.name,
    victorias: races.filter((race) =>
      race.results.some(
        (result) =>
          result.snailId === snail.id && result.position === 1,
      ),
    ).length,
  }));

  return (
    <section>
      <h2>Estadísticas</h2>

      <div>
        <article>
          <h3>Apuestas ganadas y perdidas</h3>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={betResults}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                label
              >
                {betResults.map((entry) => (
                  <Cell
                  key={entry.name}
                  fill={entry.name === "Ganadas" ? "#22c55e" : "#ef4444"} />
                ))}
              </Pie>

              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </article>

        <article>
          <h3>Victorias por caracol</h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={snailVictories}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />

              <Bar
                dataKey="victorias"
                name="Victorias"
              />
            </BarChart>
          </ResponsiveContainer>
        </article>
      </div>
    </section>
  );
}

export default RaceStats;