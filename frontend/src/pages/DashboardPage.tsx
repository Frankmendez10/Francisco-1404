import { useMemo, useState } from "react";
import type { User } from "../types/auth";
import { updateUserBalance } from "../utils/auth";
import { races, snails } from "../utils/raceData";
import RaceStats from "../components/RaceStats";
import PaymentForm from "../components/PaymentForm";
import { bets } from "../utils/betData";

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

  const wonBets = bets.filter((bet) => bet.won).length;
  const lostBets = bets.filter((bet) => !bet.won).length;

  function handlePaymentSuccess( amount: number, payment: { cardNumber: string; cvv: string;},) {
    const updatedUser = updateUserBalance(amount, payment);
    setCurrentUser(updatedUser);
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="dashboard-brand">
          <div className="dashboard-logo">🐌</div>

          <div>
            <p className="eyebrow">SIMULADOR DE CARRERAS</p>
            <h1>Carrera de Caracoles</h1>
          </div>
        </div>

        <div className="dashboard-user">
          <div>
            <span>Usuario</span>
            <strong>{currentUser.fullName}</strong>
          </div>

          <button
            type="button"
            className="button-secondary"
            onClick={onLogout}
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        <section className="welcome-section">
          <div>
            <p className="eyebrow">PANEL PRINCIPAL</p>
            <h2>Bienvenido, {currentUser.fullName.split(" ")[0]}</h2>
            <p>
              Consulta tus estadísticas y administra tu saldo.
            </p>
          </div>
        </section>

        <section className="dashboard-grid dashboard-top-grid">
          <article className="dashboard-card balance-card">
            <div className="card-header">
              <div>
                <span className="card-label">BALANCE ACTUAL</span>
                <h2>
                  ${currentUser.balance.toFixed(2)}
                </h2>
              </div>

              <div className="card-icon">💰</div>
            </div>

            <p>
              Saldo disponible para tus próximas operaciones.
            </p>
          </article>

          <article className="dashboard-card summary-card">
            <span className="card-label">CARRERAS DEL DÍA</span>

            <div className="summary-value">
              {races.length}
            </div>

            <p>
              Carreras simuladas disponibles.
            </p>
          </article>

          <article className="dashboard-card summary-card">
            <span className="card-label">APUESTAS</span>

            <div className="summary-value">
              {wonBets + lostBets}
            </div>

            <p>
              {wonBets} ganadas · {lostBets} perdidas
            </p>
          </article>
        </section>

        <section className="dashboard-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">SALDO</p>
              <h2>Cargar saldo</h2>
            </div>

            <p>
              Utiliza la tarjeta ficticia para simular una
              transacción.
            </p>
          </div>

          <div className="dashboard-card payment-card">
            <PaymentForm
              userId={currentUser.id}
              payerEmail={currentUser.email}
              onPaymentSuccess={handlePaymentSuccess}
            />
          </div>
        </section>

        <section className="dashboard-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">ANÁLISIS</p>
              <h2>Estadísticas</h2>
            </div>

            <p>
              Resultados de las apuestas y desempeño de los
              caracoles.
            </p>
          </div>

          <div className="dashboard-card stats-card">
            <RaceStats
              wonBets={wonBets}
              lostBets={lostBets}
            />
          </div>
        </section>

        <section className="dashboard-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">RESULTADOS</p>
              <h2>Carreras del día</h2>
            </div>

            <p>
              Resumen de los ganadores de cada carrera.
            </p>
          </div>

          <div className="race-grid">
            {races.map((race, index) => {
              const winner = race.results.find(
                (result) => result.position === 1,
              );

              const winnerName = snails.find(
                (snail) => snail.id === winner?.snailId,
              )?.name;

              return (
                <article
                  className="race-card"
                  key={race.id}
                >
                  <div className="race-number">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div>
                    <span>CARRERA</span>
                    <h3>{race.name}</h3>
                  </div>

                  <div className="race-winner">
                    <span>Ganador</span>
                    <strong>🐌 {winnerName}</strong>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="dashboard-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">CLASIFICACIÓN</p>
              <h2>Victorias por caracol</h2>
            </div>
          </div>

          <div className="victory-grid">
            {victories.map((snail) => (
              <article
                className="victory-card"
                key={snail.name}
              >
                <div className="victory-snail">🐌</div>

                <div>
                  <h3>{snail.name}</h3>
                  <span>
                    {snail.victories}{" "}
                    {snail.victories === 1
                      ? "victoria"
                      : "victorias"}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default DashboardPage;