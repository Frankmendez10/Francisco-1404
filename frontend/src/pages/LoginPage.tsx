import { useState } from "react";
import { loginUser } from "../utils/auth";

interface LoginPageProps {
  onLogin: () => void;
}

function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: { preventDefault: () => void; }) {
    event.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("El correo electrónico es obligatorio.");
      return;
    }

    if (!password) {
      setError("La contraseña es obligatoria.");
      return;
    }

    try {
      await loginUser(email, password);
      onLogin();
    } catch (loginError) {
      setError(
        loginError instanceof Error
          ? loginError.message
          : "No fue posible iniciar sesión.",
      );
    }
  }

    return (
    <div className="auth-card login-card">
      <div className="auth-card-header">
        <p className="eyebrow">ACCESO</p>
        <h1>Iniciar sesión</h1>
        <p>
          Ingresa a tu cuenta para consultar tu dashboard.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="login-email">
            Correo electrónico
          </label>

          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.currentTarget.value)
            }
            autoComplete="email"
            placeholder="correo@ejemplo.com"
          />
        </div>

        <div>
          <label htmlFor="login-password">
            Contraseña
          </label>

          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.currentTarget.value)
            }
            autoComplete="current-password"
            placeholder="Tu contraseña"
          />
        </div>

        {error && <p role="alert">{error}</p>}

        <button type="submit">
          Iniciar sesión
        </button>
      </form>
    </div>
  );
}

export default LoginPage;