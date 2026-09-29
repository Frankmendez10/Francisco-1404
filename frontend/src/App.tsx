import { useState } from "react";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { getCurrentUser, logoutUser } from "./utils/auth";

function App() {
  const [user, setUser] = useState(getCurrentUser);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  function handleLogin() {
    setUser(getCurrentUser());
  }

  function handleRegister() {
    setUser(getCurrentUser());
  }

  function handleLogout() {
    logoutUser();
    setUser(null);
    setAuthMode("login");
  }

  if (user) {
    return (
      <DashboardPage
        user={user}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <div className="auth-layout">
      <section className="auth-brand">
        <div className="brand-icon">🐌</div>

        <p className="eyebrow">SIMULADOR DE CARRERAS</p>

        <h1>Carrera de Caracoles</h1>

        <p>
          Administra tu saldo, consulta las carreras del día y
          sigue el desempeño de tus caracoles favoritos.
        </p>
      </section>

      <section className="auth-panel">
        {authMode === "login" ? (
          <>
            <LoginPage onLogin={handleLogin} />

            <div className="auth-switch">
              <span>¿No tienes una cuenta?</span>
              <button
                type="button"
                onClick={() => setAuthMode("register")}
              >
                Crear cuenta
              </button>
            </div>
          </>
        ) : (
          <>
            <RegisterPage onRegister={handleRegister} />

            <div className="auth-switch">
              <span>¿Ya tienes una cuenta?</span>
              <button
                type="button"
                onClick={() => setAuthMode("login")}
              >
                Iniciar sesión
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default App;