import { useState } from "react";
import DashboardPage from "./pages/DashboardPage";
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

  if (user) {
    return (
      <DashboardPage
        user={user}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <div>
      <RegisterPage />

      <hr />

      <LoginPage onLogin={handleLogin} />
    </div>
  );
}

export default App;