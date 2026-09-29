import { useState } from "react";
import { loginUser } from "../utils/auth";

interface LoginPageProps {
  onLogin: () => void;
}

function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: {
    preventDefault: () => void;
  }) {
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
    <main>
      <section>
        <h1>Iniciar sesión</h1>
        <p>Ingresa a tu cuenta.</p>

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="login-email">Correo electrónico</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.currentTarget.value)}
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="login-password">Contraseña</label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.currentTarget.value)}
              autoComplete="current-password"
            />
          </div>

          {error && <p role="alert">{error}</p>}

          <button type="submit">Iniciar sesión</button>
        </form>
      </section>
    </main>
  );
}

export default LoginPage;