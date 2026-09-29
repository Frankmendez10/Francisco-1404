import { useMemo, useState } from "react";
import type { User } from "../types/auth";
import { updateUserBalance } from "../utils/auth";
import { races, snails } from "../utils/raceData";
import RaceStats from "../components/RaceStats";
import PaymentForm from "../components/PaymentForm";

interface DashboardPageProps {
  user: User;
  onLogout: () => void;
}

function DashboardPage({ user, onLogout, }: DashboardPageProps) {
  const [currentUser, setCurrentUser] = useState(user);

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

  function handlePaymentSuccess( amount: number, payment: { cardNumber: string; cvv: string;},) {
  const updatedUser = updateUserBalance(amount, payment);
  setCurrentUser(updatedUser);
}

  return (
    <main>
      <header>
        <div>
          <h1>Carrera de Caracoles</h1>
          <p>Bienvenido, {currentUser.fullName}</p>
        </div>

        <button type="button" onClick={onLogout}>
          Cerrar sesión
        </button>
      </header>

      <section>
        <h2>Balance actual</h2>
        <p>${currentUser.balance.toFixed(2)}</p>
      </section>

      <PaymentForm
        userId={currentUser.id}
        payerEmail={currentUser.email}
        onPaymentSuccess={handlePaymentSuccess}
      />

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