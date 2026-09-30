import type { User } from "../types/auth";

const USER_STORAGE_KEY = "carrera_caracoles_user";
const SESSION_STORAGE_KEY = "carrera_caracoles_session";

const PBKDF2_ITERATIONS = 100_000;
const SALT_LENGTH = 16;

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);

  for (let index = 0; index < bytes.length; index += 1) {
    bytes[index] = Number.parseInt(
      hex.slice(index * 2, index * 2 + 2),
      16,
    );
  }

  return bytes;
}

async function hashPassword( password: string, salt: Uint8Array,): Promise<string> {
  const passwordKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );

  const saltBuffer = salt.buffer.slice( salt.byteOffset, salt.byteOffset + salt.byteLength,) as ArrayBuffer;

  const hashBuffer = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: saltBuffer,
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    passwordKey,
    256,
  );

  return bytesToHex(new Uint8Array(hashBuffer));
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

  const salt = crypto.getRandomValues(
    new Uint8Array(SALT_LENGTH),
  );

  const user: User = {
    id: crypto.randomUUID(),
    fullName: fullName.trim(),
    email: normalizedEmail,
    passwordHash: await hashPassword(password, salt),
    passwordSalt: bytesToHex(salt),
    balance: 0,
  };

  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  localStorage.setItem(SESSION_STORAGE_KEY, user.id);

  return user;
}

export async function loginUser(
  email: string,
  password: string,
): Promise<User> {
  const storedUser = localStorage.getItem(USER_STORAGE_KEY);

  if (!storedUser) {
    throw new Error("No existe un usuario registrado.");
  }

  const user: User = JSON.parse(storedUser);
  const normalizedEmail = email.trim().toLowerCase();

  if (!user.passwordSalt) {
    throw new Error(
      "La cuenta requiere un nuevo registro para actualizar su seguridad.",
    );
  }

  const salt = hexToBytes(user.passwordSalt);
  const passwordHash = await hashPassword(password, salt);

  if (
    user.email !== normalizedEmail ||
    user.passwordHash !== passwordHash
  ) {
    throw new Error("Correo o contraseña incorrectos.");
  }

  localStorage.setItem(SESSION_STORAGE_KEY, user.id);

  return user;
}

export function getCurrentUser(): User | null {
  const storedUser = localStorage.getItem(USER_STORAGE_KEY);
  const sessionId = localStorage.getItem(SESSION_STORAGE_KEY);

  if (!storedUser || !sessionId) {
    return null;
  }

  const user: User = JSON.parse(storedUser);

  if (user.id !== sessionId) {
    return null;
  }

  return user;
}

export function logoutUser(): void {
  localStorage.removeItem(SESSION_STORAGE_KEY);
}

export interface StoredPayment {
  cardNumber: string;
  cvv: string;
}

export function updateUserBalance(
  amount: number,
  payment: StoredPayment,
): User {
  const storedUser = localStorage.getItem(USER_STORAGE_KEY);

  if (!storedUser) {
    throw new Error("No existe un usuario registrado.");
  }

  const user: User = JSON.parse(storedUser);

  user.balance += amount;

  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));

  localStorage.setItem(
    "carrera_caracoles_payment",
    JSON.stringify(payment),
  );

  return user;
}