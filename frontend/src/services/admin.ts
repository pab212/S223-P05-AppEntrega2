import type { Role } from "./auth";
import { getStoredAccessToken } from "./auth";

const AUTH_API_BASE = import.meta.env.VITE_AUTH_API_URL?.trim() || "http://localhost:3001/api/auth";
const ADMIN_API_URL = AUTH_API_BASE.replace("/api/auth", "/api/admin");

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  username: string;
  role: Role;
  created_at: string;
};

const authHeaders = () => {
  const token = getStoredAccessToken();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token ?? ""}`,
  };
};

export const fetchUsers = async (): Promise<AdminUser[]> => {
  const response = await fetch(`${ADMIN_API_URL}/users`, {
    headers: authHeaders(),
  });

  if (!response.ok) {
    const data = (await response.json()) as { error?: string };
    throw new Error(data.error ?? "Error al obtener usuarios");
  }

  const data = (await response.json()) as { users: AdminUser[] };
  return data.users;
};

export const updateUserRole = async (userId: string, role: Role): Promise<void> => {
  const response = await fetch(`${ADMIN_API_URL}/users/${userId}`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ role }),
  });

  if (!response.ok) {
    const data = (await response.json()) as { error?: string };
    throw new Error(data.error ?? "Error al actualizar rol");
  }
};
