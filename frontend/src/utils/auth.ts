import type { User } from "../types/auth";

const USER_STORAGE_KEY = "carrera_caracoles_user";
const SESSION_STORAGE_KEY = "carrera_caracoles_session";

async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function registerUser(
  fullName: string,
  email: string,
  password: string,
): Promise<User> {
  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = localStorage.getItem(USER_STORAGE_KEY);

  if (existingUser) {
    const user: User = JSON.parse(existingUser);

    if (user.email === normalizedEmail) {
      throw new Error("Ya existe un usuario registrado con este correo.");
    }
  }

  const user: User = {
    id: crypto.randomUUID(),
    fullName: fullName.trim(),
    email: normalizedEmail,
    passwordHash: await hashPassword(password),
    balance: 0,
  };

  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  localStorage.setItem(SESSION_STORAGE_KEY, user.id);

  return user;
}