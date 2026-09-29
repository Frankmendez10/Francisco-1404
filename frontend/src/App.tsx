import { useState } from "react";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { getCurrentUser, logoutUser } from "./utils/auth";

function App() {
  const [user, setUser] = useState(getCurrentUser);

  function handleLogin() {
    setUser(getCurrentUser());
  }

  function handleLogout() {
    logoutUser();
    setUser(null);
  }

  if (!user) {
    return (
      <div>
        <RegisterPage />

        <hr />

        <LoginPage onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <main>
      <h1>Bienvenido, {user.fullName}</h1>
      <p>Correo: {user.email}</p>
      <p>Balance: ${user.balance.toFixed(2)}</p>

      <button type="button" onClick={handleLogout}>
        Cerrar sesión
      </button>
    </main>
  );
}

export default App;