import { useState } from "react";
import type { RegisterFormData } from "../types/auth";
import { registerUser } from "../utils/auth";

function RegisterPage() {
  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleChange(event: {
    currentTarget: HTMLInputElement;
  }) {
    const { name, value } = event.currentTarget;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  }

  async function handleSubmit(event: { preventDefault: () => void;}) {
    event.preventDefault();

    const fullName = formData.fullName.trim();
    const email = formData.email.trim();

    if (!fullName) {
      setError("El nombre completo es obligatorio.");
      return;
    }

    if (!email) {
      setError("El correo electrónico es obligatorio.");
      return;
    }

    if (!email.includes("@")) {
      setError("Ingresa un correo electrónico válido.");
      return;
    }

    if (formData.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      await registerUser(fullName, email, formData.password);

      setSuccess("Registro exitoso. Tu cuenta está lista para usar.");

      setFormData({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (registrationError) {
      setError(
        registrationError instanceof Error
          ? registrationError.message
          : "No fue posible completar el registro.",
      );
    }
  }

    return (
    <div className="auth-card">
      <div className="auth-card-header">
        <p className="eyebrow">NUEVA CUENTA</p>
        <h1>Crear cuenta</h1>
        <p>
          Regístrate para comenzar a participar en las carreras.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="fullName">Nombre completo</label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            value={formData.fullName}
            onChange={handleChange}
            autoComplete="name"
            placeholder="Tu nombre completo"
          />
        </div>

        <div>
          <label htmlFor="email">Correo electrónico</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            placeholder="correo@ejemplo.com"
          />
        </div>

        <div>
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
            placeholder="Mínimo 8 caracteres"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword">
            Confirmar contraseña
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            autoComplete="new-password"
            placeholder="Repite tu contraseña"
          />
        </div>

        {error && <p role="alert">{error}</p>}

        {success && <p role="status">{success}</p>}

        <button type="submit">
          Crear cuenta
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;