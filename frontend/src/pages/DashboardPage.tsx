import { useMemo } from "react";
import type { User } from "../types/auth";
import { races, snails } from "../utils/raceData";
import RaceStats from "../components/RaceStats";

interface DashboardPageProps {
  user: User;
  onLogout: () => void;
}

function DashboardPage({ user, onLogout,}: DashboardPageProps) {
  const victories = useMemo(() => {
    return snails.map((snail) => ({
      name: snail.name,
      victories: races.filter((race) =>
        race.results.some(
          (result) =>
            result.snailId === snail.id && result.position === 1,
        ),
      ).length,
    }));
  }, []);

  return (
    <main>
      <header>
        <div>
          <h1>Carrera de Caracoles</h1>
          <p>Bienvenido, {user.fullName}</p>
        </div>

        <button type="button" onClick={onLogout}>
          Cerrar sesión
        </button>
      </header>

      <section>
        <h2>Balance actual</h2>
        <p>${user.balance.toFixed(2)}</p>
      </section>

      <RaceStats wonBets={0} lostBets={0} />
      
      <section>
        <h2>Victorias por caracol</h2>

        <ul>
          {victories.map((snail) => (
            <li key={snail.name}>
              {snail.name}: {snail.victories} victorias
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Carreras del día</h2>

        <ul>
          {races.map((race) => {
            const winner = race.results.find(
              (result) => result.position === 1,
            );

            const winnerName = snails.find(
              (snail) => snail.id === winner?.snailId,
            )?.name;

            return (
              <li key={race.id}>
                {race.name}: ganador {winnerName}
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}

export default DashboardPage;